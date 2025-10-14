import videojs from 'video.js';

const MenuButton = videojs.getComponent('MenuButton');
const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

const toTitleCase = (string: string) => {
  if (typeof string !== 'string') {
    return string;
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
};

class SourceMenuButton extends MenuButton {
  constructor(player) {
    super(player, {
      title: player.localize('Quality'),
      name: 'QualityButton',
    });
  }

  createItems() {
    return [];
  }

  createMenu() {
    const menu = new Menu(this.player_, { menuButton: this });

    this.hideThreshold_ = 0;

    if (this.options_.title) {
      const titleEl = videojs.dom.createEl('li', {
        className: 'vjs-menu-title',
        innerHTML: toTitleCase(this.options_.title),
        tabIndex: -1,
      });
      const titleComponent = new Component(this.player_, { el: titleEl });

      this.hideThreshold_ += 1;

      menu.addItem(titleComponent);
    }

    this.items = this.createItems().reverse();

    if (this.items) {
      for (let i = 0; i < this.items.length; i++) {
        menu.addItem(this.items[i]);
      }
    }

    return menu;
  }
}

export default SourceMenuButton;
