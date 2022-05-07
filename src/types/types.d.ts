import liff from '@line/liff';
import { ShowModalOptions } from '../plugin';

export type TextDictionary = {
  title: string,
  placeholder: string,
  note: string
  cancelText: string
  submitText: string
}

export type PluginState = {
  modal: {
    reactRoot: ReactDOM.Root | null
    isOpened: boolean
  }
}

export type ShowModalOptions = {
  format?: SupportFormat,
  dictionary?: Partial<TextDictionary>
}

export type SupportFormat = 'png' | 'blob'
type CaptureReturn<T> = T extends 'png' ? string : T extends 'blob' ? Blob : Blob;

type SSPlugin = {
  capture: <T extends SupportFormat>(format: T) => Promise<CaptureReturn<T>>
  showModal: <T extends SupportFormat>(format?: T, option?: ShowModalOptions) => Promise<CaptureReturn<T>>
  hideModal: () => Promise<void>
}

declare module '@line/liff' {
  interface Liff {
    $SS: SSPlugin;
  }
}
