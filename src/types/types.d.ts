import liff from '@line/liff';
import { ShowModalOptions } from '../plugin';

export type SupportFormat = 'png' | 'blob'
type CaptureReturn<T> = T extends 'png' ? string : T extends 'blob' ? Blob : never;

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
