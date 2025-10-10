import videojs from "video.js";

const MenuItem = videojs.getComponent("MenuItem");
const Component = videojs.getComponent("Component");

class SourceMenuItem extends MenuItem {
  protected item;
  protected qualityButton;
  protected plugin;

  constructor(player, item, qualityButton, plugin) {
    super(player, {
      label: item.label,
      selectable: true,
      selected: item.selected || false,
    });
    this.item = item;
    this.qualityButton = qualityButton;
    this.plugin = plugin;
  }

  handleClick() {
    for (let i = 0; i < this.qualityButton.items.length; ++i) {
      this.qualityButton.items[i].selected(false);
    }

    this.plugin.setQuality(this.item.value);
    this.selected(true);
  }
}
// @ts-ignore
Component.registerComponent("SourceMenuItem", SourceMenuItem);
export default SourceMenuItem;
