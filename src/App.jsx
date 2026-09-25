import { useState } from "react"
import logo from "./assets/logo.png"

function App() {
  const [page, setPage] = useState("welcome")
   const [showSuccess, setShowSuccess] = useState(false)
   const [agreed, setAgreed] = useState(false)
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [confirmPassword, setConfirmPassword] = useState("")
  // SIGNUP PAGE
  if (page === "signup") {
    return (
      <div style={{background:"#FFF8E7", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px"}}>
        <h2 style={{color:"#5C3317", fontSize:"28px"}}>Create Account</h2>
        
        <input placeholder="Full Name" style={{width:"300px", height:"45px", borderRadius:"10px", border:"1px solid #D7CCC8", marginTop:"30px", padding:"0 15px"}} />
        
        <input placeholder="Mobile number or Email" style={{width:"300px", height:"45px", borderRadius:"10px", border:"1px solid #D7CCC8", marginTop:"15px", padding:"0 15px"}} />
        
        <input placeholder="Password" type="password" style={{width:"300px", height:"45px", borderRadius:"10px", border:"1px solid #D7CCC8", marginTop:"15px", padding:"0 15px"}} />
        
        <input placeholder="Confirm Password" type="password" style={{width:"300px", height:"45px", borderRadius:"10px", border:"1px solid #D7CCC8", marginTop:"15px", padding:"0 15px"}} />
        
        <button style={{background:"#5C3317", color:"white", width:"300px", height:"48px", borderRadius:"30px", border:"none", marginTop:"20px", fontSize:"18px"}}>Sign Up</button>
        
        <p onClick={()=>setPage("welcome")} style={{marginTop:"15px", color:"#5C3317", textDecoration:"underline", cursor:"pointer"}}>Back to Home</p>
      </div>
    )
  }
  // LOGIN PAGE

  if (page === "login") {
    return (
      <div style={{background:"#FFF8E7", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px"}}>
        <h2 style={{color:"#5C3317", fontSize:"28px"}}>Welcome Back</h2>
        <p style={{color:"#8D6E63"}}>Login to HearAgain</p>
        
        <input placeholder="Mobile number or Email" style={{width:"300px", height:"45px", borderRadius:"10px", border:"1px solid #D7CCC8", marginTop:"30px", padding:"0 15px"}} />
        
        <input placeholder="Password" type="password" style={{width:"300px", height:"45px", borderRadius:"10px", border:"1px solid #D7CCC8", marginTop:"15px", padding:"0 15px"}} />
        
        <button onClick={()=> setShowSuccess(true)} style={{background:"#5C3317", color:"white", width:"300px", height:"48px", borderRadius:"30px", border:"none", marginTop:"20px", fontSize:"18px"}}>Login</button>
        
        <p onClick={()=>setPage("welcome")} style={{marginTop:"15px", color:"#5C3317", textDecoration:"underline", cursor:"pointer"}}>Back to Home</p>
        
        <p style={{marginTop:"30px", color:"#8D6E63"}}>Don't have an account? <span onClick={()=>setPage("signup")} style={{fontWeight:"bold", color:"#5C3317", cursor:"pointer"}}>Sign Up</span></p>
       {showSuccess && (
     <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:1000}}>
    <div style={{background:"white", width:"300px", padding:"25px", borderRadius:"20px", textAlign:"center"}}>
      <div style={{background:"#22c55e", width:"60px", height:"60px", borderRadius:"50%", margin:"0 auto", display:"flex", justifyContent:"center", alignItems:"center", color:"white", fontSize:"28px"}}>✓</div>
      <h2 style={{color:"#5C3317"}}>Login Successful!</h2>
      <p style={{color:"#5C3317"}}>You're now signed in to HearAgain</p>
      <button onClick={()=>{setShowSuccess(false); setPage("terms") }} style={{background:"#5C3317", color:"white", width:"100%", height:"48px", borderRadius:"30px", border:"none", marginTop:"15px", fontWeight:"bold"}}>Continue</button>
    </div>
  </div>
)}
      </div>
    )
  }
  // TERMS PAGE - FINAL
  if (page === "terms") {
    return (
      <div style={{background:"#FFF8E7", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", padding:"25px 20px"}}>
        <h2 style={{color:"#5C3317", fontSize:"26px", marginTop:"20px", fontWeight:"700"}}>Terms & Conditions</h2>
        <p style={{color:"#8D6E63", fontSize:"13px", marginTop:"-5px"}}>Please read carefully</p>
        
        <div style={{background:"white", width:"90%", maxWidth:"340px", height:"360px", overflowY:"auto", padding:"20px", borderRadius:"16px", marginTop:"20px", border:"1px solid #EFEBE9", boxShadow:"0 4px 12px rgba(92,51,23,0.08)"}}>
          
          <p style={{fontSize:"12px", fontWeight:"bold", color:"#5C3317", background:"#FFF8E7", padding:"5px 10px", borderRadius:"20px", display:"inline-block"}}>🌐 English</p>
          <p style={{color:"#5C3317", fontSize:"14px", lineHeight:"22px", marginTop:"10px"}}>
            This app is created only for <b>learning & helping purpose</b>. It is not intended to hurt anyone, any community or any beliefs. All data is safe & used only to improve your experience. Please use it respectfully.
          </p>

          <hr style={{border:"0.5px solid #F5F5F5", margin:"18px 0"}}/>

          <p style={{fontSize:"12px", fontWeight:"bold", color:"#5C3317", background:"#FFF8E7", padding:"5px 10px", borderRadius:"20px", display:"inline-block"}}>💛 తెలుగు</p>
          <p style={{color:"#5C3317", fontSize:"14px", lineHeight:"22px", marginTop:"10px"}}>
          ఈ యాప్ కేవలం నేర్చుకోవడం మరియు సహాయం చేయడం కోసం మాత్రమే రూపొందించబడింది. దీని ఉద్దేశ్యం ఎవరినీ, ఏ సమాజాన్ని లేదా ఏ నమ్మకాలను బాధపెట్టడం కాదు. డేటా అంతా సురక్షితంగా ఉంటుంది మరియు మీ అనుభవాన్ని మెరుగుపరచడానికి మాత్రమే ఉపయోగించబడుతుంది. దయచేసి దీనిని గౌరవప్రదంగా ఉపయోగించండి.
          </p>

          <hr style={{border:"0.5px solid #F5F5F5", margin:"18px 0"}}/>

          <p style={{fontSize:"12px", fontWeight:"bold", color:"#5C3317", background:"#FFF8E7", padding:"5px 10px", borderRadius:"20px", display:"inline-block"}}>❤️ हिंदी</p>
          <p style={{color:"#5C3317", fontSize:"14px", lineHeight:"22px", marginTop:"10px"}}>
            यह ऐप सिर्फ़ सीखने और मदद करने के मकसद से बनाया गया है। इसका मकसद किसी व्यक्ति, समुदाय या किसी की मान्यताओं को ठेस पहुँचाना नहीं है। सारा डेटा सुरक्षित है और इसका इस्तेमाल सिर्फ़ आपके अनुभव को बेहतर बनाने के लिए किया जाता है। कृपया इसका सम्मान के साथ इस्तेमाल करें।
          </p>
          <div style={{display:"flex", alignItems:"center", gap:"10px", marginTop:"10px", background:"#FFF8E7", padding:"10px", borderRadius:"8px"}}>
  <input type="checkbox" checked={agreed} onChange={(e)=>setAgreed(e.target.checked)} style={{width:"18px", height:"18px", accentColor:"#5C3317"}} id="tick"/>
  <label htmlFor="tick" style={{fontSize:"13px", color:"#5C3317"}}>I agree to the Terms & Conditions</label>
</div>
          <p style={{fontSize:"11px", color:"#BCAAA4", marginTop:"20px", textAlign:"center"}}>By continuing, you agree to our Terms</p>
        </div>

        <button onClick={()=>setPage("dashboard")} style={{background:"#5C3317", color:"white", width:"90%", maxWidth:"340px", height:"50px", borderRadius:"30px", border:"none", marginTop:"20px", fontSize:"16px", fontWeight:"600", cursor:"pointer"}}>I Agree & Continue</button>
      </div>
    )
  }
  // WELCOME PAGE
  return (
    <div style={{background:"#FFF8E7", minHeight:"100vh", width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <img src={logo} alt="HearAgain" style={{width:"220px"}} />
      <h1 style={{fontFamily:"'Brush Script MT',cursive", color:"#5C3317", fontSize:"42px", marginTop:"10px"}}>HearAgain</h1>
      
      <button onClick={()=>setPage("login")} style={{background:"#5C3317", color:"white", width:"200px", height:"48px", borderRadius:"30px", border:"none", marginTop:"40px", fontSize:"18px"}}>Login</button>
      
      <p style={{marginTop:"40px", color:"#8D6E63"}}>Don't have an account?</p>
      <p onClick={()=>setPage("signup")} style={{fontWeight:"bold", textDecoration:"underline", color:"#5C3317", cursor:"pointer"}}>Sign Up</p>
    </div>
  )
}

export default App