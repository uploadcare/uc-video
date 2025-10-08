import type Player from "video.js/dist/types/player";
import { type UUIDSource } from "../../plugins/UUIDSource";
import { type Logo } from "../../plugins/logo";

export type VideoPlayer = Player & {
  httpSourceSelector: (options: { default: "auto" | "low" | "high" }) => void;
  generatePoster: (options: {
    videoEl: HTMLVideoElement | null;
    posterOffset?: string | number;
    crossOrigin?: "anonymous" | "use-credentials";
  }) => void;
  LogoInstance: InstanceType<typeof Logo>;
  UUIDSourceInstance: InstanceType<typeof UUIDSource>;
};
