# 🎨 Editor System (ReactJS) - Full Technical Documentation

---

# 1. 🎯 Mục tiêu Editor

Editor là nơi user chỉnh sửa thiệp theo dạng trực quan.

## Yêu cầu:
- Drag & Drop
- Inline edit text
- Upload ảnh
- Realtime preview
- Không lag

👉 Đây là phần **khó nhất frontend**.

---

# 2. 🧠 Kiến trúc tổng

```
JSON (from AI / DB)
   ↓
State (Zustand)
   ↓
Renderer (React Components)
   ↓
Editor Layer (Drag / Resize / Edit)
```

---

# 3. 📦 JSON → UI Mapping

## 3.1 Nguyên tắc

- JSON = source of truth
- UI chỉ render từ JSON

---

## 3.2 Example

```json
{
  "type": "hero",
  "data": {
    "title": "Nam & Linh"
  }
}
```

---

## 3.3 Renderer

```jsx
const SectionRenderer = ({ section }) => {
  switch (section.type) {
    case "hero":
      return <Hero {...section.data} />;
    case "story":
      return <Story {...section.data} />;
    default:
      return null;
  }
};
```

---

# 4. ⚙️ State Management

## 4.1 Chọn Zustand (khuyến nghị)

- Nhẹ
- Dễ dùng
- Performance tốt

---

## 4.2 Store

```js
import { create } from 'zustand'

export const useEditorStore = create((set) => ({
  sections: [],
  selectedId: null,

  setSections: (sections) => set({ sections }),

  updateSection: (id, data) => set((state) => ({
    sections: state.sections.map(s =>
      s.id === id ? { ...s, data } : s
    )
  })),

  select: (id) => set({ selectedId: id })
}))
```

---

# 5. 🖱 Drag & Drop System

## 5.1 Cách làm

👉 KHÔNG dùng HTML drag-drop mặc định

→ Dùng:
- dnd-kit (khuyến nghị)

---

## 5.2 Flow

```
User drag section
→ update order
→ update JSON
→ re-render
```

---

## 5.3 Example

```jsx
const handleDragEnd = (event) => {
  const { active, over } = event;

  if (active.id !== over.id) {
    reorderSections(active.id, over.id);
  }
};
```

---

# 6. ✏️ Inline Editing

## 6.1 Text edit

```jsx
<input
  value={title}
  onChange={(e) => updateSection(id, { title: e.target.value })}
/>
```

---

## 6.2 ContentEditable (advanced)

```jsx
<div contentEditable>
  {text}
</div>
```

⚠️ cần sanitize HTML

---

# 7. 🖼 Image Upload

## Flow

```
Upload → Cloudinary → URL → save vào JSON
```

---

## Example

```js
const handleUpload = async (file) => {
  const url = await uploadToCloudinary(file);
  updateSection(id, { image: url });
};
```

---

# 8. 🔁 Undo / Redo System

## 8.1 Ý tưởng

- Lưu history stack

---

## 8.2 Store

```js
history: [],
future: []
```

---

## 8.3 Logic

```js
undo: () => set(state => {
  const prev = state.history.pop();
  return {
    sections: prev,
    future: [state.sections, ...state.future]
  };
})
```

---

# 9. ⚡ Performance

## 9.1 Vấn đề

- Re-render toàn bộ
- Lag khi nhiều section

---

## 9.2 Giải pháp

- React.memo
- Lazy load
- Virtualization (nếu cần)

---

# 10. 🧱 Component Structure

```
EditorPage
 ├── Toolbar
 ├── Canvas
 │    ├── SectionRenderer
 │    └── DragLayer
 └── Sidebar
```

---

# 11. 🔗 Sync với Backend

## Auto save

- debounce 1–2s

```js
useEffect(() => {
  const timeout = setTimeout(() => {
    saveToServer(sections);
  }, 1000);

  return () => clearTimeout(timeout);
}, [sections]);
```

---

# 12. 🚀 Advanced

## 12.1 Block System

- Mỗi section = block
- Có thể add/remove

---

## 12.2 Theme System

- Global style
- Apply toàn bộ

---

## 12.3 Responsive Preview

- Mobile
- Desktop

---

# 13. ⚠️ Pitfalls

- State sync lỗi
- Drag lag
- Undo sai

---

# 14. 💡 Best Practice

- JSON là source of truth
- Tách render & logic
- Không over-engineer từ đầu

---

# END

