import { afterEach, describe, expect, it } from 'vitest';
import type { SubtitleTrack } from './configuration';
import { UCVideo } from './index';
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
