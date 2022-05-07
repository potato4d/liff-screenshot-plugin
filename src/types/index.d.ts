import liff from "@line/liff";

export type TextDictionary = {
  title: string;
  placeholder: string;
  note: string;
  cancelText: string;
  submitText: string;
};

export type PluginState = { modal: { isOpened: boolean } };

export type CaptureWithModalOptions = {
  format?: SupportFormat;
  dictionary?: Partial<TextDictionary>;
};

export type SupportFormat = "png" | "blob";
export type CaptureReturn<T> = T extends "png"
  ? string
  : T extends "blob"
    ? Blob
    : never;

type SSPlugin = {
  capture: () => Promise<Blob>;
  captureWithModal: <T extends SupportFormat>(
    format: T,
    option?: CaptureWithModalOptions,
  ) => Promise<{ feedback?: string; data: CaptureReturn<T> }>;
  hideModal: () => Promise<void>;
};

declare module "@line/liff" {
  interface Liff { $SS: SSPlugin }
}
