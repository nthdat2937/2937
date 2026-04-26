# 🃏 Tiến Lên Miền Nam Online

Game đánh bài Tiến lên miền Nam cho 4 người, chơi online realtime.

## Cài đặt & Chạy

```bash
# 1. Cài dependencies
npm install

# 2. Chạy server
npm start

# 3. Mở trình duyệt
# → http://localhost:3000
```

## Luật chơi đã hỗ trợ

- ✅ Lá bài mạnh yếu đúng luật (3 thấp nhất, 2 cao nhất, đỏ > đen)
- ✅ Đánh đơn, đôi, ba, tứ quý
- ✅ Sảnh 3–12 lá
- ✅ Đôi thông (3+ đôi liên tiếp)
- ✅ Ba đôi thông
- ✅ Tứ quý chặt 2 đơn
- ✅ 3 đôi thông chặt 2 đơn
- ✅ 4 đôi thông chặt đôi 2
- ✅ Người có 3 bích đi trước
- ✅ Bỏ lượt, tự động clear bàn khi tất cả bỏ
- ✅ Tính điểm theo thứ hạng

## Deploy lên Render (free)

1. Push code lên GitHub
2. Vào https://render.com → New Web Service
3. Connect repo, set Build Command: `npm install`, Start Command: `npm start`
4. Done — có URL public để share cho bạn bè!

## Phím tắt

- `Enter` — Đánh bài đã chọn
- `Space` — Bỏ lượt
