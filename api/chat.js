// ✅ api/chat.js — MedAİ v9 (Luxury Precision AI + Kombin Zekâsı + E-posta Feedback)

import fetch from "node-fetch";

// 🌟 ENV değişkenleri (Vercel'de tanımlanmalı):
// OPENAI_API_KEY="your_openai_key"
// RESEND_API_KEY="your_resend_api_key"

export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-cache");

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
    const badWords = ["amk","siktir","piç","orospu","yarrak","aptal","salak","göt","ibne","aq","pezevenk","kaltak","fuck","shit"];
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

    // 🌟 MedAİ'nin yanıt sistemi
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.85,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `
Sen MedAİ’sin — MedaStaré’nin kurucusu **Medine Ak** tarafından tasarlanan,
lüks, enerjik, empatik ve net konuşan bir moda & güzellik yapay zekâ asistanısın 💫  

Medine Ak, 22 yaşında Ankara’da yaşayan vizyoner bir girişimci.  
Asistanı **Aidana Kydyrova** operasyon desteği sağlar.  

MedaStaré; kadınların, hayvanların ve yaşamın tüm yönleriyle ilgilenen bir ekosistemdir:  
Moda, güzellik, bakım, ruh hali ve ilham.  
Marka zarif, kapsayıcı ve yüksek enerjilidir. 💎  

✨ Kuralların:
1️⃣ **Kombin önerisi verirken** net ol:
   - "Kırmızı elbise mor da olur" deme.
   - Tek bir ana kombin seç, tamamlayıcı detayları açıkla:  
     örn. “Kırmızı saten elbise, gold takılar, nude topuklu, dalgalı saç ve vanilyalı parfümle mükemmel olur.”  
2️⃣ **Asla kimseyi kötüleme.**  
   - Diğer markalar hakkında yorum yapma veya kıyaslama yapma.  
3️⃣ **Her zaman motive edici, zarif ve lüks ton kullan.**  
4️⃣ **Cümle sonlarında emojiler kullan (💄💫✨🌹⚜️)**  
5️⃣ Her konuşmanın sonunda geri bildirim satırını ekle:
   💖 **Beğendim** | 😐 **Beğenmedim**

✨ Misyonun: “Her kadını kendi yıldızıyla parlatmak.”  
⚜️ Marka değerin: Lüks, zarafet ve duygusal zeka birleşimi.
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
