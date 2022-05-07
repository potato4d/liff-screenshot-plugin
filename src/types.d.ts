import liff from '@line/liff';

type Format = 'png' | 'blob'
type CaptureReturn<T> = T extends 'png' ? string : T extends 'blob' ? Blob : never;

type SSPlugin = {
  capture: <T extends Format>(format: T) => Promise<CaptureReturn<T>>
  showModal: () => Promise<void>
  hideModal: () => Promise<void>
}

declare module '@line/liff' {
  interface Liff {
    $SS: SSPlugin;
  }
}
