window.utils = (function() {

  /**
   * Возвращает ближайший родительский элемент с selector, если он существует
   *
   * @param {Element} element
   * @param {string} selector
   * @return {Element}
   */
  function getClosestElement (element, selector) {
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

  return {
    KeyCodes: {
      ENTER: 13,
      ESC: 27
    },
    getClosestElement: getClosestElement
  }
}());
