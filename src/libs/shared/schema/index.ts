

export enum Preload {
  AUTO = "auto",
  METADATA = "metadata",
  NONE = "none"
}
export enum Autoplay {
  MUTED = "muted",
  PLAY = "play",
  ANY = "any"
}

export type Options = {
  autoplay: boolean | keyof typeof Autoplay
  controls: boolean;
  height: string | number;
  loop: boolean;
  muted: boolean;
  poster: string;
  preload: Preload;
  width: string | number;

  // UC props
  uuid: string;
  posterOffset: string;
  showLogo: boolean;
  cdnCname: string;

  // Video.js-specific Options
  fluid: boolean;
  playbackRates: number[]
  crossorigin?: 'anonymous' | 'use-credentials'
  playsinline?: boolean;
}

// Generic type for the validator and value system
export type ValidatorFn<T> = (value: unknown) => asserts value is T;

export type OptionRecord<T> = {
  [K in keyof T]: {
    validator: ValidatorFn<T[K]>;
    value: T[K];
  };
};

