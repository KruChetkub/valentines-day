import React, { useState, useEffect, useRef } from 'react';
import { Heart, X } from 'lucide-react';

const BackgroundHearts = () => {
  const [hearts, setHearts] = useState([]);
  useEffect(() => {
    setHearts(Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 15 + 10}s`,
      delay: `${Math.random() * 5}s`,
      size: Math.random() * 20 + 10,
      color: Math.random() > 0.5 ? '#fda4af' : '#f43f5e'
    })));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((h) => (
        <div key={h.id} 
             className="absolute opacity-0"
             style={{
               left: h.left,
               color: h.color,
               fontSize: `${h.size}px`,
               animation: `float ${h.animationDuration} linear infinite`,
               animationDelay: h.delay
             }}>
          ❤
        </div>
      ))}
    </div>
  );
};

const Explosion = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 2000;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 45 + 5; 
      
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: Math.random() * 35 + 10,
        color: ['#ff0000', '#ff69b4', '#ff1493', '#e11d48', '#fb7185'][Math.floor(Math.random() * 5)],
        life: 1, 
        decay: Math.random() * 0.008 + 0.002,
        gravity: 0.25
      });
    }

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= p.decay;

        if (p.life > 0) {
          ctx.globalAlpha = p.life;
          ctx.font = `${p.size}px serif`;
          ctx.fillStyle = p.color;
          ctx.fillText("❤", p.x, p.y);
        }
      });

      if (particles.some(p => p.life > 0)) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};

const PhotoCard = ({ src, caption, rotate, delay, onClick }) => (
  <div 
    className={`group relative transform ${rotate} hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-500 ease-out cursor-zoom-in`}
    style={{ animationDelay: delay }}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-black/10 rounded-sm transform translate-x-1 translate-y-1 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 blur-sm"></div>
    <div className="bg-white p-2 pb-8 shadow-md rounded-sm border border-gray-100 relative h-full">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-rose-200/50 rounded-full backdrop-blur-sm z-10 opacity-60"></div>
      <img src={src} alt="Memory" className="w-full h-40 object-cover rounded-sm filter brightness-[1.02] contrast-[1.05]" />
      <p className="absolute bottom-2 left-0 w-full text-center font-handwriting text-gray-500 text-xs font-medium tracking-wide px-1 truncate">{caption}</p>
    </div>
  </div>
);

const ImageModal = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-all"
        onClick={onClose}
      >
        <X size={32} />
      </button>
      <div className="relative animate-modal" onClick={e => e.stopPropagation()}>
        <img 
          src={src} 
          alt="Full size memory" 
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border-4 border-white"
        />
        <div className="absolute -bottom-10 left-0 right-0 text-center text-white/90 font-medium tracking-wide">
          ความทรงจำของเรา ❤️
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [stage, setStage] = useState('closed'); 
  const [loveCount, setLoveCount] = useState(0);
  const [clicks, setClicks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [showGiantHeart, setShowGiantHeart] = useState(false); 
  
  const photos = [
    { src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80", caption: "วันแรกที่เจอกัน", rotate: "-rotate-3" },
    { src: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=500&q=80", caption: "ทริปทะเลแสนหวาน", rotate: "rotate-2" },
    { src: "https://images.unsplash.com/photo-1522673607200-1645062cd958?w=500&q=80", caption: "รอยยิ้มของคุณ", rotate: "-rotate-1" },
    { src: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=500&q=80", caption: "เดทแรกของเรา", rotate: "rotate-3" },
    { src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500&q=80", caption: "เดินเล่นในสวน", rotate: "-rotate-2" },
    { src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80", caption: "ของขวัญชิ้นนั้น", rotate: "rotate-1" },
    { src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=500&q=80", caption: "จับมือกันไว้", rotate: "-rotate-3" },
    { src: "https://images.unsplash.com/photo-1621112904887-419379ce6824?w=500&q=80", caption: "วันเกิดปีที่แล้ว", rotate: "rotate-2" },
    { src: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=500&q=80", caption: "หัวเราะด้วยกัน", rotate: "-rotate-1" }
  ];

  const handleOpen = () => {
    if (stage !== 'closed') return;
    setStage('opening'); 

    setTimeout(() => {
      setShowGiantHeart(true);
    }, 1000);

    setTimeout(() => {
      setShowGiantHeart(false); 
      setStage('opened'); 
    }, 4000);
  };

  const handleSendLove = (e) => {
    setLoveCount(prev => prev + 1);
    const newClick = { id: Date.now(), x: e.clientX, y: e.clientY };
    setClicks(prev => [...prev, newClick]);
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== newClick.id));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffebef] via-[#fff0f5] to-[#ffe4e6] overflow-x-hidden font-sans selection:bg-rose-200">
      <BackgroundHearts />

      <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />

      {(stage === 'closed' || stage === 'opening') && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-1000 ${stage === 'opened' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative cursor-pointer group" onClick={handleOpen}>
            <div className="absolute inset-0 bg-rose-400 rounded-lg blur-xl opacity-20 animate-pulse"></div>
            <div className={`relative w-72 h-48 bg-rose-500 rounded-lg shadow-2xl flex items-center justify-center z-10 transition-transform duration-700 ${stage === 'opening' ? 'translate-y-32 scale-110 opacity-0' : 'hover:scale-105'}`}>
              <div className={`absolute top-0 left-0 w-0 h-0 border-l-[144px] border-r-[144px] border-t-[100px] border-l-transparent border-r-transparent border-t-rose-400 rounded-t-lg z-30 envelope-flap ${stage === 'opening' ? 'origin-top rotate-x-180 -z-10' : ''}`}></div>
              <div className={`absolute bottom-0 w-64 h-40 bg-white rounded-md shadow-md z-20 transition-all duration-700 ease-out flex items-center justify-center ${stage === 'opening' ? '-translate-y-48 opacity-100' : 'translate-y-0 opacity-0'}`}>
                <div className="text-center p-4">
                  <Heart className="w-10 h-10 text-rose-500 mx-auto animate-bounce" fill="currentColor" />
                  <p className="text-rose-800 font-bold mt-2">For You ❤️</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[144px] border-b-[96px] border-l-transparent border-b-rose-600 rounded-bl-lg z-20"></div>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[144px] border-b-[96px] border-r-transparent border-b-rose-600 rounded-br-lg z-20"></div>
              {stage === 'closed' && (
                <div className="absolute -bottom-16 left-0 right-0 text-center">
                  <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-rose-500 font-bold text-sm shadow-sm animate-bounce">
                    👇 แตะเพื่อเปิด
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {stage === 'opening' && <Explosion />}

      {showGiantHeart && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none">
           <div className="animate-scale-in">
             <div className="animate-heartbeat drop-shadow-2xl">
                <Heart fill="#e11d48" className="text-rose-600 w-64 h-64 md:w-96 md:h-96 filter drop-shadow-lg" />
                <div className="text-white text-center font-bold text-4xl mt-4 drop-shadow-md animate-bounce tracking-wider">
                  Love You!
                </div>
             </div>
           </div>
        </div>
      )}

      <div className={`transition-all duration-1000 ease-in-out ${stage === 'opened' ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-20 blur-md pointer-events-none'}`}>
        
        <div className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
          
          <div className="text-center mb-12 space-y-4 pt-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-600 to-rose-500 drop-shadow-sm leading-tight pb-2">
              Happy Valentine's Day
            </h1>
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
              รวมความทรงจำดีๆ ที่เรามีร่วมกัน
            </p>
          </div>

          <div className="relative mb-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-rose-200/30 to-pink-200/30 blur-3xl rounded-full -z-10"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 px-2 md:px-8">
              {photos.map((photo, index) => (
                <PhotoCard 
                  key={index}
                  src={photo.src}
                  caption={photo.caption}
                  rotate={photo.rotate}
                  delay={`${index * 0.1}s`}
                  onClick={() => setSelectedImage(photo.src)}
                />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center text-center md:text-left">
              <h3 className="text-3xl font-bold text-rose-800 mb-6">Why I Love You</h3>
              <ul className="space-y-6">
                {[
                  "ความใจดีและอ่อนโยนที่เธอมีให้คนรอบข้างเสมอ",
                  "วิธีที่เธอยิ้มให้ฉันเวลาฉันเล่าเรื่องตลกฝืดๆ",
                  "ความพยายามและความเก่งในแบบของเธอ",
                  "แค่มีเธออยู่ใกล้ๆ ก็รู้สึกอุ่นใจที่สุดแล้ว"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 text-lg">
                    <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {i+1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-64 md:h-auto rounded-3xl overflow-hidden shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&q=80&w=800" 
                alt="Us" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 to-transparent flex items-end p-8">
                <p className="text-white text-xl font-medium italic">"You are my today and all of my tomorrows."</p>
              </div>
            </div>
          </div>

          <div className="text-center pb-20 relative">
             {clicks.map(c => (
              <div key={c.id} className="fixed pointer-events-none z-50 animate-explode" style={{ left: c.x, top: c.y, '--x': '0px', '--y': '-100px' }}>
                <Heart className="text-rose-500 w-8 h-8" fill="currentColor" />
              </div>
            ))}

            <div className="glass-panel inline-block p-12 rounded-[3rem] shadow-2xl relative overflow-visible">
              <div className="absolute -top-6 -left-6 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>💌</div>
              <div className="absolute -bottom-6 -right-6 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>💝</div>

              <h2 className="text-3xl font-bold text-rose-800 mb-2">ส่งความรักให้กันหน่อยไหม?</h2>
              <p className="text-slate-500 mb-8">กดปุ่มรัวๆ ได้เลยนะ!</p>
              
              <button 
                onClick={handleSendLove}
                className="relative group bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xl py-6 px-16 rounded-full shadow-lg shadow-rose-300/50 hover:shadow-rose-500/50 transform hover:-translate-y-1 active:scale-95 transition-all duration-200 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Heart className={`w-8 h-8 ${loveCount > 0 ? 'animate-ping' : ''}`} fill="currentColor" />
                  ส่งรัก ({loveCount})
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
              </button>
            </div>
          </div>

          <footer className="text-center text-rose-300 text-sm font-medium pb-24">
            <p>Created with infinite love ❤️ {new Date().getFullYear()}</p>
          </footer>
        </div>

      </div>
    </div>
  );
}
