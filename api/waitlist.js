import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send(`
      <html><body><h1>❌ Only POST allowed</h1></body></html>
    `);
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send(errorHTML("⚠️ İsim ve e-posta gerekli!"));
  }

  const allowedDomains = ["gmail.com", "icloud.com", "outlook.com", "hotmail.com", "yahoo.com"];
  const domain = email.split("@")[1]?.toLowerCase();
  if (!allowedDomains.includes(domain)) {
    return res.status(400).send(errorHTML("⚠️ Sadece gmail, icloud, outlook, hotmail, yahoo kabul ediliyor"));
  }

  try {
    // Google Sheets Auth
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = "1--Y4fUkqxuB_6E-NpNXwFnEVhY1X20YRBdpHCIp061E";

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A:E",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          name,
          email,
          req.headers["x-forwarded-for"] || req.socket.remoteAddress,
          req.headers["user-agent"],
          new Date().toISOString()
        ]],
      },
    });

    return res.status(200).send(successHTML(name));

  } catch (err) {
    console.error("Sheets API error:", err);
    return res.status(500).send(errorHTML("❌ Sheets API error: " + err.message));
  }
}

// 🎉 Başarı ekranı
function successHTML(name) {
  return `
  <html>
  <head>
    <title>MedaStaré Waitlist</title>
    <style>
      body {
        margin:0; height:100vh; display:flex; align-items:center; justify-content:center;
        background: linear-gradient(135deg,#1a1a40,#000);
        font-family: 'Playfair Display', serif; color:#fff; overflow:hidden;
      }
      .stars {
        position:absolute; width:100%; height:100%;
        background:url('https://www.transparenttextures.com/patterns/stardust.png');
        animation: twinkle 10s infinite linear; opacity:0.3;
      }
      @keyframes twinkle {
        from {background-position:0 0;}
        to {background-position:1000px 1000px;}
      }
      .box {
        z-index:2; padding:50px; border:2px solid gold; border-radius:20px;
        background:rgba(0,0,0,0.6);
        box-shadow:0 0 40px rgba(255,215,0,0.8);
        text-align:center; animation: fadeIn 1.2s ease-in-out;
      }
      .emoji { font-size:3em; animation:bounce 1.5s infinite; }
      @keyframes bounce {
        0%,100% { transform:translateY(0);}
        50% { transform:translateY(-10px);}
      }
      @keyframes fadeIn {
        from {opacity:0; transform:scale(0.9);}
        to {opacity:1; transform:scale(1);}
      }
      h1 {
        font-size:2.2em; margin:20px 0;
        background:linear-gradient(to right, gold, #fff);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
      }
      p { font-size:1.2em; color:#ccc; }
    </style>
  </head>
  <body>
    <div class="stars"></div>
    <div class="box">
      <div class="emoji">💎✨</div>
      <h1>Teşekkürler ${name}!</h1>
      <p>Kaydın başarıyla Google Sheets’e eklendi.<br><strong>Bizi beklemede kal 💫</strong></p>
    </div>
  </body>
  </html>`;
}

// ⚠️ Hata ekranı
function errorHTML(message) {
  return `
  <html>
  <head>
    <title>MedaStaré Waitlist - Hata</title>
    <style>
      body {
        margin:0; height:100vh; display:flex; align-items:center; justify-content:center;
        background: linear-gradient(135deg,#400000,#000);
        font-family: 'Playfair Display', serif; color:#fff;
      }
      .box {
        padding:40px; border:2px solid red; border-radius:20px;
        background:rgba(0,0,0,0.7);
        box-shadow:0 0 40px rgba(255,0,0,0.8);
        text-align:center; animation: shake 0.5s;
      }
      @keyframes shake {
        0% { transform:translateX(0);}
        25% { transform:translateX(-5px);}
        50% { transform:translateX(5px);}
        75% { transform:translateX(-5px);}
        100% { transform:translateX(0);}
      }
      .emoji { font-size:3em; margin-bottom:10px; }
      h1 { font-size:1.8em; color:#ff5555; }
      p { font-size:1.1em; color:#ccc; }
    </style>
  </head>
  <body>
    <div class="box">
      <div class="emoji">⚠️</div>
      <h1>Hata!</h1>
      <p>${message}</p>
    </div>
  </body>
  </html>`;
}
