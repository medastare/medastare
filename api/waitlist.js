//
// ✨ Başarı Ekranı (Apple hologram efekti)
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
        background:radial-gradient(circle at 30% 30%, #0f0f1f, #000);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        overflow:hidden;
        color:#fff;
      }

      /* Hologram grid */
      .grid {
        position:absolute;
        width:100%;
        height:100%;
        background-image:linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size:40px 40px;
        animation:moveGrid 20s linear infinite;
      }
      @keyframes moveGrid {
        from {background-position:0 0, 0 0;}
        to {background-position:40px 40px, 40px 40px;}
      }

      .container {
        text-align:center;
        animation:fadeIn 1.2s ease-out;
        z-index:2;
      }

      h1 {
        font-size:2.5rem;
        background:linear-gradient(90deg,#00f0ff,#ff00de,#00ff95);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        text-shadow:0 0 30px rgba(0,255,255,0.4);
        animation:glow 3s ease-in-out infinite;
      }

      p {
        font-size:1.1rem;
        margin-top:14px;
        opacity:0;
        animation:slideUp 1.5s ease forwards;
        animation-delay:1s;
        color:#cfcfcf;
      }

      /* Efektler */
      @keyframes fadeIn { from{opacity:0;transform:scale(0.95);} to{opacity:1;transform:scale(1);} }
      @keyframes slideUp { from{transform:translateY(20px);opacity:0;} to{transform:translateY(0);opacity:1;} }
      @keyframes glow { 
        0%,100% { text-shadow:0 0 20px rgba(0,255,255,0.6), 0 0 40px rgba(255,0,255,0.3); }
        50% { text-shadow:0 0 40px rgba(0,255,180,0.8), 0 0 80px rgba(255,0,200,0.5); }
      }

      /* Floating particles */
      .particle {
        position:absolute;
        border-radius:50%;
        background:rgba(0,255,255,0.7);
        animation:float 10s infinite ease-in-out;
      }
      .particle:nth-child(1) { width:6px; height:6px; top:20%; left:30%; animation-delay:0s; }
      .particle:nth-child(2) { width:8px; height:8px; top:50%; left:70%; animation-delay:2s; background:#ff00ff; }
      .particle:nth-child(3) { width:5px; height:5px; top:70%; left:40%; animation-delay:4s; background:#00ff95; }

      @keyframes float {
        0% { transform:translateY(0) scale(1);}
        50% { transform:translateY(-30px) scale(1.3);}
        100% { transform:translateY(0) scale(1);}
      }
    </style>
  </head>
  <body>
    <div class="grid"></div>
    <div class="container">
      <h1>🤖✨ Teşekkürler ${name}!</h1>
      <p>Kaydın yapay zeka hologramına işlendi.<br><strong>Bizi beklemede kal 💫</strong></p>
    </div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
  </body>
  </html>`;
}

//
// ⚠️ Hata Ekranı (Apple kırmızı hologram alarmı)
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
        background:radial-gradient(circle at center,#1a0000,#000);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        color:#fff;
        overflow:hidden;
      }

      .grid {
        position:absolute;
        width:100%;
        height:100%;
        background-image:linear-gradient(rgba(255,0,0,0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,0,0,0.1) 1px, transparent 1px);
        background-size:40px 40px;
        animation:moveGrid 15s linear infinite;
      }
      @keyframes moveGrid {
        from {background-position:0 0, 0 0;}
        to {background-position:40px 40px, 40px 40px;}
      }

      .container {
        text-align:center;
        animation:fadeIn 1s ease-out;
        z-index:2;
      }

      h1 {
        font-size:2rem;
        color:#ff4c4c;
        text-shadow:0 0 30px rgba(255,0,0,0.6);
        animation:alarm 1s infinite;
      }

      p {
        font-size:1rem;
        margin-top:12px;
        color:#ffaaaa;
        opacity:0;
        animation:slideUp 1.2s ease forwards;
        animation-delay:0.8s;
      }

      @keyframes fadeIn { from{opacity:0;transform:scale(0.9);} to{opacity:1;transform:scale(1);} }
      @keyframes slideUp { from{transform:translateY(20px);opacity:0;} to{transform:translateY(0);opacity:1;} }
      @keyframes alarm { 
        0%,100% { text-shadow:0 0 20px rgba(255,0,0,0.6), 0 0 40px rgba(255,0,0,0.3); }
        50% { text-shadow:0 0 40px rgba(255,50,50,1), 0 0 80px rgba(255,0,0,0.7); }
      }
    </style>
  </head>
  <body>
    <div class="grid"></div>
    <div class="container">
      <h1>⚠️ Hata!</h1>
      <p>${message}</p>
    </div>
  </body>
  </html>`;
}
