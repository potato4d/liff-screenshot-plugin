# Concept

> This document is a translation of a [Japanese blog post](https://d.potato4d.me/20220508-liff-ss-plugin).

Since the LIFF plugin system was released in April 2022, I developed and released "liff-screenshot-plugin" as a third-party plugin.

## Motivation for Development

In the development of applications for smartphone browsers (hereafter referred to as "mobile applications"), different devices display and behave differently, and bugs of various sizes can occur. In particular, device-dependent bugs often change behavior depending on the OS type and version, and it is not uncommon to find out the details of such bugs after receiving FBs from users.

In addition, since mobile applications express many functions in a small UI, it is not always possible to say that the intentions of the creators and developers are conveyed correctly to the end users.

In fact, I sometimes develop applications that run on LINE's In-App Browser, including non-LIFF environments, and there are many cases where troubleshooting inevitably takes time.

In such cases, if we have a screenshot of the actual screen, we can work on solving the problem much faster. And if the screenshot is of the current state of the application, rather than of the privacy of the OS, we should be able to use it easily without any trouble.

We have created and released liff-screenshot-plugin as a solution that solves such problems and satisfies the requirements for the difficult-to-handle part of screenshots.

The internal structure of liff-screenshot-plugin is just to save DOM as it is via Canvas as an image, and it can be used as a simple screenshot system without any external communication by just doing liff.use.

## What the plug-in can do

Two major situations are available, each of which is introduced below.

> * This plug-in intentionally does not support the upload function of acquired images.
> On the other hand, appropriate service integration is required for practical use, and we introduce how to introduce it in the latter part of this document.

### Obtaining a screenshot of the currently displayed screen

The simplest function is the `liff.$SS.capture` function, which takes a screenshot. This function outputs the DOM structure as it is at the time the function is called as a png image in Blob format, regardless of the UI status of the surface or platform. The sample image was taken on a Mac, but of course it works on the mobile LIFF App.

It returns `Promise<Blob>`, so it is easy to handle and no special options currently exist. In actual code, it is used as follows

```ts
async function getScreenShot() {
  const blob = await liff.$SS.capture('blob') // The first argument is the current 'blob'.

  // The captured data is provided in a blob and can then be used freely.
  const url = URL.createObjectURL(blob)

  // ...
}
```

### Show screenshot sending modal

Another feature optimized for LIFF is a modal UI that allows users to annotate screenshots and send them. The sample image was taken on a Mac, but of course it works on the mobile LIFF App.

Although there are not many cases where this type of UI component is actively used, we are considering the possibility of creating a demand for UI components on LIFF and implementing them.

Since LIFF apps are equally provided on the LINE App, it will be valuable for plug-ins to have their own UI and provide a unified user experience.

For example, if a plugin for LINE Pay payment is created and its UI is unified, users will be able to make payments with a unified user experience regardless of which LIFF app they are using.

This plug-in also provides a modal UI in order to provide such a unified experience.

```ts
async function getScreenShot() {
  try {
    const result = await liff.$SS.captureWithModal('blob') // The first argument is the current 'blob'.
    const blob = result.data

    // The entered text is stored in feedback
    console.log(result.feedback)

    // The captured data is provided in a blob and can then be used freely.
    const url = URL.createObjectURL(blob)

    // ...
  } catch(e) {
    // Describes what to do in the event of an error or interruption
  }
}
```

Also, since the modal wording is the default value, rewrite it to match each service if necessary. Default values are defined under the following type definitions.

```ts
export type TextDictionary = {
  title: string
  placeholder: string
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
```

When rewriting, pass a dictionary as the second argument. See [README](https://github.com/potato4d/liff-screenshot-plugin) for details.

## Uploading captured Screenshots

This plug-in does not provide a screenshot upload function itself.

This is because the nature of recording the user's browser screen requires management in accordance with the terms and privacy policies set forth by each service.

However, we believe that there is motivation to try and implement this function at the lowest possible cost, so we have included two reference implementations here.

### Upload to Firebase Storage

The easiest way is to upload to object storage. For example, Firebase's Firebase Storage allows you to upload a screenshot with only a few lines of actual processing by simply writing code like the following

```ts
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes } from "firebase/storage"

initializeApp({
  storageBucket: "<project-name>.appspot.com"
})

const app = getApp();
const storage = getStorage();

async function upload(blob: Blob, uniqueId: string) {
  const name = `screenshot-${uniqueId}.png`
  const ssRef = ref(storage, `ss/${name}`);
  await uploadBytes(ssRef, result)
}

// ...logic

async function main() {
  const blob = await liff.$SS.capture('blob')
  await upload(blob, `${crypto.getRandomValues(new Uint32Array(10))}-${new Date().getTime()}`)
}
```

When using a modal UI, you can save the data in text/plain format to save it all together.

If the administrator is able to read only with write-only access, other object storage methods, such as AWS S3, can be considered, not limited to Firebase Storage.

## Installation

Like other packages, it can be installed via NPM.

```terminal
$ npm i liff-screeenshot-plugin # or yarn add liff-screenshot-plugin
```

Also, since @line/liff is provided by NPM, after installing it together, simply do liff.use to complete the installation.

```ts
import liff from '@line/liff'

import 'liff-screenshot-plugin/styles/index.css'
import LIFFSSPlugin from 'liff-screenshot-plugin'

liff.use(LIFFSSPlugin)
```

## Possible Use Cases

The above is a complete list of features and implementation guides, but we also note a few possible use cases.

### As part of your inquiry

If you are going to do more than simply take screenshots behind the scenes with the capture function, the safest use would be to use the modal UI as it is and have it used for inquiries.

The modal UI of this plugin is based on the feedback modal provided by Google within its services.

[![Image from Gyazo](https://i.gyazo.com/2401fcc3a88fffcf810bfa474d6b8b00.png)](https://gyazo.com/2401fcc3a88fffcf810bfa474d6b8b00)

<span style="text-align:center;display:block;font-size:12px" class="pb-2">Google's feedback modal</span>

Therefore, in the LIFF application, a similar situation is an area where the power of the plugin can be most effectively demonstrated at low cost. Basically, an effective implementation would be to tie `liff.$SS.showModal` to the part of the service where you want to receive feedback, and then receive reports from users as needed.

### As the final step in the error handling process

Another possible use case would be to send a screenshot at the last Catch of error handling, with the user's consent.

It is often the case that a user wants to check the actual display of a particular device only when it is malfunctioning. This is something that occurs with a certain frequency.

Recently, there are more and more services such as [KARTE](https://karte.io/) that record user behavior as screenshots or videos on a web service for a certain period of time, and some of them can handle error displays in their entirety, but not all services require a heavy SaaS.

[![Image from Gyazo](https://i.gyazo.com/1817c4e98a6adab01a990d58ade22620.png)](https://gyazo.com/1817c4e98a6adab01a990d58ade22620)

<span style="text-align:center;display:block;font-size:12px" class="pb-2">[Karte Live](https://karte.io/product/live/)</span>

In such a situation, it can be used for light use limited to LIFF troubleshooting.

In particular, if the process caught by Sentry or others has already been implemented, it may be an effective way to send screenshots only to users who have agreed to the terms of the agreement.

