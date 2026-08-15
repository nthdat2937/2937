-- ============================================================
-- Supabase Migration: Tạo bảng picture_quiz_packs
-- Chạy SQL này trong Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS picture_quiz_packs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    description TEXT DEFAULT '',
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cho phép read/write từ anon key (public access giống các bảng khác)
ALTER TABLE picture_quiz_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON picture_quiz_packs
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON picture_quiz_packs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON picture_quiz_packs
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON picture_quiz_packs
    FOR DELETE USING (true);

-- Index for faster ordering
CREATE INDEX IF NOT EXISTS idx_quiz_packs_created ON picture_quiz_packs (created_at);
