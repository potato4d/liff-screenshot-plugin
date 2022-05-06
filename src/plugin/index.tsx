import ReactDOM from 'react-dom/client'
import { toBlob, toPng } from 'html-to-image'
import { ReportModal } from '../components/ReportModal'
import * as constants from '../utils/constants'

type State = {
  modal: {
    reactRoot: ReactDOM.Root | null
    isOpened: boolean
  }
}

const pluginState: State = {
  modal: {
    reactRoot: null,
    isOpened: false,
  }
}

const LIFFScreenShotPlugin = {
  name: 'SS',
  async capture(format: string) {
    if (format === 'blob') {
      const blob = toBlob(document.querySelector('body')!)
      return blob
    }
    if (format === 'png') {
      const png = toPng(document.querySelector('body')!)
      return png
    }
    return ''
  },
  async showModal() {
    return new Promise((resolve) => {
      if (pluginState.modal.isOpened) {
        throw new Error('')
      }
      const callback = (result: string) => {
        this.hideModal()
        resolve(result)
      }
      const modalRoot = document.createElement('div')
      modalRoot.id = constants.MODAL_ROOT_ID
      ;(modalRoot as any).style = 'width: 100%; height: 100%;z-index: 500000;position: fixed;left:0;top:0'
      document.body.append(modalRoot)
      pluginState.modal.reactRoot = ReactDOM.createRoot(document.getElementById(constants.MODAL_ROOT_ID)!)
      pluginState.modal.reactRoot.render(
        <ReportModal callback={callback} />
      )
    })
  },
  hideModal() {
    document.getElementById(constants.MODAL_ROOT_ID)!.remove()
    pluginState.modal.reactRoot?.unmount()
    pluginState.modal.isOpened = false
  },
  install() {
    return {
      capture: (format: string) => this.capture(format),
      showModal: () => this.showModal(),
      hideModal: () => this.hideModal(),
    }
  }
} as const

export default LIFFScreenShotPlugin
