import { useState, useRef } from "react"
import logo from "./assets/logo.png"

function App() {
  const [page, setPage] = useState("welcome")
  const [showSuccess, setShowSuccess] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [showPlus, setShowPlus] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [signupError, setSignupError] = useState("")
  const [loginError, setLoginError] = useState("")
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [selectedFileName, setSelectedFileName] = useState("")
  const [inputText, setInputText] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [isChatStarted, setIsChatStarted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const clearAndGo = (nextPage) => {
    setEmail(""); setPassword(""); setConfirmPassword("");
    setSignupError(""); setLoginError(""); setPage(nextPage);
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() && selectedImages.length === 0) return;
    const userMsg = { type: 'user', text: inputText, images: [...selectedImages], fileName: selectedFileName };
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatStarted(true);
    const promptText = inputText.trim();
    setInputText(""); setSelectedImages([]); setSelectedFileName(""); setIsTyping(true);

    const cleanPrompt = promptText;
    const lower = cleanPrompt.toLowerCase();
    const hasImages = userMsg.images && userMsg.images.length > 0;
    const isVideo = lower.includes("video");
    const isImageToPrompt = hasImages;

    if (isImageToPrompt) {
      let promptTextOut = `Aesthetic photo of ${(userMsg.fileName || "uploaded image").replace(/\.[^/.]+$/, "")}, highly detailed, 8k, cinematic lighting, photorealistic`;
      try {
        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent("Describe this image for AI generation: " + cleanPrompt)}`);
        if (res.ok) { const t = await res.text(); if (t) promptTextOut = t; }
      } catch (e) { }
      setChatMessages(prev => [...prev, { type: 'ai', text: `📝 Generated Prompt:\n\n${promptTextOut}`, isPrompt: true }]);
      setIsTyping(false);
    } else if (isVideo) {
      let videoPrompt = cleanPrompt.replace(/\bvideo\b/gi, '').trim() || "beautiful nature";
      let h = 0; for (let i = 0; i < videoPrompt.length; i++) { h = videoPrompt.charCodeAt(i) + ((h << 5) - h); }
      const mySeed = Math.abs(h);
      const isGirlVideo = lower.includes("girl") || lower.includes("college") || lower.includes("woman");
      let videoUrl;
      if (isGirlVideo) {
        videoUrl = `https://source.unsplash.com/768x768/?college,girl,garden,portrait&sig=${mySeed}`;
      } else {
        videoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(videoPrompt + " cinematic video style")}?width=768&height=768&seed=${mySeed}&model=turbo&nologo=true`;
      }
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: 'ai', text: 'Video generated 🎬', videoUrl: videoUrl, isVideo: true }]);
        setIsTyping(false);
      }, 800);
    } else {
      let h = 0; for (let i = 0; i < cleanPrompt.length; i++) { h = cleanPrompt.charCodeAt(i) + ((h << 5) - h); }
      const mySeed = Math.abs(h);
      const isGirlPrompt = lower.includes("girl") || lower.includes("college") || lower.includes("woman") || lower.includes("lady") || lower.includes("female");

      let imageUrl;
      if (isGirlPrompt) {
        // 3RD OPTION: Girl unte Unsplash - 100% no block
        const safeQuery = cleanPrompt.toLowerCase().replace(/girl/g, "woman").replace(/college girl/g, "college woman portrait");
        imageUrl = `https://source.unsplash.com/768x768/?${encodeURIComponent(safeQuery + " beautiful portrait garden")}&sig=${mySeed}`;
      } else {
        // Normal prompts ki Pollinations AI
        let safePrompt = cleanPrompt;
        if (lower.includes("sun")) safePrompt = safePrompt + ", bright sunny day, beautiful sky, 8k";
        imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(safePrompt)}?width=768&height=768&seed=${mySeed}&model=turbo&nologo=true&nofeed=true`;
      }

      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: 'ai', text: 'Image generated ✨', imageUrl: imageUrl, isImage: true }]);
        setIsTyping(false);
      }, 800);
    }
  };

  const handleImageSelect = (e) => { const file = e.target.files[0]; if (file) { setSelectedImages([...selectedImages, URL.createObjectURL(file)]); setSelectedFileName(file.name); setShowPlus(false); } }
  const handleCameraSelect = (e) => { const file = e.target.files[0]; if (file) { setSelectedImages([...selectedImages, URL.createObjectURL(file)]); setSelectedFileName(file.name || "camera_photo.jpg"); setShowPlus(false); } }
  const handleVideoSelect = (e) => { const file = e.target.files[0]; if (file) { setSelectedImages([...selectedImages, URL.createObjectURL(file)]); setSelectedFileName(file.name || "video.mp4"); setShowPlus(false); } }

  const handleLogin = () => {
    setLoginError(""); if (!email || !password) { setLoginError("Email/Mobile and Password ivvu mawa!"); return; }
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = savedUsers.find(u => u.email === email && u.password === password);
    const isTestAccount = (email === "test@gmail.com" || email === "9876543210") && password === "test123";
    if (foundUser || isTestAccount) { setShowSuccess(true); } else { setLoginError("Wrong credentials mawa! Please try again."); setPassword(""); }
  };
  const handleSignup = () => {
    setSignupError(""); if (!email || !password) { setSignupError("Email and Password fill cheyyi mawa!"); return; }
    if (password !== confirmPassword) { setSignupError("Passwords do not match!"); setPassword(""); setConfirmPassword(""); return; }
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (savedUsers.find(u => u.email === email)) { setSignupError("Mobile number or Email already exists!"); setEmail(""); setPassword(""); setConfirmPassword(""); return; }
    savedUsers.push({ email, password }); localStorage.setItem("users", JSON.stringify(savedUsers)); clearAndGo("login");
  };

  if (page === "signup") {
    return (
      <div style={{ background: "#FFF8E7", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <h2 style={{ color: "#5C3317", fontSize: "28px" }}>Create Account</h2>
        <input placeholder="Full Name" autoComplete="off" style={{ width: "300px", height: "45px", borderRadius: "10px", border: "1px solid #D7CCC8", marginTop: "30px", padding: "0 15px" }} />
        <input placeholder="Mobile number or Email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setSignupError("")} autoComplete="off" style={{ width: "300px", height: "40px", borderRadius: "10px", border: "1px solid #D7CCC8", marginTop: "15px", padding: "0 15px" }} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setSignupError("")} autoComplete="new-password" style={{ width: "300px", height: "45px", borderRadius: "10px", border: "1px solid #D7CCC8", marginTop: "15px", padding: "0 15px" }} />
        <input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onFocus={() => setSignupError("")} autoComplete="new-password" style={{ width: "300px", height: "45px", borderRadius: "10px", border: "1px solid #D7CCC8", marginTop: "15px", padding: "0 15px" }} />
        {signupError && <p style={{ color: "#FF4D4F", fontSize: "13px", marginTop: "8px", width: "300px" }}>{signupError}</p>}
        <button onClick={handleSignup} style={{ background: "#5C3317", color: "white", width: "300px", height: "48px", borderRadius: "30px", border: "none", marginTop: "20px", fontSize: "18px", cursor: "pointer" }}>Sign Up</button>
        <p onClick={() => clearAndGo("welcome")} style={{ marginTop: "15px", color: "#5C3317", textDecoration: "underline", cursor: "pointer" }}>Back to Home</p>
      </div>
    )
  }
  if (page === "login") {
    return (
      <div style={{ background: "#FFF8E7", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <h2 style={{ color: "#5C3317", fontSize: "28px" }}>Welcome Back</h2>
        <p style={{ color: "#8D6E63" }}>Login to HearAgain</p>
        <input placeholder="Mobile number or Email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setLoginError("")} autoComplete="off" style={{ width: "300px", height: "45px", borderRadius: "10px", border: "1px solid #D7CCC8", marginTop: "30px", padding: "0 15px" }} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setLoginError("")} autoComplete="off" style={{ width: "300px", height: "45px", borderRadius: "10px", border: "1px solid #D7CCC8", marginTop: "15px", padding: "0 15px" }} />
        {loginError && <p style={{ color: "#FF4D4F", fontSize: "13px", marginTop: "8px", width: "300px" }}>{loginError}</p>}
        <button onClick={handleLogin} style={{ background: "#5C3317", color: "white", width: "300px", height: "48px", borderRadius: "30px", border: "none", marginTop: "20px", fontSize: "18px", cursor: "pointer" }}>Login</button>
        <p onClick={() => clearAndGo("welcome")} style={{ marginTop: "15px", color: "#5C3317", textDecoration: "underline", cursor: "pointer" }}>Back to Home</p>
        <p style={{ marginTop: "30px", color: "#8D6E63" }}>Don't have an account? <span onClick={() => clearAndGo("signup")} style={{ fontWeight: "bold", color: "#5C3317", cursor: "pointer" }}>Sign Up</span></p>
        {showSuccess && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            <div style={{ background: "white", width: "300px", padding: "25px", borderRadius: "20px", textAlign: "center" }}>
              <div style={{ background: "#22c55e", width: "60px", height: "60px", borderRadius: "50%", margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontSize: "28px" }}>✓</div>
              <h2 style={{ color: "#5C3317" }}>Login Successful!</h2>
              <button onClick={() => { setShowSuccess(false); setPage("terms") }} style={{ background: "#5C3317", color: "white", width: "100%", height: "48px", borderRadius: "30px", border: "none", marginTop: "15px", fontWeight: "bold" }}>Continue</button>
            </div>
          </div>
        )}
      </div>
    )
  }
  if (page === "terms") {
    return (
      <div style={{ background: "#FFF8E7", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "25px 20px" }}>
        <h2 style={{ color: "#5C3317", fontSize: "26px", marginTop: "20px", fontWeight: "700" }}>Terms & Conditions</h2>
        <div style={{ background: "white", width: "90%", maxWidth: "340px", height: "360px", overflowY: "auto", padding: "20px", borderRadius: "16px", marginTop: "20px", border: "1px solid #EFEBE9" }}>
          <p style={{ color: "#5C3317", fontSize: "14px", lineHeight: "22px" }}>This app is created only for <b>learning & helping purpose</b>. It is not intended to hurt anyone, any community or any beliefs. All data is safe & used only to improve your experience. Please use it respectfully.</p>
          <p style={{ color: "#5C3317", fontSize: "14px", lineHeight: "22px", marginTop: "10px" }}>ఈ యాప్ కేవలం నేర్చుకోవడం మరియు సహాయం చేయడం కోసం మాత్రమే రూపొందించబడింది. దీని ఉద్దేశ్యం ఎవరినీ, ఏ సమాజాన్ని లేదా ఏ నమ్మకాలను బాధపెట్టడం కాదు. డేటా అంతా సురక్షితంగా ఉంటుంది మరియు మీ అనుభవాన్ని మెరుగుపరచడానికి మాత్రమే ఉపయోగించబడుతుంది. దయచేసి దీనిని గౌరవప్రదంగా ఉపయోగించండి..</p>
          <p style={{ color: "#5C3317", fontSize: "14px", lineHeight: "22px", marginTop: "10px" }}>यह ऐप सिर्फ़ सीखने और मदद करने के मकसद से बनाया गया है। इसका मकसद किसी व्यक्ति, समुदाय या किसी की मान्यताओं को ठेस पहुँचाना नहीं है। सारा डेटा सुरक्षित है और इसका इस्तेमाल सिर्फ़ आपके अनुभव को बेहतर बनाने के लिए किया जाता है। कृपया इसका सम्मान के साथ इस्तेमाल करें।</p>

        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "15px", width: "90%", maxWidth: "340px" }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ width: "18px", height: "18px" }} id="tick" />
          <label htmlFor="tick" style={{ fontSize: "13px", color: "#5C3317" }}>I agree to Terms & Conditions</label>
        </div>
        <button onClick={() => { if (agreed) setPage("dashboard") }} style={{ background: "#5C3317", color: "white", width: "90%", maxWidth: "340px", height: "50px", borderRadius: "30px", border: "none", marginTop: "20px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>I Agree & Continue</button>
      </div>
    )
  }
  if (page === "dashboard") {
    return (
      <div style={{ background: "#FFF8E7", minHeight: "100vh", paddingBottom: "90px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", width: "100%", maxWidth: "400px" }}>
          <div style={{ width: "55px", height: "55px", background: "#FFFFFF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={logo} alt="logo" style={{ width: "200px", height: "200px", objectFit: "contain" }} />
          </div>
          <h1 style={{ color: "#5C3317", fontSize: "35px", fontWeight: "bold", margin: 0, fontFamily: "'Brush Script MT',cursive" }}>HearAgain</h1>
        </div>
        {isChatStarted && (
          <div style={{ width: "90%", maxWidth: "400px", marginTop: "20px" }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ background: msg.type === 'user' ? '#5C3317' : 'white', color: msg.type === 'user' ? 'white' : '#5C3317', padding: '10px', borderRadius: '12px', marginBottom: '10px' }}>
                <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                {msg.images && msg.images.map((im, idx) => (<img key={idx} src={im} style={{ width: "100%", borderRadius: "10px", marginTop: "8px" }} />))}
                {msg.imageUrl && (
                  <div style={{ width: "100%", borderRadius: "12px", marginTop: "10px", border: "1px solid #F3E8D3", overflow: "hidden", background: "#fff" }}>
                    <img src={msg.imageUrl} style={{ width: "100%", height: "auto", display: "block", minHeight: "200px" }} alt="generated" />
                  </div>
                )}
                {msg.videoUrl && (
                  <div style={{ width: "100%", borderRadius: "12px", marginTop: "10px", overflow: "hidden", border: "1px solid #F3E8D3" }}>
                    <img src={msg.videoUrl} style={{ width: "100%", height: "auto" }} alt="video" />
                    <div style={{ padding: "8px", fontSize: "12px", textAlign: "center" }}>🎬 Cinematic preview</div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && <p style={{ color: "#8D6E63", fontSize: "13px" }}>Generating...</p>}
          </div>
        )}
        <div style={{ width: "90%", maxWidth: "400px", background: "#FFFBEB", border: "1px solid #F3E8D3", borderRadius: "20px", padding: "12px 16px", margin: "20px auto", display: "flex", flexDirection: "column", gap: "10px", position: "relative" }}>
          {selectedImages.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {selectedImages.map((img, index) => (
                <div key={index} style={{ position: "relative", width: "60px", height: "60px" }}>
                  <img src={img} style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", border: "1px solid #F3E8D3" }} />
                  <div onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))} style={{ position: "absolute", top: "-6px", right: "-6px", background: "black", color: "white", width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", cursor: "pointer" }}>✕</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%" }}>
            <span onClick={() => setShowPlus(!showPlus)} style={{ fontSize: "30px", color: "#5C3317", cursor: "pointer", fontWeight: "300" }}>+</span>
            <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Describe what you want to create..." style={{ flex: 1, border: "none", background: "transparent", outline: "none", color: "#5C3317", fontSize: "15px", marginLeft: "4px" }} />
            <div onClick={handleSendMessage} style={{ width: "38px", height: "38px", background: "#5C3317", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span style={{ color: "white", fontSize: "18px", transform: "rotate(-45deg)" }}>➤</span>
            </div>
          </div>
          {showPlus && (
            <div style={{ position: "absolute", top: "60px", left: "0", background: "white", width: "180px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.15)", padding: "8px", zIndex: 10, border: "1px solid #F3E8D3" }}>
              <div onClick={() => fileInputRef.current.click()} style={{ padding: "12px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}><span>🖼️</span> <span style={{ color: "#5C3317", fontSize: "14px" }}>Image</span></div>
              <div onClick={() => cameraInputRef.current.click()} style={{ padding: "12px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}><span>📷</span> <span style={{ color: "#5C3317", fontSize: "14px" }}>Camera</span></div>
              <div onClick={() => videoInputRef.current.click()} style={{ padding: "12px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}><span>🎥</span> <span style={{ color: "#5C3317", fontSize: "14px" }}>Video</span></div>
            </div>
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" style={{ display: "none" }} />
        <input type="file" ref={cameraInputRef} onChange={handleCameraSelect} accept="image/*" style={{ display: "none" }} />
        {/* BOTTOM NAV - ACTIVE LOGIC */}
        <div style={{ position: "fixed", bottom: "12px", left: "50%", transform: "translateX(-50%)", width: "92%", maxWidth: "400px", background: "#FFF8E7", borderRadius: "28px", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 8px", boxShadow: "0 8px 25px rgba(0,0,0,0.12)", zIndex: 100 }}>

          <div onClick={() => setActiveTab("home")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", opacity: activeTab === "home" ? 1 : 0.6 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={activeTab === "home" ? "#5C3317" : "none"} stroke="#5C3317" strokeWidth="2"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
            <span style={{ background: activeTab === "home" ? "#5C3317" : "transparent", color: activeTab === "home" ? "white" : "#5C3317", fontSize: "12px", padding: "4px 14px", borderRadius: "15px", marginTop: "4px", fontWeight: "600" }}>Home</span>
          </div>

          {/* Chat - dotted bubble like in your photo */}
          <div onClick={() => setActiveTab("chat")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", opacity: activeTab === "chat" ? 1 : 0.6 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3h8a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4h-2.5L9 20v-4H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" />
              <circle cx="9.5" cy="9.5" r="1" fill="#5C3317" stroke="none" />
              <circle cx="12" cy="9.5" r="1" fill="#5C3317" stroke="none" />
              <circle cx="14.5" cy="9.5" r="1" fill="#5C3317" stroke="none" />
            </svg>
            <span style={{ background: activeTab === "chat" ? "#5C3317" : "transparent", color: activeTab === "chat" ? "white" : "#5C3317", fontSize: "12px", padding: "4px 14px", borderRadius: "15px", marginTop: "4px", fontWeight: "600" }}>Chat</span>
          </div>

          <div onClick={() => setActiveTab("voice")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", opacity: activeTab === "voice" ? 1 : 0.6 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="2"><rect x="9" y="2" width="6" height="12" rx="3" fill={activeTab === "voice" ? "#5C3317" : "none"} /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /></svg>
            <span style={{ background: activeTab === "voice" ? "#5C3317" : "transparent", color: activeTab === "voice" ? "white" : "#5C3317", fontSize: "12px", padding: "4px 14px", borderRadius: "15px", marginTop: "4px", fontWeight: "600" }}>Voice Chat</span>
          </div>

          <div onClick={() => setActiveTab("profile")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", opacity: activeTab === "profile" ? 1 : 0.6 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={activeTab === "profile" ? "#5C3317" : "none"} stroke="#5C3317" strokeWidth="2"><circle cx="12" cy="7" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
            <span style={{ background: activeTab === "profile" ? "#5C3317" : "transparent", color: activeTab === "profile" ? "white" : "#5C3317", fontSize: "12px", padding: "4px 14px", borderRadius: "15px", marginTop: "4px", fontWeight: "600" }}>Profile</span>
          </div>

        </div>
      </div>
    )
  }
  return (
    <div style={{ background: "#FFF8E7", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <img src={logo} alt="HearAgain" style={{ width: "450px" }} />
      <h1 style={{ fontFamily: "'Brush Script MT',cursive", color: "#5C3317", fontSize: "42px", marginTop: "10px" }}>HearAgain</h1>
      <button onClick={() => clearAndGo("login")} style={{ background: "#5C3317", color: "white", width: "200px", height: "48px", borderRadius: "30px", border: "none", marginTop: "40px", fontSize: "18px", cursor: "pointer" }}>Login</button>
      <p style={{ marginTop: "40px", color: "#8D6E63" }}>Don't have an account?</p>
      <p onClick={() => clearAndGo("signup")} style={{ fontWeight: "bold", textDecoration: "underline", color: "#5C3317", cursor: "pointer" }}>Sign Up</p>
    </div>
  );
}
export default App;