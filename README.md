# Phạm Gia Travel

Website thuê xe du lịch & Limousine VIP - Phạm Gia Travel

Một trang web/cổng dịch vụ cho thuê xe du lịch và limousine chất lượng cao, hướng tới trải nghiệm khách hàng VIP: đặt xe, quản lý đặt chỗ, thông tin loại xe, và liên hệ nhanh chóng.

## Nội dung README này
- Giới thiệu
- Tính năng
- Công nghệ (ví dụ)
- Yêu cầu
- Cài đặt (chạy ở môi trường local)
- Triển khai (ví dụ)
- Cấu hình môi trường
- Hướng dẫn nhúng API bản đồ có thể cấu hình
- Đóng góp
- License & Liên hệ

---

## Giới thiệu
Pham Gia Travel cung cấp dịch vụ cho thuê xe du lịch và Limousine VIP cho cá nhân, gia đình và doanh nghiệp. Mục tiêu của dự án là tạo một website dễ sử dụng để khách hàng:
- Xem danh sách xe, hình ảnh và thông tin chi tiết
- Đặt lịch thuê/đặt xe trực tuyến (hiện tại repo thể hiện trang thông tin tĩnh)
- Quản lý và theo dõi đơn hàng (nếu có backend được thêm sau này)
- Liên hệ hỗ trợ và nhận báo giá nhanh

## Tính năng (ví dụ)
- Trang danh sách xe theo loại (xe du lịch, limousine, xe vip)
- Trang chi tiết xe kèm hình ảnh, giá thuê và tiện ích
- Form đặt xe: ngày giờ, địa điểm, loại chuyến, yêu cầu thêm (chưa có backend xử lý trong repo hiện tại)
- Tìm kiếm & lọc theo địa điểm, ngày, loại xe
- Bộ sưu tập hình ảnh và bản đồ vị trí chi nhánh

> Ghi chú: Tính năng thực tế phụ thuộc vào triển khai hiện tại — vui lòng chỉnh sửa phần này cho phù hợp với codebase.

## Công nghệ (ví dụ)
- Frontend: HTML5, Tailwind CSS (CDN), JavaScript
- Tài nguyên: Google Fonts, hình ảnh từ Unsplash

## Yêu cầu
- Trình duyệt web hiện đại
- Nếu muốn chạy như một site tĩnh: một static server (hoặc GitHub Pages / Netlify / Vercel)

## Cài đặt (chạy ở local)
1. Clone repo:
   ```bash
   git clone https://github.com/anhphamdung79-bot/pham-gia-travel.git
   cd pham-gia-travel
   ```

2. Mở `index.html` trực tiếp hoặc chạy server tĩnh:
   ```bash
   # Python 3
   python -m http.server 8000
   # mở http://localhost:8000/index.html
   ```

## Hướng dẫn nhúng API bản đồ có thể cấu hình
Hiện tại `index.html` sử dụng iframe với liên kết maps.app.goo.gl trực tiếp. Để thay bằng Google Maps Embed API (sử dụng API key có thể cấu hình) hoặc để lưu API key an toàn khi triển khai, làm theo các bước dưới đây:

1. Lấy API key Google Maps
   - Vào Google Cloud Console → tạo project → ENABLE `Maps Embed API` (hoặc `Maps JavaScript API` nếu cần nhiều tương tác).
   - Tạo API key trong phần Credentials.
   - (Khuyến nghị) Restrict key: giới hạn theo HTTP referrers (tên miền) và chỉ bật những API cần thiết.

2. Cách đơn giản (thay trực tiếp iframe) — không an toàn để lưu key công khai trong mã nguồn:
   Thay ô iframe hiện có bằng URL Embed:
   ```html
   <iframe
     src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Pham+Gia+Travel,+Lagi+Binh+Thuan"
     allowfullscreen
     loading="lazy"></iframe>
   ```
   - Thay YOUR_API_KEY bằng API key của bạn.
   - q có thể là địa chỉ, tên địa điểm hoặc place_id.

3. Cách tốt hơn cho site tĩnh: tách key ra file cấu hình (không commit key vào git)
   - Tạo file `config.example.js` (được commit) với nội dung:
     ```js
     // config.example.js (commit vào repo as an example)
     // Copy to config.js and fill in real keys (do NOT commit config.js)
     window.__APP_CONFIG__ = {
       MAPS_API_KEY: '' // đặt key ở đây trong file local config.js
     };
     ```
   - Thêm `config.js` vào `.gitignore`.
   - Trong `index.html`, thay iframe thành một iframe có id và set src bằng JavaScript khi trang load:
     ```html
     <!-- trong body -->
     <div class="map-container">
       <iframe id="mapFrame" allowfullscreen loading="lazy"></iframe>
     </div>

     <script src="/config.js"></script>
     <script>
       (function(){
         const key = window.__APP_CONFIG__ && window.__APP_CONFIG__.MAPS_API_KEY;
         const q = encodeURIComponent('Pham Gia Travel, Lagi, Binh Thuan');
         const iframe = document.getElementById('mapFrame');
         if (key && iframe) {
           iframe.src = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}`;
         } else if (iframe) {
           // fallback: show static link or existing maps.app link
           iframe.src = 'https://maps.app.goo.gl/UF3C5kDM77pF6YLSA';
         }
       })();
     </script>
     ```
   - Khi triển khai (Netlify / Vercel / GitHub Pages), bạn có thể cung cấp `config.js` tại thời điểm deploy hoặc sử dụng biến môi trường của nền tảng để tạo `config.js` động.

4. Khi triển khai lên dịch vụ hosting (ví dụ Netlify / Vercel):
   - Sử dụng biến môi trường (NETLIFY/TOML build step) để sinh `config.js` trong bước build/deploy, ví dụ tạo file `public/config.js` chứa key từ biến môi trường.
   - Cách khác: nếu dùng server-side (Express, Laravel, v.v.), render key từ server vào trang hoặc dùng endpoint cấu hình bảo mật.

Ghi chú bảo mật: Không lưu Google Maps API key có full access trong mã nguồn công khai. Luôn giới hạn referrers và chỉ bật API cần thiết.

## Triển khai (ví dụ)
- Sử dụng GitHub Pages, Netlify hoặc Vercel để host site tĩnh.
- Nếu bạn thêm backend, triển khai như ứng dụng web tương ứng (Heroku, Render, VPS).

## Cấu hình môi trường (gợi ý biến / file)
- `config.example.js` (commit) — mẫu file cấu hình chứa MAPS_API_KEY: ''
- `config.js` (local, DO NOT COMMIT) — chứa MAPS_API_KEY thực tế

## Đóng góp
1. Fork repository
2. Tạo branch feature: git checkout -b feature/my-feature
3. Commit thay đổi: git commit -m "Mô tả thay đổi"
4. Push và tạo Pull Request

Vui lòng viết rõ nội dung PR và ảnh hưởng tới chức năng nào.

## License
Repository này được cấp phép theo MIT License. Xem file `LICENSE` trong repository để biết chi tiết.

## Liên hệ
Phạm Gia Travel
- Email: anhphamdung79@gmail.com
- Hotline / Zalo: 0907 546 828
- Website: https://phamgiatravel.example

---

Nếu bạn muốn, tôi sẽ:
- Tạo `config.example.js` trong repo và thêm `config.js` vào `.gitignore` (tôi có thể tạo các file mẫu này nếu bạn đồng ý);
- Tự động thay thế iframe trong `index.html` để dùng `config.js` (tôi sẽ tạo một PR/commit để cập nhật index.html khi bạn cho phép).
