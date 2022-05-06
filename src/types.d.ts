import liff from '@line/liff';

type SSPlugin = {
  capture: (format: string) => Promise<any>
  showModal: () => Promise<void>
  hideModal: () => Promise<void>
}

declare module '@line/liff' {
  interface Liff {
    $SS: SSPlugin;
  }
}
