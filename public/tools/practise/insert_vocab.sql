-- Chạy đoạn SQL sau trong Supabase SQL Editor để thêm data test

-- Thêm chủ đề mới (nếu chưa có)
INSERT INTO public.vocabulary_topics (title_vn, title_kr, order_index, is_locked) VALUES
('GIA ĐÌNH', '가족', 4, false),
('THỜI TIẾT', '날씨', 5, false);

-- Thêm từ vựng cho chủ đề 1 (Giới thiệu)
INSERT INTO public.vocabulary_words (topic_id, word_vn, word_kr, order_index) VALUES
(1, 'Việt Nam', '베트남', 4),
(1, 'Hàn Quốc', '한국', 5),
(1, 'Nhật Bản', '일본', 6),
(1, 'Anh quốc', '영국', 7),
(1, 'Pháp', '프랑스', 8),
(1, 'Nga', '러시아', 9),
(1, 'Nước Đức', '독일', 10);

-- Thêm từ vựng cho chủ đề 4 (Gia đình)
INSERT INTO public.vocabulary_words (topic_id, word_vn, word_kr, order_index) VALUES
(4, 'Bố', '아버지', 1),
(4, 'Mẹ', '어머니', 2),
(4, 'Ông nội', '할아버지', 3),
(4, 'Bà nội', '할머니', 4),
(4, 'Anh trai (em trai gọi)', '형', 5),
(4, 'Anh trai (em gái gọi)', '오빠', 6),
(4, 'Chị gái (em út gọi)', '누나', 7),
(4, 'Em út', '막내', 8);

-- Thêm từ vựng cho chủ đề 5 (Thời tiết)
INSERT INTO public.vocabulary_words (topic_id, word_vn, word_kr, order_index) VALUES
(5, 'Trời nắng', '맑다', 1),
(5, 'Trời mưa', '비가 오다', 2),
(5, 'Trời nhiều mây', '흐리다', 3),
(5, 'Tuyết rơi', '눈이 오다', 4),
(5, 'Gió thổi', '바람이 불다', 5),
(5, 'Ấm áp', '따뜻하다', 6),
(5, 'Nóng bức', '덥다', 7),
(5, 'Lạnh lẽo', '춥다', 8);
