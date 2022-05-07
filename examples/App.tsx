import liff from '@line/liff'
import { useState } from 'react'
import logo from './logo.svg'

const App: React.FC = () => {
  const [urlList, setUrlList] = useState<string[]>([]);

  const handleClickCapture = () => {
    liff.$SS.capture()
    .then((result) => {
      setUrlList((prev) => [...prev, URL.createObjectURL(result)])
    })
  }

  const handleClickShowModal = () => {
    liff.$SS.showModal('blob')
    .then((result) => {
      setUrlList((prev) => [...prev, URL.createObjectURL(result)])
    })
  }

  const handleClickShowI18nModal = () => {
    liff.$SS.showModal('blob', {
      dictionary: {
        title: 'Send Feedback',
        placeholder: 'Please provide details about your feedback.',
        note: 'The information and screenshots will be used in accordance with our Terms of Service and Privacy Policy.',
        cancelText: 'CANCEL',
        submitText: 'SEND'
      }
    })
    .then((result) => {
      setUrlList((prev) => [...prev, URL.createObjectURL(result)])
    })
  }

  return (
    <div className="App">
      <div className="main">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p className="buttons">
            <button type="button" onClick={handleClickCapture}>
              capture
            </button>
            <button type="button" onClick={handleClickShowModal}>
              showModal
            </button>
            <button type="button" onClick={handleClickShowI18nModal}>
              showModal with i18n option
            </button>
          </p>
        </header>
      </div>
      <div className="side">
        <h2>ScreenShot</h2>
        <ul>
          {
            urlList.map((url) => (
              <li>
                <img src={url} key={url} />
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default App
