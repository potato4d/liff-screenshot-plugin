import liff from '@line/liff'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { SupportFormat } from '../types/types'

export type TextDictionary = {
  title: string,
  placeholder: string,
  note: string
  cancelText: string
  submitText: string
}

const defaultTextDictionary: TextDictionary = {
  title: 'フィードバックを送信',
  placeholder: 'フィードバックについての詳細をご記入ください',
  note: 'いただいた情報ならびにスクリーンショットは、当サービス利用規約・プライバシーポリシーに則った範囲で利用いたします。',
  cancelText: 'キャンセル',
  submitText: '送信'
} as const

export const ReportModal: React.FC<{ format: SupportFormat, dicionary?: Partial<TextDictionary>, callback: (result: string | Blob) => void }> = ({ format, dicionary, callback }) => {
  const [previewUrl, setPreviewUrl] = useState('')
  const textDictionary = {...defaultTextDictionary, ...(dicionary || {})} as const

  useEffect(() => {
    liff.$SS.capture('png')
    .then((url: string) => {
      setPreviewUrl(url)
    })
    .catch((err: Error) => {
      console.log(err)
    })
  }, [])

  const handleClickCancel = useCallback(() => {
    liff.$SS.hideModal()
  }, [])

  const handleClickSubmit = useCallback(() => {
    liff.$SS.capture(format)
    .then((result) => {
      callback(result)
    })
    .catch((err: Error) => {
      console.log(err)
    })
  }, [])

  if (!previewUrl) {
    return (
      <div />
    )
  }

  return (
    <div id="liff-modal-plugin-root">
      <div id="liff-modal-plugin_body">
        <ModalHeading>
          {textDictionary.title}
        </ModalHeading>
        <textarea placeholder={textDictionary.placeholder} />
        <ModalPreview previewUrl={previewUrl} />
        <p id="liff-modal-plugin_note">{textDictionary.note}</p>
        <div id="liff-modal-plugin_controls">
          <Button theme="cancel" onClick={handleClickCancel}>{textDictionary.cancelText}</Button>
          <Button theme="primary" onClick={handleClickSubmit}>{textDictionary.submitText}</Button>
        </div>
      </div>
      <ModalBackGround onClick={handleClickCancel} />
    </div>
  )
}

const Button: React.FC<{ children: ReactNode, theme: string, onClick?: () => void }> = ({ theme, children, onClick }) => {
  return (
    <button type="button" onClick={onClick} className="liff-modal-plugin_button" style={{
      background: theme === 'cancel' ? '#fff' : '#19B602',
      color: theme === 'cancel' ? '#19B602' : '#fff',
    }}>{children}</button>
  )
}

const ModalHeading: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h2 id="liff-modal-plugin_heading">
    {children}
  </h2>
)

const ModalBackGround: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div id="liff-modal-plugin_background" onClick={onClick} />
)

const ModalPreview: React.FC<{ previewUrl: string }> = ({ previewUrl }) => (
  <div id="liff-modal-plugin_previewWrapper">
    <div id="liff-modal-plugin_previewBody" style={{
      backgroundImage: `url(${previewUrl})`
    }} />
  </div>
)
