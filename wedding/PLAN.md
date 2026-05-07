# 🎯 Kế hoạch triển khai - Wedding Invitation Platform

> **Stack:** Next.js (Frontend) + .NET (Backend) + PostgreSQL + Cloudinary + AI
> **Mục tiêu:** Launch MVP trong 30 ngày

---

## Trạng thái ký hiệu

- `[ ]` Chưa làm
- `[x]` Hoàn thành
- `[-]` Đang làm

---

## Phase 1 — Foundation (Tuần 1–2)

> Mục tiêu: có thứ chạy được, deploy được

### Backend (.NET)

- [x] Setup project Clean Architecture (API / Application / Domain / Infrastructure)
- [x] Cấu hình PostgreSQL + Entity Framework Core
- [x] DB Migration: bảng Users, Invitations, InvitationSections, RSVP
- [x] Auth: POST /api/auth/register
- [x] Auth: POST /api/auth/login (trả JWT)
- [x] Invitation: POST /api/invitations (tạo mới)
- [x] Invitation: GET /api/invitations/{slug} (lấy theo slug)
- [x] Invitation: PUT /api/invitations/{id} (cập nhật)
- [x] Slug auto-generate từ tên cặp đôi (vd: nam-linh-wedding)
- [x] JSON Schema versioning (version field bắt buộc)
- [x] Cấu hình CORS, Swagger
- [ ] Dockerize backend
- [ ] Deploy lên VPS/Azure

### Frontend (Next.js)

- [x] Setup Next.js + TypeScript + Tailwind CSS
- [x] Setup Zustand store
- [x] Trang Home / Landing page
- [x] Trang chọn template (`/templates`)
- [x] Trang thiệp public (`/[slug]`) — SSG + ISR
- [x] Trang đăng ký / đăng nhập (`/auth`)
- [x] Kết nối API auth (register, login, lưu JWT)
- [x] Kết nối API lấy thiệp theo slug

### Deliverable Phase 1
> ✅ User đăng ký → chọn template → xem thiệp tĩnh qua link

---

## Phase 2 — Editor + Media (Tuần 3)

> Mục tiêu: user tự chỉnh được thiệp trực tiếp

### Editor

- [x] Setup Zustand editor store (sections, selectedId, history)
- [x] Component structure: EditorPage > Toolbar + Canvas + Sidebar
- [x] JSON → UI Mapping (SectionRenderer)
- [x] Render các section: Hero, Story, Event, Gallery, RSVP
- [x] Inline text edit (input / contentEditable)
- [x] Drag & Drop sections dùng `dnd-kit`
- [x] Undo / Redo (history stack)
- [x] Theme system (apply global primaryColor, font)
- [ ] Responsive preview (Mobile / Desktop toggle)

### Media

- [ ] Tích hợp Cloudinary upload
- [ ] Upload ảnh trong editor → lưu URL vào JSON section
- [x] Auto-save debounce 1–2s (sync lên backend)

### Deliverable Phase 2
> ✅ User chỉnh thiệp trực tiếp, lưu tự động, upload ảnh

---

## Phase 3 — AI + Payment (Tuần 4)

> Mục tiêu: validate business model

### AI Service

- [x] Chọn provider: OpenAI GPT-4o-mini
- [x] Backend AIService: GenerateIntent
- [x] Backend AIService: GenerateContent
- [x] Backend AIService: GenerateLayout
- [x] Backend AIService: Merge (content + layout → final JSON)
- [x] Validation layer (kiểm tra JSON output có đủ theme + sections)
- [x] Retry strategy nếu AI trả JSON không hợp lệ
- [x] Template fallback nếu AI fail hoàn toàn
- [x] Frontend: form nhập thông tin cặp đôi → gọi AI → render thiệp

### Payment

- [x] Tích hợp MoMo (thị trường VN)
- [x] Payment flow: Publish → check paid → redirect → webhook → update DB
- [x] Paywall tại bước Publish / Download
- [x] Xử lý webhook MoMo (verify signature, update status)
- [x] Trang thanh toán thành công / thất bại

### RSVP

- [x] API: POST /api/rsvp
- [x] Frontend: RSVP form trên trang thiệp public
- [x] Lưu RSVP vào DB (Name, Phone, Status, Message)

### Deliverable Phase 3
> ✅ User nhập tên → AI tạo thiệp → chỉnh → publish → trả tiền → share link

---

## Phase 4 — Growth (Sau launch)

> Mục tiêu: tăng trưởng organic và viral

### SEO & Performance

- [ ] Tối ưu SSG/ISR cho trang thiệp public
- [ ] Meta tags động (OG image, title, description) cho từng thiệp
- [ ] URL đẹp: `/nam-linh-wedding`
- [ ] Sitemap tự động
- [ ] Image optimization qua Cloudinary (WebP/AVIF, auto resize)

### Viral Loop

- [ ] Branding nhỏ ở footer thiệp (free plan)
- [ ] CTA "Tạo thiệp giống vậy" → link về platform
- [ ] Referral: giảm giá khi mời bạn

### Analytics

- [ ] View count cho từng thiệp
- [ ] RSVP rate dashboard
- [ ] Drop-off rate tracking (funnel)

### Thêm template & tính năng

- [ ] Thêm template premium (animation, đẹp hơn)
- [ ] Countdown timer section
- [ ] Google Maps embed section
- [ ] QR code sharing
- [ ] Multi-language support (VI / EN)
- [ ] Guest management dashboard

### Payment mở rộng

- [ ] Tích hợp VNPay
- [ ] Tích hợp Stripe (global)

---

## Quyết định kỹ thuật đã chốt

| Hạng mục | Quyết định |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind |
| State management | Zustand |
| Drag & Drop | dnd-kit |
| Backend | .NET Clean Architecture |
| Database | PostgreSQL + EF Core |
| Media | Cloudinary |
| AI Provider | OpenAI GPT-4o-mini |
| Rendering (public page) | SSG + ISR |
| Rendering (editor) | CSR |
| Payment (VN) | MoMo → VNPay |
| Payment (Global) | Stripe |
| Deploy Frontend | Vercel |
| Deploy Backend | Docker + VPS/Azure |
| CI/CD | GitHub Actions |

---

## Ghi chú

- Template kiểm soát layout, AI chỉ fill content → stable hơn
- Paywall chặn tại Publish/Download, không chặn sớm
- JSON là source of truth cho toàn bộ editor
- Không over-engineer từ đầu — launch sớm, iterate nhanh

---

*Cập nhật lần cuối: Phase 1 bắt đầu*
