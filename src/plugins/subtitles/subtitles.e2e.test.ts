import { afterEach, describe, expect, it } from 'vitest';
import type { SubtitleTrack } from '../../configuration';
import type { UCVideo } from '../../index';
import '../../index';
import blankWebm from './fixtures/blank.webm?url';
import deSrt from './fixtures/de.srt?url';
import enVtt from './fixtures/en.vtt?url';
import notSubtitles from './fixtures/not-subtitles.html?url';
import { toWebVTT } from './toWebVTT';

type Element = UCVideo & { tracks: SubtitleTrack[] };

const mount = (children = '') => {
  document.body.innerHTML = `<uc-video uuid="test" cdn-cname="${location.origin}">${children}</uc-video>`;
  return document.querySelector('uc-video') as Element;
};

const remoteTracks = (el: Element) => {
  const player = el.player as unknown as {
    remoteTextTracks(): ArrayLike<TextTrack>;
  };
  return Array.from(player.remoteTextTracks());
};

const labels = (el: Element) => remoteTracks(el).map((track) => track.label);

afterEach(() => {
  document.body.innerHTML = '';
});

describe('subtitles', () => {
  it('loads <track> children and shows the default one', async () => {
    const el = mount(`
      <track kind="subtitles" src="${enVtt}" srclang="en" label="English" default>
      <track kind="captions" src="${deSrt}" srclang="de" label="Deutsch">
    `);

    await expect.poll(() => labels(el)).toEqual(['English', 'Deutsch']);

    const [en, de] = remoteTracks(el);
    expect(en.language).toBe('en');
    expect(en.mode).toBe('showing');
    expect(de.kind).toBe('captions');
    expect(de.mode).toBe('disabled');
    await expect.poll(() => en.cues?.length).toBe(2);
  });

  it('converts SRT to WebVTT', async () => {
    const el = mount(`<track src="${deSrt}" srclang="de" label="Deutsch">`);

    await expect.poll(() => labels(el)).toEqual(['Deutsch']);

    const [de] = remoteTracks(el);
    de.mode = 'hidden';

    await expect.poll(() => de.cues?.length).toBe(2);
    const cue = de.cues?.[1] as VTTCue;
    expect(cue.startTime).toBe(2);
    expect(cue.endTime).toBe(4.25);
    expect(cue.text).toBe('Welt');
  });

  it('appends the tracks property after <track> children and replaces it', async () => {
    const el = mount(`<track src="${enVtt}" srclang="en" label="English">`);

    el.tracks = [{ src: deSrt, srclang: 'de', label: 'Deutsch' }];
    await expect.poll(() => labels(el)).toEqual(['English', 'Deutsch']);

    el.tracks = [{ src: deSrt, srclang: 'fr', label: 'Français' }];
    await expect.poll(() => labels(el)).toEqual(['English', 'Français']);

    el.tracks = [];
    await expect.poll(() => labels(el)).toEqual(['English']);
  });

  it('follows <track> children being added, changed and removed', async () => {
    const el = mount(`<track src="${enVtt}" srclang="en" label="English">`);
    await expect.poll(() => labels(el)).toEqual(['English']);

    const de = document.createElement('track');
    de.src = deSrt;
    de.label = 'Deutsch';
    el.append(de);
    await expect.poll(() => labels(el)).toEqual(['English', 'Deutsch']);

    de.label = 'German';
    await expect.poll(() => labels(el)).toEqual(['English', 'German']);

    el.querySelector('track')?.remove();
    await expect.poll(() => labels(el)).toEqual(['German']);
  });

  // Playwright's Chromium can't decode the H.264 HLS stream a uuid points to, so a WebM source stands in for the uuid's player.src() call.
  it('keeps tracks when the source changes', async () => {
    const el = mount(`<track src="${enVtt}" srclang="en" label="English">`);
    await expect.poll(() => labels(el)).toEqual(['English']);

    el.player.addRemoteTextTrack({ src: enVtt, label: 'auto' }, false);
    expect(labels(el)).toEqual(['English', 'auto']);

    el.player.src({ src: blankWebm, type: 'video/webm' });

    await expect.poll(() => labels(el)).toEqual(['English']);
  });

  it('renders the active cue inside the shadow root', async () => {
    const el = mount(
      `<track src="${enVtt}" srclang="en" label="English" default>`,
    );
    await expect.poll(() => labels(el)).toEqual(['English']);

    el.player.src({ src: blankWebm, type: 'video/webm' });
    await new Promise((resolve) => el.player.one('loadeddata', resolve));
    el.player.currentTime(2.5);

    const display = el.shadowRoot?.querySelector('[part="subtitles"]');
    await expect.poll(() => display?.textContent).toBe('World');
  });

  it('skips tracks that fail to load or have no cues', async () => {
    const el = mount(`
      <track src="http://127.0.0.1:9/missing.vtt" label="Missing">
      <track src="${notSubtitles}" label="Not subtitles">
      <track src="${enVtt}" srclang="en" label="English">
    `);

    await expect.poll(() => labels(el)).toEqual(['English']);
  });

  it('ignores tracks without src', async () => {
    const el = mount(`<track label="No src">`);

    el.tracks = [
      { src: '', label: 'Empty' },
      { src: enVtt, label: 'English' },
    ];

    await expect.poll(() => labels(el)).toEqual(['English']);
  });

  it('shows the captions button and exposes the subtitles part', async () => {
    const el = mount(`<track src="${enVtt}" srclang="en" label="English">`);
    const root = el.shadowRoot as ShadowRoot;
    const button = root.querySelector('.vjs-subs-caps-button');

    await expect
      .poll(() => button?.classList.contains('vjs-hidden'))
      .toBe(false);
    expect(
      root
        .querySelector('[part="subtitles"]')
        ?.classList.contains('vjs-text-track-display'),
    ).toBe(true);
  });
});

describe('toWebVTT', () => {
  it('returns WebVTT unchanged apart from BOM and line endings', () => {
    expect(toWebVTT('﻿WEBVTT\r\n\r\n00:01.000 --> 00:02.000\r\nHi')).toBe(
      'WEBVTT\n\n00:01.000 --> 00:02.000\nHi',
    );
  });

  it('converts SRT timings and keeps cue text intact', () => {
    const srt = '1\r\n0:00:01,000 --> 0:00:02,500\r\nAt 0:00:01,000 sharp\r\n';

    expect(toWebVTT(srt)).toBe(
      'WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.500\nAt 0:00:01,000 sharp\n',
    );
  });
});
