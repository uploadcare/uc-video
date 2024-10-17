import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import type { TOptions } from "../../../shared/settings";
const MenuItem = videojs.getComponent("MenuItem");
const Component = videojs.getComponent("Component");

class SourceMenuItem extends MenuItem {
  constructor(player: Player, options: TOptions) {
    options.selectable = true;
    options.multiSelectable = false;

    super(player, options);
  }

  handleClick() {
    const selected = this.options_;

    super.handleClick();

    const levels = [...this.player_.qualityLevels().levels_];

    for (const [index, level] of levels.entries()) {
      level.enabled =
        selected.index === levels.length || selected.index === index;
    }
  }

  update() {
    const selectedIndex = this.player_.qualityLevels().selectedIndex;

    this.selected(this.options_.index === selectedIndex);
  }
}

Component.registerComponent("SourceMenuItem", SourceMenuItem);
export default SourceMenuItem;
