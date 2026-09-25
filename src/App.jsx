import logo from './assets/logo.png'

function App() {
  return (
    <div style={styles.container}>
      <img src={logo} width={200} alt="HearAgain logo" style={styles.img} />
    </div>
  )
}

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
  img: {
    display: 'block',
  },
}

export default App
