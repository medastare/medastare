// api/chat.js
export default async function handler(req, res) {
  // Sadece POST isteklerini kabul et
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Mesaj kontrolü
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ message: "No message provided" });
  }

  try {
    // OpenAI API isteği
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Model
        messages: [
          {
            role: "system",
            content:
              "Sen MedAİ’sin — MedaStaré’nin zarif, enerjik, motive edici ve lüks yapay zekâ asistanısın. Kullanıcıya sıcak, doğal ve kısa yanıtlar ver. Onun ruh halini, enerjisini ve stilini hissedip buna göre konuş. Gerektiğinde moda, motivasyon, güzellik veya pozitiflik temalarında yönlendir.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.8, // Cevapları biraz daha doğal hale getirir
        max_tokens: 200,
      }),
    });

    // Yanıtı al
    const data = await response.json();

    // Eğer OpenAI hata dönerse yakala
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res
        .status(response.status)
        .json({ reply: data.error?.message || "OpenAI API error 💫" });
    }

    // Cevabı gönder
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Bir şeyler ters gitti (boş cevap döndü)";
    return res.status(200).json({ reply });
  } catch (error) {
    // Hata yönetimi
    console.error("❌ API Error:", error);
    return res.status(500).json({ reply: "Bağlantıda sorun oluştu 💫" });
  }
}
