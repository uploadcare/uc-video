/**
 *
 * Fork https://github.com/chrisboustead/videojs-hls-quality-selector
 *
 */

import videojs from "video.js";
import SourceMenuButton from "./ui/SourceMenuButton.js";
import SourceMenuItem from "./ui/SourceMenuItem.js";

const defaults = {};

const Plugin = videojs.getPlugin("plugin");

export class HttpSourceSelector extends Plugin {
  private _qualityButton;
  private player;
  private options;

  constructor(player, options) {
    super(player);

    this.options = videojs.obj.merge(defaults, options);
    this.player = player;

    this.player.ready(() => {
      if (this.player.qualityLevels) {
        this.player.addClass("vjs-hls-quality-selector");

        this.createQualityButton();
        this.bindPlayerEvents();
      }
    });
  }

  bindPlayerEvents() {
    this.player
      .qualityLevels()
      .on("addqualitylevel", this.onAddQualityLevel.bind(this));
  }

  createQualityButton() {
    const player = this.player;

    this._qualityButton = new SourceMenuButton(player);

    const placementIndex = player.controlBar.children().length - 2;
    const concreteButtonInstance = player.controlBar.addChild(
      this._qualityButton,
      { componentClass: "qualitySelector" },
      this.options.placementIndex || placementIndex
    );

    concreteButtonInstance.addClass("vjs-quality-selector");
    if (!this.options.displayCurrentQuality) {
      const icon = ` ${this.options.vjsIconClass || "vjs-icon-hd"}`;

      concreteButtonInstance.menuButton_.$(".vjs-icon-placeholder").className +=
        icon;
    } else {
      this.setButtonInnerText(player.localize("Auto"));
    }
    concreteButtonInstance.removeClass("vjs-hidden");
  }

  setButtonInnerText(text) {
    this._qualityButton.menuButton_.$(".vjs-icon-placeholder").innerHTML = text;
  }

  getQualityMenuItem(item) {
    const player = this.player;

    return new SourceMenuItem(player, item, this._qualityButton, this);
  }

  onAddQualityLevel() {
    const player = this.player;
    const qualityList = player.qualityLevels();
    const levels = qualityList.levels_ || [];
    const levelItems: SourceMenuItem[] = [];

    for (let i = 0; i < levels.length; ++i) {
      const { width, height } = levels[i];
      const pixels = width > height ? height : width;

      if (!pixels) {
        continue;
      }

      if (
        !levelItems.filter((_existingItem) => {
          return _existingItem.item && _existingItem.item.value === pixels;
        }).length
      ) {
        const levelItem = this.getQualityMenuItem.call(this, {
          label: pixels + "p",
          value: pixels,
        });

        levelItems.push(levelItem);
      }
    }

    levelItems.sort((current, next) => {
      if (typeof current !== "object" || typeof next !== "object") {
        return -1;
      }
      if (current.item.value > next.item.value) {
        return 1;
      }
      if (current.item.value < next.item.value) {
        return -1;
      }
      return 0;
    });

    levelItems.push(
      this.getQualityMenuItem.call(this, {
        label: this.player.localize("Auto"),
        value: "auto",
        selected: true,
      })
    );

    if (this._qualityButton) {
      this._qualityButton.createItems = () => {
        return levelItems;
      };
      this._qualityButton.update();
    }
  }

  setQuality(quality) {
    const qualityList = this.player.qualityLevels();

    this._currentQuality = quality;

    if (this.options.displayCurrentQuality) {
      this.setButtonInnerText(
        quality === "auto" ? this.player.localize("Auto") : `${quality}p`
      );
    }

    for (let i = 0; i < qualityList.length; ++i) {
      const { width, height } = qualityList[i];
      const pixels = width > height ? height : width;

      qualityList[i].enabled = pixels === quality || quality === "auto";
    }
    this._qualityButton.unpressButton();
  }

  getCurrentQuality() {
    return this._currentQuality || "auto";
  }
}

const registerPlugin = videojs.registerPlugin;

registerPlugin("httpSourceSelector", HttpSourceSelector);
