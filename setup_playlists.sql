-- Hướng dẫn: Mở bảng phụ điều khiển Supabase của dự án 2937, vào phần "SQL Editor"
-- Mở một truy vấn mới và dán toàn bộ đoạn mã bên dưới rồi bấm "Run" (Chạy)

-- 1. Tạo bảng custom_playlists
CREATE TABLE custom_playlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  songs jsonb DEFAULT '[]'::jsonb
);

-- 2. Bật bảo mật mức dòng (Row Level Security)
ALTER TABLE custom_playlists ENABLE ROW LEVEL SECURITY;

-- 3. Tạo quy tắc: Mỗi người dùng chỉ được phép xem và chỉnh sửa playlist của riêng mình
CREATE POLICY "Users can manage their own playlists" ON custom_playlists
  FOR ALL USING (auth.uid() = user_id);
