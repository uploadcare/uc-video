import videojs from "video.js";
import type Player from "video.js/dist/types/player";

const Plugin = videojs.getPlugin("plugin");

export class BasePlugin extends Plugin {
  _player: Player;
  _options: Record<string, unknown>;

  constructor(player: Player, options: Record<string, unknown>) {
    super(player, options);

    this._player = player
    this._options = options
  }
}
