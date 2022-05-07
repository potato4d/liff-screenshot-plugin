import { render } from 'preact'
import App from './App'
import './index.css'
import '../styles/index.css'
import liff from '@line/liff'
import LIFFScreenShotPlugin from '../src/plugin'

liff.use(LIFFScreenShotPlugin)

liff.init({
  liffId: `${import.meta.env.VITE_TEST_LIFF_ID}`,
})
.then(() => {
  render(
    <App />,
    document.getElementById('root')!
  )
})

