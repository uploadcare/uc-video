import { afterEach, describe, expect, it } from 'vitest';
import type { SubtitleTrack } from './configuration';
import { UCVideo } from './index';
import blankWebm from './plugins/subtitles/fixtures/blank.webm?url';
import enVtt from './plugins/subtitles/fixtures/en.vtt?url';

type Element = UCVideo & {
  uuid: string;
  cdnCname: string;
  tracks: SubtitleTrack[];
};

const labels = (el: Element) => {
  const player = el.player as unknown as {
    remoteTextTracks(): ArrayLike<TextTrack>;
  };
  return Array.from(player.remoteTextTracks(), (track) => track.label);
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('properties', () => {
  it('exist before the element is connected', () => {
    const el = document.createElement('uc-video');

    expect('tracks' in el).toBe(true);
    expect('uuid' in el).toBe(true);
  });

  it('keep values set before the element is connected', async () => {
    const el = document.createElement('uc-video') as Element;
    el.cdnCname = location.origin;
    el.uuid = 'before-connect';
    el.tracks = [{ src: enVtt, srclang: 'en', label: 'English' }];

    expect(el.getAttribute('uuid')).toBe('before-connect');

    document.body.append(el);

    await expect.poll(() => labels(el)).toEqual(['English']);
    expect(el.player.currentSrc()).toContain('/before-connect/');
  });

  it('keep values set before the element is upgraded', async () => {
    const tag = 'uc-video-late-upgrade';
    const el = document.createElement(tag) as Element;
    el.tracks = [{ src: enVtt, srclang: 'en', label: 'English' }];
    el.setAttribute('uuid', 'before-upgrade');
    el.setAttribute('cdn-cname', location.origin);
    document.body.append(el);

    customElements.define(tag, class extends UCVideo {});

    await expect.poll(() => labels(el)).toEqual(['English']);
    expect(Object.hasOwn(el, 'tracks')).toBe(false);
    expect(el.tracks).toEqual([
      { src: enVtt, srclang: 'en', label: 'English' },
    ]);
  });
});

describe('full-window mode', () => {
  const box = (el: globalThis.Element) => {
    const { left, top, width, height } = el.getBoundingClientRect();
    return { left, top, width, height };
  };

  const mount = () => {
    const style = document.createElement('style');
    style.textContent =
      'uc-video { width: 320px; height: 180px; margin: 20px; max-width: 50%; }';
    document.body.innerHTML = `<uc-video uuid="test" cdn-cname="${location.origin}"></uc-video>`;
    document.body.prepend(style);
    return document.querySelector('uc-video') as Element;
  };

  it('fills the viewport even when page styles size the element', () => {
    const el = mount();
    const player = el.shadowRoot?.querySelector('.video-js') as HTMLElement;
    const viewport = {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const before = box(el);
    el.player.enterFullWindow();

    expect(el.hasAttribute('full-window')).toBe(true);
    expect(box(el)).toEqual(viewport);
    expect(box(player)).toEqual(viewport);

    el.player.exitFullWindow();

    expect(el.hasAttribute('full-window')).toBe(false);
    expect(box(el)).toEqual(before);
  });

  it('releases the page when removed in full-window mode', () => {
    const el = mount();

    el.player.enterFullWindow();
    expect(document.documentElement.style.overflow).toBe('hidden');

    el.remove();

    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.classList.contains('vjs-full-window')).toBe(false);
  });
});

describe('sizing', () => {
  const size = (el: globalThis.Element) => {
    const { width, height } = el.getBoundingClientRect();
    return { width, height };
  };

  const mount = (pageCss: string, attrs = '') => {
    const style = document.createElement('style');
    style.textContent = pageCss;
    document.body.innerHTML = `<div style="width: 600px"><uc-video uuid="test" cdn-cname="${location.origin}" ${attrs}></uc-video></div>`;
    document.body.prepend(style);

    const el = document.querySelector('uc-video') as Element;
    const player = el.shadowRoot?.querySelector('.video-js') as HTMLElement;
    return { el, player };
  };

  // blank.webm is 64x36.
  const loadVideo = async (el: Element) => {
    await new Promise<void>((resolve) => el.player.ready(() => resolve()));
    el.player.src({ src: blankWebm, type: 'video/webm' });
    await new Promise((resolve) => el.player.one('loadedmetadata', resolve));
  };

  it('fills the size page styles give the element', async () => {
    const { el, player } = mount('uc-video { width: 320px; height: 200px; }');
    await loadVideo(el);

    expect(size(el)).toEqual({ width: 320, height: 200 });
    expect(size(player)).toEqual({ width: 320, height: 200 });
  });

  it('takes the height from the aspect ratio when page styles set the width', async () => {
    const { el, player } = mount('uc-video { width: 100%; }');
    await loadVideo(el);

    expect(size(player)).toEqual({ width: 600, height: 337.5 });
  });

  it('keeps the video size when nothing sizes the element', async () => {
    const { el, player } = mount('');
    expect(size(player)).toEqual({ width: 300, height: 168.75 });

    await loadVideo(el);

    expect(size(el)).toEqual({ width: 64, height: 36 });
    expect(size(player)).toEqual({ width: 64, height: 36 });
  });

  it('uses width and height attributes unless page styles override them', () => {
    const { player } = mount('', 'width="320" height="240"');
    expect(size(player)).toEqual({ width: 320, height: 240 });

    const styled = mount(
      'uc-video { width: 160px; }',
      'width="320" height="240"',
    );
    expect(size(styled.player)).toEqual({ width: 160, height: 120 });
  });

  it('leaves fluid mode to video.js', async () => {
    const { el, player } = mount('', 'fluid');
    await loadVideo(el);

    expect(size(player)).toEqual({ width: 600, height: 337.5 });
  });
});

describe('control bar', () => {
  const mount = async (width: number, attrs = '') => {
    document.body.innerHTML = `<uc-video style="width: ${width}px" uuid="test" cdn-cname="${location.origin}" ${attrs}><track src="${enVtt}" srclang="en" label="English"></uc-video>`;
    const el = document.querySelector('uc-video') as Element;
    // The uuid's HLS stream errors in Playwright's Chromium, and video.js hides the control bar on error.
    await new Promise<void>((resolve) => el.player.ready(() => resolve()));
    el.player.src({ src: blankWebm, type: 'video/webm' });
    await new Promise((resolve) => el.player.one('loadedmetadata', resolve));
    el.player.addClass('vjs-has-started');

    const root = el.shadowRoot as ShadowRoot;
    const bar = root.querySelector('.vjs-control-bar') as HTMLElement;
    const visible = (selector: string) => {
      const control = root.querySelector(selector);
      return !!control && getComputedStyle(control).display !== 'none';
    };

    await expect.poll(() => visible('.vjs-subs-caps-button')).toBe(true);
    return { el, bar, visible };
  };

  it('fits captions, quality and the logo at 320px', async () => {
    const { bar, visible } = await mount(320);

    expect(bar.scrollWidth).toBe(bar.clientWidth);
    for (const control of [
      '.vjs-subs-caps-button',
      '.vjs-quality-selector',
      '.vjs-fullscreen-control',
      '.vjs-uc-logo',
    ]) {
      expect(visible(control), control).toBe(true);
    }
  });

  it('keeps the progress bar above 320px', async () => {
    const { bar, visible } = await mount(360);

    expect(bar.scrollWidth).toBe(bar.clientWidth);
    expect(visible('.vjs-progress-control')).toBe(true);
  });

  it('can turn responsive mode off', async () => {
    const { el } = await mount(320, 'responsive="false"');

    expect(el.player.responsive()).toBe(false);
  });
});
