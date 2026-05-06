# ⚡ Performance & Scaling - Full Technical Documentation

---

# 1. 🎯 Mục tiêu

- Load trang thiệp < 2s (3G/4G)
- TTFB thấp
- SEO tốt (index được thiệp)
- Chịu tải nhiều user đồng thời

---

# 2. 🧠 Kiến trúc tổng

```
Client (Browser)
  ↓
CDN (Vercel Edge / Cloudflare)
  ↓
SSR / Static Page
  ↓
API (.NET)
  ↓
Database (PostgreSQL)
  ↓
Object Storage (S3 / Cloudinary)
```

---

# 3. 🚀 Rendering Strategy (QUAN TRỌNG)

## 3.1 Options

- CSR (React SPA)
- SSR (Server-side render)
- SSG (Static generation)

---

## 3.2 Khuyến nghị

👉 Thiệp public: **SSG + ISR**
👉 Editor: **CSR**

---

## 3.3 Flow SSG

```
Build / Request
→ Fetch JSON
→ Generate HTML
→ Cache CDN
```

---

# 4. ⚡ Caching Strategy

## 4.1 CDN Cache

- Cache HTML
- Cache assets (JS, CSS, images)

---

## 4.2 API Cache

- Redis (optional)

---

## 4.3 Example Header

```
Cache-Control: public, max-age=3600
```

---

# 5. 🖼 Image Optimization

## 5.1 Vấn đề

- Ảnh cưới rất nặng

---

## 5.2 Giải pháp

- Dùng Cloudinary
- Auto resize
- WebP/AVIF

---

## 5.3 Example URL

```
/image/upload/w_800,q_auto,f_auto/sample.jpg
```

---

# 6. ⚡ Frontend Optimization

## 6.1 Code Splitting

```js
const Editor = lazy(() => import('./Editor'))
```

---

## 6.2 Lazy Load

- Load section khi scroll

---

## 6.3 Memo

```jsx
export default React.memo(Component)
```

---

# 7. ⚙️ Backend Optimization (.NET)

## 7.1 Query Optimization

- Use index
- Avoid N+1

---

## 7.2 Caching

- Memory cache
- Redis

---

## 7.3 Example

```csharp
var data = await cache.GetOrCreateAsync(key, async entry => {
    return await db.GetInvitation();
});
```

---

# 8. 🌍 CDN & Edge

## 8.1 Dùng CDN

- Vercel Edge
- Cloudflare

---

## 8.2 Lợi ích

- Giảm latency
- Scale global

---

# 9. 🔐 Security & Rate Limit

- Rate limit API
- Protect upload

---

# 10. 📈 Scaling Strategy

## 10.1 Horizontal Scaling

- Multiple backend instances

---

## 10.2 DB Scaling

- Read replica

---

# 11. 🔗 API Design (Hiệu năng)

- REST đơn giản
- Trả JSON gọn

---

# 12. 📊 Monitoring

- Log (Serilog)
- Metrics (Prometheus)

---

# 13. ⚠️ Pitfalls

- Không cache
- Ảnh quá nặng
- SSR sai → chậm

---

# 14. 💡 Best Practice

- SSG cho public
- CDN mọi thứ có thể
- Optimize ảnh trước tiên

---

# 15. 🚀 Advanced

## 15.1 Incremental Static Regeneration (ISR)

- Update thiệp không cần rebuild toàn bộ

---

## 15.2 Edge Functions

- Personalization nhẹ tại CDN

---

# END

