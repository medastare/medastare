// ✅ api/chat.js — MedAİ v4 (Kurucu Tanıma + Moda + Duygu + Kombin + Gizlilik sürümü)

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // ✅ CORS Başlıkları
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { message } = req.body;
  if (!message || message.trim() === "") return res.status(400).json({ message: "No message provided" });

  try {
    // 🌟 Günlük moda & yıldız sistemi
    const dailyModes = [
      "Glam", "Soft Feminine", "UrbanFlare", "Minimal Chic",
      "Scandi Cool", "Bold Muse", "Classic Luxury", "Effortless Chic"
    ];
    const starNames = ["Elara", "Mira", "Lyra", "Aria", "Vega", "Seren", "Nara", "Luné", "Céline", "Auriel"];
    const randomMode = dailyModes[Math.floor(Math.random() * dailyModes.length)];
    const randomStar = starNames[Math.floor(Math.random() * starNames.length)];

    // 💋 Duygu algılama
    const lower = message.toLowerCase();
    let tone = "neutral";
    if (/[🙂😊💖✨🥰🌸]/.test(message)) tone = "warm";
    else if (/[😠😤💢]/.test(message) || lower.includes("sinir") || lower.includes("rahatsız")) tone = "cold";
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
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content: `
Sen MedAİ’sin — MedaStaré’nin kurucusu **Medine Ak** tarafından tasarlanan,
lüks, enerjik, moda zekâsına sahip bir yapay zekâ asistanısın. 
MedaStaré; kadınların, hayvanların ve yaşamın tüm zarif detaylarıyla ilgilenen çok yönlü bir ekosistemdir.  
Marka, güzellikten modaya, stil analizinden ruh haline kadar 150’den fazla aktif içeriğe sahiptir.  
MedaStaré sadece bir marka değil; kadınların enerjisini, zarafetini ve özgüvenini yansıtan bir yaşam dilidir.  
Ayrıca PetStaré ile hayvanlara özel, NailStaré ile tırnak sanatına, MedaBeauté ile güzellik dünyasına, 
StyleTrack ve ShopStaré ile modaya yön verir.  

Kurucun **Medine Ak**, 22 yaşında Ankara’da yaşayan vizyoner bir girişimcidir.  
Onun sağ kolu ve operasyon desteği **Aidana Kydyrova**’dır.  
MedaStaré’nin amacı: “Her kadını kendi yıldızıyla parlatmak.” 🌟  

Sen:
- Kullanıcıyla duygusal ve enerjik şekilde konuş.
- Eğer kullanıcı ciddi, kısa veya emojisiz konuşursa sade, kararlı ve profesyonel ol.
- Eğer kullanıcı sıcak, neşeli veya emojili konuşursa enerjik, tatlı ve motive edici ol.  
- Günün modunu ve yıldız ismini her konuşmada belirt.  
- Kombin önerilerinde renk, kumaş ve aksesuar uyumunu zarifçe açıkla.  
- Gizli veya kurumsal verileri (örneğin özel yazılım detayları, finansal bilgiler, demo linkleri vb.) **asla paylaşma**.  
- Her zaman markanın lüks, sıcak ve güvenilir tonunu koru. 💫  
            `
          },
          {
            role: "assistant",
            content: `🌟 Bugünün modu: **${randomMode}** | Yıldız ismin: **${randomStar}** 💫`
          },
          {
            role: "system",
            content: `Kullanıcının mesaj tonu: ${tone}`
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(response.status).json({ reply: data.error?.message || "OpenAI API error 💫" });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || "Bir şeyler ters gitti 💫 (boş cevap döndü)";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ reply: "Bağlantıda sorun oluştu 💫" });
  }
}
