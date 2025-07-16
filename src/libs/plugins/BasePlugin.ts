import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';

const Plugin = videojs.getPlugin('plugin');

// @ts-ignore
export class BasePlugin<T extends Player = Player> extends Plugin {
  _player: T;
  _options: Record<string, unknown>;

  constructor(player: T, options: Record<string, unknown>) {
    super(player, options);

    this._player = player;
    this._options = options;
  }
}
