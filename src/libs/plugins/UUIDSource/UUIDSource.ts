import videojs from 'video.js';
import type { VideoPlayerWithPlugins } from '../../configuration';
import { SOURCES_MIME_TYPES } from '../../shared/settings';
import { createSrcVideoAdaptive } from '../../shared/url/createSrcVideoAdaptive';

const Plugin = videojs.getPlugin('plugin');

type Player = VideoPlayerWithPlugins & {
  uuid: (value: string) => void;
};

//@ts-ignore
export class UUIDSource extends Plugin {
  private player: Player;
  private uuid: string;
  private cdnCname: string;

  constructor(player: Player, options: { uuid: string; cdnCname: string }) {
    super(player, options);

    this.uuid = options.uuid;
    this.cdnCname = options.cdnCname;

    this.player = player;
    this.player.ready(() => {
      if (!this.uuid) {
        throw new Error('UUID is required');
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
    this.player.trigger('uuidchange', { uuid: this.uuid });
  }

  getVideoUrl(uuid: string) {
    return createSrcVideoAdaptive(this.cdnCname, uuid);
  }
}

videojs.registerPlugin('UUIDSourceInstance', UUIDSource);
