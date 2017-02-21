'use strict';

window.utils = (function () {
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

  /**
   * Возвращает ближайший родительский элемент с selector, если он существует
   *
   * @param {Element} element
   * @param {string} selector
   * @return {Element}
   */
  function getClosestElement(element, selector) {
    var matchesSelector = element.matches || element.webkitMatchesSelector || element.msMatchesSelector;

    while (element) {
      if (matchesSelector.call(element, selector)) {
        return element;
      } else {
        element = element.parentElement;
      }
    }

    return null;
  }

  /**
   * Проверяет нужная ли клавиша нажата
   *
   * @param {KeyboardEvent} event
   * @return {boolean}
   */
  function isActivateEvent(event) {
    return event.keyCode === window.utils.KeyCodes.ENTER || event.type === 'click';
  }

  /**
   * Заменяет один элемент другим
   *
   * @param {Element} currentElement
   * @param {Element} newElement
   */
  function replaceDOM(currentElement, newElement) {
    currentElement.parentElement.replaceChild(newElement, currentElement);
  }

  function isFunction(arg) {
    return typeof arg === 'function';
  }

  return {
    KeyCodes: KeyCodes,
    getClosestElement: getClosestElement,
    isActivateEvent: isActivateEvent,
    isFunction: isFunction,
    replaceDOM: replaceDOM
  };
}());
