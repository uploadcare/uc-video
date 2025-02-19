<p align="center">
  <a href="https://uploadcare.com/?ref=uc-video">
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logosafespacetransparent.svg">
      <source media="(prefers-color-scheme: dark)" srcset="https://ucarecdn.com/3b610a0a-780c-4750-a8b4-3bf4a8c90389/logotransparentinverted.svg">
      <img width=250 alt="Uploadcare logo" src="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logosafespacetransparent.svg">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://uploadcare.com/?ref=uc-video">Website</a> •
  <a href="https://uploadcare.com/docs/adaptive-bitrate-streaming/?ref=uc-video">Docs</a> • 
  <a href="https://uploadcare.com/blog?ref=uc-video">Blog</a> • 
  <a href="https://discord.gg/mKWRgRsVz8?ref=uc-video">Discord</a> •
  <a href="https://twitter.com/Uploadcare?ref=uc-video">Twitter</a>
</p>

# Uploadcare Video Delivery

[![NPM version][npm-img]][npm-url]
[![Build Status][badge-build]][build-url]
[![GitHub release][badge-release-img]][badge-release-url]
[![Uploadcare stack on StackShare][badge-stack-img]][badge-stack-url]

This is Uploadcare's video solution, powered by Video.js, offers a seamless and high-performance video streaming experience.

## Features
- **Optimized Streaming Quality:** Dynamically adjusts video quality based on the viewer’s device and internet speed, ensuring the best possible viewing experience.
- **Cost-Effective Bandwidth Usage:** Reduces data consumption by delivering only the necessary video resolution, saving on bandwidth costs, especially for users with slower connections or smaller screens.
- **Enhanced User Experience:** Minimizes buffering and delays, providing smooth and uninterrupted playback, even on less reliable networks, leading to higher user engagement and satisfaction.
- **Seamless Integration:** Easy to use—simply upload your video file, and instantly receive a link for adaptive streaming, enabling quick deployment and management without technical complexities.

## Quick Start

### From NPM
1. Install the package: 
```bash
npm install @uploadcare/uc-video
```
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

## Security issues

If you think you ran into something in Uploadcare libraries that might have
security implications, please hit us up at
[bugbounty@uploadcare.com][uc-email-bounty] or Hackerone.

We'll contact you personally in a short time to fix an issue through co-op and
prior to any public disclosure.

## Feedback

Issues and PRs are welcome. You can provide your feedback or drop us a support
request at [hello@uploadcare.com][uc-email-hello].

[uc-email-bounty]: mailto:bugbounty@uploadcare.com
[uc-email-hello]: mailto:hello@uploadcare.com
[github-releases]: https://github.com/uploadcare/uc-video/releases
[github-branch-release]: https://github.com/uploadcare/uc-video/tree/release
[github-contributors]: https://github.com/uploadcare/uc-video/graphs/contributors
[badge-stack-img]: https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat
[badge-stack-url]: https://stackshare.io/uploadcare/stacks/
[badge-release-img]: https://img.shields.io/github/release/uploadcare/uc-video.svg
[badge-release-url]: https://github.com/uploadcare/uc-video/releases
[npm-img]: http://img.shields.io/npm/v/@uploadcare/uc-video.svg
[npm-url]: https://www.npmjs.com/package/@uploadcare/uc-video
[badge-build]: https://github.com/uploadcare/uc-video/actions/workflows/checks.yml/badge.svg
[build-url]: https://github.com/uploadcare/uc-video/actions/workflows/checks.yml

[video-js-options]: https://videojs.com/guides/options/