type VideoAttributes = {
  autoplay: boolean | "muted" | "play" | "any";
  controls: boolean;

  height: number | string;
  width: number | string;

  loop: boolean;
  muted: boolean;
  poster: string | null;
  preload: "none" | "metadata" | "auto";

  controlslist: "nodownload" | "nofullscreen" | "noremoteplayback";
  crossorigin: "anonymous" | "use-credentials" | null;
  disablepictureinpicture: boolean;
  disableremoteplayback: boolean;
  playsinline: boolean;
};

type UploadcareVideoOptions = {
  uuid: string | null;
  cdnCname: string | null;
  showLogo: boolean;
  posterOffset: string;
};

type VideojsOptions = {
  aspectRatio?: string | null;
  audioOnlyMode: boolean;
  audioPosterMode: boolean;
  autoSetup: boolean;
  breakpoints: Record<
    "tiny" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "huge",
    number
  > | null;

  children?: unknown[] | object | null;

  disablePictureInPicture: boolean;
  enableDocumentPictureInPicture: boolean;
  enableSmoothSeeking: boolean;
  experimentalSvgIcons: boolean;
  fluid: boolean;

  fullscreen: {
    options: {
      navigationUI: string;
    };
  };

  id: string;
  inactivityTimeout: number;
  language: string;

  languages: unknown;

  liveui: boolean;
  nativeControlsForTouch: boolean;
  normalizeAutoplay: boolean;
  notSupportedMessage: string;
  noUITitleAttributes: boolean;
  playbackRates: number[];

  plugins: unknown;

  posterImage: boolean;
  preferFullWindow: boolean;
  responsive: boolean;
  restoreEl: boolean | Element;

  skipButtons: unknown;

  sources: { src: string; type: string }[] | null;
  suppressNotSupportedError: boolean;
  techCanOverridePoster: boolean;
  techOrder: string[];
  userActions: unknown;

  spatialNavigation: {
    enabled: boolean;
    horizontalSeek: boolean;
  };

  // Tech Options
  html5: unknown;
};

export const DEFAULT_CDN_CNAME = "https://ucarecdn.com";

export const DEFAULT_HLS_OPTIONS = {
  html5: {
    handlePartialData: false,

    nativeVideoTracks: false,
    nativeAudioTracks: false,
    nativeTextTracks: false,

    vhs: {
      overrideNative: true,
    },
  },
};

export const defaultVideoAttributes = {
  autoplay: false,
  controls: true,
  height: "",
  width: "",
  loop: false,
  muted: false,
  poster: null,
  preload: "auto",
  controlslist: "nodownload",
  crossorigin: null,
  disablepictureinpicture: false,
  disableremoteplayback: false,
  playsinline: false,
} satisfies VideoAttributes;

export const uploadcareConfiguration = {
  uuid: "",
  cdnCname: DEFAULT_CDN_CNAME,
  showLogo: true,
  posterOffset: "",
} satisfies UploadcareVideoOptions;

export const videojsOptions = {
  audioOnlyMode: false,
  audioPosterMode: false,
  autoSetup: false,
  breakpoints: null,
  disablePictureInPicture: false,
  enableDocumentPictureInPicture: false,
  enableSmoothSeeking: false,
  experimentalSvgIcons: false,
  fluid: false,
  id: "",
  inactivityTimeout: 0,
  language: "",
  liveui: false,
  nativeControlsForTouch: false,
  normalizeAutoplay: false,
  notSupportedMessage: "",
  noUITitleAttributes: false,
  playbackRates: [],
  posterImage: true,
  preferFullWindow: false,
  responsive: false,
  restoreEl: false,
  suppressNotSupportedError: false,
  techCanOverridePoster: false,
  techOrder: ["html5"],
  sources: null,

  fullscreen: {
    options: {
      navigationUI: "hide",
    },
  },

  languages: undefined,
  plugins: undefined,
  skipButtons: undefined,
  userActions: undefined,
  spatialNavigation: {
    enabled: false,
    horizontalSeek: false,
  },
  html5: undefined,
} satisfies VideojsOptions;

export const initialConfiguration = Object.freeze({
  ...uploadcareConfiguration,
  ...defaultVideoAttributes,
  ...videojsOptions,

  ...DEFAULT_HLS_OPTIONS,
});

export const allKeysConfiguration = Object.keys(initialConfiguration);

export const complexConfigKeys = [
  "breakpoints",
  "children",
  "fullscreen",
  "restoreEl",
  "sources",
  "techOrder",
  "spatialNavigation",
  "html5",
];

const isComplexKey = (key: string) => complexConfigKeys.includes(key);

export const plainConfigKeys =
  /** @type {(keyof import('../../types').ConfigPlainType)[]} */ allKeysConfiguration.filter(
    (key) => !isComplexKey(key)
  );

export const toKebabCase = (str: string) =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x: string) => x.toLowerCase())
    .join("-");

export const attrKeyMapping = {
  ...Object.fromEntries(
    allKeysConfiguration.map((key) => [toKebabCase(key), key])
  ),
  ...Object.fromEntries(
    allKeysConfiguration.map((key) => [key.toLowerCase(), key])
  ),
};

export const arrayAttrKeys = new Set([
  ...Object.keys(attrKeyMapping),
  ...Object.values(attrKeyMapping),
]);
