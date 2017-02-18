'use strict';

window.showCard = (function () {
  var utils = window.utils;

  var DIALOG_INVISIBLE = 'dialog--invisible';

  var dialogElement = document.querySelector('.dialog');
  var dialogCloseElement = dialogElement.querySelector('.dialog__close');
  var onDialogClose = null;

  /**
   * Обработчик клика для dialogCloseElement
   *
   * @param {KeyboardEvent} event
   */
  function dialogCloseClickHandler(event) {
    event.preventDefault();
    removeDialogHanldlers();
    if (typeof callback === 'function') {
      onDialogClose();
    }
  }

  /**
   * Обработчик нажатия клавиши для document
   *
   * @param {KeyboardEvent} event
   */
  function dialogKeydownHandler(event) {
    if (event.keyCode === utils.KeyCodes.ESC) {
      removeDialogHanldlers();
      if (typeof callback === 'function') {
        onDialogClose();
      }
    }
  }

  /**
   * Удаляет обработчики диалога
   */
  function removeDialogHanldlers() {
    document.removeEventListener('keydown', dialogKeydownHandler);
    dialogCloseElement.removeEventListener('click', dialogCloseClickHandler);
  }

  /**
   * Показывает / скрывает диалог
   *
   * @param {Function} callback
   */
  return function (callback) {
    var flag = true;

    if (typeof callback === 'function') {
      flag = false;
      onDialogClose = callback;
    }

    document.addEventListener('keydown', dialogKeydownHandler);
    dialogCloseElement.addEventListener('click', dialogCloseClickHandler);

    dialogElement.classList.toggle(DIALOG_INVISIBLE, !flag);
    dialogElement.setAttribute('aria-hidden', !flag);
  };
})();
