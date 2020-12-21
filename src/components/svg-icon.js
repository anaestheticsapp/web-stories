import { LitElement, html, css } from 'lit-element';

const icons = {
  cached: '<path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/><path d="M0 0h24v24H0z" fill="none"/>',
  fullscreen: '<path d="M0 0h24v24H0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>',
  share: '<path d="M0 0h24v24H0z" fill="none"/><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>',
};

class SvgIcon extends LitElement {
  static get properties() {
    return {
      icon: { type: String },
      svg: { type: String },
      size: { type: String },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          align-items: center;
          line-height: 0em;
          width: 24px;
          height: 24px;
        }
        slot {
          display: none;
        }
        svg {
          width: 100%;
          height: 100%;
          min-width: 24px;
          fill: currentColor;
        }
        .selected svg {
          fill: #2196f3;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.icon = null;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.icon) this.icon = this.textContent;
  }

  shouldUpdate(changedProp) {
    if (changedProp.has('icon') && this.icon) {
      const template = document.createElement('template');
      template.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24">${icons[this.icon]}</svg>`;
      this.svg = template.content;
    }
    return true;
  }

  render() {
    return html`${this.svg}`;
  }
}
customElements.define('svg-icon', SvgIcon);
