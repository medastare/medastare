// pages/api/waitlist.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "❌ Only POST method is allowed" });
  }

  const { name, email } = req.body;

  // basit validasyon
  if (!name || !email) {
    return res.status(400).json({ message: "⚠️ Name and email are required" });
  }

  // sadece büyük sağlayıcılar
  const allowedDomains = [
    "gmail.com",
    "icloud.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com"
  ];
  const domain = email.split("@")[1]?.toLowerCase();

  if (!allowedDomains.includes(domain)) {
    return res.status(400).json({
      message: "⚠️ Sadece gmail, icloud, outlook, hotmail veya yahoo kabul ediliyor."
    });
  }

  // loglama (istersen DB bağlayabilirsin)
  console.log("✅ New Waitlist Signup:", {
    name,
    email,
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    ua: req.headers["user-agent"],
    date: new Date().toISOString(),
  });

  // başarı mesajı
  return res.status(200).json({
    message: "✅ Teşekkürler! Kaydın alındı, beklemede kal ✨"
  });
}
