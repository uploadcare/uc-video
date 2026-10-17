const SRT_TIMESTAMP = /(\d+):(\d{2}):(\d{2}),(\d{3})/g;

export const toWebVTT = (text: string) => {
  const body = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');

  if (body.startsWith('WEBVTT')) {
    return body;
  }

  const cues = body
    .split('\n')
    .map((line) =>
      line.includes('-->')
        ? line.replace(
            SRT_TIMESTAMP,
            (_, h: string, m: string, s: string, ms: string) =>
              `${h.padStart(2, '0')}:${m}:${s}.${ms}`,
          )
        : line,
    )
    .join('\n');

  return `WEBVTT\n\n${cues}`;
};
