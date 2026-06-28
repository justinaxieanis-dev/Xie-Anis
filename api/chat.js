export default async function handler(req, res) {
    // التأكد من أن الطلب من نوع POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // جلب المفتاح من متغيرات البيئة المحمية في Vercel
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'API key is missing on the server' });
        }

        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // إرسال الطلب القادم من الواجهة الأمامية إلى Gemini
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const data = await response.json();

        // في حال وجود خطأ من Gemini (مثل مفتاح غير صالح أو مشكلة أخرى)
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // إرجاع النتيجة بنجاح للواجهة الأمامية
        return res.status(200).json(data);

    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
