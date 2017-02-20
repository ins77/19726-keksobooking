'use strict';

window.showCard = (function () {
  var utils = window.utils;

  var tokyoElement = document.querySelector('.tokyo');

  /**
   * Показывает диалог
   *
   * @param {Function} callback
   * @param {Array} data
   */
  return function (callback, data) {
    var templateElement = document.querySelector('#dialog-template');
    var elementToClone = templateElement.content.querySelector('.dialog');
    var newElement = elementToClone.cloneNode(true);

    tokyoElement.appendChild(newElement);

    var DIALOG_INVISIBLE = 'dialog--invisible';
    var dialogElement = document.querySelector('.dialog');
    var dialogCloseElement = dialogElement.querySelector('.dialog__close');
    var dialogLodgeTitleElement = dialogElement.querySelector('.lodge__title');
    var dialogLodgeAddressElement = dialogElement.querySelector('.lodge__address');
    var dialogLodgeDescElement = dialogElement.querySelector('.lodge__description');
    var dialogLodgePhotosElement = dialogElement.querySelector('.lodge__photos');
    var dialogLodgePriceElement = dialogElement.querySelector('.lodge__price');
    // var dialogLodgeTypeElement = dialogElement.querySelector('.lodge__flat');
    // var dialogLodgeRoomsElement = dialogElement.querySelector('.lodge__rooms');
    // var dialogLodgeGuestsElement = dialogElement.querySelector('.lodge__guests');
    var dialogLodgeCheckInElement = dialogElement.querySelector('.lodge__checkin-time');
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

    dialogLodgePhotosElement.innerHTML = '';
    dialogLodgeTitleElement.textContent = data.offer.title;
    dialogLodgeAddressElement.textContent = data.offer.address;
    dialogLodgeDescElement.textContent = data.offer.description;
    dialogLodgeDescElement.textContent = data.offer.description;
    dialogLodgePriceElement.textContent = data.offer.price;
    // dialogLodgeTypeElement.textContent = data.offer.type;
    // dialogLodgeRoomsElement.textContent = data.offer.rooms;
    // dialogLodgeGuestsElement.textContent = data.offer.guests;
    // dialogLodgeCheckInElement.textContent = data.offer.checkin;
    // dialogLodgeCheckOutElement.textContent = data.offer.checkout;

    data.offer.features.forEach(function (element) {

    });

    data.offer.photos.forEach(function (element) {
      var image = new Image(52, 42);
      image.src = element;
      dialogLodgePhotosElement.appendChild(image);
    });

    cb = utils.isFunction(callback) ? callback : null;

    toggleVisibility(true);

    document.addEventListener('keydown', dialogKeydownHandler);
    dialogCloseElement.addEventListener('click', dialogCloseClickHandler);
  };
})();
