import type Player from "video.js/dist/types/player";
import { BasePlugin } from "../BasePlugin";
import videojs from "video.js";
import { Logo as LogoComponent } from '../../shared/ui/index'
import { TOptions, VIDEO_PLAYER_EVENTS } from "../../shared/settings";

export class Logo extends BasePlugin {
  constructor(player: Player, options: TOptions) {
    videojs.registerComponent("UCLogo", LogoComponent);

    super(player, options)
    // @ts-ignore
    this.on(player, VIDEO_PLAYER_EVENTS.READY, () => {
      this.#init();
    });
  };

  #init() {
    // @ts-ignore
    const controlBar = this._player.controlBar;
    if (!controlBar.getChild("UCLogo")) {
      controlBar.el().append(controlBar.addChild("UCLogo").el());
    }
  }
}


const registerPlugin = videojs.registerPlugin;

registerPlugin("addLogo", Logo);