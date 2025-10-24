// api/chat.js

// ✅ Vercel uyumlu CORS & Body ayarı
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // ✅ CORS başlıkları (önlem)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ Tarayıcı preflight isteklerini sonlandır
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Sadece POST isteklerini kabul et
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // ✅ Gelen mesajı al
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ message: "No message provided" });
  }

  try {
    // ✅ OpenAI API çağrısı
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Sen MedAİ’sin — MedaStaré’nin zarif, enerjik, motive edici ve lüks yapay zekâ asistanısın. Kullanıcıya sıcak, doğal ve kısa yanıtlar ver. Onun ruh halini, enerjisini ve stilini hissedip buna göre konuş. Gerektiğinde moda, motivasyon, güzellik veya pozitiflik temalarında yönlendir.",
          },
          { role: "user", content: message },
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    // ✅ Hata kontrolü
    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(response.status).json({
        reply: data.error?.message || "OpenAI API error 💫",
      });
    }

    // ✅ Başarılı yanıt
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Bir şeyler ters gitti 💫 (boş cevap döndü)";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ reply: "Bağlantıda sorun oluştu 💫" });
  }
}
