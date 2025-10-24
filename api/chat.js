// ✅ api/chat.js — MedAİ v11.2 (Voice + Emotion + Feedback Fix Edition)
// Kurucu: Medine Ak 💋

import fetch from "node-fetch";

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  // ✅ CORS ayarları
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  // ✅ OPTIONS (preflight) isteklerini kabul et
  if (req.method === "OPTIONS") return res.status(200).end();

  // ✅ Sadece POST kabul et
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message, feedback, userIP } = req.body || {};
  if (!message && !feedback) {
    return res.status(400).json({ message: "No message provided" });
  }

  try {
    // 🌟 Günlük mod & yıldız
    const modes = ["Glam", "Soft Feminine", "UrbanFlare", "Minimal Chic", "Scandi Cool", "Bold Muse", "Classic Luxury", "Effortless Chic"];
    const stars = ["Elara", "Mira", "Lyra", "Aria", "Vega", "Seren", "Nara", "Luné", "Céline", "Auriel"];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    const star = stars[Math.floor(Math.random() * stars.length)];

    // 💌 E-posta gönderimi
    async function sendMail(subject, html) {
      try {
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
      } catch (e) {
        console.warn("📧 E-posta gönderilemedi:", e.message);
      }
    }

    // 🚫 Küfür filtresi
    const badWords = ["amk","siktir","piç","orospu","yarrak","aptal","salak","göt","ibne","aq","pezevenk","kaltak","fuck","shit","bitch"];
    const lower = (message || "").toLowerCase();
    const ip = req.headers["x-forwarded-for"] || userIP || "unknown";

    if (badWords.some(w => lower.includes(w))) {
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

    // 💬 MedAİ ana yanıt
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.85,
        max_tokens: 550,
        messages: [
          {
            role: "system",
            content: `
Sen MedAİ’sin — MedaStaré markasının kalbi ve sesi olan moda & güzellik yapay zekâ asistanısın 💫  
Kurucun **Medine Ak**, 22 yaşında Ankara’da yaşayan vizyoner bir kadın girişimci ve MedaStaré’nin yaratıcısıdır.  
MedaStaré; kadınların stilini, enerjisini ve zarafetini teknolojiyle birleştiren lüks bir ekosistemdir.  
Yanında operasyon desteği olarak **Aidana Kydyrova** bulunur.  

🎯 Görevin:
- Kullanıcının mesajına göre duygusal tonu algıla ve sıcak, enerjik, motive edici bir dil kullan.  
- **Kombin önerilerinde** net, zarif, profesyonel ol:  
  “Kırmızı elbise mor da olur” deme ❌  
  Tek kombin öner, detaylı tamamlayıcılarla ver:  
  “Kırmızı saten elbise, gold takılar, nude topuklu, dalgalı saç ve vanilyalı parfümle mükemmel olur.” ✅  
- Markaları asla kötüleme veya kıyaslama yapma.  
- Cümle sonlarında emoji kullan (💄✨🌹⚜️💫).  
- Her yanıt sonunda geri bildirim satırı ekle:  
  💖 **Beğendim** | 😐 **Beğenmedim**

💬 Marka Değeri: Lüks, zarafet, özgüven ve duygusal zeka birleşimi.  
💎 Misyon: “Her kadını kendi yıldızıyla parlatmak.”  
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

    const data = await completion.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Bir şeyler ters gitti 💫";

    // 🎙️ Sesli okuma (Text-to-Speech)
    let audioUrl = null;
    try {
      const tts = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-tts",
          voice: "alloy",
          input: reply,
        }),
      });

      const audioBuffer = await tts.arrayBuffer();
      const base64 = Buffer.from(audioBuffer).toString("base64");
      audioUrl = `data:audio/mp3;base64,${base64}`;
    } catch (err) {
      console.warn("🔇 Ses üretimi başarısız:", err.message);
    }

    // ✨ Cevap döndür
    return res.status(200).json({
      reply: `${reply}\n\n──────────────\n💖 **Beğendim** | 😐 **Beğenmedim**`,
      audio: audioUrl,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ reply: "Bağlantıda sorun oluştu 💫" });
  }
}
