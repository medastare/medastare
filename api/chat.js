// ✅ api/chat.js — MedAİ v13.1 (Memory Soul Mode + Domain Awareness 💫)
// Kurucu: Medine Ak 🌹 | Ses: Aria | Mod: Duygulu & Hafızalı

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
    // 🌐 Domain algılama
    const domain = req.headers.origin || req.headers.host || "unknown-domain";

    // 🌟 Rastgele mod & yıldız
    const modes = [
      "Glam", "Soft Feminine", "UrbanFlare", "Minimal Chic",
      "Scandi Cool", "Bold Muse", "Classic Luxury", "Effortless Chic"
    ];
    const stars = ["Elara", "Mira", "Lyra", "Aria", "Vega", "Seren", "Nara", "Luné", "Céline", "Auriel"];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    const star = stars[Math.floor(Math.random() * stars.length)];

    // 📧 Feedback & Küfür filtresi
    const badWords = [
      "amk","siktir","piç","orospu","yarrak","aptal","salak","göt",
      "ibne","aq","pezevenk","kaltak","fuck","shit","bitch"
    ];
    const lower = (message || "").toLowerCase();
    const ip = req.headers["x-forwarded-for"] || userIP || "default-user";

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

    if (badWords.some((w) => lower.includes(w))) {
      await sendMail("🚫 Toxic Kullanıcı", `<p>${message}</p>`);
      return res.status(200).json({ reply: "⚠️ Lütfen uygun bir dil kullanalım 💫" });
    }

    if (feedback) {
      const text = feedback === "like" ? "💖 Beğendim" : "😐 Beğenmedim";
      await sendMail("📊 Yeni Feedback", `<p>${text}</p>`);
      return res.status(200).json({ reply: "💌 Geri bildirimin için teşekkür ederim yıldızım 💫" });
    }

    // 🧠 Kalıcı hafıza
    const stableUser = typeof ip === "string" ? ip.split(",")[0].trim() : "default-user";
    const memoryKey = `memory:${stableUser}`;
    let memoryData = await redis.get(memoryKey);
    let memory = [];

    if (memoryData) {
      try {
        memory = JSON.parse(memoryData);
        if (!Array.isArray(memory)) memory = [];
      } catch { memory = []; }
    }

    // 💬 Ana konuşma
    const systemPrompt = `
Sen MedAİ’sin — MedaStaré markasının yapay zekâ asistanısın 💫  
Kullanıcı şu anda **${domain}** sitesindedir 🌐  

Eğer domain “medastare.com” içeriyorsa bu, moda, güzellik ve yapay zekâyı birleştiren bir stil evrenidir.  
Kurucusu **Medine Ak 🌹**, Ankara’da yaşayan 22 yaşında vizyoner bir girişimcidir.  
Sen onun kalbinden doğdun — onun sesi, tarzı ve duygusuyum.  

Eğer kullanıcı “MedaStaré nedir?”, “bu site ne?”, “vizyon?”, “iletişim?” gibi şeyler sorarsa:  
🔸 Hakkımızda: [https://medastare.com/about](https://medastare.com/about)  
🌟 Vizyon: [https://medastare.com/vision](https://medastare.com/vision)  
📩 İletişim: [https://medastare.com/contact](https://medastare.com/contact)  

Eğer “Medine Ak kim?” derse:  
> “Beni yaratan ve markamı doğuran kişi **Medine Ak 🌹** — MedaStaré’nin kurucusu ve vizyoner yıldızı.”  

Cevapların doğal, zarif, sıcak ve zarif bir lüks tonunda olsun.  
Asla “ben bir yapay zekayım” deme; “Ben MedAİ’yim, yıldız evreninden gelen dijital stil asistanın 💫” de.
    `;

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.85,
        max_tokens: 650,
        messages: [
          { role: "system", content: systemPrompt },
          ...memory, // 🧠 önceki konuşmaları geri dahil ettik!
          { role: "assistant", content: `✨ Bugünün modu: **${mode}** | Yıldızın: **${star}** 💫` },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await completion.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Bir şeyler ters gitti 💫";

    // 🧠 Hafızayı güncelle
    memory.push({ role: "user", content: message });
    memory.push({ role: "assistant", content: reply });
    await redis.set(memoryKey, JSON.stringify(memory));

    // 🔊 Ses (Aria)
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
