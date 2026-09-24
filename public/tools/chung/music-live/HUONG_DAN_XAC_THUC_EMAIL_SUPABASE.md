# Hướng Dẫn Cấu Hình Xác Thực Email (OTP 6 Số & Link) Trên Supabase

Để tính năng gửi mã 6 số OTP và link xác minh email hoạt động với Supabase, bạn chỉ cần thực hiện 2 bước đơn giản sau trong trang quản trị Supabase:

---

## Bước 1: Bật Tính Năng "Confirm Email" trong Supabase Auth

1. Mở trang quản lý dự án **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Chọn dự án của bạn -> Chọn mục **Authentication** ở menu bên trái.
3. Nhấp vào mục **Providers** -> Chọn **Email**.
4. Bật tùy chọn:
   - ✅ **Enable Email provider**: `ON`
   - ✅ **Confirm email**: `ON` (Bật tính năng bắt buộc xác nhận email trước khi đăng nhập)
   - ⏱️ **OTP expiry**: Đặt là `3600` (tương đương 60 phút) hoặc `300` (5 phút) tùy bạn muốn.
5. Nhấp **Save** ở cuối trang.

---

## Bước 2: Dán Mẫu Giao Diện Email Template Vào Supabase

1. Vẫn ở mục **Authentication** -> Chọn mục **Email Templates** ở thanh menu con.
2. Chọn mẫu template **Confirm signup** (hoặc *Confirmation*).
3. Đặt **Subject** (Tiêu đề email):
   ```text
   Xác nhận tài khoản 2937.ML Live - Mã OTP: {{ .Token }}
   ```
4. Tại phần **Message Body (HTML)**, xóa nội dung mặc định và copy toàn bộ nội dung từ file:
   `supabase-email-template.html` (trong cùng thư mục này) và dán vào.
5. Nhấp **Save** để lưu template.

---

## Bước 3: Cấu hình Redirect URLs (cho người dùng bấm Link)

1. Ở mục **Authentication** -> Chọn **URL Configuration**.
2. Tại mục **Site URL**, điền URL trang web của bạn (ví dụ: `http://localhost:3000` hoặc domain thật của bạn).
3. Tại mục **Redirect URLs**, bấm **Add URL** và thêm:
   - `http://localhost:3000`
   - `http://localhost:3000/*`
   - (Và domain chính thức nếu đã deploy).
4. Nhấp **Save**.

---

## 🎉 Hoàn tất!
Giờ đây, khi bất kỳ người dùng nào đăng ký tài khoản:
1. Supabase sẽ tự động gửi email với giao diện dark theme sang trọng của 2937.ML Live.
2. Người dùng có 2 cách để xác thực:
   - **Cách 1**: Nhìn thấy mã 6 số `{{ .Token }}` và nhập trực tiếp vào 6 ô OTP trên web.
   - **Cách 2**: Bấm vào nút **"Xác Minh Email Ngay"** (`{{ .ConfirmationURL }}`), website sẽ tự động mở và đăng nhập vào phòng.
