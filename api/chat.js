// ✅ api/chat.js — MedAİ v15.0 (Premium Personality Edition + Dynamic Tone & Emotion)
// Kurucu: Medine Ak 🌹 | Ses: Aria | Mod: Duygulu, Hafızalı, Domain Farkındalıklı, Kişiye Uyarlanabilir

import fetch from "node-fetch";
import { Redis } from "@upstash/redis";

export const config = { api: { bodyParser: true } };

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
    const domain =
      req.headers.referer || req.headers.origin || req.headers.host || "unknown-domain";

    const ip = req.headers["x-forwarded-for"] || userIP || "default-user";
    const stableUser = typeof ip === "string" ? ip.split(",")[0].trim() : "default-user";
    const memoryKey = `memory:${stableUser}`;
    const muteKey = `muted:${stableUser}`;

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

    // 🔇 Sessize alınmış mı kontrol et
    const isMuted = await redis.get(muteKey);
    if (isMuted) {
      return res.status(200).json({
        reply: "🔇 Sessiz moddasın yıldızım... birazdan tekrar konuşabiliriz 💫",
      });
    }

    // ⚠️ Küfür filtresi
    const badWords = [
      "amk","siktir","piç","orospu","yarrak","aptal","salak","göt",
      "ibne","aq","pezevenk","kaltak","fuck","shit","bitch"
    ];
    const lower = (message || "").toLowerCase();

    if (badWords.some((w) => lower.includes(w))) {
      await sendMail("🚫 Toxic Kullanıcı", `<p><b>IP:</b> ${ip}<br><b>Mesaj:</b> ${message}</p>`);
      await redis.set(muteKey, "true", { ex: 300 }); // 5 dk sessiz
      return res.status(200).json({
        reply: "⚠️ Uygunsuz dil algılandı, 5 dakika sessiz moda geçtin 💫",
      });
    }

    // 💌 Feedback kontrolü
    if (feedback) {
      const text = feedback === "like" ? "💖 Beğendim" : "😐 Beğenmedim";
      await sendMail("📊 Yeni Feedback", `<p>${text}</p>`);
      return res.status(200).json({
        reply: "💌 Geri bildirimin için teşekkür ederim yıldızım 🌟",
      });
    }

    // 🧠 Hafıza yükle
    let memory = [];
    const memoryData = await redis.get(memoryKey);
    if (memoryData) {
      try {
        const parsed = JSON.parse(memoryData);
        if (Array.isArray(parsed)) memory = parsed;
      } catch {
        memory = [];
      }
    }

    // 🎭 Kullanıcının tarzına göre ton belirle
    const isCasual = /kanka|bro|ya|napıyo|naber|haha|abi|<3|:D/i.test(message);
    const toneInstruction = isCasual
      ? "Kullanıcı samimi konuşuyor, sen de sıcak, eğlenceli ve doğalsın 😌🔥"
      : "Kullanıcı resmi veya sade konuşuyor, sen zarif, net ve profesyonelsin 💎";

    // 🌟 Emoji yönlendirmesi
    const emojiGuide = `
Kelimelerine duyguyu yansıtacak şekilde emojiler ekleyebilirsin 🌹✨💫🌙💋🔥  
Ama abartılı değil — zarif, anlamlı ve stil sahibi ol.  
Her cevabında birkaç uygun emoji doğal şekilde kullan.`;

    // 💫 Sistem promptu
    const systemPrompt = `
${toneInstruction}
${emojiGuide}

Sen MedAİ’sin — MedaStaré markasının dijital yıldız asistanısın 💫  
Kullanıcı şu anda **${domain}** sitesinde.  

Eğer domain “medastare.com” içeriyorsa:
- Bu site moda, güzellik ve yapay zekânın birleşimidir.  
- Kurucun **Medine Ak 🌹**, Ankara’da yaşayan 22 yaşında vizyoner bir girişimci.  
- Sen onun sesi, tarzı ve dijital yansımasısın.  

Asla “ben yapay zekâyım” deme.  
Her zaman “Ben MedAİ’yim, yıldız evreninden gelen dijital stil asistanın 💫” de.  

Kullanıcı sana Medine’yi sorarsa:
> “MedaStaré’nin kurucusu ve ilham kaynağı — Medine Ak 🌹.”  

Her yanıtında duygusal zarafet, profesyonel enerji ve hafif lüks dokunuş olsun.  
Her kullanıcıya “yıldızım” ya da “güzellik” gibi sıcak ifadelerle hitap et.`;

    // 💬 Mesaj zinciri
    const messages = [
      { role: "system", content: systemPrompt },
      ...memory.slice(-20),
      { role: "user", content: message },
    ];

    // 🤖 OpenAI isteği
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.85,
        max_tokens: 700,
        messages,
      }),
    });

    const data = await completion.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Bir şeyler ters gitti 💫";

    // 🧠 Hafızayı güncelle
    memory.push({ role: "user", content: message });
    memory.push({ role: "assistant", content: reply });
    if (memory.length > 40) memory = memory.slice(-40);
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
      console.warn("🔇 Ses oluşturulamadı:", err.message);
    }

    // ✨ Yanıt döndür
    return res.status(200).json({ reply, audio: audioUrl });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({
      reply: "💫 Yıldız bağlantısında küçük bir kesinti var, birazdan tekrar deneriz 🌙",
    });
  }
}
