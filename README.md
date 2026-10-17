<p align="center">
  <a href="https://uploadcare.com/?ref=uc-video">
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="https://ucarecdn.com/27eed822-4a34-4347-b227-a89df2e7bf47/uploadcare-logo.svg">
      <source media="(prefers-color-scheme: dark)" srcset="https://ucarecdn.com/dfd6c07b-fd17-4559-8803-bc98f92b564b/uploadcare-logo-inverted.svg">
      <img width=250 alt="Uploadcare logo" src="https://ucarecdn.com/27eed822-4a34-4347-b227-a89df2e7bf47/uploadcare-logo.svg">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://uploadcare.com/cdn/video-cdn/?utm_source=npm&utm_medium=ucvideo&utm_campaign=video_cdn&utm_content=website_header">Website</a> •
  <a href="https://uploadcare.com/docs/adaptive-bitrate-streaming/?utm_source=npm&utm_medium=ucvideo&utm_campaign=video_cdn&utm_content=docs_header">Docs</a> •
  <a href="https://uploadcare.com/blog/?utm_source=npm&utm_medium=ucvideo&utm_campaign=video_cdn&utm_content=blog_header">Blog</a> •
  <a href="https://twitter.com/Uploadcare?ref=uc-video">Twitter</a>
</p>

# Uploadcare Video Player

[![NPM version][npm-img]][npm-url]
[![Build Status][badge-build]][build-url]
[![GitHub release][badge-release-img]][badge-release-url]
[![Uploadcare stack on StackShare][badge-stack-img]][badge-stack-url]

Speed up video releases with our plug-and-play player. It's a part of [Uploadcare Video CDN][uc-video-cdn-page-intro] solution, designed to enable native video streaming on your website or app

<img alt="Uploadcare Video Player examples" src="https://ucarecdn.com/28893843-8e78-4753-a1b2-b567e9f12479/img00045.png">

## Features

- A ready-to-use video player powered by Video.js—no need to build from scratch!
- Easily integrate anywhere—we support all modern frameworks out of the box, with no adapters required.
- Provide end users with everything they need for video playback, including basic controls, a quality picker, and picture-in-picture mode.
- Part of [Uploadcare Video CDN][uc-video-cdn-page-features], that lets you integrate on-demand video-handling infrastructure in minutes and enable immediate playback for your users

## Quick Start

### From NPM

1. Install the package:

```bash
npm install @uploadcare/uc-video
```

2. Connect the component from your script file:

```js
import "@uploadcare/uc-video";
import "@uploadcare/uc-video/style";
```

3. Add the component in your application markup:

```html
<uc-video uuid="UUID_FILE_FROM_UPLOADCARE"></uc-video>
```

### From CDN

1. Connect `UCVideo` directly from your document:

```html
<script type="module">
  import "https://cdn.jsdelivr.net/npm/@uploadcare/uc-video/dist/uc-video.js";
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

Uploadcare Video Player provides all the [options][video-js-options] from video.js and some unique proprietary attributes:

- **UUID**: file uuid from Uploadcare
- **posterOffset**: to get a frame from the video for the poster. Example: `posterOffset="1:30"` is `90sec`
- **showLogo**: shows the logo, default is `true`
- **tracks**: subtitle tracks, property only. See [Subtitles](#subtitles)

## Sizing

Size `<uc-video>` with CSS, as you would a `<video>`:

```css
uc-video {
  width: 100%; /* the height follows the video's aspect ratio */
}
```

- Set both `width` and `height` to fill a fixed box; the video is letterboxed inside it.
- Set only `width`, and the height follows the video's aspect ratio. Setting only `height` doesn't work the other way around, so set the width too.
- Without CSS, the player takes the size from the `width` and `height` attributes, or else the video's own size (300px wide until the video loads). CSS on the element overrides the attributes.
- `fluid` and `fill` work as in video.js.

## Subtitles

Add `<track>` elements inside `<uc-video>`, as you would with `<video>`:

```html
<uc-video uuid="UUID_FILE_FROM_UPLOADCARE">
  <track
    kind="subtitles"
    src="https://ucarecdn.com/UUID_SUBTITLES_FILE/"
    srclang="en"
    label="English"
    default
  />
  <track kind="subtitles" src="/subtitles/de.srt" srclang="de" label="Deutsch" />
</uc-video>
```

Or set them from JavaScript with the `tracks` property:

```js
const video = document.querySelector('uc-video');

video.tracks = [
  { kind: 'subtitles', src: '/subtitles/en.vtt', srclang: 'en', label: 'English', default: true },
];
```

- WebVTT and SRT are supported. The format is detected from the file contents, so URLs without an extension, like Uploadcare CDN URLs, work.
- The menu lists `<track>` children first, then `tracks`. It updates when `<track>` children are added, removed or edited, or when a new array is assigned to `tracks`. The viewer's chosen language stays selected while it's still available.
- Tracks aren't tied to the video: they stay when `uuid` changes, so update them together.
- Subtitle files are loaded with `fetch()`, so files on another origin need CORS headers (`Access-Control-Allow-Origin`). Uploadcare CDN sends them. With `crossorigin="use-credentials"`, cookies are sent, and the server must reply with an explicit origin instead of `*`.
- The subtitles container is exposed as a CSS part: `uc-video::part(subtitles)`. Viewers can also change the font, colors and background under "subtitles settings" in the menu.
- On iPhone, fullscreen uses the system player, which doesn't show these subtitles. They show again when the viewer leaves fullscreen. To keep them visible, add the `prefer-full-window` attribute: fullscreen then stretches the player over the browser window instead, with its own controls and subtitles. Safari's toolbars stay visible.

## Framework support

Uploadcare Video Player is built with [Web Components][mdn-web-components], meaning you can integrate it into any environment — no adapters required.

Check our latest [video tutorial][uc-video-tutorial] on integrating Video CDN and subscribe to our channel to more details.

## Browser support

The latest desktop and mobile stable versions of Chrome, Edge, Firefox, Opera, and Safari are supported.

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
[uc-video-tutorial]: https://www.youtube.com/watch?v=EE68Qgmb5fo
[uc-video-cdn-page-intro]: https://uploadcare.com/cdn/video-cdn/?utm_source=npm&utm_medium=ucvideo&utm_campaign=video_cdn&utm_content=intro
[uc-video-cdn-page-features]: https://uploadcare.com/cdn/video-cdn/?utm_source=npm&utm_medium=ucvideo&utm_campaign=video_cdn&utm_content=features
[mdn-web-components]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components
