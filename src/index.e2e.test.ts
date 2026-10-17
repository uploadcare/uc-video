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
