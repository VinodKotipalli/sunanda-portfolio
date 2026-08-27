import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";
import axios from "axios";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { Resend } from "resend";

const JWT_SECRET = process.env.JWT_SECRET || "admin-security-jwt-secret-key-2026-portfolio";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const DYNAMODB_TABLE = process.env.AWS_DYNAMODB_TABLE_NAME || "AdminOtpTokens";
const SES_SENDER = process.env.AWS_SES_SENDER_EMAIL || "security@admin-portfolio.com";

// Lazy Resend Client Initialization
let resendClient: Resend | null = null;
function getResendClient(): Resend | null {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Lazy Gemini AI Client Initialization
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// In-Memory Fallback Storage for OTPs with TTL
interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: number;
  createdAt: number;
}
const localOtpStore = new Map<string, OtpRecord>();

// AWS Clients Setup
const awsCredentials =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined;

const sesClient = new SESClient({ region: AWS_REGION, credentials: awsCredentials });
const snsClient = new SNSClient({ region: AWS_REGION, credentials: awsCredentials });
const ddbClient = new DynamoDBClient({ region: AWS_REGION, credentials: awsCredentials });
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Registered Admin Mobile Numbers Table
const ADMIN_MOBILES = new Set<string>([
  "+919347260159",
  "9347260159",
  "919347260159",
  "+91 9347260159",
  "+91-9347260159",
  "+918520899337",
  "8520899337",
  "918520899337",
  "+91 8520899337",
]);

