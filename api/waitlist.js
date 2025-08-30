import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send(errorHTML("❌ Sadece POST isteği kabul ediliyor"));
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send(errorHTML("⚠️ İsim ve e-posta gerekli!"));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send(errorHTML("⚠️ Geçerli bir e-posta adresi giriniz"));
  }

  const allowedDomains = ["gmail.com", "icloud.com", "outlook.com", "hotmail.com", "yahoo.com"];
  const domain = email.split("@")[1]?.toLowerCase();
  if (!allowedDomains.includes(domain)) {
    return res.status(400).send(errorHTML("⚠️ Sadece gmail, icloud, outlook, hotmail, yahoo kabul ediliyor"));
  }

  try {
    const key = process.env.GOOGLE_SERVICE_KEY;
    if (!key) throw new Error("GOOGLE_SERVICE_KEY bulunamadı!");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(key),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1--Y4fUkqxuB_6E-NpNXwFnEVhY1X20YRBdpHCIp061E"; // ✅ senin Sheet ID

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
          new Date().toISOString(),
        ]],
      },
    });

    return res.status(200).send(successHTML(name));
  } catch (err) {
    console.error("❌ Sheets API error:", err);
    return res.status(500).send(errorHTML("❌ Sunucu hatası: " + err.message));
  }
}

/* ====== Başarı Ekranı (Apple / Hologram Efektli) ====== */
function successHTML(name) {
  return `
  <html>
  <head>
    <title>MedaStaré Waitlist</title>
    <style>
      body {
        margin:0;
        height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        background:radial-gradient(circle at top,#1a1a40,#0d0d1f);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        overflow:hidden;
        color:#fff;
      }
      h1 {
        font-size:2.5rem;
        font-weight:700;
        background:linear-gradient(90deg,#00eaff,#7a5cff,#00ffb3);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        animation:glow 3s ease-in-out infinite;
      }
      p {
        margin-top:12px;
        font-size:1.1rem;
        color:#d9e6ff;
        animation:fadeIn 2s ease forwards;
      }
      @keyframes glow {
        50% { text-shadow:0 0 30px rgba(0,234,255,.6); }
      }
      @keyframes fadeIn {
        from { opacity:0; transform:translateY(10px); }
        to { opacity:1; transform:translateY(0); }
      }
    </style>
  </head>
  <body>
    <div style="text-align:center;">
      <h1>✨ Teşekkürler ${name}!</h1>
      <p>Kaydın başarıyla Google Sheets’e eklendi.<br><strong>Bizi beklemede kal... </strong></p>
    </div>
  </body>
  </html>`;
}

/* ====== Hata Ekranı ====== */
function errorHTML(message) {
  return `
  <html>
  <head><title>MedaStaré Waitlist - Hata</title></head>
  <body style="background:#400;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="text-align:center;">
      <h1 style="color:#ff4c4c;animation:pulse 1.5s infinite;">⚠️ Hata!</h1>
      <p>${message}</p>
    </div>
    <style>
      @keyframes pulse { 
        0% { transform:scale(1); } 
        50% { transform:scale(1.05); } 
        100% { transform:scale(1); } 
      }
    </style>
  </body>
  </html>`;
}
