'use strict';

window.showCard = (function () {
  var utils = window.utils;
  var renderDialog = window.renderDialog;

  var tokyoElement = document.querySelector('.tokyo');
  var currentElement;
  var closeBtnElement;
  var cb;

  /**
   * Закрывает диалог
   */
  function closeDialog() {
    removeListeners();
    currentElement.parentElement.removeChild(currentElement);
    currentElement = null;
    if (cb) {
      cb();
    }
  }

  /**
   * Обработчик клика для closeBtnElement
   *
   * @param {KeyboardEvent} event
   */
  function closeBtnClickHandler(event) {
    event.preventDefault();
    closeDialog();
  }

  /**
   * Обработчик нажатия клавиши для document
   *
   * @param {KeyboardEvent} event
   */
  function documentKeydownHandler(event) {
    if (event.keyCode === utils.KeyCodes.ESC) {
      closeDialog();
    }
  }

  /**
   * Удаляет обработчики диалога
   */
  function removeListeners() {
    document.removeEventListener('keydown', documentKeydownHandler);
    closeBtnElement.removeEventListener('click', closeBtnClickHandler);
  }

  /**
   * Добавляет обработчики диалога
   */
  function addListeners() {
    document.addEventListener('keydown', documentKeydownHandler);
    closeBtnElement.addEventListener('click', closeBtnClickHandler);
  }

  /**
   * Показывает диалог
   *
   * @param {Array} data
   * @param {Function} callback
   */
  return function (data, callback) {
    if (!data) {
      if (currentElement) {
        closeDialog();
      }
      return;
    }

    var newDialogElement = renderDialog(data);

    cb = utils.isFunction(callback) ? callback : null;

    if (currentElement) {
      removeListeners();
      utils.replaceDOM(currentElement, newDialogElement);
    } else {
      tokyoElement.appendChild(newDialogElement);
    }

    currentElement = newDialogElement;
    closeBtnElement = currentElement.querySelector('.dialog__close');
    addListeners();
  };
})();