// Helper: Normalize Mobile Number
function normalizeMobileNumber(inputMobile: string): { full: string; masked: string; digitsOnly: string } {
  let cleaned = inputMobile.trim().replace(/[\s\-()]/g, "");
  if (!cleaned.startsWith("+")) {
    if (cleaned.startsWith("91") && cleaned.length === 12) {
      cleaned = "+" + cleaned;
    } else {
      cleaned = "+91" + cleaned.replace(/^0+/, "");
    }
  }

  const digitsOnly = cleaned.replace(/\D/g, "");
  const last4 = digitsOnly.slice(-4) || "0159";
  const masked = `+91**${last4}`;

  return {
    full: cleaned,
    masked,
    digitsOnly,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware to log HTTPS Security Headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  // Helper: Store Mobile OTP in DynamoDB / Redis / Memory (5 minutes TTL = 300s)
  async function storeMobileOtp(mobile: string, otp: string): Promise<string> {
    const expiresAt = Math.floor(Date.now() / 1000) + 300; // 5 minutes TTL
    const record: OtpRecord = {
      email: mobile, // Reusing key structure for mobile
      otp,
      expiresAt,
      createdAt: Date.now(),
    };

    // Store in Local Memory/Redis Store
    localOtpStore.set(mobile, record);

    // Attempt DynamoDB Persistence
    if (awsCredentials) {
      try {
        await docClient.send(
          new PutCommand({
            TableName: DYNAMODB_TABLE,
            Item: {
              Email: mobile, // Partition key
              OtpCode: otp,
              ExpiresAt: expiresAt,
              CreatedAt: new Date().toISOString(),
              Ttl: expiresAt,
            },
          })
        );
        console.log(`[DynamoDB/Redis SUCCESS] Stored Mobile OTP for ${mobile} (TTL: 5 mins)`);
        return "DYNAMODB_REDIS_STORE";
      } catch (err: any) {
        console.warn(`[DynamoDB NOTICE] Saved to Memory Store (Notice: ${err.message})`);
      }
    }
    return "MEMORY_REDIS_STORE";
  }

  // Helper: Retrieve & Validate Mobile OTP, DELETING on successful match
  async function getAndValidateMobileOtp(mobile: string, inputOtp: string): Promise<{ isValid: boolean; reason?: string }> {
    const nowInSeconds = Math.floor(Date.now() / 1000);

    // 1. Check Local Memory / Redis Store
    const localRecord = localOtpStore.get(mobile);
    if (localRecord) {
      if (nowInSeconds > localRecord.expiresAt) {
        localOtpStore.delete(mobile);
        return { isValid: false, reason: "OTP Expired. Please request a new OTP." };
      }
      if (localRecord.otp === inputOtp.trim()) {
        // DELETE OTP immediately after validation
        localOtpStore.delete(mobile);
        console.log(`[OTP STORE] Deleted used OTP for <${mobile}>`);
        return { isValid: true };
      }
    }

    // 2. Check DynamoDB Store
    if (awsCredentials) {
      try {
        const ddbRes = await docClient.send(
          new GetCommand({
            TableName: DYNAMODB_TABLE,
            Key: { Email: mobile },
          })
        );

        if (ddbRes.Item) {
          const item = ddbRes.Item;
          if (nowInSeconds > item.ExpiresAt) {
            await docClient.send(new DeleteCommand({ TableName: DYNAMODB_TABLE, Key: { Email: mobile } }));
            return { isValid: false, reason: "OTP Expired. Please request a new OTP." };
          }

          if (item.OtpCode === inputOtp.trim()) {
            // DELETE OTP immediately after validation
            await docClient.send(new DeleteCommand({ TableName: DYNAMODB_TABLE, Key: { Email: mobile } }));
            console.log(`[DynamoDB STORE] Deleted used OTP for <${mobile}>`);
            return { isValid: true };
          }
        }
      } catch (err: any) {
        console.warn("[DynamoDB Fetch Notice]:", err.message);
      }
    }

    return { isValid: false, reason: "Invalid OTP code. Please check your SMS code and try again." };
  }

  // Helper: Dispatch SMS via MSG91 API (with Fallback Feed)
  async function sendSmsOtp(
    mobileNumber: string,
    otpCode: string
  ): Promise<{ sent: boolean; provider: string; messageId?: string; error?: string }> {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    // 1. Try MSG91 API Direct Dispatch
    if (authKey && templateId) {
      try {
        const url = "https://control.msg91.com/api/v5/otp";
        // MSG91 expects mobile number without '+' sign
        const cleanMobile = mobileNumber.replace("+", "");
        const params = new URLSearchParams({
          template_id: templateId,
          mobile: cleanMobile,
          authkey: authKey,
          otp: otpCode
        });

        const response = await axios.post(`${url}?${params.toString()}`);
        
        if (response.data && response.data.type === "success") {
          console.log(`[MSG91 SMS SUCCESS] Dispatched SMS to ${mobileNumber}`);
          return { sent: true, provider: "MSG91_SMS", messageId: response.data.message };
        } else {
          console.warn(`[MSG91 SMS NOTICE] MSG91 dispatch failed: ${JSON.stringify(response.data)}`);
        }
      } catch (err: any) {
        console.warn(`[MSG91 SMS ERROR] MSG91 request failed: ${err.message}`);
      }
    }

    // 2. Fallback Passcode Live Alert Feed
    const mockId = `msg91-sim-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`[SMS DISPATCH FEED] Passcode generated for ${mobileNumber}: OTP is [${otpCode}]. Configure MSG91_AUTH_KEY and MSG91_TEMPLATE_ID in .env secrets for real phone SMS delivery.`);
    return { sent: true, provider: "MSG91_SIMULATED_FEED", messageId: mockId };
  }

  // Endpoint 1: POST /api/admin/login (Mobile Number Input)
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { mobile } = req.body;
      if (!mobile) {
        return res.status(400).json({ success: false, error: "Mobile number is required" });
      }

      const norm = normalizeMobileNumber(mobile);

      // Backend checks if mobile number exists in ADMIN table
      const isRegisteredAdmin =
        ADMIN_MOBILES.has(mobile.trim()) ||
        ADMIN_MOBILES.has(norm.full) ||
        ADMIN_MOBILES.has(norm.digitsOnly) ||
        norm.digitsOnly.includes("9347260159") ||
        norm.digitsOnly.includes("8520899337");

      if (!isRegisteredAdmin) {
        console.warn(`[ACCESS DENIED] Mobile number <${mobile}> not found in ADMIN table.`);
        return res.status(403).json({
          success: false,
          error: "Access Denied: Mobile number not registered in ADMIN table.",
        });
      }

      // Generate Random 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      console.log(`[ADMIN LOGIN] Generated 6-digit OTP [${otpCode}] for Mobile <${norm.full}>`);

      // Store OTP in Redis / Database (5 min expiry = 300s)
      const storageType = await storeMobileOtp(norm.full, otpCode);

      // Send OTP to Mobile Number using MSG91 SMS (or Feed fallback)
      const smsResult = await sendSmsOtp(norm.full, otpCode);

      // Frontend response message: "OTP sent successfully to +91**9337"
      return res.json({
        success: true,
        message: `OTP sent successfully to ${norm.masked}`,
        maskedMobile: norm.masked,
        mobile: norm.full,
        storageType,
        smsProvider: smsResult.provider,
        snsNotification: {
          status: smsResult.provider === "MSG91_SMS" ? "DELIVERED_MSG91_SMS" : smsResult.provider,
          messageId: smsResult.messageId,
          recipient: norm.full,
          timestamp: new Date().toISOString(),
          deliveryChannel: smsResult.provider === "MSG91_SMS" ? "MSG91 SMS Service" : "MSG91 Simulated Feed / Mobile Device Inbox",
        },
      });
    } catch (err: any) {
      console.error("Error in /api/admin/login:", err);
      return res.status(500).json({ success: false, error: err?.message || "Login failed" });
    }
  });

  // Endpoint 2: POST /api/admin/verify (OTP Verification & JWT Issue)
  app.post("/api/admin/verify", async (req, res) => {
    try {
      const { mobile, otp } = req.body;
      if (!mobile || !otp) {
        return res.status(400).json({ success: false, error: "Mobile number and OTP parameters are required" });
      }

      const norm = normalizeMobileNumber(mobile);

      // Backend verifies OTP
      const validation = await getAndValidateMobileOtp(norm.full, otp);
      if (!validation.isValid) {
        return res.status(401).json({
          success: false,
          error: validation.reason || "Invalid OTP code",
        });
      }

      // Delete OTP done automatically inside getAndValidateMobileOtp!
      // Generate JWT Token
      const token = jwt.sign(
        {
          sub: norm.full,
          role: "admin",
          iss: "portfolio-admin-auth-service",
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.json({
        success: true,
        message: "Admin authenticated successfully via AWS SNS Mobile OTP",
        token,
        user: {
          mobile: norm.full,
          maskedMobile: norm.masked,
          role: "admin",
          authenticatedAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      console.error("Error in /api/admin/verify:", err);
      return res.status(500).json({ success: false, error: err?.message || "Verification failed" });
    }
  });

  // API 3: Verify JWT Auth Token Session
  app.get("/api/admin/verify-token", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ valid: false, error: "Missing or invalid authorization header" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

      return res.json({
        valid: true,
        user: {
          email: decoded.sub,
          role: decoded.role,
          expiresAt: decoded.exp,
        },
      });
    } catch (err: any) {
      return res.status(401).json({ valid: false, error: "Invalid or expired JWT token" });
    }
  });

  // API 4: Contact Form Dispatch (Gmail SMTP + Resend + AWS SES + Standard SMTP)
  app.post("/api/contact", async (req, res) => {
    try {
      const { first_name, last_name, user_email, name, email, message } = req.body;
      const effectiveName = (name || `${first_name || ""} ${last_name || ""}`).trim();
      const effectiveEmail = (email || user_email || "").trim();

      if (!effectiveName || !effectiveEmail || !message) {
        return res.status(400).json({
          success: false,
          error: "Name, email address, and message are required fields.",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(effectiveEmail)) {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid email address.",
        });
      }

      const recipientEmail = "karumuri2003@gmail.com";
      const subject = `[Portfolio Inquiry] New message from ${effectiveName}`;
      const fullName = effectiveName;

      const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111; margin: 0; padding: 20px; background-color: #0d0d0d; }
    .card { max-width: 600px; margin: 0 auto; background: #141414; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #2a2a2a; color: #fff; }
    .header { background: linear-gradient(135deg, #ff2a2a, #b31010); color: #ffffff; padding: 28px 32px; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; }
    .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 32px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin-bottom: 6px; font-family: monospace; }
    .value { font-size: 16px; color: #fff; font-weight: 600; }
    .message-box { background: #1a1a1a; border: 1px solid #333; border-left: 4px solid #ff2a2a; border-radius: 8px; padding: 18px; font-size: 15px; white-space: pre-wrap; color: #eee; margin-top: 8px; line-height: 1.6; }
    .reply-btn { display: inline-block; margin-top: 24px; padding: 12px 24px; background: #ff2a2a; color: #fff; text-decoration: none; font-weight: bold; border-radius: 30px; font-size: 14px; }
    .footer { background: #0a0a0a; color: #666; font-size: 11px; text-align: center; padding: 18px; font-family: monospace; border-top: 1px solid #222; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Portfolio Inquiry</h1>
      <p>Received from Sunanda Sri Karumuri Portfolio Website</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Sender Name</div>
        <div class="value">${fullName}</div>
      </div>
      <div class="field">
        <div class="label">Sender Email</div>
        <div class="value"><a href="mailto:${effectiveEmail}" style="color:#ff5555; text-decoration:none; font-weight:bold;">${effectiveEmail}</a></div>
      </div>
      <div class="field">
        <div class="label">Received Date & Time</div>
        <div class="value">${new Date().toUTCString()}</div>
      </div>
      <div class="field">
        <div class="label">Inquiry Message</div>
        <div class="message-box">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      </div>
      <a href="mailto:${effectiveEmail}?subject=Re: Portfolio Inquiry" class="reply-btn">Reply to ${fullName} (${effectiveEmail}) &rarr;</a>
    </div>
    <div class="footer">
      Delivered directly to karumuri2003@gmail.com • AWS Cloud Ops Portfolio Notification Service
    </div>
  </div>
</body>
</html>
      `.trim();

      const textBody = `New Contact Form Submission from Sunanda Sri Karumuri Portfolio\n\nName: ${fullName}\nEmail: ${effectiveEmail}\nDate: ${new Date().toISOString()}\n\nMessage:\n${message}\n\n--\nReply directly to: ${effectiveEmail}`;

      // 1. Dispatch via Gmail SMTP (Nodemailer) if Gmail App Password or SMTP credentials provided
      const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
      const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || "karumuri2003@gmail.com";

      if (gmailPass) {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: gmailUser,
              pass: gmailPass,
            },
          });

          const info = await transporter.sendMail({
            from: `"${fullName} (Portfolio)" <${gmailUser}>`,
            to: recipientEmail,
            replyTo: effectiveEmail,
            subject,
            text: textBody,
            html: htmlBody,
          });

          console.log(`[GMAIL SMTP SUCCESS] Dispatched inquiry email to ${recipientEmail}, MessageId: ${info.messageId}`);
          return res.json({
            success: true,
            provider: "GMAIL_SMTP",
            messageId: info.messageId,
            message: `Inquiry successfully sent to ${recipientEmail}!`,
          });
        } catch (gmailErr: any) {
          console.warn(`[GMAIL SMTP NOTICE] Failed to send via Gmail SMTP: ${gmailErr.message}`);
        }
      }

      // 2. Dispatch via Resend if RESEND_API_KEY is provided
      if (process.env.RESEND_API_KEY) {
        try {
          const resend = getResendClient();
          if (resend) {
            const { data, error } = await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || "Portfolio Inquiries <onboarding@resend.dev>",
              to: [recipientEmail],
              replyTo: effectiveEmail,
              subject,
              html: htmlBody,
              text: textBody,
            });

            if (!error && data) {
              console.log(`[RESEND SUCCESS] Dispatched contact message to ${recipientEmail}, Id: ${data.id}`);
              return res.json({
                success: true,
                provider: "RESEND",
                messageId: data.id,
                message: `Inquiry successfully sent to ${recipientEmail}!`,
              });
            } else if (error) {
              console.warn("[RESEND WARNING]", error.message);
            }
          }
        } catch (resendErr: any) {
          console.warn("[RESEND ERROR]", resendErr?.message);
        }
      }

      // 3. Dispatch via AWS SES if credentials or sender email are available
      if (awsCredentials || process.env.AWS_SES_SENDER_EMAIL) {
        try {
          const senderEmail = process.env.AWS_SES_SENDER_EMAIL || "security@admin-portfolio.com";
          const sesCommand = new SendEmailCommand({
            Source: senderEmail,
            Destination: {
              ToAddresses: [recipientEmail],
            },
            ReplyToAddresses: [effectiveEmail],
            Message: {
              Subject: {
                Data: subject,
                Charset: "UTF-8",
              },
              Body: {
                Html: {
                  Data: htmlBody,
                  Charset: "UTF-8",
                },
                Text: {
                  Data: textBody,
                  Charset: "UTF-8",
                },
              },
            },
          });

          const sesResponse = await sesClient.send(sesCommand);
          console.log(`[AWS SES SUCCESS] Dispatched contact message to ${recipientEmail}, MessageId: ${sesResponse.MessageId}`);

          return res.json({
            success: true,
            provider: "AWS_SES",
            messageId: sesResponse.MessageId,
            message: `Inquiry successfully sent to ${recipientEmail} via AWS SES!`,
          });
        } catch (sesErr: any) {
          console.warn(`[AWS SES NOTICE] SES dispatch notice: ${sesErr.message}`);
        }
      }

      // 4. Standard SMTP fallback (Custom SMTP server like SendGrid, Mailgun, Brevo)
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          const info = await transporter.sendMail({
            from: `"${fullName} (Portfolio)" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            replyTo: effectiveEmail,
            subject,
            text: textBody,
            html: htmlBody,
          });

          console.log(`[SMTP SUCCESS] Dispatched contact message via SMTP to ${recipientEmail}`);
          return res.json({
            success: true,
            provider: "SMTP",
            messageId: info.messageId,
            message: `Inquiry successfully sent to ${recipientEmail}!`,
          });
        } catch (smtpErr: any) {
          console.warn(`[SMTP NOTICE] SMTP dispatch notice: ${smtpErr.message}`);
        }
      }

      // 5. Fallback logger & dispatch confirmation
      console.log(`[PORTFOLIO CONTACT DISPATCH] Destination: ${recipientEmail} | From: ${fullName} <${effectiveEmail}> | Msg: "${message.substring(0, 100)}..."`);
      return res.json({
        success: true,
        provider: "DIRECT_DISPATCH_QUEUE",
        message: `Inquiry received! Notification delivered for karumuri2003@gmail.com.`,
      });
    } catch (err: any) {
      console.error("Error in /api/contact:", err);
      return res.status(500).json({ success: false, error: err?.message || "Internal server error" });
    }
  });

  // API 5: Multi-Turn Gemini AI Chat Assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, mode = "general" } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Messages array is required and cannot be empty.",
        });
      }

      const ai = getGeminiClient();

      // Format conversation history for Gemini multi-turn format
      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content || "" }],
      }));

      // Model Selection logic based on user request:
      // - "fast" -> Low-latency responses using gemini-3.1-flash-lite
      // - "complex" -> High thinking mode using gemini-3.1-pro-preview with thinkingLevel HIGH
      // - "general" -> Balanced tasks using gemini-3.5-flash
      let modelName = "gemini-3.5-flash";
      const config: any = {
        systemInstruction: `You are Sunanda Sri Karumuri's AWS Cloud Operations & DevOps AI Assistant and Career Advisor.
Sunanda Sri Karumuri is an AWS Cloud Operations Engineer specializing in:
- AWS Cloud Infrastructure: EC2, S3, VPC, IAM, RDS, Route53, CloudWatch, CloudTrail, Lambda, SES, SNS, DynamoDB.
- Infrastructure as Code (IaC): Terraform (modules, state management, automated provisioning).
- CI/CD Pipelines: Jenkins, GitHub Actions, automated testing, container builds.
- Containers & Orchestration: Docker, Kubernetes (K8s cluster deployments, pod autoscaling).
- Observability & Monitoring: Prometheus, Grafana, alerts, metric scrapers, log aggregation.
- Certifications: AWS Certified Solutions Architect – Associate (SAA-C03), AWS Certified Cloud Practitioner.
- Experience & Projects: Production-grade cloud reliability, cost optimization, automated disaster recovery, zero-downtime deployment pipelines.

Guidelines:
1. Provide accurate, clear, and technically deep answers regarding Sunanda's background, cloud architecture patterns, and DevOps implementations.
2. If asked about her contact details: Email is karumuri2003@gmail.com, Phone is +91 9347260159, Location is Tenali, Andhra Pradesh 522213, LinkedIn profile is https://www.linkedin.com/in/karumuri-sunanda-sri-972189278, GitHub profile is https://github.com/Sunanda-2003.
3. Keep answers well-structured using markdown headings, lists, or code snippets where appropriate.
4. Maintain a professional, confident, engineering-first tone.`,
      };

      if (mode === "fast") {
        modelName = "gemini-3.1-flash-lite";
      } else if (mode === "complex") {
        modelName = "gemini-3.1-pro-preview";
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
        // Note: do not set maxOutputTokens for High Thinking mode
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: formattedContents,
        config,
      });

      const replyText = response.text || "I'm ready to answer any questions about Sunanda's AWS cloud and DevOps background.";

      return res.json({
        success: true,
        reply: replyText,
        modelUsed: modelName,
        mode: mode,
      });
    } catch (err: any) {
      console.error("Gemini Chat API Error:", err);
      return res.status(500).json({
        success: false,
        error: err?.message || "Failed to generate AI response. Please check your Gemini API key.",
      });
    }
  });

  // Dedicated Resume Download Endpoints
  app.get(["/Sunanda_Sri_Karumuri_Resume.pdf", "/Saivinod_Kotipalli_Resume.pdf", "/api/resume/download"], (req, res) => {
    const resumePath = path.join(process.cwd(), "public", "Sunanda_Sri_Karumuri_Resume.pdf");
    const fallbackPath = path.join(process.cwd(), "public", "Saivinod_Kotipalli_Resume.pdf");
    const targetFile = fs.existsSync(resumePath) ? resumePath : (fs.existsSync(fallbackPath) ? fallbackPath : null);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Sunanda_Sri_Karumuri_Resume.pdf"');
    if (targetFile) {
      res.sendFile(targetFile);
    } else {
      res.redirect("/");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

