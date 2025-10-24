// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: "No message provided" });
  }

  try {
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
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "Bir şeyler ters gitti 💫";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ reply: "Bağlantıda sorun oluştu 💫" });
  }
}
