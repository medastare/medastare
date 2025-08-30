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
    const spreadsheetId = "1--Y4fUkqxuB_6E-NpNXwFnEVhY1X20YRBdpHCIp061E";

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

/* ====== APPLE / HOLOGRAM TARZI BAŞARI EKRANI ====== */
function successHTML(name) {
  return `
  <html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>MedaStaré Waitlist</title>
    <style>
      *{box-sizing:border-box}
      body{
        margin:0;height:100vh;display:flex;align-items:center;justify-content:center;
        background:#0b0d1a;overflow:hidden;
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;color:#fff;
      }
      /* arka plan spotlight + yumuşak gradient pan */
      .bg{
        position:absolute;inset:-20%;
        background:
          radial-gradient(600px 260px at 20% 10%, rgba(0,255,200,.25), transparent 60%),
          radial-gradient(800px 320px at 80% 90%, rgba(140,80,255,.18), transparent 60%),
          linear-gradient(135deg,#0b0d1a,#05060b);
        filter:saturate(120%);
        animation:bgpan 30s linear infinite;
      }
      @keyframes bgpan{0%{transform:translateX(0)}50%{transform:translateX(-3%)}100%{transform:translateX(0)}}

      /* cam kart + ince neon stroke */
      .card{
        position:relative;z-index:2;width:min(92vw,560px);padding:34px 28px;text-align:center;
        border-radius:24px;background:rgba(255,255,255,.06);
        backdrop-filter:blur(16px) saturate(130%);-webkit-backdrop-filter:blur(16px) saturate(130%);
        border:1px solid rgba(255,255,255,.16);
        box-shadow:0 10px 40px rgba(0,0,0,.55), 0 0 120px rgba(0,255,200,.16);
        animation:rise .9s ease-out both;
      }
      @keyframes rise{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}

      /* hologram başlık */
      h1{
        margin:0 0 10px;font-size:2.3rem;line-height:1.15;font-weight:700;
        background:linear-gradient(90deg,#00eaff,#7a5cff,#00ffb3);
        -webkit-background-clip:text;-webkit-text-fill-color:transparent;
        letter-spacing:.2px;
        text-shadow:0 0 28px rgba(0,234,255,.35);
        animation:glow 3s ease-in-out infinite;
      }
      @keyframes glow{50%{text-shadow:0 0 44px rgba(122,92,255,.5)}}

      p{margin:0;font-size:1.03rem;color:#d9e6ff;opacity:.95}

      /* küçük “AI onaylandı” çipi */
      .chip{
        margin:18px auto 0;display:inline-flex;gap:10px;align-items:center;
        padding:10px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.18);
        background:rgba(255,255,255,.05);color:#cfe8ff;font-size:.9rem;
      }
      .dot{width:8px;height:8px;border-radius:50%;
           background:conic-gradient(from 0deg,#00eaff,#7a5cff,#00ffb3,#00eaff);
           animation:spin 2.2s linear infinite}
      @keyframes spin{to{transform:rotate(360deg)}}

      /* zarif parçacıklar */
      .particles{position:absolute;inset:0;pointer-events:none}
      .p{position:absolute;width:8px;height:8px;border-radius:50%;
         background:radial-gradient(circle,#fff,transparent 65%);opacity:.75;
         animation:float 7s ease-in-out infinite}
      .p:nth-child(1){top:18%;left:22%;animation-delay:.0s}
      .p:nth-child(2){top:72%;left:70%;animation-delay:1.4s}
      .p:nth-child(3){top:80%;left:40%;animation-delay:2.6s}
      .p:nth-child(4){top:30%;left:82%;animation-delay:3.2s}
      @keyframes float{50%{transform:translateY(-16px)}}

      /* başlık üzerinde hafif “shimmer” çizgisi */
      .shine{
        position:absolute;inset:0;pointer-events:none;mask-image:radial-gradient(closest-side, rgba(255,255,255,.9), transparent);
      }
      .beam{
        position:absolute;top:15%;left:-40%;width:40%;height:70%;
        background:linear-gradient(120deg,transparent,rgba(255,255,255,.55),transparent);
        transform:skewX(-20deg);filter:blur(6px);opacity:.6;animation:beam 3s ease-in-out infinite;
      }
      @keyframes beam{0%{left:-40%}50%{left:100%}100%{left:140%}}
    </style>
  </head>
  <body>
    <div class="bg"></div>
    <div class="card">
      <div class="shine"><div class="beam"></div></div>
      <h1>Teşekkürler ${name}!</h1>
      <p>Kaydın başarıyla Google Sheets’e eklendi.<br><b>Bizi beklemede kal</b></p>
      <div class="chip"><div class="dot"></div><div>AI asistanı onayladı</div></div>
    </div>
    <div class="particles"><div class="p"></div><div class="p"></div><div class="p"></div><div class="p"></div></div>
  </body>
  </html>`;
}

/* ====== APPLE / CAMLI HATA EKRANI ====== */
function errorHTML(message) {
  return `
  <html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>MedaStaré Waitlist - Hata</title>
    <style>
      *{box-sizing:border-box}
      body{
        margin:0;height:100vh;display:flex;align-items:center;justify-content:center;
        background:#060608;overflow:hidden;
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;color:#fff;
      }
      .bg{
        position:absolute;inset:-20%;
        background:
          radial-gradient(640px 260px at 25% 5%, rgba(255,70,70,.25), transparent 60%),
          radial-gradient(800px 340px at 110% 110%, rgba(120,0,0,.22), transparent 60%),
          linear-gradient(135deg,#0b0d12,#000);
        animation:bg 22s linear infinite;
      }
      @keyframes bg{50%{transform:translateX(-3%)}}      

      .card{
        position:relative;z-index:2;width:min(92vw,560px);padding:28px;text-align:center;
        border-radius:22px;background:rgba(255,0,0,.06);
        backdrop-filter:blur(14px) saturate(130%);-webkit-backdrop-filter:blur(14px) saturate(130%);
        border:1px solid rgba(255,0,0,.22);
        box-shadow:0 10px 40px rgba(0,0,0,.6), 0 0 90px rgba(255,60,60,.22);
        animation:rise .9s ease-out both;
      }
      @keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

      h1{margin:0 0 8px;font-size:2rem;color:#ff4c4c;text-shadow:0 0 28px rgba(255,0,0,.6);animation:pulse 1.6s infinite}
      @keyframes pulse{50%{transform:scale(1.03)}}
      p{margin:0;font-size:1rem;color:#ffcdcd}
    </style>
  </head>
  <body>
    <div class="bg"></div>
    <div class="card">
      <h1>Hata!</h1>
      <p>${message}</p>
    </div>
  </body>
  </html>`;
}
