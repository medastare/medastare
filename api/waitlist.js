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
        background:radial-gradient(circle at top,#0b0d1a,#000);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        overflow:hidden;
        color:#fff;
      }
      .container {
        text-align:center;
        position:relative;
        z-index:2;
        animation:fadeIn 1.2s ease-out;
      }
      h1 {
        font-size:2.8rem;
        font-weight:700;
        background:linear-gradient(90deg,#00eaff,#7a5cff,#00ffb3);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        animation:glow 3s ease-in-out infinite;
      }
      p {
        margin-top:14px;
        font-size:1.1rem;
        color:#cfe8ff;
        animation:slideUp 1.5s ease forwards;
      }
      /* glowing halo */
      .halo {
        position:absolute;
        width:600px;
        height:600px;
        border-radius:50%;
        background:radial-gradient(circle,rgba(0,234,255,.25),transparent 70%);
        filter:blur(80px);
        animation:rotate 20s linear infinite;
      }
      @keyframes glow {
        50% { text-shadow:0 0 35px rgba(0,234,255,.6); }
      }
      @keyframes fadeIn {
        from { opacity:0; transform:scale(0.95);}
        to { opacity:1; transform:scale(1);}
      }
      @keyframes slideUp {
        from {opacity:0; transform:translateY(20px);}
        to {opacity:1; transform:translateY(0);}
      }
      @keyframes rotate {
        from {transform:rotate(0);}
        to {transform:rotate(360deg);}
      }
      /* floating particles */
      .particle {
        position:absolute;
        width:6px;
        height:6px;
        border-radius:50%;
        background:white;
        opacity:.7;
        animation:float 6s ease-in-out infinite;
      }
      .particle:nth-child(1){top:20%;left:25%;animation-delay:0s}
      .particle:nth-child(2){top:70%;left:40%;animation-delay:1.5s}
      .particle:nth-child(3){top:40%;left:75%;animation-delay:3s}
      @keyframes float {
        50% { transform:translateY(-20px) scale(1.2); opacity:.9 }
      }
    </style>
  </head>
  <body>
    <div class="halo"></div>
    <div class="container">
      <h1>✨ Teşekkürler ${name}!</h1>
      <p>Kaydın başarıyla Google Sheets’e eklendi.<br><b>Bizi beklemede kal 🚀</b></p>
    </div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
  </body>
  </html>`;
}

/* ====== Hata Ekranı (Apple tarzı cam + neon) ====== */
function errorHTML(message) {
  return `
  <html>
  <head>
    <title>MedaStaré Waitlist - Hata</title>
    <style>
      body {
        margin:0;
        height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        background:linear-gradient(135deg,#200,#400);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        overflow:hidden;
      }
      .card {
        padding:30px 40px;
        border-radius:20px;
        background:rgba(255,0,0,.08);
        backdrop-filter:blur(18px) saturate(160%);
        -webkit-backdrop-filter:blur(18px) saturate(160%);
        border:1px solid rgba(255,0,0,.25);
        text-align:center;
        animation:fadeIn .8s ease-out;
        box-shadow:0 0 40px rgba(255,0,0,.25);
      }
      h1 {
        font-size:2rem;
        color:#ff4c4c;
        text-shadow:0 0 15px rgba(255,0,0,0.6);
        animation:pulse 1.5s infinite;
        margin:0 0 10px;
      }
      p { color:#ffdcdc; margin:0; font-size:1rem; }
      @keyframes fadeIn {
        from {opacity:0; transform:translateY(10px);}
        to {opacity:1; transform:translateY(0);}
      }
      @keyframes pulse {
        50% { transform:scale(1.05); }
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>⚠️ Hata!</h1>
      <p>${message}</p>
    </div>
  </body>
  </html>`;
}
