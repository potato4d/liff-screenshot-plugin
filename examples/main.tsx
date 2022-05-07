import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import liff from '@line/liff'
import LIFFScreenShotPlugin from '../src/plugin'

liff.use(LIFFScreenShotPlugin)

liff.init({
  liffId: `${import.meta.env.VITE_TEST_LIFF_ID}`,
})
.then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
  )
})

