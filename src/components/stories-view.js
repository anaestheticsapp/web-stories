import { LitElement, html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import * as dom from 'helpers/dom.js';
import webShare from 'logic/web-share.js';
import stories from '../data/stories.js';

const COMPONENT = 'stories-view';

class StoriesView extends LitElement {
  static get properties() {
    return {
      _currentView: { type: Array },
    };
  }
  constructor() {
    super();
    this._stories = stories;

    const user = 0;
    const story = stories[0].length - 1;
    this._currentView = [user, story];

    this._getWindowMedian = this._getWindowMedian.bind(this);
    this._keyboardNavigation = this._keyboardNavigation.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._getWindowMedian);
    window.addEventListener('keydown', this._keyboardNavigation);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._getWindowMedian);
    window.removeEventListener('keydown', this._keyboardNavigation);
  }
  firstUpdated() {
    this._users = this.shadowRoot.querySelectorAll('section');
    this._users[0].focus();

    this._getWindowMedian();

    const updateProgressBarOnSwipe = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const visibleUser = +entry.target.dataset.user;
          const currentUser = this._currentView[0];
          if (currentUser !== visibleUser) {
            const story = this._stories[visibleUser].filter((story) => !story.seen).length - 1;
            this._currentView = [visibleUser, story];
          }
        }
      });
    };
    const options = {
      root: this.shadowRoot.querySelector('main'),
      rootMargin: '50px',
      threshold: 1,
    };
    const observer = new IntersectionObserver(updateProgressBarOnSwipe, options);
    const sections = this.shadowRoot.querySelectorAll('section');
    sections.forEach((el) => observer.observe(el));
  }
  updated(props) {
    if (props.has('_currentView')) {
      const [user, story] = this._currentView;
      this._animateElement(user, story);
    }
  }
  _getWindowMedian() {
    this._median = this.offsetLeft + this.clientWidth / 2;
  }
  _keyboardNavigation({ key }) {
    if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'ArrowLeft' || key === 'ArrowRight') {
      const [user] = this._currentView;
      switch (key) {
        case 'ArrowDown':
        case 'ArrowUp':
          const story = this._stories[user].filter((story) => !story.seen).length - 1;
          return this._navigateStories(key === 'ArrowDown' ? 'next' : 'prev', user, story);
        case 'ArrowLeft':
          if (user === 0) return this._endOfStories('prev', user);
          return this._changeUser(user - 1);
        case 'ArrowRight':
          if (user === this._stories.length - 1) return this._endOfStories('next', user);
          return this._changeUser(user + 1);
      }
    }
  }
  _animateElement(user, story) {
    const article = this.shadowRoot.getElementById(`${user}-${story}`);
    const el = article.querySelector('.container div');
    if (!el) return;
    switch (el.className) {
      case 'label':
        return el.animate({ opacity: '1' }, { duration: 750, easing: 'ease-in-out', fill: 'forwards' });
      case 'h1':
        return el.animate([{ transform: 'scale(1)' }, { transform: 'scale(2)' }, { transform: 'scale(1)' }], { duration: 1000, easing: 'ease-in-out' });
      case 'text':
        return el.animate([
          { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(-10deg)' }],
          { duration: 1000, fill: 'forwards' }
        );
    }
  }

  _endOfStories(direction, user) {
    const section = this._users[user];
    const el = section.appendChild(dom.create('article', { className: 'end ' + direction }));
    el.addEventListener('animationend', (evt) => {
      if (evt.target !== el) return;
      el.remove();
    });
  }
  _changeUser(user) {
    const nextUser = this._users[user];
    const scroll = () => nextUser.scrollIntoView({ behavior: 'smooth' });
    window.requestAnimationFrame(scroll);

    const stories = this._stories[user].filter((story) => !story.seen);
    this._currentView = [user, stories.length - 1];
  }
  _navigateStories(direction, user, story) {
    const stories = this._stories[user];

    const firstItemInUserStory = stories.length - 1;
    const lastItemInUserStory = 0;
    const hasNextUserStory = user < this._stories.length - 1;
    const hasPrevUserStory = user !== 0;

    if (direction === 'next') {
      if (lastItemInUserStory === story && !hasNextUserStory) {
        return this._endOfStories(direction, user);
      } else if (lastItemInUserStory === story && hasNextUserStory) {
        this._changeUser(user + 1);
      } else {
        stories[story].seen = true;
        this._currentView = [user, story - 1];
      }
    } else if (direction === 'prev') {
      if (firstItemInUserStory === story && !hasPrevUserStory) {
        return this._endOfStories(direction, user);
      } else if (firstItemInUserStory === story && hasPrevUserStory) {
        this._changeUser(user - 1);
      } else {
        stories[story + 1].seen = false;
        this._currentView = [user, story + 1];
      }
    }
  }

  _onTap(e) {
    if (e.target.nodeName !== 'ARTICLE') return;
    const parent = e.target.parentNode.dataset;
    if (!parent) return console.warn('animation not finished');
    const user = +parent.user;
    const story = this._stories[user].filter((story) => !story.seen).length - 1;
    const direction = e.clientX > this._median ? 'next' : 'prev';
    this._navigateStories(direction, user, story);
  }
  _onClick(e) {
    const { id } = e.target;
    switch (id) {
      case 'fullscreen':
        if (!document.fullscreenElement) return this.requestFullscreen().catch((err) => console.log(err));
        else return document.exitFullscreen();
      case 'share':
        return webShare(location.href, { title: 'Web Stories', text: 'Have a look at my web story!' });
    }
  }

  renderStories(user, userIndex) {
    return user.map((story, storyIndex) => {
      const seen = { seen: story.seen };
      return html`
        <article id="${userIndex}-${storyIndex}" data-story="${storyIndex}" class="${classMap(seen)}" style="--bg: url(${story.url});">
          ${story.text
            ? html`
                <div class="container">
                  <div class="${story.class}">${story.text}</div>
                </div>
              `
            : ''}
        </article>
      `;
    });
  }
  renderUsers() {
    return this._stories.map(
      (user, userIndex) =>
        html`<section tabindex="0" data-user="${userIndex}">${this.renderStories(user, userIndex)}</section>`
    );
  }
  render() {
    const progressBar = this._stories.map(
      (_, index) => html`<span class="${index === this._currentView[0] ? 'active' : ''}"></span>`
    );

    return html`
      <div class="toolbar">
        ${navigator.share
            ? html`<button type="button" id="share" @click="${this._onClick}"><svg-icon icon="share"></svg-icon></button>`
            : ''}
        ${document.fullscreenEnabled
          ? html`<button type="button" id="fullscreen" @click="${this._onClick}"><svg-icon icon="fullscreen"></svg-icon></button>`
          : ''}

      </div>
      <main @click="${this._onTap}">${this.renderUsers()}</main>
      <footer>${progressBar}</footer>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: grid;
          align-items: center;
          justify-items: center;
          place-items: center;
          background: var(--background-color);
        }
        section:focus {
          outline: none;
        }
        svg-icon {
          pointer-events: none;
        }
        main {
          width: 100vw;
          height: 100%;
          box-shadow: 0 5px 2.5px hsla(200, 95%, 3%, 0.037), 0 12px 6.5px hsla(200, 95%, 3%, 0.053),
            0 22.5px 13px hsla(200, 95%, 3%, 0.065), 0 40.2px 24px hsla(200, 95%, 3%, 0.077),
            0 75.2px 44px hsla(200, 95%, 3%, 0.093), 0 180px 80px hsla(200, 95%, 3%, 0.13);
          display: grid;
          grid: 1fr / auto-flow 100%;
          gap: 0.5rem; /* changing to 1ch or 2ch breaks scroll on android */
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          overscroll-behavior: contain;
          touch-action: pan-x;
        }

        @media (hover: hover) {
          main {
            border-radius: 3ch;
          }
        }
        @media (hover: hover) and (min-width: 480px) {
          main {
            max-width: 480px;
            max-height: 848px;
          }
        }
        @media (hover: hover) and (max-height: 880px) and (min-width: 720px) {
          main {
            max-width: 320px;
            max-height: 568px;
          }
        }

        main::-webkit-scrollbar {
          display: none;
        }
        section {
          scroll-snap-align: start;
          scroll-snap-stop: always;
          display: grid;
          grid: [story] 1fr / [story] 1fr;
        }
        article {
          grid-area: story;

          background-size: cover;
          background-image: var(--bg), linear-gradient(to top, #1b1d1c, #7986cb);

          user-select: none;
          touch-action: manipulation;

          transition: opacity 0.3s cubic-bezier(0.4, 0, 1, 1);
          z-index: 1;
        }
        article.seen {
          opacity: 0;
          pointer-events: none;
        }

        div.toolbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: flex-end;
          padding: 5px 20px;
          z-index: 100;
        }
        button {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          min-width: 42px;
          background: transparent;
          border: 0px;
          color: var(--on-background-color);
          cursor: pointer;
          outline: none;
          border-radius: 50%;
        }
        button:hover {
          background: var(--button-hover-color);
        }
        article.end {
          animation: var(--duration) var(--timing) 0s 1 normal none running fade-in-out;
          margin-left: 0;
          pointer-events: none;
          width: 50%;
          opacity: 0;
        }
        article.next {
          justify-self: right;
          background: linear-gradient(90deg, rgb(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
        }
        article.prev {
          justify-self: left;
          background: linear-gradient(90deg, rgb(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
        }
        @keyframes fade-in-out {
          50% { opacity: 1; }
        }
        div.container {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          height: 100%;
          pointer-events: none;
        }
        .animate div {
          opacity: 0;
          animation: var(--duration) var(--timing) 0s 1 normal none running fade-in-out;
        }
        div.label {
          text-align: center;
          background: rgb(0 0 0 / 0.6);
          padding: 60px 20px 60px;
          color: var(--on-background-color);
          font-size: 2rem;
          width: 100%;
          align-self: flex-end;
          opacity: 0;
        }
        div.text {
          align-self: center;
          background: rgba(0, 0, 0, 0.85);
          padding: 20px 40px;
          color: var(--on-background-color);
          font-size: 2rem;
          font-weight: 500;
          border-radius: 1rem;
        }
        div.h1 {
          text-align: center;
          background: rgb(63, 81, 181);
          padding: 40px 20px;
          color: var(--on-background-color);
          font-size: 2rem;
          width: 100%;
          align-self: flex-start;
        }
        footer {
          position: fixed;
          bottom: 0px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: flex-end;
          padding: 5px 20px;
          z-index: 100;
        }
        footer span {
          background: rgba(255, 255, 255, 0.5);
          margin: 2px;
          width: 100%;
          border-radius: 1rem;
          height: 3px;
        }
        span.active {
          background: #2196f3;
          transition: background-color var(--duration) var(--timing);
        }
      `,
    ];
  }
}
customElements.define(COMPONENT, StoriesView);
