// File: api/chat-gemini.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Lấy API Key của Gemini đã giấu trên Vercel
        const API_KEY = process.env.GEMINI_API_KEY; 
        const contents = req.body.contents;

        // Gọi đến API của Google từ máy chủ Vercel
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contents: contents })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || "Lỗi từ phía Google");
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message || 'Lỗi server Gemini rùi ông chủ ơi!' });
    }
}