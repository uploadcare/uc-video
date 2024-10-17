import videojs from "video.js";
import './logo.css'

const ClickableComponent = videojs.getComponent('ClickableComponent')

export class Logo extends ClickableComponent {
  createEl() {
    return videojs.dom.createEl("a", {
      href: 'https://uploadcare.com/',
      target: '_blank',
      className: "vjs-control vjs-uc-logo vjs-button",
      'aria-label': 'Uploadcare logo'
    });
  }
}


const registerComponent = videojs.registerComponent;

registerComponent("addUCLogo", Logo);