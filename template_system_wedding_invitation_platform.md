# 🧱 Template System - Full Technical Documentation

---

# 1. 🎯 Mục tiêu Template System

Template giúp:
- Tái sử dụng layout
- Không phụ thuộc hoàn toàn vào AI
- Monetization (bán template)

👉 Đây là **core business layer**.

---

# 2. 🧠 Kiến trúc tổng

```
Template (JSON)
   ↓
Merge với Content (AI/User)
   ↓
Final JSON
   ↓
Render UI
```

---

# 3. 📦 Template Definition

## 3.1 Template là gì?

Template = JSON định nghĩa:
- Layout
- Style
- Default content

---

## 3.2 Example Template

```json
{
  "id": "template_01",
  "name": "Romantic Beige",
  "theme": {
    "primaryColor": "#EADBC8",
    "font": "Playfair Display"
  },
  "sections": [
    {
      "type": "hero",
      "data": {
        "title": "{coupleName}",
        "subtitle": "We are getting married"
      }
    },
    {
      "type": "story",
      "data": {
        "content": "{story}"
      }
    }
  ]
}
```

---

# 4. 🔄 Template + AI Merge

## 4.1 Placeholder System

```json
{
  "title": "{coupleName}"
}
```

---

## 4.2 Replace Logic

```js
function applyTemplate(template, content) {
  let json = JSON.stringify(template);

  Object.keys(content).forEach(key => {
    json = json.replaceAll(`{${key}}`, content[key]);
  });

  return JSON.parse(json);
}
```

---

# 5. 🧱 Template Storage

## 5.1 DB Structure

### Templates
```
Id
Name
Thumbnail
Json (TEXT)
IsPremium
CreatedAt
```

---

## 5.2 Versioning

- version field
- tránh breaking user data

---

# 6. 🎨 Theme System

## 6.1 Global Theme

```json
{
  "theme": {
    "primaryColor": "#EADBC8",
    "secondaryColor": "#FFF",
    "font": "Playfair Display"
  }
}
```

---

## 6.2 Apply Theme

```jsx
const theme = useTheme();

<div style={{ color: theme.primaryColor }}>
```

---

# 7. 🧩 Dynamic Rendering

## 7.1 Mapping

```jsx
const components = {
  hero: Hero,
  story: Story,
  gallery: Gallery
};

const Render = ({ section }) => {
  const Comp = components[section.type];
  return <Comp {...section.data} />;
};
```

---

# 8. 🏗 Template Builder (Optional - nâng cao)

Cho admin tạo template:
- UI builder
- Export JSON

---

# 9. 💰 Monetization

## 9.1 Free vs Premium

- Free: basic templates
- Premium: đẹp + animation

---

## 9.2 Lock logic

```js
if (template.isPremium && !user.paid) {
  showUpgrade();
}
```

---

# 10. ⚡ Performance

- Cache template
- CDN cho thumbnail

---

# 11. 🔗 API Design

### GET /templates

### GET /templates/{id}

---

# 12. ⚠️ Pitfalls

- Template quá phức tạp
- Không backward compatible

---

# 13. 💡 Best Practice

- Template đơn giản nhưng đẹp
- Tách content & layout
- Dùng placeholder rõ ràng

---

# 14. 🚀 Advanced

## 14.1 Multi-theme switch

## 14.2 Animation config trong JSON

```json
{
  "animation": "fade-in"
}
```

---

# END
