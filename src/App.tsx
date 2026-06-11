// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, RefreshCw, Star, MessageCircle, MicOff, ArrowRight, Sparkles } from 'lucide-react';

const SCENARIOS = [
  {
    id: 1,
    title: "Mượn đồ chơi",
    image: "🐰",
    bgGradient: "from-blue-200 via-blue-100 to-cyan-100",
    context: "Bạn Thỏ đang có một chiếc ô tô màu đỏ rất đẹp. Bé muốn mượn bạn Thỏ chơi một lát, bé sẽ nói thế nào nhỉ?",
    rules: {
      action: ["mượn", "cho mình", "cho tớ", "cùng chơi", "chơi chung", "mình chơi"],
      polite: ["nhé", "được không", "ạ", "với", "nha"]
    },
    impolite: ["đi", "đưa đây", "đưa nhanh", "mau lên"],
    aiCharacter: "Bạn Thỏ",
    successReply: "Đồng ý luôn! Chúng mình cùng chơi ô tô nhé!",
    hints: {
      hasImpolite: "Ôi, bé nói như vậy nghe giống ra lệnh quá. Mình xin mượn nhẹ nhàng hơn nhé.",
      missingAction: "Bé muốn mượn đồ chơi thì bé dùng từ 'mượn' hoặc 'chơi chung' nhé.",
      missingPolite: "Câu của bé hơi cộc lốc rồi. Bé thêm chữ 'nhé' hoặc 'được không' ở cuối câu cho lịch sự nha.",
      tooShort: "Bé nói câu dài thêm một chút nữa nhé, ví dụ: 'Bạn Thỏ cho mình mượn nhé!'"
    },
    evaluation: "Tuyệt vời! Bé xin mượn rất lịch sự! Để câu nói hay hơn nữa, lần sau bé có thể khen: 'Ô tô của bạn đẹp quá, cho mình mượn nhé'. Bạn Thỏ sẽ rất thích đấy!"
  },
  {
    id: 2,
    title: "Xin lỗi khi làm rơi đồ",
    image: "🐻",
    bgGradient: "from-orange-200 via-orange-100 to-yellow-100",
    context: "Ôi thôi, bé lỡ tay làm rơi hộp bút của bạn Gấu xuống đất mất rồi. Bé hãy nói một câu để bạn Gấu không buồn nhé!",
    rules: {
      action: ["xin lỗi", "lỗi", "xin lổi"],
      polite: ["ạ", "nhé", "nha", "vô ý", "lỡ tay", "không cố ý", "mình", "tớ"]
    },
    impolite: ["kệ", "không sao", "bình thường", "nhặt đi"],
    aiCharacter: "Bạn Gấu",
    successReply: "Không sao đâu, lần sau bạn cẩn thận hơn là được.",
    hints: {
      hasImpolite: "Bé ơi, mình làm rơi đồ thì không được nói vậy đâu. Bé hãy nói lời xin lỗi chân thành nhé.",
      missingAction: "Khi làm rơi đồ của bạn, bé phải nói từ gì nhỉ? Bé nhớ nói lời 'xin lỗi' nhé.",
      missingPolite: "Bé xin lỗi ngoan rồi, nhưng thêm từ 'mình lỡ tay' hoặc chữ 'nhé' thì bạn Gấu sẽ hết buồn liền.",
      tooShort: "Bé nói câu dài thêm một chút nhé, ví dụ: 'Mình xin lỗi bạn Gấu nhé'."
    },
    evaluation: "Bé ngoan lắm! Bé biết nhận lỗi là một em bé dũng cảm. Lần sau bé có thể nói thêm 'Mình sẽ nhặt lên giúp bạn nhé' để thể hiện sự quan tâm nha!"
  },
  {
    id: 3,
    title: "Nhận quà tặng",
    image: "🐿️",
    bgGradient: "from-pink-200 via-pink-100 to-rose-100",
    context: "Hôm nay là sinh nhật bé, bạn Sóc mang đến tặng bé một hộp quà rất to. Bé sẽ nói gì với bạn Sóc?",
    rules: {
      action: ["cảm ơn", "cám ơn", "thích quá", "đẹp quá"],
      polite: ["ạ", "nhiều", "lắm", "nhé", "nha", "bạn", "mình", "tớ"]
    },
    impolite: ["chê", "xấu", "không thích"],
    aiCharacter: "Bạn Sóc",
    successReply: "Không có gì! Mình mong là bạn sẽ thích món quà này. Chúc mừng sinh nhật bạn nha!",
    hints: {
      hasImpolite: "Ôi, khi được nhận quà mình không nên nói vậy đâu. Bé hãy vui vẻ nói lời cảm ơn nha.",
      missingAction: "Khi được bạn tặng quà, bé nhớ nói lời 'cảm ơn' nhé.",
      missingPolite: "Bé xưng hô thêm 'mình cảm ơn bạn' thì câu nói sẽ tình cảm hơn rất nhiều đó.",
      tooShort: "Bé nói dài thêm một chút nhé, ví dụ: 'Mình cảm ơn bạn Sóc nhiều lắm'."
    },
    evaluation: "Bé nói lời cảm ơn to và rõ ràng lắm! Lần sau, bé có thể ôm bạn một cái và nói 'Món quà đẹp quá, mình thích lắm'. Chắc chắn bạn Sóc sẽ rất vui!"
  },
  {
    id: 4,
    title: "Mời bạn chơi cùng",
    image: "🐱",
    bgGradient: "from-green-200 via-green-100 to-emerald-100",
    context: "Bé đang xếp lâu đài cát rất vui, bé thấy bạn Mèo đang đứng nhìn một mình. Bé hãy rủ bạn Mèo vào chơi cùng nhé!",
    rules: {
      action: ["chơi cùng", "chơi chung", "xếp chung", "rủ", "vào đây", "ra đây chơi"],
      polite: ["nhé", "nào", "ạ", "nha", "được không", "cùng"]
    },
    impolite: ["lại đây", "vào đi", "ra đây nhanh"],
    aiCharacter: "Bạn Mèo",
    successReply: "Meo meo, thích quá! Mình vào xếp lâu đài cát cùng bạn ngay đây!",
    hints: {
      hasImpolite: "Bé gọi bạn nhẹ nhàng thôi nhé, mình không nên dùng từ ra lệnh như vậy đâu.",
      missingAction: "Bé hãy vẫy tay và rủ bạn Mèo 'vào chơi cùng' nhé.",
      missingPolite: "Bé rủ bạn nhớ thêm chữ 'nhé' hoặc 'nào' ở cuối câu cho thân thiện nha.",
      tooShort: "Bé nói câu rủ bạn dài hơn một chút nhé, ví dụ: 'Bạn Mèo vào chơi cùng mình nhé'."
    },
    evaluation: "Bé rủ bạn rất thân thiện! Để lời mời hấp dẫn hơn, bé có thể vừa vẫy tay vừa nói 'Bạn vào đây chơi xếp lâu đài chung cho vui nhé'."
  }
];

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState('intro'); // intro, listening, thinking, hint, success, evaluation, finished
  const [isListening, setIsListening] = useState(false);
  const [score, setScore] = useState(0);
  const [browserSupported, setBrowserSupported] = useState(true);
  
  const [currentCharacterText, setCurrentCharacterText] = useState("");
  const [speakerData, setSpeakerData] = useState({ name: "Cô giáo AI", icon: "👩‍🏫", isAI: true });

  const recognitionRef = useRef(null);
  const currentAudioRef = useRef(null);

  useEffect(() => {
    // Chỉ khởi tạo Audio 1 lần duy nhất, không tạo mới khi đổi Phase (trạng thái)
    if (!currentAudioRef.current) {
        currentAudioRef.current = new Audio();
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'vi-VN';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        handleAnalyzeSpeech(text);
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        if (phase === 'listening') {
           setPhase('intro');
           setCurrentCharacterText("Cô chưa nghe rõ bé nói gì. Bé nhấn lại Micro và nói to lên nhé!");
        }
      };

      recognitionRef.current.onend = () => setIsListening(false);
    } else {
      setBrowserSupported(false);
    }
    
    return () => {
      window.speechSynthesis.cancel();
      if (currentAudioRef.current && currentAudioRef.current.pause) currentAudioRef.current.pause();
      if (recognitionRef.current && isListening) recognitionRef.current.stop();
    };
  }, [currentStep, phase]);

  const speakText = (text, isCharacter = false, callback = null) => {
    const audio = currentAudioRef.current;
    if (!audio) return;

    // Tắt ngay loa và dọn dẹp bộ nhớ cũ trước khi nói câu mới
    audio.pause();
    audio.onended = null;
    audio.onerror = null;
    window.speechSynthesis.cancel();

    // Dùng client=tw-ob ưu tiên, dự phòng gtx (chỉ dùng cho nhân vật)
    const primaryUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text)}`;
    const backupUrl = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=vi&q=${encodeURIComponent(text)}`;

    let isUsingPrimary = true;
    audio.src = primaryUrl;

    audio.onended = () => {
        if (callback) callback();
    };

    // Hệ thống Fallback (Dự phòng)
    audio.onerror = () => {
        if (isUsingPrimary) {
            isUsingPrimary = false;
            audio.src = backupUrl;
            
            const retryPromise = audio.play();
            if (retryPromise !== undefined) {
                retryPromise.catch(e => {
                    if (e.name !== 'AbortError') audio.onerror();
                });
            }
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'vi-VN';
            utterance.rate = 0.95;
            utterance.pitch = isCharacter ? 1.4 : 1.0;
            utterance.onend = () => { if (callback) callback(); };
            window.speechSynthesis.speak(utterance);
        }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Bỏ qua lỗi AbortError để không bị nhảy giọng
            if (error.name === 'AbortError') return; 
            audio.onerror();
        });
    }
  };

  const handleStartGame = async () => {
    // Mở khóa âm thanh ngay khi người dùng bấm nút vật lý (bắt buộc trên các môi trường deploy)
    if (currentAudioRef.current) {
        currentAudioRef.current.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"; 
        await currentAudioRef.current.play().catch(() => {});
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setGameStarted(true);
      startScenario(0);
    } catch (error) {
      alert("Bé cần cho phép trình duyệt sử dụng Micro để có thể nói chuyện với các bạn động vật nhé!");
    }
  };

  const startScenario = (stepIndex) => {
    const scenario = SCENARIOS[stepIndex];
    setSpeakerData({ name: "Cô giáo AI", icon: "👩‍🏫", isAI: true });
    setCurrentCharacterText(scenario.context);
    setPhase('intro');
    // Đã gỡ bỏ lệnh đọc âm thanh của giáo viên
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current.onended = null;
          currentAudioRef.current.onerror = null;
      }
      window.speechSynthesis.cancel();
      
      setSpeakerData({ name: "Bé", icon: "🎤", isAI: false });
      setCurrentCharacterText("..."); 
      setPhase('listening');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleAnalyzeSpeech = (text) => {
    setPhase('thinking');
    setCurrentCharacterText("..."); 

    const lowercaseText = text.toLowerCase();
    const scenario = SCENARIOS[currentStep];
    
    let errorType = null;
    const hasImpolite = scenario.impolite.some(word => lowercaseText.includes(word));
    const hasAction = scenario.rules.action.some(word => lowercaseText.includes(word));
    const hasPolite = scenario.rules.polite.some(word => lowercaseText.includes(word));
    const wordCount = text.trim().split(/\s+/).length;

    if (hasImpolite) {
        errorType = 'hasImpolite';
    } else if (!hasAction) {
        errorType = 'missingAction';
    } else if (!hasPolite) {
        errorType = 'missingPolite';
    } else if (wordCount < 3) {
        errorType = 'tooShort';
    }

    setTimeout(() => {
      if (!errorType) {
        // Trả lời đạt 100% -> Nhân vật đáp lại (Vẫn giữ âm thanh nhân vật)
        setSpeakerData({ name: scenario.aiCharacter, icon: scenario.image, isAI: true });
        setCurrentCharacterText(scenario.successReply);
        setScore(prev => prev + 10);
        
        speakText(scenario.successReply, true, () => {
           // Sau khi nhân vật nói xong, hiện text đánh giá của giáo viên (Không đọc âm thanh)
           setTimeout(() => {
               setPhase('evaluation');
               setSpeakerData({ name: "Cô giáo AI", icon: "👩‍🏫", isAI: true });
               setCurrentCharacterText(scenario.evaluation);
           }, 600);
        });
        
        setPhase('success');
      } else {
        // Trả lời thiếu / sai -> Mớm lời đúng lỗi của bé (Chỉ hiện text, không đọc)
        setSpeakerData({ name: "Cô giáo AI", icon: "👩‍🏫", isAI: true });
        const hintMsg = scenario.hints[errorType] || "Bé thử nói lại một lần nữa rõ ràng hơn nhé.";
        setCurrentCharacterText(hintMsg);
        setPhase('hint');
      }
    }, 1000);
  };

  const nextScenario = () => {
    if (currentStep < SCENARIOS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      startScenario(nextStep);
    } else {
      setPhase('finished');
      setSpeakerData({ name: "Cô giáo AI", icon: "👩‍🏫", isAI: true });
      const finishText = "Tuyệt vời quá! Bé đã hoàn thành xuất sắc các tình huống giao tiếp. Bé là một người bạn vô cùng lịch sự và đáng yêu!";
      setCurrentCharacterText(finishText);
      // Đã gỡ bỏ lệnh đọc âm thanh kết thúc
    }
  };

  const restartGame = () => {
    setCurrentStep(0);
    setScore(0);
    startScenario(0);
  };

  if (!browserSupported) {
    return (
      <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-8 text-center">
        <MicOff className="w-20 h-20 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-red-700 mb-2">Trình duyệt không hỗ trợ</h1>
        <p className="text-gray-700">Trò chơi cần tính năng Nhận diện giọng nói. Vui lòng mở ứng dụng bằng Chrome hoặc Edge nhé!</p>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 text-center border-8 border-white/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-indigo-500 opacity-10 rounded-b-[50%]"></div>
          <div className="text-8xl mb-4 animate-bounce relative z-10">🎭</div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 relative z-10">
            Sân Khấu Lời Nói
          </h1>
          <p className="text-gray-600 mb-8 text-lg font-medium leading-relaxed relative z-10">
            Cùng học cách giao tiếp lịch sự và bày tỏ cảm xúc với các bạn động vật nhé!
          </p>
          <button 
            onClick={handleStartGame}
            className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-3xl font-bold text-2xl shadow-[0_10px_20px_rgba(99,102,241,0.3)] flex justify-center items-center gap-3 transition-all hover:scale-105 active:scale-95 relative z-10"
          >
            <Play className="w-8 h-8" fill="currentColor"/> Bắt đầu
          </button>
        </div>
      </div>
    );
  }

  const scenario = SCENARIOS[currentStep];

  return (
    <div className={`min-h-screen p-2 md:p-6 font-sans flex flex-col transition-colors duration-1000 bg-gradient-to-br ${scenario.bgGradient}`}>
      
      {/* Header Bar */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center bg-white/60 backdrop-blur-md rounded-full px-6 py-3 mb-6 shadow-sm border border-white/50">
        <div className="flex items-center gap-2 font-bold text-gray-700">
           <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm uppercase tracking-wider">
             Tình huống {currentStep + 1}/{SCENARIOS.length}
           </span>
        </div>
        <div className="flex items-center bg-yellow-100 px-4 py-1.5 rounded-full border border-yellow-300 shadow-inner">
          <Star className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" />
          <span className="font-bold text-yellow-700 text-lg">{score}</span>
        </div>
      </div>

      {/* Main Face-to-Face Stage */}
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center relative">
        
        {phase === 'finished' ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-[3rem] p-10 text-center shadow-2xl border-4 border-white max-w-lg w-full animate-in zoom-in duration-500">
            <div className="text-8xl mb-6">🏆</div>
            <h2 className="text-3xl font-black text-indigo-600 mb-4">Tuyệt vời quá!</h2>
            <p className="text-xl text-gray-700 mb-8 font-medium">{currentCharacterText}</p>
            <button 
              onClick={restartGame}
              className="px-8 py-4 bg-indigo-500 text-white rounded-full font-bold text-xl shadow-lg flex items-center justify-center mx-auto gap-3 hover:scale-105"
            >
              <RefreshCw className="w-6 h-6" /> Chơi lại
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            
            {/* Speech Bubble */}
            <div className={`relative max-w-2xl w-full bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 mb-8 transform transition-all duration-300 ${
              speakerData.isAI ? 'border-indigo-100 translate-y-0 opacity-100' : 'border-purple-200 scale-95 opacity-80'
            }`}>
               <div className="absolute -top-5 left-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-2">
                 {speakerData.icon} {speakerData.name}
               </div>

               <p className={`text-xl md:text-2xl leading-relaxed text-center font-medium ${
                 phase === 'listening' || phase === 'thinking' ? 'text-gray-400 animate-pulse text-4xl' : 'text-gray-800'
               }`}>
                 {currentCharacterText}
               </p>
               
               <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[24px] border-l-transparent border-r-transparent border-t-white"></div>
            </div>

            {/* Character */}
            <div className="relative mt-4">
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-50 ${
                phase === 'evaluation' ? 'bg-yellow-300' : 'bg-white'
              }`}></div>
              
              <div className={`text-[150px] md:text-[200px] leading-none drop-shadow-2xl relative z-10 transition-transform duration-500 ${
                speakerData.isAI && phase !== 'listening' && phase !== 'thinking' ? 'scale-110 animate-[bounce_3s_ease-in-out_infinite]' : 'scale-100 opacity-90'
              }`}>
                 {phase === 'evaluation' || phase === 'hint' || phase === 'intro' ? "👩‍🏫" : scenario.image}
              </div>

              {phase === 'evaluation' && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-20">
                   <Sparkles className="w-20 h-20 text-yellow-400 animate-ping absolute -top-10 -right-10" />
                   <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse absolute top-10 -left-10" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Control */}
      {phase !== 'finished' && (
        <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 p-4 md:p-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 flex justify-center">
          <div className="w-full max-w-xl flex flex-col items-center">
            
            {(phase === 'evaluation' || (phase === 'success' && score > 0)) ? (
               <button 
                 onClick={nextScenario}
                 disabled={phase !== 'evaluation'}
                 className={`w-full py-5 rounded-3xl font-bold text-2xl flex justify-center items-center gap-3 transition-all ${
                   phase === 'evaluation' 
                     ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-xl hover:scale-105 active:scale-95' 
                     : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                 }`}
               >
                 {phase === 'evaluation' ? (
                   <>Qua tình huống tiếp theo <ArrowRight className="w-8 h-8" /></>
                 ) : (
                   "Đang đọc nhận xét..."
                 )}
               </button>
            ) : (
               <>
                 <p className={`text-base font-semibold mb-3 transition-colors ${
                    isListening ? 'text-rose-500 animate-pulse' : 'text-gray-500'
                 }`}>
                    {isListening ? "Nhấn vào micro để hoàn thành câu nói" : "Đọc xong yêu cầu, bé nhấn Micro để trả lời nhé!"}
                 </p>
                 
                 <button 
                    onClick={toggleListen}
                    disabled={phase === 'thinking'}
                    className={`relative group ${phase === 'thinking' ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                    {isListening && (
                      <span className="absolute -inset-4 bg-rose-400 rounded-full opacity-40 animate-ping"></span>
                    )}
                    <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
                      isListening 
                        ? 'bg-rose-500 scale-110 shadow-rose-300/50' 
                        : 'bg-gradient-to-tr from-indigo-500 to-purple-500 hover:scale-105 shadow-indigo-300/50'
                    }`}>
                      <Mic className={`w-12 h-12 ${isListening ? 'animate-pulse' : ''}`} />
                    </div>
                 </button>
               </>
            )}
          </div>
        </div>
      )}
      <div className="h-40"></div>
    </div>
  );
}
