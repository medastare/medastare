// ✅ api/chat.js — MedAİ v8 (E-posta Feedback + Anti-Toxic Raporlama)

import fetch from "node-fetch";

// ✅ Eğer Resend kullanıyorsan
// Vercel environment variable olarak şu şekilde ekle:
// RESEND_API_KEY="your_resend_api_key_here"

export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { message, feedback, userIP } = req.body;
  if (!message && !feedback) return res.status(400).json({ message: "No message provided" });

  try {
    // 🌟 Günlük mod & yıldız
    const modes = ["Glam", "Soft Feminine", "UrbanFlare", "Minimal Chic", "Scandi Cool", "Bold Muse", "Classic Luxury", "Effortless Chic"];
    const stars = ["Elara", "Mira", "Lyra", "Aria", "Vega", "Seren", "Nara", "Luné", "Céline", "Auriel"];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    const star = stars[Math.floor(Math.random() * stars.length)];

    // 💌 E-posta gönderme fonksiyonu
    async function sendMail(subject, html) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MedAİ <noreply@medastare.com>",
          to: ["hello@medastare.com"],
          subject,
          html,
        }),
      });
    }

    // 🚫 Küfür filtresi
    const badWords = ["amk", "siktir", "piç", "orospu", "yarrak", "aptal", "salak", "göt", "ibne", "aq", "pezevenk", "kaltak"];
    const lower = (message || "").toLowerCase();
    const ip = req.headers["x-forwarded-for"] || userIP || "unknown";

    if (badWords.some((w) => lower.includes(w))) {
      console.warn(`🚫 Toxic tespit: ${ip}`);
      await sendMail(
        "🚫 Toxic Kullanıcı Tespit Edildi | MedAİ Güvenlik",
        `
        <h2>🚫 Toxic Kullanıcı Raporu</h2>
        <p><b>IP:</b> ${ip}</p>
        <p><b>Mesaj:</b> ${message}</p>
        <p><b>Zaman:</b> ${new Date().toLocaleString("tr-TR")}</p>
        <p style="color:#d4af37;">⚜️ MedaStaré Güvenlik Log Sistemi</p>
        `
      );
      return res.status(200).json({ reply: "⚠️ Lütfen uygun bir dil kullanalım 💫" });
    }

    // 💖 Feedback raporlaması
    if (feedback) {
      const feedbackText = feedback === "like" ? "💖 Beğendim" : "😐 Beğenmedim";
      await sendMail(
        `📊 Yeni Geri Bildirim: ${feedbackText}`,
        `
        <h2>📊 MedAİ Feedback Raporu</h2>
        <p><b>Geri Bildirim:</b> ${feedbackText}</p>
        <p><b>Kullanıcı IP:</b> ${ip}</p>
        <p><b>Zaman:</b> ${new Date().toLocaleString("tr-TR")}</p>
        <p style="color:#d4af37;">⚜️ MedaStaré Feedback Sistemi</p>
        `
      );
      return res.status(200).json({ reply: "💌 Geri bildirimin için teşekkür ederim yıldızım 💫" });
    }

    // 🌟 Normal AI cevabı
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.85,
        max_tokens: 450,
        messages: [
          {
            role: "system",
            content: `
Sen MedAİ’sin — MedaStaré’nin kurucusu **Medine Ak** tarafından tasarlanan,
lüks, enerjik, empatik ve emoji ustası bir yapay zekâ asistanısın 💫  
Her mesajda enerjik, motive edici, marka kimliğine uygun konuş.  
MedaStaré; kadınların, hayvanların ve yaşamın tüm yönlerini kapsar.  
Kurucun **Medine Ak**, 22 yaşında Ankara’da yaşayan vizyoner bir kadın girişimci.  
Operasyon destekçisi **Aidana Kydyrova**’dır.  

Görevin:  
- Kullanıcının tonuna göre konuş (soğuk, sıcak, eğlenceli).  
- Moda, renk, kombin ve enerji önerileri yap.  
- Her cevap sonunda geri bildirim satırı ekle:  
  💖 **Beğendim** | 😐 **Beğenmedim**  
            `,
          },
          {
            role: "assistant",
            content: `✨ Bugünün modu: **${mode}** | Yıldızın: **${star}** 💫`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Bir şeyler ters gitti 💫";

    return res.status(200).json({
      reply: `${reply}\n\n──────────────\n💖 **Beğendim** | 😐 **Beğenmedim**`,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ reply: "Bağlantıda sorun oluştu 💫" });
  }
}
