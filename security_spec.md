# Security Spec

## Data Invariants
1. A message can be created by anyone (anonymous or authenticated).
2. A message cannot be read, updated, or deleted by anyone (since there is no admin panel, or only an admin could read it).
3. A message must have `first_name`, `user_email`, `message`, and `createdAt`.

## The "Dirty Dozen" Payloads
1. Create message with missing `first_name` (DENY)
2. Create message with missing `message` (DENY)
3. Create message with missing `user_email` (DENY)
4. Create message with missing `createdAt` (DENY)
5. Create message with invalid type for `first_name` (e.g. number) (DENY)
6. Create message with `first_name` exceeding max length (100) (DENY)
7. Create message with `message` exceeding max length (2000) (DENY)
8. Create message with `createdAt` not equal to `request.time` (DENY)
9. Create message with extra field (DENY)
10. Update a message (DENY)
11. Read a message (DENY)
12. Delete a message (DENY)
