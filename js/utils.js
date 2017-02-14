'use strict';

window.utils = (function () {

  /**
   * Возвращает ближайший родительский элемент с selector, если он существует
   *
   * @param {Element} element
   * @param {string} selector
   * @return {Element}
   */
  function getClosestElement(element, selector) {
    var matchesSelector = element.matches || element.webkitMatchesSelector;

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
   * @return {Boolean}
   */
  function isActivateEvent(event) {
    return event.keyCode === window.utils.KeyCodes.ENTER || event.type === 'click';
  }

  return {
    KeyCodes: {
      ENTER: 13,
      ESC: 27
    },
    getClosestElement: getClosestElement,
    isActivateEvent: isActivateEvent
  };
}());
