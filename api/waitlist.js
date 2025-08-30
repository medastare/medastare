export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  const allowedDomains = ["gmail.com", "icloud.com", "outlook.com", "hotmail.com", "yahoo.com"];
  const domain = email.split("@")[1]?.toLowerCase();

  if (!allowedDomains.includes(domain)) {
    return res.status(400).json({ message: "⚠️ Sadece gmail, icloud, outlook, hotmail, yahoo kabul ediliyor" });
  }

  console.log("✅ New Waitlist Signup:", {
    name,
    email,
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    ua: req.headers["user-agent"],
    date: new Date().toISOString(),
  });

  return res.status(200).json({ message: "✅ Teşekkürler! Kaydın alındı, beklemede kal 💫" });
}
