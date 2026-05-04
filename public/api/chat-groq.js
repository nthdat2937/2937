// File: api/chat-groq.js
export default async function handler(req, res) {
    // Chỉ cho phép nhận dữ liệu gửi lên qua phương thức POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Lấy API Key đã giấu trên Vercel ở Bước 1
        const API_KEY = process.env.GROQ_API_KEY; 
        const userMessages = req.body.messages;

        // Backend của mình thay mặt ông chủ gọi đến Groq
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: userMessages,
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        // Trả kết quả về lại cho Frontend (Trang web HTML)
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'Lỗi server rùi ông chủ ơi!' });
    }
}