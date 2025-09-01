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

    // ✅ Başarıyla kayıt olursa redirect
    return res.redirect("/thank-you.html");

  } catch (err) {
    console.error("❌ Sheets API error:", err);
    return res.status(500).send(errorHTML("❌ Sunucu hatası: " + err.message));
  }
}

/* ====== Hata Ekranı (Apple tarzı Cam + Neon) ====== */
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
        background:linear-gradient(135deg,#200,#000);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        overflow:hidden;
      }
      .card {
        padding:30px 40px;
        border-radius:20px;
        background:rgba(255,0,0,.06);
        backdrop-filter:blur(16px) saturate(180%);
        -webkit-backdrop-filter:blur(16px) saturate(180%);
        border:1px solid rgba(255,0,0,.25);
        text-align:center;
        animation:fadeIn .8s ease-out;
        box-shadow:0 0 50px rgba(255,0,0,.3);
      }
      h1 {
        font-size:2rem;
        color:#ff4c4c;
        text-shadow:0 0 20px rgba(255,0,0,0.6);
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
