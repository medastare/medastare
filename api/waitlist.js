export default function Home() {
  return (
    <html>
      <head>
        <title>MedaStaré - Tadilatta</title>
        <style>{`
          body {
            margin:0; height:100vh; display:flex; align-items:center; justify-content:center;
            background: linear-gradient(135deg,#1a1a40,#000);
            font-family: 'Playfair Display', serif; color:#fff;
            overflow:hidden;
          }
          .stars {
            position:absolute; width:100%; height:100%;
            background:url('https://www.transparenttextures.com/patterns/stardust.png');
            animation: twinkle 15s infinite linear; opacity:0.25;
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
        `}</style>
      </head>
      <body>
        <div class="stars"></div>
        <div class="box">
          <div class="emoji">🚧✨</div>
          <h1>MedaStaré Tadilatta</h1>
          <p>Yeni sürüm için hazırlık yapıyoruz.<br/><strong>Bizi beklemede kal 💫</strong></p>
        </div>
      </body>
    </html>
  );
}
