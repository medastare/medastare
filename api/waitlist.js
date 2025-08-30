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
    const spreadsheetId = "1--Y4fUkqxuB_6E-NpNXwFnEVhY1X20YRBdpHCIp061E"; // ✅ senin sheet ID

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

//
// ✨ Başarı Ekranı (Apple efektleriyle)
//
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
        background:linear-gradient(135deg,#1a1a40,#2d2d60);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        overflow:hidden;
        color:#fff;
      }
      .container {
        text-align:center;
        animation:fadeIn 1.2s ease-out;
      }
      h1 {
        font-size:2.2rem;
        background:linear-gradient(90deg,#FFD700,#FF69B4,#AD6EFF);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        position:relative;
        display:inline-block;
      }
      h1::after {
        content:"";
        position:absolute;
        top:0;
        left:-150%;
        height:100%;
        width:150%;
        background:linear-gradient(120deg,transparent,rgba(255,255,255,0.6),transparent);
        animation:shimmer 2.5s infinite;
      }
      p {
        font-size:1rem;
        margin-top:12px;
        opacity:0;
        animation:slideUp 1.5s ease forwards;
        animation-delay:1s;
      }
      .confetti {
        position:absolute;
        width:8px;
        height:14px;
        top:-10px;
        animation:fall 3s linear infinite;
        opacity:0.8;
      }
      @keyframes fadeIn { from{opacity:0;transform:scale(0.95);} to{opacity:1;transform:scale(1);} }
      @keyframes shimmer { 0%{left:-150%;} 50%{left:100%;} 100%{left:150%;} }
      @keyframes slideUp { from{transform:translateY(20px);opacity:0;} to{transform:translateY(0);opacity:1;} }
      @keyframes fall { 0%{transform:translateY(0) rotate(0);} 100%{transform:translateY(100vh) rotate(360deg);} }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>✨ Teşekkürler ${name}!</h1>
      <p>Kaydın başarıyla Google Sheets’e eklendi.<br><strong>Bizi beklemede kal 💫</strong></p>
    </div>
    <!-- 🎊 confetti parçaları -->
    <div class="confetti" style="left:10%;background:#FF69B4;animation-delay:0s;"></div>
    <div class="confetti" style="left:30%;background:#FFD700;animation-delay:0.3s;"></div>
    <div class="confetti" style="left:50%;background:#AD6EFF;animation-delay:0.6s;"></div>
    <div class="confetti" style="left:70%;background:#00FA9A;animation-delay:0.9s;"></div>
    <div class="confetti" style="left:90%;background:#1E90FF;animation-delay:1.2s;"></div>
  </body>
  </html>`;
}

//
// ⚠️ Hata Ekranı (Apple kırmızı pulse efekti)
//
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
        background:linear-gradient(135deg,#400000,#600000);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        color:#fff;
        overflow:hidden;
      }
      .container {
        text-align:center;
        animation:fadeIn 1s ease-out;
      }
      h1 {
        font-size:2rem;
        color:#FF4C4C;
        text-shadow:0 0 15px rgba(255,0,0,0.6);
        animation:pulse 1.5s infinite;
      }
      p {
        font-size:1rem;
        margin-top:10px;
        opacity:0;
        animation:slideUp 1.2s ease forwards;
        animation-delay:0.8s;
      }
      @keyframes fadeIn { from{opacity:0;transform:scale(0.95);} to{opacity:1;transform:scale(1);} }
      @keyframes slideUp { from{transform:translateY(20px);opacity:0;} to{transform:translateY(0);opacity:1;} }
      @keyframes pulse { 0%{transform:scale(1);} 50%{transform:scale(1.05);} 100%{transform:scale(1);} }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>⚠️ Hata!</h1>
      <p>${message}</p>
    </div>
  </body>
  </html>`;
}
