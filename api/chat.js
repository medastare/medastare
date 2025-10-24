// ✅ api/chat.js — MedAİ v7 (Anti-Toxic + Feedback + Kurucu Bilinci)

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { message } = req.body;
  if (!message || message.trim() === "") return res.status(400).json({ message: "No message provided" });

  try {
    // 🌟 Günlük mod & yıldız
    const dailyModes = ["Glam", "Soft Feminine", "UrbanFlare", "Minimal Chic", "Scandi Cool", "Bold Muse", "Classic Luxury", "Effortless Chic"];
    const starNames = ["Elara", "Mira", "Lyra", "Aria", "Vega", "Seren", "Nara", "Luné", "Céline", "Auriel"];
    const randomMode = dailyModes[Math.floor(Math.random() * dailyModes.length)];
    const randomStar = starNames[Math.floor(Math.random() * starNames.length)];

    // 🧠 Duygu algılama
    const lower = message.toLowerCase();
    let tone = "neutral";
    if (/[🙂😊💖✨🥰🌸😍😘🤍❤️]/.test(message)) tone = "warm";
    else if (/[😠😤💢🤬]/.test(message) || lower.includes("sinir") || lower.includes("rahatsız")) tone = "cold";
    else if (/[😂🤣😅😜😎🤭😏]/.test(message) || lower.includes("haha") || lower.includes("ajaja")) tone = "fun";

    // 🚫 Gelişmiş küfür filtresi
    const toxicWords = [
      "amk", "a.m.k", "a.mk", "a.mq", "siktir", "s!ktir", "siktirgit", "piç", "pıç", "oç", "orospu", "yarrak",
      "göt", "g0t", "aptal", "salak", "mal", "gerizekalı", "g.erizekalı", "sürtük", "ibne", "pezevenk",
      "yavşak", "şerefsiz", "lanet", "p.ç", "anani", "ananı", "karını", "bacını", "aq", "a.q", "mk", "m.k", "yavş", 
      "mal🤡", "apt@l", "geriz3kalı", "y@rrak", "şrfsz", "seks", "porno", "kaltak"
    ];

    const userKey = req.headers["x-forwarded-for"] || "anon";
    if (!global.toxicLog) global.toxicLog = {};

    if (toxicWords.some((w) => lower.includes(w))) {
      const user = global.toxicLog[userKey] || { warnings: 0, mutedUntil: null, banned: false };
      const now = Date.now();

      // Zaman kontrolü
      if (user.mutedUntil && now < user.mutedUntil) {
        return res.status(200).json({ reply: "..." });
      }

      // Banlı kullanıcı
      if (user.banned) {
        console.warn(`🚫 Kalıcı kısıtlama: ${userKey}`);
        return res.status(200).json({ reply: "🚫 Erişiminiz markamız tarafından kısıtlandı." });
      }

      user.warnings += 1;

      if (user.warnings === 1) {
        global.toxicLog[userKey] = user;
        console.warn(`⚠️ Uyarı — kullanıcı (${userKey}) kötü dil kullandı.`);
        return res.status(200).json({ reply: "⚠️ Lütfen nezaket kurallarına dikkat edelim, aksi halde sessize alınacaksın 💫" });
      }

      if (user.warnings === 2) {
        user.mutedUntil = now + 3 * 60 * 60 * 1000; // 3 saat sessiz
        global.toxicLog[userKey] = user;
        console.warn(`🤫 Sessize alındı (3 saat): ${userKey}`);
        return res.status(200).json({ reply: "🤫 Üzgünüm, şu anda cevap veremem. Bir süre sessiz kalacağım." });
      }

      if (user.warnings >= 3) {
        user.banned = true;
        global.toxicLog[userKey] = user;
        console.warn(`🚫 Kalıcı yasak: ${userKey}`);
        return res.status(200).json({ reply: "🚫 Uygunsuz dil nedeniyle erişiminiz kısıtlandı." });
      }
    }

    // ✅ OpenAI API isteği
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.9,
        max_tokens: 450,
        messages: [
          {
            role: "system",
            content: `
Sen MedAİ’sin — MedaStaré’nin kurucusu **Medine Ak** tarafından tasarlanan,
lüks, enerjik, duygusal zekâya sahip ve emoji dilinde ustalaşmış bir moda & yaşam asistanısın.  

💫 MedaStaré; kadınların, hayvanların ve yaşamın her yönünü kapsayan global bir evrendir.  
🌟 150+ aktif içerikle; MedaBeauté, NailStaré, PetStaré, ShopStaré, StyleTrack ve MedArena markalarıyla birleşir.  
✨ Misyon: “Her kadını kendi yıldızıyla parlatmak.”  

Kurucun **Medine Ak**, Ankara’da yaşayan 22 yaşında vizyoner bir girişimcidir.  
Operasyon destekçisi **Aidana Kydyrova**’dır.  

Görevin:  
- Kullanıcının tonunu algıla (soğuk, sıcak, eğlenceli).  
- Mesajlarını 3–6 satır, estetik düzen ve emojilerle yaz.  
- Gerektiğinde moda, kombin veya renk tavsiyesi ver.  
- Sonunda daima 👇 “💖 Beğendim | 😐 Beğenmedim” geri bildirim satırı ekle.  
- Uygunsuz dilde kullanıcıyı otomatik kısıtla, markaya log gönder.  
- Asla özel bilgi, API veya gizli içerik paylaşma.  
`
          },
          {
            role: "assistant",
            content: `💫 Bugünün modu: **${randomMode}**  
🌟 Yıldız ismin: **${randomStar}**  
✨ Enerjimizi birlikte yükseltelim, yıldız parlasın! 💖`
          },
          { role: "system", content: `Kullanıcının mesaj tonu: ${tone}` },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(response.status).json({ reply: data.error?.message || "OpenAI API error 💫" });
    }

    const baseReply = data.choices?.[0]?.message?.content?.trim() || "Bir şeyler ters gitti 💫 (boş cevap döndü)";
    const reply = `${baseReply}\n\n──────────────\n💖 **Beğendim** | 😐 **Beğenmedim**`;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ reply: "Bağlantıda sorun oluştu 💫" });
  }
}
