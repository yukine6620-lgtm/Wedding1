# 🎯 Wedding Invitation Website (AI-powered) - Full Documentation

---

# 1. 📌 Product Overview

## 1.1 Vision
Create an AI-powered platform that allows users to build and publish a **wedding invitation website in under 3 minutes**.

## 1.2 Core Value
- No design skills required
- Fully customizable
- Shareable via link
- Mobile-first experience

## 1.3 Target Users
- Couples (Gen Z, Millennials)
- Wedding planners

---

# 2. 🧱 System Architecture

## 2.1 High-level Architecture

```
Frontend (ReactJS)
    ↓
API Gateway (.NET)
    ↓
Services:
  - Auth Service
  - Invitation Service
  - AI Service
  - Media Service
    ↓
Database (PostgreSQL)
Storage (Cloudinary / S3)
```

## 2.2 Deployment
- Frontend: Vercel
- Backend: Docker + VPS / Azure
- DB: PostgreSQL

---

# 3. 🧩 Feature Breakdown

## 3.1 MVP Features

### User
- Register/Login
- Create invitation
- Edit invitation
- Publish invitation

### Invitation
- Template selection
- Edit text
- Upload images
- Countdown timer
- Google Maps location
- RSVP form

### AI
- Generate content
- Suggest design

---

# 4. 🗂 Database Design

## 4.1 Tables

### Users
```
Id (GUID)
Email
PasswordHash
CreatedAt
```

### Invitations
```
Id (GUID)
UserId
Slug
Title
TemplateId
Status
CreatedAt
```

### InvitationSections
```
Id
InvitationId
Type
Content (JSON)
Order
```

### RSVP
```
Id
InvitationId
Name
Phone
Status
Message
CreatedAt
```

---

# 5. 🎨 Frontend (ReactJS)

## 5.1 Structure
```
src/
  components/
  pages/
  editor/
  services/
  hooks/
```

## 5.2 Key Pages
- Home
- Template Selection
- Editor
- Preview
- Public Invitation Page

## 5.3 Editor
- Drag & Drop
- Inline text edit
- Image upload

---

# 6. ⚙️ Backend (.NET)

## 6.1 Structure
```
API
Application
Domain
Infrastructure
```

## 6.2 APIs

### Auth
- POST /auth/register
- POST /auth/login

### Invitation
- POST /invitation
- GET /invitation/{slug}
- PUT /invitation/{id}

### RSVP
- POST /rsvp

---

# 7. 🤖 AI Agent System

## 7.1 Role of AI
- Generate wedding content
- Suggest layout
- Auto-fill invitation

## 7.2 Flow
```
User Input → AI Agent → Generate JSON → Render UI
```

## 7.3 Example Output
```
{
  "title": "Nam & Linh Wedding",
  "sections": [
    {"type": "hero", "text": "We are getting married"},
    {"type": "story", "text": "Our love story..."}
  ]
}
```

---

# 8. 📦 Media Handling

- Upload images → Cloudinary
- Store URL in DB
- Optimize images automatically

---

# 9. 🚀 Deployment

## 9.1 CI/CD
- GitHub Actions
- Auto deploy

## 9.2 Environment
- Dev
- Staging
- Production

---

# 10. 💰 Monetization

- Free: basic templates
- Paid:
  - Premium templates
  - Custom domain
  - No watermark

---

# 11. 📈 Future Enhancements

- Multi-language
- Guest management dashboard
- Analytics (views, RSVP rate)
- QR code sharing

---

# 12. 🗺 Roadmap (30 days)

## Week 1
- Setup project
- Auth

## Week 2
- Invitation CRUD
- Basic UI

## Week 3
- Editor
- Media upload

## Week 4
- AI integration
- Deploy

---

---

# 🤖 AI Agent Design (Detailed)

## 1. 🎯 Goal
AI must generate **valid JSON UI schema** for rendering a wedding website.

NOT a chatbot → a **UI generator**.

---

## 2. 🧠 Architecture

### Flow
```
User Input
→ Preprocess (normalize input)
→ AI Multi-step Agent
→ Validator
→ Database
→ Frontend Render
```

---

## 3. 🔄 Multi-step Agent Design

### Step 1: Intent Parsing
Extract structured intent from user input.

```json
{
  "style": "minimal",
  "tone": "romantic",
  "color": "beige"
}
```

---

### Step 2: Content Generation
Generate text content.

```json
{
  "title": "Nam & Linh Wedding",
  "story": "...",
  "invitationText": "..."
}
```

---

### Step 3: Layout Generation
Define structure.

```json
{
  "sections": [
    { "type": "hero" },
    { "type": "story" },
    { "type": "gallery" },
    { "type": "event" },
    { "type": "rsvp" }
  ]
}
```

---

### Step 4: Merge
Combine content + layout.

```json
{
  "theme": {...},
  "sections": [...]
}
```

---

## 4. 📦 JSON Schema (Contract)

### Root
```json
{
  "theme": {
    "primaryColor": "#EADBC8",
    "font": "Playfair Display"
  },
  "sections": []
}
```

---

### Section: Hero
```json
{
  "type": "hero",
  "data": {
    "title": "Nam & Linh",
    "subtitle": "We are getting married",
    "date": "2026-12-12",
    "backgroundImage": "url"
  }
}
```

---

### Section: Story
```json
{
  "type": "story",
  "data": {
    "content": "Our love story..."
  }
}
```

---

### Section: Event
```json
{
  "type": "event",
  "data": {
    "time": "18:00",
    "location": "Hà Nội",
    "mapUrl": ""
  }
}
```

---

### Section: RSVP
```json
{
  "type": "rsvp",
  "data": {
    "enabled": true
  }
}
```

---

## 5. 🧪 Prompt Engineering

### System Prompt
```
You are a UI generator.
Return ONLY valid JSON.
Follow schema strictly.
No explanation.
```

---

### Layout Prompt
```
Generate wedding website layout.
Style: romantic minimal
Color: beige
Include: hero, story, gallery, event, rsvp
Return JSON only.
```

---

### Content Prompt
```
Write wedding content.
Tone: romantic
Language: Vietnamese
Include title, invitation text, story.
```

---

## 6. ⚠️ Validation Layer

Never trust AI output directly.

### Rules
- Must parse JSON
- Must contain: theme, sections

### Example (.NET)
```csharp
public bool Validate(JsonObject data)
{
    return data.ContainsKey("theme") && data.ContainsKey("sections");
}
```

---

## 7. 🔁 Retry Strategy

If invalid:
```
Fix this JSON to match schema
```

---

## 8. ⚙️ Backend Design (.NET)

### Service
```
AIService
 - GenerateIntent
 - GenerateContent
 - GenerateLayout
 - Merge
```

### Flow
```csharp
var intent = await ai.GenerateIntent(input);
var content = await ai.GenerateContent(intent);
var layout = await ai.GenerateLayout(intent);

var result = Merge(content, layout);

if (!Validate(result))
    result = RetryFix(result);
```

---

## 9. 🚀 Advanced Strategy

### Hybrid AI + Template
- Use predefined layout
- AI fills content

→ Stable & production-ready

---

### Personalization Loop
```
User edits → AI refines → update JSON
```

---

## 10. ⚠️ Common Issues

- Invalid JSON
- Hallucinated fields
- Poor layout

### Solutions
- Strict schema
- Validator
- Template fallback

---

## 11. 💡 Key Insight

Do NOT let AI control everything.

Best approach:
👉 Template controls layout
👉 AI fills content

---

# END

