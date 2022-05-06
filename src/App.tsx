import liff from '@line/liff'
import logo from './logo.svg'
import './App.css'
import '../styles/index.css'

function App() {

  const handleClickCapture = () => {
    liff.$SS.capture('blob')
    .then((result: any) => {
      console.log(result)
    })
  }

  const handleClickShowModal = () => {
    liff.$SS.showModal()
    .then((result: any) => {
      console.log(result)
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={handleClickCapture}>
            Capture
          </button>
          <button type="button" onClick={handleClickShowModal}>
            Show Modal
          </button>
        </p>
      </header>
    </div>
  )
}

export default App
