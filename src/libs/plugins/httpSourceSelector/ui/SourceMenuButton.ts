import videojs from "video.js";
import SourceMenuItem from "./SourceMenuItem.js";
import type Player from "video.js/dist/types/player.js";
import { TOptions } from "../../../shared/settings.js";

const MenuButton = videojs.getComponent("MenuButton");

class SourceMenuButton extends MenuButton {
  constructor(player: Player, options: TOptions & { default: "high" | "low" }) {
    // @ts-ignore
    super(player, options);
    const qualityLevels = this.player_.qualityLevels();

    if (options && options.default) {
      if (options.default === "low") {
        for (const [index, qualityLevel] of qualityLevels.entries()) {
          qualityLevel.enabled = index === 0;
        }
      } else if (options.default === "high") {
        for (let index = 0; index < qualityLevels.length; index++) {
          qualityLevels[index].enabled = index === qualityLevels.length - 1;
        }
      }
    }


    this.player_
      .qualityLevels()
      .on(
        ["change", "addqualitylevel", "removequalitylevel"],
        videojs.bind(this, this.update),
      );
  }


  createEl() {
    return videojs.dom.createEl("div", {
      className:
        "vjs-http-source-selector vjs-menu-button vjs-menu-button-popup vjs-control vjs-button custom-class-safari",
    });
  }


  buildCSSClass() {
    return MenuButton.prototype.buildCSSClass.call(this) + "vjs-icon-cog";
  }

  update() {
    // @ts-ignore
    return MenuButton.prototype.update.call(this);
  }

  createItems() {
    const menuItems = [];
    const levels = this.player_.qualityLevels();

    const labels = [] as unknown[];

    for (let index = levels.length - 1; index >= 0; index--) {
      const selected = index === levels.selectedIndex;

      // Display height if height metadata is provided with the stream, else use bitrate
      let label = `${index}`;
      let sortValue = index;
      const level = levels[index];

      if (level.height) {
        label = `${level.height}p`;
        sortValue = Number.parseInt(level.height, 10);
      } else if (level.bitrate) {
        label = `${Math.floor(level.bitrate / 1e3)} kbps`;
        sortValue = Number.parseInt(level.bitrate, 10);
      }

      // Skip duplicate labels
      if (labels.includes(label)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      labels.push(label);

      menuItems.push(
        new SourceMenuItem(this.player_, { label, index, selected, sortValue }),
      );
    }

    // If there are multiple quality levels, offer an 'auto' option
    if (levels.length > 1) {
      menuItems.push(
        new SourceMenuItem(this.player_, {
          label: "Auto",
          index: levels.length,
          selected: false,
          sortValue: 999999,
        }),
      );
    }

    // Sort menu items by their label name with Auto always first
    menuItems.sort((a, b) => b.options_.sortValue - a.options_.sortValue);

    return menuItems;
  }
}

export default SourceMenuButton;
