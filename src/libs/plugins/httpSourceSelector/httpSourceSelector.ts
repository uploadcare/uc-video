/**
 *
 * Fork https://github.com/jfujita/videojs-http-source-selector
 *
 */

import { BasePlugin } from "./../BasePlugin";
import videojs from "video.js";

import SourceMenuButton from "./ui/SourceMenuButton.js";
import SourceMenuItem from "./ui/SourceMenuItem.js";
import type Player from "video.js/dist/types/player.js";
import { type TOptions, VIDEO_PLAYER_EVENTS } from "../../shared/settings.js";

const CSS_VJS_HTTP_SELECTOR = "vjs-http-source-selector";

const defaults = {}

export class HttpSourceSelector extends BasePlugin {
  constructor(player: Player, options: TOptions) {
    videojs.registerComponent("SourceMenuButton", SourceMenuButton);
    videojs.registerComponent("SourceMenuItem", SourceMenuItem);

    const merge = (videojs.obj && videojs.obj.merge) || videojs.mergeOptions;
    const settings = merge(defaults, options);
    super(player, settings);

    this.on(player, VIDEO_PLAYER_EVENTS.READY, () => {
      this.#reset();
      this.#init();
    });
  }

  #init() {
    this._player.addClass(CSS_VJS_HTTP_SELECTOR);
    this._player.videojsHTTPSouceSelectorInitialized = true;

    if (this._player.techName_ === "Html5") {
      this.on(this._player, VIDEO_PLAYER_EVENTS.LOADED_METADATA, () =>
        this.#metadataLoaded(),
      );
    } else {
      this.#reset();
    }
  }

  #reset() {
    this._player.removeClass(CSS_VJS_HTTP_SELECTOR);
    if (this._player.videojsHTTPSouceSelectorInitialized === true) {
      if (!this._player.controlBar.getChild("SourceMenuButton")) {
        this._player.controlBar.removeChild("SourceMenuButton", {});
      }
      this._player.videojsHTTPSouceSelectorInitialized = false;
    }
  }

  #metadataLoaded() {
    const controlBar = this._player.controlBar;
    const fullscreenToggle = controlBar.getChild("fullscreenToggle");

    if (!controlBar.getChild("SourceMenuButton")) {
      if (fullscreenToggle) {
        controlBar
          .el()
          .insertBefore(
            controlBar.addChild("SourceMenuButton").el(),
            fullscreenToggle.el(),
          );
      } else {
        controlBar.el().append(controlBar.addChild("SourceMenuButton").el());
      }
    }
  }
}

const registerPlugin = videojs.registerPlugin;

registerPlugin("httpSourceSelector", HttpSourceSelector);
