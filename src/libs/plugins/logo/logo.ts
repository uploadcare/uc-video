import videojs from 'video.js';
import './logo.css';
import { metricaAnalytics } from '../../shared/analytics';

const defaults = {
  active: true,
};

const Plugin = videojs.getPlugin('plugin');

export class Logo extends Plugin {
  protected player;
  protected logoEl;
  protected state;
  protected options_;

  constructor(player, options = {}) {
    super(player, options);
    this.player = player;

    this.options_ = Object.assign({}, defaults, options);

    this.state = {
      showLogo: this.options_.active,
    };

    this.logoEl = document.createElement('a');
    this.logoEl.href = metricaAnalytics.LOGO;
    this.logoEl.target = '_blank';
    this.logoEl.className = 'vjs-control vjs-uc-logo vjs-button';

    this._setVisibility(this.state.showLogo);

    const controlBar = this.player.controlBar;
    controlBar.el().appendChild(this.logoEl);

    this.player.showLogo = (value: boolean) => this._setVisibility(value);
  }

  _setVisibility(show: boolean) {
    this.state.showLogo = show;
    this.logoEl.style.display = show ? 'block' : 'none';
  }
}

videojs.registerPlugin('LogoInstance', Logo);
