import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import { type TOptions, VIDEO_PLAYER_EVENTS } from '../../shared/settings';
import { Logo as LogoComponent } from '../../shared/ui/index';
import { BasePlugin } from '../BasePlugin';

export class Logo extends BasePlugin {
  constructor(player: Player, options: TOptions) {
    videojs.registerComponent('UCLogo', LogoComponent);

    super(player, options);

    this._player.on(VIDEO_PLAYER_EVENTS.READY, () => {
      this._init();
    });
  }

  _init() {
    // @ts-ignore
    const controlBar = this._player.controlBar;
    if (!controlBar.getChild('UCLogo')) {
      controlBar.el().append(controlBar.addChild('UCLogo').el());
    }
  }
}

const registerPlugin = videojs.registerPlugin;

registerPlugin('showLogo', Logo);
