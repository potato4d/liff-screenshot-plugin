import ReactDOM from 'react-dom/client'
import { toBlob } from 'html-to-image'
import { ReportModal } from '../components/ReportModal'
import * as constants from '../utils/constants'
import { PluginState, ShowModalOptions, SupportFormat } from '../types/types'

const pluginState: PluginState = {
  modal: {
    reactRoot: null,
    isOpened: false,
  }
}

const LIFFScreenShotPlugin = {
  name: 'SS',
  async capture(format?: SupportFormat) {
    const blob = await toBlob(document.querySelector('body')!)
    return blob!
  },
  async showModal(format: SupportFormat, showModalOptions?: ShowModalOptions) {
    const opt = showModalOptions || { dictionary: null }
    return new Promise((resolve) => {
      if (pluginState.modal.isOpened) {
        throw new Error('')
      }
      const callback = (result: string | Blob) => {
        this.hideModal()
        resolve(result)
      }
      const modalRoot = document.createElement('div')
      modalRoot.id = constants.MODAL_ROOT_ID
      ;(modalRoot as any).style = 'width: 100%; height: 100%;z-index: 500000;position: fixed;left:0;top:0'
      document.body.append(modalRoot)
      pluginState.modal.reactRoot = ReactDOM.createRoot(document.getElementById(constants.MODAL_ROOT_ID)!)
      pluginState.modal.reactRoot.render(
        <ReportModal dicionary={opt.dictionary || {}} format={format} callback={callback} />
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
      capture: (format?: SupportFormat) => this.capture(format || 'blob'),
      showModal: (format?: SupportFormat, showModalOptions?: ShowModalOptions) => this.showModal(format || 'blob', showModalOptions),
      hideModal: () => this.hideModal(),
    }
  }
} as const

export default LIFFScreenShotPlugin
