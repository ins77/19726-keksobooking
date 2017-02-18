'use strict';

window.showCard = (function () {
  var DIALOG_INVISIBLE = 'dialog--invisible';
  var dialogElement = document.querySelector('.dialog');

  /**
   * Показывает / скрывает диалог
   *
   * @param {Function} callback
   */
  return function (callback) {
    var flag = true;

    if (typeof callback === 'function') {
      flag = false;
      callback();
    }

    dialogElement.classList.toggle(DIALOG_INVISIBLE, !flag);
    dialogElement.setAttribute('aria-hidden', !flag);
  };
})();
