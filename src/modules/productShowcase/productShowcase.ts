/**
 * productShowcase.ts
 *
 * Here you can see an example of the pattern that we use for
 * the modules.
 *
 * The basic idea is to have:
 *
 * - CSS classes
 * - DOM Selectors
 * - DOM elements (after apply the selectors)
 * - State (yes, each module needs to have an state)
 * - Events
 * - A way to access the module API from a different module. Not the best idea,
 *   but sometimes you need intercommunication between modules and this can
 *   help you to solve this needs. (If you are uncomfortable with this approach,
 *   use something to handle the state, like Redux)
 *
 * Also, we need to define what pattern we'll apply to create the modules.
 * In this project, we're gonna work with OLOO
 * (see https://gist.github.com/getify/5572383 for more information). The problem is that
 * OLOO uses Object.create, which doesn't work well with Typescript. If you are using JS, this is a good
 * approach. If you are using Typescript, use classes.
 *
 */

import Tabs from '../../components/tabs/tabs';
import Module from '../Module';

// Here we have the classes that we'll use in our javascript, like
// active, hidden, etc.
// You can structure this object as you want, but take in consideration
// that css classes here don't have the initial dot (.) since you'll be using them
// with classList methods (add, remove, contains).
const css = {
  title: {
    italic: 'product-showcase__title--italic',
  },
};

// Selectors are used to get DOM elements. It's very common that a CSS class is used as selector,
// so use string interpolation in those cases from css constant, in order to avoid repetition.
const selectors = {
  // These are bad examples for selectors because they are attached to styles.
  title: '.product-showcase__title',
  text: '.product-showcase__text',

// Recommended: Use a data attribute or class that specifies that it attaches a js functionality
  // like js-button
  button: '[data-button]',
};

export const productShowcaseInstances = Module.generateWeakMap();

interface ProductShowcaseDOM {
  title: Element | null;
  text: Element | null;
  button: Element | null;
}

interface ProductShowcaseState {
  isTitleItalic: boolean;
}

interface ProductShowcaseOptions {
  italic: boolean;
}

class ProductShowcase extends Module {
  private dom: ProductShowcaseDOM;
  private state: ProductShowcaseState;
  private options: ProductShowcaseOptions;

  constructor(domElement: HTMLElement, options?: ProductShowcaseOptions) {
    super();

    // Parse the options set in the DOM element
    this.options = Module.parseOptions(domElement);

    // Look for DOM elements
    this.dom = {
      title: domElement.querySelector(selectors.title),
      text: domElement.querySelector(selectors.text),
      button: domElement.querySelector(selectors.button),
    };

    // Add initial state
    this.state = {
      isTitleItalic: Boolean(this.options.italic) || false,
    };

    // Initialize stuff, like events, JS generated DOM and classes, etc.
    this.initializeEvents();
    this.updateDOMFirstTime();

    productShowcaseInstances.set(domElement, this);
  }

  public toggleItalicOnTitle(toggleVar?: boolean): boolean {
    if (!this.dom.title) {
      return false;
    }

    this.state.isTitleItalic = typeof toggleVar === 'boolean' ?
      toggleVar :
      !this.state.isTitleItalic;

    this.dom.title.classList.toggle(css.title.italic, this.state.isTitleItalic);

    return this.state.isTitleItalic;
  }

  private initializeEvents() {
    if (this.dom.button) {
      this.dom.button.addEventListener('click', () => this.toggleItalicOnTitle());
    }
  }

  private updateDOMFirstTime() {
    this.toggleItalicOnTitle(this.state.isTitleItalic);
  }
}

export default function init(domElement: HTMLElement) {
  const instance = new ProductShowcase(domElement);
}
