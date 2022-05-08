import liff from "@line/liff";

import type { ComponentChildren } from "preact";
import type { FC } from "preact/compat";
import type { SupportFormat, TextDictionary } from "../types";

import { useEffect, useRef, useState, useCallback } from "preact/compat";

const defaultTextDictionary: TextDictionary = {
  title: "フィードバックを送信",
  placeholder: "フィードバックについての詳細をご記入ください",
  note: "いただいた情報ならびにスクリーンショットは、当サービス利用規約・プライバシーポリシーに則った範囲で利用いたします。",
  cancelText: "キャンセル",
  submitText: "送信",
} as const;

export const ReportModal: FC<
  {
    format: SupportFormat;
    dicionary?: Partial<TextDictionary>;
    callback: (result: { feedback?: string; data: string | Blob }) => void;
  }
> = ({ dicionary, callback }) => {
  const [previewBlob, setBlob] = useState<Blob>();
  const [previewUrl, setUrl] = useState("");
  const [feedback, setFeedback] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInit = useRef(false);
  const dic = { ...defaultTextDictionary, ...(dicionary || {}) } as const;

  // Auto Focus
  useEffect(
    () => {
      if (!textareaRef.current) {
        return;
      }
      textareaRef.current.focus();
    },
    [textareaRef, previewUrl],
  );

  // Capture
  useEffect(
    () => {
      if (isInit.current) {
        return;
      }
      liff.$SS
        .capture()
        .then(
          (blob: Blob) => {
            if (isInit.current) {
              return;
            }
            const url = URL.createObjectURL(blob);
            setBlob(blob);
            setUrl(url);
            isInit.current = true;
          },
        )
        .catch(
          (err: Error) => {
            console.log(err);
          },
        );
    },
    [],
  );

  const handleClickCancel = useCallback(
    () => {
      liff.$SS.hideModal();
    },
    [],
  );

  const handleClickSubmit = () => {
    if (previewBlob) {
      callback({ feedback, data: previewBlob });
    }
  };

  if (!previewUrl) {
    return null;
  }

  return (
    <div id="L-ModalPlugin-root" role="dialog" aria-modal
    aria-labelledby="L-ModalPlugin_heading"
    aria-describedby="L-ModalPlugin_body">
      <div id="L-ModalPlugin_body">
        <h2 id="L-ModalPlugin_heading">
          {dic.title}
          </h2>
        <textarea placeholder={dic.placeholder} ref={textareaRef} onInput={(e) => setFeedback(e.currentTarget.value)} />
        <div id="L-ModalPlugin_previewWrapper">
          <div id="L-ModalPlugin_previewBody" style={{
            backgroundImage: `url(${previewUrl})`
          }} />
        </div>
        <p id="L-ModalPlugin_note">{dic.note}</p>
        <div id="L-ModalPlugin_controls">
          <Button theme="cancel" onClick={handleClickCancel}>{dic.cancelText}</Button>
          <Button theme="primary" onClick={handleClickSubmit}>{dic.submitText}</Button>
        </div>
      </div>
      <div id="L-ModalPlugin_background" onClick={handleClickCancel} />
    </div>
  );
};

const Button: FC<
  { children: ComponentChildren; theme: string; onClick?: () => void }
> = ({ theme, children, onClick }) => {
  return (
    <button type="button" onClick={onClick} className="L-ModalPlugin_button" style={{
      background: theme === 'cancel' ? '#fff' : '#19B602',
      color: theme === 'cancel' ? '#19B602' : '#fff',
    }}>{children}</button>
  );
};
