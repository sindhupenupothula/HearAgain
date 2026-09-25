import logo from './assets/logo.png'

function App() {
  return (
    <div style={styles.container}>
      <div style={styles.column}>
        <img src={logo} width={120} alt="HearAgain logo" style={styles.logo} />
        <h1 style={styles.title}>HearAgain</h1>
        <div style={{ height: 40 }} />
        <button style={styles.button}>Login</button>
        <p style={styles.noAccount}>Don't have an account?</p>
        <a href="#signup" style={styles.signUp}>Sign Up</a>
      </div>
    </div>
  )
}

const BROWN = '#5C3317'
const LIGHT_BROWN = '#8B5E3C'
const DARK_BROWN = '#3E1F0F'

const styles = {
  container: {
    backgroundColor: '#FFF8E7',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    textAlign: 'center',
    gap: 12,
    padding: '24px 16px',
  },
  logo: {
    display: 'block',
    marginBottom: 8,
  },
  title: {
    fontFamily: "'Dancing Script', cursive",
    fontWeight: 700,
    fontSize: 64,
    color: BROWN,
    margin: 0,
    lineHeight: 1,
  },
  button: {
    width: 280,
    height: 48,
    backgroundColor: BROWN,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 999,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  noAccount: {
    color: LIGHT_BROWN,
    fontSize: 14,
    margin: 0,
    marginTop: 4,
  },
  signUp: {
    color: DARK_BROWN,
    fontSize: 15,
    fontWeight: 700,
    textDecoration: 'underline',
    cursor: 'pointer',
    marginTop: -4,
  },
}

export default App
