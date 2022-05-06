import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import liff from '@line/liff'
import LIFFScreenShotPlugin from './plugin'

liff.use(LIFFScreenShotPlugin)

liff.init({
  liffId: `${process.env.TEST_LIFF_ID}`,
})
.then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
  )
})

