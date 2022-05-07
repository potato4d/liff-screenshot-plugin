import liff from '@line/liff'
import { ComponentChildren } from 'preact'
import React, { useCallback, useEffect, useRef, useState } from 'preact/compat'
import { SupportFormat, TextDictionary } from '../types'

const defaultTextDictionary: TextDictionary = {
  title: 'フィードバックを送信',
  placeholder: 'フィードバックについての詳細をご記入ください',
  note: 'いただいた情報ならびにスクリーンショットは、当サービス利用規約・プライバシーポリシーに則った範囲で利用いたします。',
  cancelText: 'キャンセル',
  submitText: '送信'
} as const

export const ReportModal: React.FC<{ format: SupportFormat, dicionary?: Partial<TextDictionary>, callback: (result: string | Blob) => void }> = ({ format, dicionary, callback }) => {
  const [previewBlob, setBlob] = useState<Blob>();
  const [previewUrl, setUrl] = useState('')
  const initializedRef = useRef(false);
  const div = {...defaultTextDictionary, ...(dicionary || {})} as const

  useEffect(() => {
    if (initializedRef.current) {
      return
    }
    liff.$SS.capture()
    .then((blob: Blob) => {
      if (initializedRef.current) {
        return
      }
      const url = URL.createObjectURL(blob)
      setBlob(blob)
      setUrl(url)
      initializedRef.current = true
    })
    .catch((err: Error) => {
      console.log(err)
    })
  }, [])

  const handleClickCancel = useCallback(() => {
    liff.$SS.hideModal()
  }, [])

  const handleClickSubmit = useCallback(() => {
    if (previewBlob) {
      callback(previewBlob)
    }
  }, [previewBlob, callback])

  if (!previewUrl) {
    return null
  }

  return (
    <div id="L-ModalPlugin-root">
      <div id="L-ModalPlugin_body">
        <h2 id="L-ModalPlugin_heading">
          {div.title}
          </h2>
        <textarea placeholder={div.placeholder} />
        <ModalPreview previewUrl={previewUrl} />
        <p id="L-ModalPlugin_note">{div.note}</p>
        <div id="L-ModalPlugin_controls">
          <Button theme="cancel" onClick={handleClickCancel}>{div.cancelText}</Button>
          <Button theme="primary" onClick={handleClickSubmit}>{div.submitText}</Button>
        </div>
      </div>
      <div id="L-ModalPlugin_background" onClick={handleClickCancel} />
    </div>
  )
}

const Button: React.FC<{ children: ComponentChildren, theme: string, onClick?: () => void }> = ({ theme, children, onClick }) => {
  return (
    <button type="button" onClick={onClick} className="L-ModalPlugin_button" style={{
      background: theme === 'cancel' ? '#fff' : '#19B602',
      color: theme === 'cancel' ? '#19B602' : '#fff',
    }}>{children}</button>
  )
}

const ModalPreview: React.FC<{ previewUrl: string }> = ({ previewUrl }) => (
  <div id="L-ModalPlugin_previewWrapper">
    <div id="L-ModalPlugin_previewBody" style={{
      backgroundImage: `url(${previewUrl})`
    }} />
  </div>
)
