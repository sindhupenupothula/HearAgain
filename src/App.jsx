import Logo from './Logo.jsx'

function App() {
  return (
    <div style={styles.container}>
      <div style={styles.logoWrapper}>
        <Logo />
      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: '#FFF8E7',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
  },
}

export default App
