function successHTML(name) {
  return `
  <html>
  <head>
    <title>MedaStaré Waitlist</title>
    <style>
      body {
        margin: 0;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(135deg, #1a1a40, #2d2d60);
        overflow: hidden;
        color: #fff;
      }

      .container {
        text-align: center;
        animation: fadeIn 1.2s ease-out;
      }

      h1 {
        font-size: 2.2rem;
        background: linear-gradient(90deg, #FFD700, #FF69B4, #AD6EFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        position: relative;
        display: inline-block;
      }

      /* ✨ Shimmer effect */
      h1::after {
        content: "";
        position: absolute;
        top: 0;
        left: -150%;
        height: 100%;
        width: 150%;
        background: linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent);
        animation: shimmer 2.5s infinite;
      }

      p {
        font-size: 1rem;
        margin-top: 12px;
        opacity: 0;
        animation: slideUp 1.5s ease forwards;
        animation-delay: 1s;
      }

      /* 🎉 Confetti Particles */
      .confetti {
        position: absolute;
        width: 8px;
        height: 14px;
        background: gold;
        top: -10px;
        animation: fall 3s linear infinite;
        opacity: 0.8;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      @keyframes shimmer {
        0% { left: -150%; }
        50% { left: 100%; }
        100% { left: 150%; }
      }

      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      @keyframes fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>✨ Teşekkürler ${name}!</h1>
      <p>Kaydın başarıyla Google Sheets’e eklendi.<br><strong>Bizi beklemede kal 💫</strong></p>
    </div>

    <!-- 🎊 Confetti (10 parça örnek) -->
    <div class="confetti" style="left:10%; background:#FF69B4; animation-delay:0s;"></div>
    <div class="confetti" style="left:20%; background:#FFD700; animation-delay:0.2s;"></div>
    <div class="confetti" style="left:30%; background:#AD6EFF; animation-delay:0.4s;"></div>
    <div class="confetti" style="left:40%; background:#00FA9A; animation-delay:0.6s;"></div>
    <div class="confetti" style="left:50%; background:#FF4500; animation-delay:0.8s;"></div>
    <div class="confetti" style="left:60%; background:#1E90FF; animation-delay:1s;"></div>
    <div class="confetti" style="left:70%; background:#FFD700; animation-delay:1.2s;"></div>
    <div class="confetti" style="left:80%; background:#FF69B4; animation-delay:1.4s;"></div>
    <div class="confetti" style="left:90%; background:#AD6EFF; animation-delay:1.6s;"></div>
  </body>
  </html>`;
}
