# 🧩 Execution Layer Documentation (API + Flow + DB + Payment)

---

# 1. 🔌 API Specification

## Auth

### POST /api/auth/login
Request:
```json
{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "jwt_token",
  "user": {
    "id": "guid"
  }
}
```

---

## Invitation

### POST /api/invitations
```json
{
  "templateId": "string",
  "data": {}
}
```

### GET /api/invitations/{slug}

### PUT /api/invitations/{id}

---

# 2. 🧠 JSON Schema Versioning

```json
{
  "version": "1.0",
  "theme": {},
  "sections": []
}
```

Rules:
- version bắt buộc
- sections không được null

---

# 3. 🎯 User Flow

1. Landing
2. Chọn template
3. Nhập thông tin
4. AI generate
5. Edit
6. Preview
7. Publish
8. Payment

---

# 4. 🗄 Database Schema

## Users
- Id
- Email
- PasswordHash

## Invitations
- Id
- UserId
- Slug (unique)
- JsonData (jsonb)
- Status
- CreatedAt
- UpdatedAt

Index:
- Slug unique
- UserId index

---

# 5. 🔐 Auth & Permission

JWT Payload:
```json
{
  "userId": "guid",
  "role": "user"
}
```

---

# 6. 💳 Payment Flow

Flow:

```
User click publish
→ Check paid
→ Redirect payment
→ Payment success (webhook)
→ Update DB
```

---

## Webhook Example

```json
{
  "status": "success",
  "orderId": "123"
}
```

---

# 7. 🚀 Deployment Config

ENV:
```
DB_CONNECTION=
JWT_SECRET=
CLOUDINARY_KEY=
```

---

# 8. 🧪 Testing

- Unit test service
- Test create invitation flow

---

# 9. 📊 Logging

- Log request
- Log error

---

# 10. 💾 Backup

- Daily backup DB
- Store S3

---

# END
