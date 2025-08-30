export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { name, email } = req.body;

  // basit validasyon
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  // geçerli domain listesi
  const allowedDomains = ["gmail.com", "icloud.com", "outlook.com", "hotmail.com", "yahoo.com"];
  const domain = email.split("@")[1]?.toLowerCase();

  if (!allowedDomains.includes(domain)) {
    return res.status(400).json({ message: "Only real email providers are accepted" });
  }

  // kayıt log örneği (ileride DB bağlanabilir)
  console.log("New Waitlist Signup:", {
    name,
    email,
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    ua: req.headers["user-agent"],
    date: new Date().toISOString()
  });

  // şimdilik sadece success dönelim
  return res.status(200).json({ message: "✅ Kaydın alındı!" });
}
