import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send(errorHTML("❌ Sadece POST isteği kabul ediliyor"));
  }

  const { name, email } = req.body;

  // ⚠️ Zorunlu alanlar
  if (!name || !email) {
    return res.status(400).send(errorHTML("⚠️ İsim ve e-posta gerekli!"));
  }

  // ✨ Regex ile e-posta format kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send(errorHTML("⚠️ Geçerli bir e-posta adresi giriniz"));
  }

  // ✨ Domain kontrolü
  const allowedDomains = ["gmail.com", "icloud.com", "outlook.com", "hotmail.com", "yahoo.com"];
  const domain = email.split("@")[1]?.toLowerCase();
  if (!allowedDomains.includes(domain)) {
    return res.status(400).send(errorHTML("⚠️ Sadece gmail, icloud, outlook, hotmail, yahoo kabul ediliyor"));
  }

  try {
    // 🔑 Google Service Account bağlan
    if (!process.env.GOOGLE_SERVICE_KEY) {
      throw new Error("GOOGLE_SERVICE_KEY env değişkeni bulunamadı!");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY), // ✅ ENV KEY KULLANIMI
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // 📊 Senin Sheet ID
    const spreadsheetId = "1--Y4fUkqxuB_6E-NpNXwFnEVhY1X20YRBdpHCIp061E";

    // 📝 Satır ekle
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A:E",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          name,
          email,
          req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "N/A",
          req.headers["user-agent"] || "unknown",
          new Date().toISOString()
        ]],
      },
    });

    return res.status(200).send(successHTML(name));

  } catch (err) {
    console.error("❌ Sheets API error:", err);
    return res.status(500).send(errorHTML("❌ Sunucu hatası: " + err.message));
  }
}

//
// 🎉 Başarı Ekranı
//
function successHTML(name) {
  return `
  <html>
  <head><title>MedaStaré Waitlist</title></head>
  <body style="background:#1a1a40; color:#fff; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
    <div style="text-align:center;">
      <h1>✨ Teşekkürler ${name}!</h1>
      <p>Kaydın başarıyla Google Sheets’e eklendi.<br><strong>Bizi beklemede kal 💫</strong></p>
    </div>
  </body>
  </html>`;
}

//
// ⚠️ Hata Ekranı
//
function errorHTML(message) {
  return `
  <html>
  <head><title>MedaStaré Waitlist - Hata</title></head>
  <body style="background:#400000; color:#fff; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
    <div style="text-align:center;">
      <h1>⚠️ Hata!</h1>
      <p>${message}</p>
    </div>
  </body>
  </html>`;
}
