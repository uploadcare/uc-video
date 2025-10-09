import videojs from "video.js";
import { createSrcVideoAdaptive } from "../../shared/url/createSrcVideoAdaptive";
import { SOURCES_MIME_TYPES } from "../../shared/settings";

const Plugin = videojs.getPlugin("plugin");

export class UUIDSource extends Plugin {
  protected player;
  protected uuid;
  protected cdnCname;

  constructor(player, options: { uuid: string; cdnCname: string }) {
    super(player, options);

    this.uuid = options.uuid;
    this.cdnCname = options.cdnCname;

    this.player = player;
    this.player.ready(() => {
      if (!this.uuid) {
        throw new Error("UUID is required");
      }

      this.updateSource();
    });

    this.player.uuid = (uuid: string) => this.setUuid(uuid);
  }

  setUuid(uuid: string) {
    if (uuid && uuid !== this.uuid) {
      this.uuid = uuid;
      this.updateSource();
    }
  }

  updateSource() {
    if (!this.uuid) return;

    const videoUrl = this.getVideoUrl(this.uuid);

    this.player.src({ src: videoUrl, type: SOURCES_MIME_TYPES.hls });
    this.player.trigger("uuidchange", { uuid: this.uuid });
  }

  getVideoUrl(uuid: string) {
    return createSrcVideoAdaptive(this.cdnCname, uuid);
  }
}

videojs.registerPlugin("UUIDSourceInstance", UUIDSource);
