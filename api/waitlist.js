//
// ✨ Başarı Ekranı (Apple / hologram efektli)
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
        background:radial-gradient(circle at top,#1a1a40,#0d0d1f);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        overflow:hidden;
        color:#fff;
      }
      .card {
        text-align:center;
        padding:40px;
        border-radius:20px;
        background:rgba(255,255,255,0.05);
        backdrop-filter:blur(15px) saturate(120%);
        -webkit-backdrop-filter:blur(15px) saturate(120%);
        border:1px solid rgba(255,255,255,0.15);
        box-shadow:0 0 40px rgba(0,255,200,0.2);
        animation:fadeIn 1s ease-out;
      }
      h1 {
        font-size:2.4rem;
        margin:0;
        background:linear-gradient(90deg,#00eaff,#ff57ff,#00ffb3);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        animation:glow 3s ease-in-out infinite;
      }
      p {
        font-size:1.1rem;
        margin-top:15px;
        color:#cfe8ff;
      }
      @keyframes fadeIn { from{opacity:0;transform:scale(0.95);} to{opacity:1;transform:scale(1);} }
      @keyframes glow {
        0%,100%{text-shadow:0 0 20px rgba(0,234,255,0.3);}
        50%{text-shadow:0 0 35px rgba(255,87,255,0.4);}
      }
      .dot {
        width:10px; height:10px; border-radius:50%;
        background:conic-gradient(from 0deg,#00eaff,#ff57ff,#00ffb3,#00eaff);
        margin:20px auto 0;
        animation:spin 2s linear infinite;
      }
      @keyframes spin { to { transform:rotate(360deg); } }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>✨ Teşekkürler ${name}!</h1>
      <p>Kaydın başarıyla Google Sheets’e eklendi.<br><strong>Bizi beklemede kal 💫</strong></p>
      <div class="dot"></div>
    </div>
  </body>
  </html>`;
}

//
// ⚠️ Hata Ekranı (Apple kırmızı neon efekti)
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
        background:radial-gradient(circle at top,#400000,#100000);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        overflow:hidden;
        color:#fff;
      }
      .card {
        text-align:center;
        padding:35px;
        border-radius:18px;
        background:rgba(255,0,0,0.05);
        backdrop-filter:blur(12px);
        -webkit-backdrop-filter:blur(12px);
        border:1px solid rgba(255,0,0,0.25);
        box-shadow:0 0 40px rgba(255,0,0,0.25);
        animation:fadeIn 1s ease-out;
      }
      h1 {
        font-size:2rem;
        margin:0;
        color:#ff4c4c;
        text-shadow:0 0 20px rgba(255,0,0,0.6);
        animation:pulse 1.4s infinite;
      }
      p {
        font-size:1rem;
        margin-top:12px;
        color:#ffb3b3;
      }
      @keyframes fadeIn { from{opacity:0;transform:translateY(15px);} to{opacity:1;transform:translateY(0);} }
      @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.06);} }
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
