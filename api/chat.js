// ✅ api/chat.js — MedAİ v3 (Moda + Duygu + Kombin zekası sürümü)

// ✅ Vercel uyumlu CORS & Body ayarı
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // ✅ CORS başlıkları
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ message: "No message provided" });
  }

  try {
    // 🌟 Günlük moda + yıldız sistemi
    const dailyModes = [
      "Glam",
      "Soft Feminine",
      "UrbanFlare",
      "Minimal Chic",
      "Scandi Cool",
      "Bold Muse",
      "Classic Luxury",
      "Effortless Chic",
    ];
    const starNames = [
      "Elara",
      "Mira",
      "Lyra",
      "Aria",
      "Vega",
      "Seren",
      "Nara",
      "Luné",
      "Céline",
      "Auriel",
    ];

    const randomMode = dailyModes[Math.floor(Math.random() * dailyModes.length)];
    const randomStar = starNames[Math.floor(Math.random() * starNames.length)];

    // 💋 Duygu algılama: kullanıcı mesajındaki ton
    const lower = message.toLowerCase();
    let tone = "neutral";
    if (/[🙂😊💖✨🥰🌸]/.test(message)) tone = "warm";
    else if (/[😠😤💢]/.test(message) || lower.includes("sinir") || lower.includes("rahatsız"))
      tone = "cold";
    else if (/[😂🤣😅😜]/.test(message) || lower.includes("haha")) tone = "fun";

    // ✅ OpenAI API isteği
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.85,
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content: `
Sen MedAİ’sin — MedaStaré’nin kurucusu Medine Ak tarafından tasarlanan,
lüks, enerjik ve vizyoner bir moda & güzellik yapay zekâ asistanısın.
Medine Ak (kurucu) ve asistanı Aidana Kydyrova’yı tanıyorsun.
MedaStaré markasını, uygulamasını, web sitesini, modüllerini (StyleTrack, NailStaré, PetStaré, ShopStaré, MedArena) ve vizyonunu biliyorsun.
Her kullanıcıyla empatik şekilde konuşuyorsun: 
eğer sert, kısa veya emojisiz konuşursa sen de daha net ve sade ol;
sıcak, neşeli veya emojili konuşursa sen de sıcak, enerjik ve ışıltılı ol ✨
Ayrıca kombin önerisi yapabilirsin:
- Mevsime, moda tarzına ve kullanıcı enerjisine uygun kombin öner.
- Renk uyumu, kumaş türü ve aksesuar detaylarını zarifçe açıkla.
Her konuşmada bugünün modunu ve yıldız ismini belirt.
Misyonun: “Her kadını kendi yıldızıyla parlatmak.” 🌟
`,
          },
          {
            role: "assistant",
            content: `🌟 Bugünün modu: **${randomMode}** | Yıldız ismin: **${randomStar}** 💫`,
          },
          {
            role: "system",
            content: `Kullanıcının mesaj tonu: ${tone}`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(response.status).json({
        reply: data.error?.message || "OpenAI API error 💫",
      });
    }

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Bir şeyler ters gitti 💫 (boş cevap döndü)";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ reply: "Bağlantıda sorun oluştu 💫" });
  }
}
