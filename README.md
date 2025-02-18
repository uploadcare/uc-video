<p align="center">
  <a href="https://uploadcare.com/?ref=react-uploader">
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logosafespacetransparent.svg">
      <source media="(prefers-color-scheme: dark)" srcset="https://ucarecdn.com/3b610a0a-780c-4750-a8b4-3bf4a8c90389/logotransparentinverted.svg">
      <img width=250 alt="Uploadcare logo" src="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logosafespacetransparent.svg">
    </picture>
  </a>
</p>

# Uploadcare Video Delivery
This is Uploadcare's video solution, powered by Video.js, offers a seamless and high-performance video streaming experience.

## Features
- **Optimized Streaming Quality:** Dynamically adjusts video quality based on the viewer’s device and internet speed, ensuring the best possible viewing experience.
- **Cost-Effective Bandwidth Usage:** Reduces data consumption by delivering only the necessary video resolution, saving on bandwidth costs, especially for users with slower connections or smaller screens.
- **Enhanced User Experience:** Minimizes buffering and delays, providing smooth and uninterrupted playback, even on less reliable networks, leading to higher user engagement and satisfaction.
- **Seamless Integration:** Easy to use—simply upload your video file, and instantly receive a link for adaptive streaming, enabling quick deployment and management without technical complexities.

## Quick Start

### From NPM
1. Install the package: `npm install @uploadcare/uc-video`
2. Connect the component from your script file:
```js
import '@uploadcare/uc-video';
import '@uploadcare/uc-video/style'
```
3. Add the component in your application markup:
```html
<uc-video uuid="UUID_FILE_FROM_UPLOADCARE"></uc-video>
```

### From CDN
1. Connect `UCVideo` directly from your document:
```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/@uploadcare/uc-video/dist/uc-video.js';
</script>
```
2. Add `UCVideo` in your application markup:
```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@uploadcare/uc-video/dist/style.css"
/>

<uc-video uuid="UUID_FILE_FROM_UPLOADCARE"> </uc-video>
```

## Attributes
UC Video provides all the [options][video-js-options] from video.js and some unique proprietary attributes:

- **UUID**: file uuid from Uploadcare
- **posterOffset**: to get a frame from the video for the poster. Example: `posterOffset="1:30"` is `90sec`
- **showLogo**: shows the logo, default is `true`

## Framework support
Uploadcare Video Delivery is built with Web Components, meaning you can integrate it into any environment — no adapters required.

[video-js-options]: https://videojs.com/guides/options/