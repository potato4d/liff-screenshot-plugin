# LIFF ScreenShot Plugin

[![npm version](https://badge.fury.io/js/liff-screenshot-plugin.svg)](https://badge.fury.io/js/liff-screenshot-plugin) ![master](https://github.com/potato4d/liff-screenshot-plugin/actions/workflows/build.yml/badge.svg?branch=master) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Image from Gyazo](https://i.gyazo.com/5d5f94d482d5767522ee45c791a487a4.png)](https://gyazo.com/5d5f94d482d5767522ee45c791a487a4)

> ScreenShot plugin for LIFF

[詳細の紹介はこちら(日本語)](https://d.potato4d.me/entry/20220508-liff-ss-plugin/) | [Concept detail](https://github.com/potato4d/liff-screenshot-plugin/blob/master/.github/workflows/CONCEPT.md)

## Installation

### Use via Node.js 

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

## Use via browser

coming soon

## Usage

### Use as capture mode

[![Image from Gyazo](https://i.gyazo.com/26f8deca6b7a6924aa7ad47bf4ae9899.png)](https://gyazo.com/26f8deca6b7a6924aa7ad47bf4ae9899)

### Use as modal mode

[![Image from Gyazo](https://i.gyazo.com/c6249be9205e6f5199cb49881a3499ff.png)](https://gyazo.com/c6249be9205e6f5199cb49881a3499ff)

## API

### capture

- Argument: `capture('blob')`
- Return: `Promise<Blob>`

Take a screenshot. Currently only the Blob format is supported; PNG support is planned for the future.

### captureWithModal

- Argument: `captureWithModal('blob', option?: CaptureWithModalOptions)`
- Return: `Promise<{ feedback?: string, data: Blob }>`

Display a dedicated modal and capture screenshots with user feedback.

The final result is feedback in string format and the Blob's data.

#### CaptureWithModalOptions

Mainly options exist for i18n. These are all optional.

```ts
type TextDictionary = {
  title: string;
  placeholder: string;
  note: string;
  cancelText: string;
  submitText: string;
};

type CaptureWithModalOptions = {
  format?: SupportFormat;
  dictionary?: Partial<TextDictionary>;
};
```

### hideModal

- Argument: `hideModal()`
- Return: `void`

Interrupts the processing of the displayed modal and hides it.

## LICENCE

MIT
