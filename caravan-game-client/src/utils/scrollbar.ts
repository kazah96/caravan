/*
  This file is slightly modified version of the bootstrap scrollbar helper;
  https://github.com/twbs/bootstrap/blob/main/js/src/util/scrollbar.js
*/

/* eslint-disable class-methods-use-this */
const isElement = (object: unknown): object is HTMLElement => {
  if (!object || typeof object !== 'object') {
    return false;
  }

  return typeof (object as HTMLElement).nodeType !== 'undefined';
};

const PROPERTY_PADDING = 'padding-right';

class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  }

  private _element: HTMLElement;

  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }

  hide() {
    const width = this.getWidth();
    this.disableOverFlow();
    // give padding to element to balance the hidden scrollbar width
    this.setElementAttributes(
      this._element,
      PROPERTY_PADDING,
      (calculatedValue: number) => calculatedValue + width,
    );
  }

  reset() {
    this.resetElementAttributes(this._element, 'overflow');
    this.resetElementAttributes(this._element, PROPERTY_PADDING);
  }

  isOverflowing() {
    return this.getWidth() > 0;
  }

  private disableOverFlow() {
    this.saveInitialAttribute(this._element, 'overflow');
    this._element.style.overflow = 'hidden';
  }

  setElementAttributes(
    selector: HTMLElement,
    styleProperty: string,
    callback: (n: number) => number,
  ) {
    const scrollbarWidth = this.getWidth();
    const manipulationCallBack = (element: HTMLElement) => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }

      this.saveInitialAttribute(element, styleProperty);
      const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
      element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
    };

    this.applyManipulationCallback(selector, manipulationCallBack);
  }

  private saveInitialAttribute(element: HTMLElement, styleProperty: string) {
    const actualValue = element.style.getPropertyValue(styleProperty);
    if (actualValue) {
      element.setAttribute(styleProperty, actualValue);
    }
  }

  private resetElementAttributes(selector: HTMLElement, styleProperty: string) {
    const manipulationCallBack = (element: HTMLElement) => {
      const value = element.getAttribute(styleProperty);
      if (value === null) {
        element.style.removeProperty(styleProperty);
        return;
      }

      element.removeAttribute(styleProperty);
      element.style.setProperty(styleProperty, value);
    };

    this.applyManipulationCallback(selector, manipulationCallBack);
  }

  applyManipulationCallback(selector: HTMLElement, callBack: (v: HTMLElement) => void) {
    if (isElement(selector)) {
      callBack(selector);
      return;
    }

    for (const sel of this._element.querySelectorAll(selector)) {
      callBack(sel);
    }
  }
}

export { ScrollBarHelper };
