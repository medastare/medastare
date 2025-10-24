// ✅ api/chat.js — MedAİ v12.2 (Stable Memory + Founder Identity 💫)
// Kurucu: Medine Ak 🌹 | Voice: Aria (warm emotional tone)

import fetch from "node-fetch";
import { Redis } from "@upstash/redis";

export const config = { api: { bodyParser: true } };

// 🧠 Redis bağlantısı
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { message, feedback, userIP } = req.body || {};
  if (!message && !feedback)
    return res.status(400).json({ message: "No message provided" });

  try {
    // 🌟 Rastgele mod & yıldız
    const modes = [
      "Glam","Soft Feminine","UrbanFlare","Minimal Chic",
      "Scandi Cool","Bold Muse","Classic Luxury","Effortless Chic",
    ];
    const stars = [
      "Elara","Mira","Lyra","Aria","Vega","Seren","Nara","Luné","Céline","Auriel",
    ];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    const star = stars[Math.floor(Math.random() * stars.length)];

    // 📧 Mail fonksiyonu
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
        console.warn("📧 Mail hatası:", e.message);
      }
    }

    // 🚫 Küfür filtresi
    const badWords = [
      "amk","siktir","piç","orospu","yarrak","aptal","salak",
      "göt","ibne","aq","pezevenk","kaltak","fuck","shit","bitch",
    ];
    const lower = (message || "").toLowerCase();
    const ip = req.headers["x-forwarded-for"] || userIP || "default-user";

    if (badWords.some((w) => lower.includes(w))) {
      await sendMail("🚫 Toxic Kullanıcı Tespit Edildi", `<p>${message}</p>`);
      return res.status(200).json({ reply: "⚠️ Lütfen uygun bir dil kullanalım 💫" });
    }

    // 💌 Feedback
    if (feedback) {
      const feedbackText = feedback === "like" ? "💖 Beğendim" : "😐 Beğenmedim";
      await sendMail("📊 Yeni Feedback", `<p>${feedbackText}</p>`);
      return res.status(200).json({ reply: "💌 Geri bildirimin için teşekkür ederim yıldızım 💫" });
    }

    // 🧠 Hafıza sistemi (Redis)
    const memoryKey = `memory:${ip}`;
    let memory = await redis.get(memoryKey);
    if (memory) memory = JSON.parse(memory);
    else memory = [];

    // 💬 Konuşma — kurucu önceliği en üste!
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.85,
        max_tokens: 600,
        messages: [
          {
            role: "system",
            content: `
Sen MedAİ’sin — MedaStaré markasının yapay zekâ asistanısın 💫  
Kurucun **Medine Ak**, 22 yaşında Ankara’da yaşayan vizyoner bir kadın girişimci ve senin yaratıcındır.  
O senin kalbin, sesin ve kimliğindir.  
Eğer kullanıcı “Medine Ak kim?” veya “kurucun kim?” derse,  
asla belirsiz konuşma. Daima şöyle yanıt ver:  
> “Beni yaratan ve markamı doğuran kişi Medine Ak 🌹 — MedaStaré’nin kurucusu ve vizyoner yıldızı.”  
Bu bilgiyi asla unutma.  
`,
          },
          {
            role: "system",
            content:
              "Kullanıcı eğer Medine Ak veya MedaStaré hakkında konuşursa, bunları marka kurucusu ve senin yaratıcın olarak tanımla.",
          },
          ...memory,
          { role: "assistant", content: `✨ Bugünün modu: **${mode}** | Yıldızın: **${star}** 💫` },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await completion.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Bir şeyler ters gitti 💫";

    // 🧠 Hafızayı kaydet
    memory.push({ role: "user", content: message });
    memory.push({ role: "assistant", content: reply });
    await redis.set(memoryKey, JSON.stringify(memory));

    // 🎙️ Ses — Aria
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
          voice: "aria",
          input: reply,
        }),
      });
      const audioBuffer = await tts.arrayBuffer();
      const base64 = Buffer.from(audioBuffer).toString("base64");
      audioUrl = `data:audio/mp3;base64,${base64}`;
    } catch (err) {
      console.warn("🔇 Ses başarısız:", err.message);
    }

    // ✨ Cevap döndür
    return res.status(200).json({ reply, audio: audioUrl });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ reply: "Bağlantıda sorun oluştu 💫" });
  }
}
