'use strict';

window.showCard = (function () {
  var utils = window.utils;

  var DIALOG_INVISIBLE = 'dialog--invisible';

  var dialogElement = document.querySelector('.dialog');
  var dialogCloseElement = dialogElement.querySelector('.dialog__close');
  var cb;

  /**
   * Закрывает диалог
   */
  function closeDialog() {
    removeDialogHanldlers();
    toggleVisibility(false);
    if (cb) {
      cb();
    }
  }

  /**
   * Показывает / скрывает диалог
   *
   * @param {boolean} flag
   */
  function toggleVisibility(flag) {
    dialogElement.classList.toggle(DIALOG_INVISIBLE, !flag);
    dialogElement.setAttribute('aria-hidden', !flag);
  }

  /**
   * Обработчик клика для dialogCloseElement
   *
   * @param {KeyboardEvent} event
   */
  function dialogCloseClickHandler(event) {
    event.preventDefault();
    closeDialog();
  }

  /**
   * Обработчик нажатия клавиши для document
   *
   * @param {KeyboardEvent} event
   */
  function dialogKeydownHandler(event) {
    if (event.keyCode === utils.KeyCodes.ESC) {
      closeDialog();
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
   * Показывает диалог
   *
   * @param {Function} callback
   * @param {Array} data
   */
  return function (callback, data) {
    cb = utils.isFunction(callback) ? callback : null;

    toggleVisibility(true);

    document.addEventListener('keydown', dialogKeydownHandler);
    dialogCloseElement.addEventListener('click', dialogCloseClickHandler);
  };
})();
