'use strict';

window.showCard = (function () {
  var utils = window.utils;
  var renderDialog = window.renderDialog;

  var tokyoElement = document.querySelector('.tokyo');
  var currentElement;
  var cb;

  /**
   * Закрывает диалог
   */
  function closeDialog() {
    removeDialogEventListeners(currentElement);
    currentElement.parentElement.removeChild(currentElement);
    currentElement = null;
    if (cb) {
      cb();
    }
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
  function dialogCloseKeydownHandler(event) {
    if (event.keyCode === utils.KeyCodes.ESC) {
      closeDialog();
    }
  }

  /**
   * Удаляет обработчики диалога
   *
   * @param {Element} element
   */
  function removeDialogEventListeners(element) {
    document.removeEventListener('keydown', dialogCloseKeydownHandler);
    element.removeEventListener('click', dialogCloseClickHandler);
  }

  /**
   * Добавляет обработчики диалога
   *
   * @param {Element} element
   */
  function addDialogEventListeners(element) {
    document.addEventListener('keydown', dialogCloseKeydownHandler);
    element.addEventListener('click', dialogCloseClickHandler);
  }

  /**
   * Показывает диалог
   *
   * @param {Function} callback
   * @param {Array} data
   */
  return function (callback, data) {
    var newDialogElement = renderDialog(data);
    var DialogCloseElement = newDialogElement.querySelector('.dialog__close');

    cb = utils.isFunction(callback) ? callback : null;

    if (currentElement) {
      removeDialogEventListeners(currentElement.querySelector('.dialog__close'));
      utils.replaceDOM(currentElement, newDialogElement);
    } else {
      tokyoElement.appendChild(newDialogElement);
    }

    addDialogEventListeners(DialogCloseElement);

    currentElement = newDialogElement;
  };
})();
