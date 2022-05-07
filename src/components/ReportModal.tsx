import liff from '@line/liff'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'

export const ReportModal: React.FC<{ callback: (result: string | Blob) => void }> = ({ callback }) => {
  const [previewUrl, setPreviewUrl] = useState('')

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
    liff.$SS.capture('blob')
    .then((blob: Blob) => {
      callback(blob)
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
        <ModalHeading />
        <textarea placeholder="フィードバックについての詳細をご記入ください" />
        <ModalPreview previewUrl={previewUrl} />
        <p id="liff-modal-plugin_note">いただいた情報ならびにスクリーンショットは、当サービス利用規約・プライバシーポリシーに則った範囲で利用いたします。</p>
        <div id="liff-modal-plugin_controls">
          <Button theme="cancel" onClick={handleClickCancel}>キャンセル</Button>
          <Button theme="primary" onClick={handleClickSubmit}>送信</Button>
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

const ModalHeading: React.FC = () => (
  <h2 id="liff-modal-plugin_heading">
    フィードバックを送信
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
