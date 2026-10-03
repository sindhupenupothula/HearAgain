import { useState, useRef, useEffect } from "react"
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
  const newChatFileRef = useRef(null)
  const chatFileRef = useRef(null) // NEW - chat ki separate
  const [selectedImages, setSelectedImages] = useState([])
  const [selectedFileName, setSelectedFileName] = useState("")
  const [newChatImage, setNewChatImage] = useState(null)
  const [inputText, setInputText] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [isChatStarted, setIsChatStarted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("currentUser") || "");
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [openedChat, setOpenedChat] = useState(null);
  const [detailInput, setDetailInput] = useState("");
  const [detailMessages, setDetailMessages] = useState([]);
  const [caption, setCaption] = useState("");

  const handleCameraClick = () => {
    chatFileRef.current?.click(); // FIXED
  }
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const urls = files.map(f => URL.createObjectURL(f));
      setSelectedImages(urls);
    }
  }
  const handleClosePreview = () => {
    setSelectedImages([]);
    setCaption("");
    if (chatFileRef.current) chatFileRef.current.value = "";
  }
  const handleSendImage = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { type: 'user', text: caption, image: selectedImages[0], time };
    setDetailMessages(prev => [...prev, newMsg]);
    handleClosePreview();
  }
  const handleDetailSend = () => {
    if (!detailInput.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { type: 'user', text: detailInput, time };
    setDetailMessages(prev => [...prev, userMsg]);
    setDetailInput("");
    setTimeout(() => {
      const lower = userMsg.text.toLowerCase();
      let replyText = "Got it! Tell me more about your hearing?";
      if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
        replyText = "Hello! I'm HearAgain Assistant. How can I help you with your hearing today?";
      } else if (lower.includes("noisy") || lower.includes("cafe") || lower.includes("noise")) {
        replyText = "That's common — background noise can be challenging. Here are 3 quick tips:\n• Face the person speaking\n• Use quieter seating near walls\n• Try HearAgain noise-filter mode";
      } else if (lower.includes("yes") || lower.includes("tip")) {
        replyText = "Here are 3 quick tips:\n• Face the person speaking and reduce distance\n• Use quieter seating near walls, away from speakers\n• Try the HearAgain noise-filter mode in Settings";
      } else if (lower.includes("thank")) {
        replyText = "You're welcome! Happy to help. Anything else?";
      }
      const botMsg = { type: 'bot', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setDetailMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  const handlePin = () => {
    const updated = chats.map(c => selectedChats.includes(c.id) ? { ...c, isPinned: !c.isPinned } : c);
    setChats(updated); setSelectedChats([]);
  };
  const handleMute = () => {
    const updated = chats.map(c => selectedChats.includes(c.id) ? { ...c, isMuted: !c.isMuted } : c);
    setChats(updated); setSelectedChats([]);
  };

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`chats_${currentUser}`);
      if (saved) setChats(JSON.parse(saved));
      setChatsLoaded(true);
    }
  }, [currentUser]);
  useEffect(() => {
    if (currentUser && chatsLoaded) localStorage.setItem(`chats_${currentUser}`, JSON.stringify(chats));
  }, [chats, currentUser, chatsLoaded]);

  const clearAndGo = (nextPage) => { setEmail(""); setPassword(""); setConfirmPassword(""); setSignupError(""); setLoginError(""); setPage(nextPage); }
  const handleSendMessage = async () => {
    if (!inputText.trim() && selectedImages.length === 0) return;
    const userMsg = { type: 'user', text: inputText, images: [...selectedImages], fileName: selectedFileName };
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatStarted(true);
    const promptText = inputText.trim();
    setInputText(""); setSelectedImages([]); setSelectedFileName(""); setShowPlus(false); setIsTyping(true);
    const cleanPrompt = promptText;
    const lower = cleanPrompt.toLowerCase();
    const hasImages = userMsg.images && userMsg.images.length > 0;
    const isVideo = lower.includes("video");
    if (hasImages) {
      let promptTextOut = `Aesthetic photo of ${(userMsg.fileName || "uploaded image").replace(/\.[^/.]+$/, "")}, highly detailed, 8k`;
      setChatMessages(prev => [...prev, { type: 'ai', text: `📝 Generated Prompt:\n\n${promptTextOut}`, isPrompt: true }]);
      setIsTyping(false);
    } else if (isVideo) {
      let h = 0; for (let i = 0; i < cleanPrompt.length; i++) { h = cleanPrompt.charCodeAt(i) + ((h << 5) - h); }
      const mySeed = Math.abs(h);
      const videoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt + " cinematic")}?width=768&height=768&seed=${mySeed}&model=turbo&nologo=true`;
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: 'ai', text: 'Video generated 🎬', videoUrl: videoUrl, isVideo: true }]);
        setIsTyping(false);
      }, 800);
    } else {
      let h = 0; for (let i = 0; i < cleanPrompt.length; i++) { h = cleanPrompt.charCodeAt(i) + ((h << 5) - h); }
      const mySeed = Math.abs(h);
      const isGirlPrompt = lower.includes("girl") || lower.includes("college") || lower.includes("woman");
      let imageUrl;
      if (isGirlPrompt) imageUrl = `https://source.unsplash.com/768x768/?college,woman,portrait&sig=${mySeed}`;
      else imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=768&height=768&seed=${mySeed}&model=turbo&nologo=true&nofeed=true`;
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: 'ai', text: 'Image generated ✨', imageUrl: imageUrl, isImage: true }]);
        setIsTyping(false);
      }, 800);
    }
  };
  const handleImageSelect = (e) => { const file = e.target.files[0]; if (file) { setSelectedImages([...selectedImages, URL.createObjectURL(file)]); setSelectedFileName(file.name); setShowPlus(false); } }
  const handleCameraSelect = (e) => { const file = e.target.files[0]; if (file) { setSelectedImages([...selectedImages, URL.createObjectURL(file)]); setSelectedFileName(file.name || "camera_photo.jpg"); setShowPlus(false); } }
  const handleVideoSelect = (e) => { const file = e.target.files[0]; if (file) { setSelectedImages([...selectedImages, URL.createObjectURL(file)]); setSelectedFileName(file.name || "video.mp4"); setShowPlus(false); } }
  const handleNewChatImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setNewChatImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  }
  const handleLogin = () => {
    setLoginError(""); if (!email || !password) { setLoginError("Email/Mobile and Password ivvu mawa!"); return; }
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = savedUsers.find(u => u.email === email && u.password === password);
    const isTestAccount = (email === "test@gmail.com" || email === "9876543210") && password === "test123";
    if (foundUser || isTestAccount) {
      localStorage.setItem("currentUser", email);
      setCurrentUser(email);
      setShowSuccess(true);
    } else { setLoginError("Wrong credentials mawa! Please try again."); setPassword(""); }
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
    if (openedChat) {
      return (
        <div style={{ background: "#FFF8E7", minHeight: "100vh", width: "100%", maxWidth: "400px", margin: "0 auto", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#FFF8E7", borderBottom: "1px solid #F3E8D3", position: "sticky", top: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div onClick={() => setOpenedChat(null)} style={{ cursor: "pointer", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </div>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#F5E6C8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {openedChat.image ? <img src={openedChat.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontWeight: "700", color: "#5C3317" }}>{openedChat.name[0]}</span>}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "700", color: "#3E2723", fontSize: "15px" }}>{openedChat.name === "logo" ? "HearAgain Assistant" : openedChat.name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#2E7D32", fontWeight: "600" }}>online ●</p>
              </div>
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 010 0.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15v1.92z" /></svg>
          </div>

          {/* MESSAGES LIST - YOUR OLD WORK SAFE */}
          <div style={{ flex: 1, padding: "16px", overflowY: "auto", paddingBottom: "100px" }}>
            {detailMessages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.type === 'user' ? "flex-end" : "flex-start", marginBottom: "12px" }}>
                <div style={{ background: msg.type === 'user' ? "#5C3317" : "white", color: msg.type === 'user' ? "white" : "#5C3317", padding: "10px 14px", borderRadius: "18px", maxWidth: "240px" }}>
                  {msg.image && <img src={msg.image} style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "12px", display: "block" }} />}                  {msg.text && <div style={{ fontSize: "14px", whiteSpace: "pre-wrap" }}>{msg.text}</div>}
                  <div style={{ fontSize: "10px", opacity: 0.6, textAlign: "right", marginTop: "4px" }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM BAR - YOUR OLD WORK SAFE */}
          <div style={{ position: "fixed", bottom: 12, left: "50%", transform: "translateX(-50%)", width: "95%", maxWidth: "380px", background: "#FFF8E7", padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px", borderTop: "1px solid #F3E8D3", borderRadius: "30px", zIndex: 100 }}>
            <div style={{ cursor: "pointer", display: "flex", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><circle cx="9" cy="9" r="1" fill="#5C3317" /><circle cx="15" cy="9" r="1" fill="#5C3317" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /></svg>
            </div>
            <input ref={chatFileRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={handleFileSelect} />
            <div onClick={handleCameraClick} style={{ cursor: "pointer", display: "flex", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="1.5"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
            </div>
            <div style={{ cursor: "pointer", display: "flex", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
            </div>
            <input value={detailInput} onChange={(e) => setDetailInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleDetailSend()} placeholder="Type a message" style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "14px" }} />
            <div onClick={handleDetailSend} style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#5C3317", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
            </div>
          </div>

          {selectedImages.length > 0 && (
            <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "400px", height: "100vh", background: "#FFF8E7", zIndex: 9999, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px", alignItems: "center" }}>
                <div onClick={handleClosePreview} style={{ cursor: "pointer", width: "36px", height: "36px", background: "#3E2723", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontSize: "18px" }}>✕</span>
                </div>
                <div style={{ width: "36px" }}></div>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                <img src={selectedImages[0]} style={{ maxWidth: "100%", maxHeight: "65vh", objectFit: "contain", borderRadius: "16px" }} />
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "white", borderRadius: "30px", padding: "8px 8px 8px 16px", border: "1px solid #F3E8D3" }}>
                  <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Ask about this..." style={{ flex: 1, background: "transparent", border: "none", color: "#5C3317", outline: "none", fontSize: "15px" }} />
                  <div onClick={handleSendImage} style={{ width: "42px", height: "42px", background: "#5C3317", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }
    return (
      <div style={{ background: "#FFF8E7", minHeight: "100vh", paddingBottom: "90px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {selectedChats.length > 0 && activeTab === "chat" ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", width: "100%", maxWidth: "400px", boxSizing: "border-box", background: "#FFF8E7", borderBottom: "1px solid #F3E8D3" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div onClick={() => setSelectedChats([])} style={{ cursor: "pointer" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </div>
              <span style={{ fontWeight: "700", fontSize: "19px", color: "#5C3317" }}>{selectedChats.length}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div onClick={handlePin} style={{ cursor: "pointer" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="2"><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" /></svg>
              </div>
              <div onClick={() => setShowDeletePopup(true)} style={{ cursor: "pointer" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
              </div>
              <div onClick={handleMute} style={{ cursor: "pointer" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="2"><path d="M13 5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3l4 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", width: "100%", maxWidth: "400px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "55px", height: "55px", background: "#FFFFFF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={logo} alt="logo" style={{ width: "200px", height: "200px", objectFit: "contain" }} />
              </div>
              <h1 style={{ color: "#5C3317", fontSize: "35px", fontWeight: "bold", margin: 0, fontFamily: "'Brush Script MT',cursive" }}>HearAgain</h1>
            </div>
            {activeTab === "chat" && (
              <div onClick={() => { setNewChatName(""); setNewChatImage(null); setShowNewChat(true); }} style={{ cursor: "pointer", width: "38px", height: "38px", borderRadius: "10px", background: "white", border: "1px solid #F3E8D3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </div>
            )}
          </div>
        )}
        {showNewChat && (
          <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "400px", bottom: 0, background: "#FFF8E7", zIndex: 200, display: "flex", flexDirection: "column", boxShadow: "0 0 20px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", gap: "16px", borderBottom: "1px solid #F3E8D3" }}>
              <div onClick={() => setShowNewChat(false)} style={{ cursor: "pointer" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3E2723" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#3E2723", margin: 0 }}>New Chat</h2>
            </div>
            <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
              <label htmlFor="newChatFileInput" style={{ border: "2px dashed #8D6E63", borderRadius: "16px", width: "100%", height: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#FFFBF0", overflow: "hidden", position: "relative" }}>
                {newChatImage ? (
                  <>
                    <img src={newChatImage} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "14px" }} />
                    <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); setNewChatImage(null); if (newChatFileRef.current) newChatFileRef.current.value = ""; }} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.6)", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>✕</div>
                  </>
                ) : (
                  <>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3E2723" strokeWidth="1.5"><path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                    <p style={{ marginTop: "12px", color: "#8D6E63", fontSize: "14px" }}>Tap to upload photo</p>
                  </>
                )}
              </label>
              <input id="newChatFileInput" type="file" ref={newChatFileRef} onChange={handleNewChatImage} accept="image/*" style={{ display: "none" }} />
              <div style={{ marginTop: "28px", marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "16px", fontWeight: "600", color: "#3E2723", marginBottom: "10px" }}>Name</label>
                <input value={newChatName} onChange={(e) => setNewChatName(e.target.value)} placeholder="Enter name" style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #E0D0B0", background: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}></div>
              <button onClick={() => { if (newChatName.trim()) { const newChatObj = { id: Date.now(), name: newChatName, image: newChatImage, isPinned: false, isMuted: false }; setChats([...chats, newChatObj]); setNewChatName(""); setNewChatImage(null); if (newChatFileRef.current) newChatFileRef.current.value = ""; setShowNewChat(false); setActiveTab('chat'); } else { alert("Please enter name"); } }} style={{ width: "100%", padding: "16px", borderRadius: "12px", background: "#4B2E2A", color: "white", border: "none", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
                Create Chat
              </button>
            </div>
          </div>
        )}
        {activeTab === "home" && !showNewChat && (
          <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", flex: 1, padding: "0 16px" }}>
            <div style={{ flex: 1, overflowY: "auto", marginTop: "10px" }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ background: msg.type === 'user' ? '#5C3317' : 'white', color: msg.type === 'user' ? 'white' : '#5C3317', padding: '10px', borderRadius: '12px', marginBottom: '10px' }}>
                  <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                  {msg.images && msg.images.map((im, idx) => (<img key={idx} src={im} style={{ width: "100%", borderRadius: "10px", marginTop: "8px" }} />))}
                  {msg.imageUrl && (<div style={{ width: "100%", borderRadius: "12px", marginTop: "10px", border: "1px solid #F3E8D3", overflow: "hidden", background: "#fff" }}><img src={msg.imageUrl} style={{ width: "100%", height: "auto", display: "block" }} alt="generated" /></div>)}
                  {msg.videoUrl && (<div style={{ width: "100%", borderRadius: "12px", marginTop: "10px", overflow: "hidden", border: "1px solid #F3E8D3" }}><img src={msg.videoUrl} style={{ width: "100%", height: "auto" }} alt="video" /></div>)}
                </div>
              ))}
              {!isChatStarted && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", position: "relative", width: "100%", flex: 1, height: "65vh", overflow: "hidden" }}>
                  <img src={logo} alt="bg-logo" style={{ width: "500px", height: "500px", objectFit: "contain", opacity: 0.25, position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />
                  <p style={{ color: "#3E2723", fontWeight: "700", fontSize: "20px", fontFamily: "serif", position: "relative", zIndex: 1, marginTop: "120px" }}>What do you want to create today?</p>
                </div>
              )}
            </div>
            {selectedImages.length > 0 && (
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px", overflowX: "auto" }}>
                {selectedImages.map((im, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    <img src={im} style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
                    <div onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))} style={{ position: "absolute", top: "-6px", right: "-6px", background: "black", color: "white", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", cursor: "pointer" }}>✕</div>
                  </div>
                ))}
              </div>
            )}
            {showPlus && (
              <div style={{ background: "white", borderRadius: "16px", padding: "12px", display: "flex", gap: "20px", marginBottom: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                <div onClick={() => cameraInputRef.current?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                  <div style={{ width: "44px", height: "44px", background: "#F3E5C6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📷</div>
                  <span style={{ fontSize: "11px", marginTop: "4px", color: "#5C3317" }}>Camera</span>
                </div>
                <div onClick={() => fileInputRef.current?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                  <div style={{ width: "44px", height: "44px", background: "#F3E5C6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🖼️</div>
                  <span style={{ fontSize: "11px", marginTop: "4px", color: "#5C3317" }}>Photos</span>
                </div>
                <div onClick={() => videoInputRef.current?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                  <div style={{ width: "44px", height: "44px", background: "#F3E5C6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🎥</div>
                  <span style={{ fontSize: "11px", marginTop: "4px", color: "#5C3317" }}>Video</span>
                </div>
              </div>
            )}
            <div style={{ background: "white", borderRadius: "30px", padding: "6px 6px 6px 12px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", border: "1px solid #F3E5C6", marginBottom: "10px" }}>
              <div onClick={() => setShowPlus(!showPlus)} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FFF8E7", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "20px", color: "#5C3317" }}>
                {showPlus ? "✕" : "+"}
              </div>
              <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Describe what you want to create..." style={{ flex: 1, border: "none", outline: "none", fontSize: "15px", color: "#5C3317", background: "transparent" }} />
              <div onClick={handleSendMessage} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#3E2723", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" style={{ display: "none" }} />
            <input type="file" ref={cameraInputRef} onChange={handleCameraSelect} accept="image/*" capture="environment" style={{ display: "none" }} />
            <input type="file" ref={videoInputRef} onChange={handleVideoSelect} accept="video/*" style={{ display: "none" }} />
          </div>
        )}
        {activeTab === "chat" && !showNewChat && (
          <div style={{ background: "#FFF8E7", width: "100%", maxWidth: "400px", padding: "0 16px" }}>
            <div style={{ background: "#F3E5C6", borderRadius: "12px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", marginTop: "4px", marginBottom: "16px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B7355" strokeWidth="2"><circle cx="11" cy="11" r="6" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
              <input placeholder="Search" style={{ border: "none", background: "transparent", outline: "none", flex: 1, color: "#5C3317", fontSize: "15px" }} />
            </div>
            {chats.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "60px", textAlign: "center" }}>
                <div style={{ fontSize: "60px", marginBottom: "15px" }}>💬</div>
                <p style={{ color: "#5C3317", fontWeight: "700", fontSize: "18px", margin: "0 0 6px 0" }}>No chats yet</p>
                <p style={{ color: "#8B7355", fontSize: "14px", margin: 0 }}>Start a conversation to see it here</p>
              </div>
            ) : (
              [...chats].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map((chat) => (
                <div key={chat.id}
                  onClick={() => {
                    if (selectedChats.length > 0) { if (selectedChats.includes(chat.id)) { setSelectedChats(selectedChats.filter(id => id !== chat.id)) } else { setSelectedChats([...selectedChats, chat.id]) } } else {
                      setOpenedChat(chat);
                    }
                  }} onContextMenu={(e) => { e.preventDefault(); setSelectedChats([chat.id]); }} style={{ display: "flex", gap: "14px", padding: "14px 12px", cursor: "pointer", alignItems: "center", background: selectedChats.includes(chat.id) ? "#D7B78F" : "white", borderRadius: "12px", marginBottom: "10px", border: selectedChats.includes(chat.id) ? "2px solid #5C3317" : "1px solid transparent" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#F5E6C8", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {chat.image ? <img src={chat.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ fontWeight: "bold", color: "#5C3317", fontSize: "20px" }}>{chat.name[0]?.toUpperCase()}</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "700", color: "#5C3317", fontSize: "16px" }}>{chat.name}</span>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {chat.isPinned && <span style={{ fontSize: "14px" }}>📌</span>}
                        {chat.isMuted && <span style={{ fontSize: "14px" }}>🔇</span>}
                        <span style={{ fontSize: "12px", color: "#8B7355" }}>Now</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "13px", color: "#8B7355", marginTop: "2px", display: "block" }}>Tap to start chatting</span>
                  </div>
                  {selectedChats.includes(chat.id) ? (<div style={{ width: "26px", height: "26px", background: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "bold", flexShrink: 0 }}>✓</div>) : null}
                </div>
              ))
            )}
          </div>
        )}
        {showDeletePopup && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.45)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ background: "#1F1F1F", width: "100%", maxWidth: "340px", borderRadius: "18px", padding: "22px", color: "white" }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>Delete this chat?</h3>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "22px", marginTop: "22px" }}>
                <span onClick={() => setShowDeletePopup(false)} style={{ color: "#81C784", fontWeight: "600", cursor: "pointer", fontSize: "15px" }}>Cancel</span>
                <span onClick={() => { setChats(chats.filter(c => !selectedChats.includes(c.id))); setSelectedChats([]); setShowDeletePopup(false); }} style={{ color: "#81C784", fontWeight: "600", cursor: "pointer", fontSize: "15px" }}>Delete chat</span>
              </div>
            </div>
          </div>
        )}
        {activeTab === "voice" && !showNewChat && (<div style={{ padding: "40px" }}><h2 style={{ color: "#5C3317" }}>Voice Chat Coming Soon</h2></div>)}
        {activeTab === "profile" && !showNewChat && (<div style={{ padding: "40px" }}><h2 style={{ color: "#5C3317" }}>Profile - {currentUser} <br /><button onClick={() => { setPage("welcome"); }}>Logout</button></h2></div>)}
        <div style={{ position: "fixed", bottom: "12px", left: "50%", transform: "translateX(-50%)", width: "92%", maxWidth: "400px", background: "#FFF8E7", borderRadius: "28px", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 8px", boxShadow: "0 8px 25px rgba(0,0,0,0.12)", zIndex: 100 }}>
          <div onClick={() => setActiveTab("home")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", opacity: activeTab === "home" ? 1 : 0.6 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={activeTab === "home" ? "#5C3317" : "none"} stroke="#5C3317" strokeWidth="2"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
            <span style={{ background: activeTab === "home" ? "#5C3317" : "transparent", color: activeTab === "home" ? "white" : "#5C3317", fontSize: "12px", padding: "4px 14px", borderRadius: "15px", marginTop: "4px", fontWeight: "600" }}>Home</span>
          </div>
          <div onClick={() => setActiveTab("chat")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", opacity: activeTab === "chat" ? 1 : 0.6 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5C3317" strokeWidth="1.8"><path d="M8 3h8a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4h-2.5L9 20v-4H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" /><circle cx="9.5" cy="9.5" r="1" fill="#5C3317" /><circle cx="12" cy="9.5" r="1" fill="#5C3317" /><circle cx="14.5" cy="9.5" r="1" fill="#5C3317" /></svg>
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
      </div >
    );
  }
  return (
    <div style={{ background: "#FFF8E7", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <img src={logo} alt="HearAgain" style={{ width: "450px" }} />
      <h1 style={{ fontFamily: "'Brush Script MT', cursive", color: "#5C3317", fontSize: "42px", marginTop: "10px" }}>HearAgain</h1>
      <button onClick={() => clearAndGo("login")} style={{ background: "#5C3317", color: "white", width: "200px", padding: "12px", borderRadius: "25px", border: "none", marginTop: "20px", cursor: "pointer" }}>Login</button>
      <p onClick={() => clearAndGo("signup")} style={{ fontWeight: "bold", textDecoration: "underline", cursor: "pointer", color: "#5C3317", marginTop: "15px" }}>
        Don't have an account? Sign up
      </p>
    </div>
  );
}
export default App;