import logo from "./assets/logo.png"

function App() {
  return (
    <div style={{
      backgroundColor: "#FFF8E7",
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: 0,
      padding: 0
    }}>
      <img src={logo} alt="HearAgain" style={{width:"220px", height:"auto"}} />
      <h1 style={{fontFamily:"'Brush Script MT',cursive", color:"#5C3317", fontSize:"42px", marginTop:"10px"}}>HearAgain</h1>
      <button style={{background:"#5C3317", color:"white", width:"200px", height:"48px", borderRadius:"30px", border:"none",fontsize:"100px", marginTop:"40px"}}>Login</button>
      <p style={{marginTop:"40px", color:"#8D6E63"}}>Don't have an account?</p>
      <p style={{fontWeight:"bold", textDecoration:"underline", color:"#5C3317"}}>Sign Up</p>
    </div>
  )
}
export default App
