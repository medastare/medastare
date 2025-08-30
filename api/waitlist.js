//
// ✨ Başarı Ekranı (Apple + Hologram vibe)
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
        background:radial-gradient(circle at 20% 20%, #0a0a1a, #000);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        color:#fff;
        overflow:hidden;
      }
      .grid {
        position:absolute;
        inset:0;
        background-image:
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size:40px 40px;
        animation:move 20s linear infinite;
      }
      @keyframes move {
        from {background-position:0 0, 0 0;}
        to {background-position:40px 40px, 40px 40px;}
      }
      .container {
        text-align:center;
        z-index:2;
        animation:fadeIn 1.2s ease-out;
      }
      h1 {
        font-size:2.4rem;
        background:linear-gradient(90deg,#00eaff,#ff00ff,#00ff9d);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        animation:glow 3s ease-in-out infinite;
      }
      @keyframes glow {
        0%,100% { text-shadow:0 0 20px rgba(0,255,255,0.6); }
        50% { text-shadow:0 0 40px rgba(255,0,200,0.7); }
      }
      p {
        margin-top:14px;
        font-size:1.1rem;
        color:#d0d0d0;
        opacity:0;
        animation:slideUp 1.2s ease forwards;
        animation-delay:0.8s;
      }
      .particle {
        position:absolute;
        border-radius:50%;
        animation:float 8s ease-in-out infinite;
      }
      .particle:nth-child(1){width:6px;height:6px;top:30%;left:20%;background:#0ff;}
      .particle:nth-child(2){width:10px;height:10px;top:60%;left:70%;background:#f0f;}
      .particle:nth-child(3){width:7px;height:7px;top:75%;left:40%;background:#0f9;}
      @keyframes float {
        0%{transform:translateY(0) scale(1);}
        50%{transform:translateY(-25px) scale(1.3);}
        100%{transform:translateY(0) scale(1);}
      }
      @keyframes fadeIn {from{opacity:0;transform:scale(0.9);}to{opacity:1;transform:scale(1);} }
      @keyframes slideUp {from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;} }
    </style>
  </head>
  <body>
    <div class="grid"></div>
    <div class="container">
      <h1>🤖✨ Teşekkürler ${name}!</h1>
      <p>Kaydın başarıyla Google Sheets’e işlendi.<br><strong>Bizi beklemede kal 💫</strong></p>
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
        background:radial-gradient(circle at center,#2d0000,#000);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        color:#fff;
        overflow:hidden;
      }
      .grid {
        position:absolute;
        inset:0;
        background-image:
          linear-gradient(rgba(255,0,0,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,0,0,0.08) 1px, transparent 1px);
        background-size:40px 40px;
        animation:move 15s linear infinite;
      }
      @keyframes move {
        from {background-position:0 0, 0 0;}
        to {background-position:40px 40px, 40px 40px;}
      }
      .container {
        text-align:center;
        z-index:2;
        animation:fadeIn 1s ease-out;
      }
      h1 {
        font-size:2rem;
        color:#ff4c4c;
        text-shadow:0 0 30px rgba(255,0,0,0.7);
        animation:alarm 1s infinite;
      }
      @keyframes alarm {
        0%,100% { text-shadow:0 0 20px rgba(255,0,0,0.5);}
        50% { text-shadow:0 0 50px rgba(255,50,50,1);}
      }
      p {
        margin-top:12px;
        font-size:1rem;
        color:#ffaaaa;
        opacity:0;
        animation:slideUp 1.2s ease forwards;
        animation-delay:0.8s;
      }
      @keyframes fadeIn {from{opacity:0;transform:scale(0.9);}to{opacity:1;transform:scale(1);} }
      @keyframes slideUp {from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1);} }
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
