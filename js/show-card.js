'use strict';

window.showCard = (function () {
  var utils = window.utils;

  var DIALOG_INVISIBLE = 'dialog--invisible';

  var tokyoElement = document.querySelector('.tokyo');
  var dialogTemplate = document.querySelector('#dialog-template');
  var dialogElement = dialogTemplate.content.querySelector('.dialog');
  var dialogClone = dialogElement.cloneNode(true);
  var dialogCloseElement = dialogClone.querySelector('.dialog__close');
  var offerTitleElement = dialogClone.querySelector('.lodge__title');
  var offerAddressElement = dialogClone.querySelector('.lodge__address');
  var offerPriceElement = dialogClone.querySelector('.lodge__price');
  var offerTypeElement = dialogClone.querySelector('.lodge__type');
  var offerRoomsAndGuestsElement = dialogClone.querySelector('.lodge__rooms-and-guests');
  var offerCheckinTimeElement = dialogClone.querySelector('.lodge__checkin-time');
  var offerDescriptionElement = dialogClone.querySelector('.lodge__description');
  var offerPhotosElement = dialogClone.querySelector('.lodge__photos');
  var offerFeaturesElement = dialogClone.querySelector('.lodge__features');
  var cb;

  function fillDialog(data) {
    offerPhotosElement.innerHTML = '';
    offerFeaturesElement.innerHTML = '';
    offerTitleElement.innerText = data.offer.title;
    offerAddressElement.innerText = data.offer.address;
    offerPriceElement.innerText = data.offer.price + ' ₽/ночь';
    offerTypeElement.innerText = data.offer.type;
    offerRoomsAndGuestsElement.innerText = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    offerCheckinTimeElement.innerText = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    offerDescriptionElement.innerText = data.offer.description;

    data.offer.features.forEach(function (item) {
      var featureElement = document.createElement('span');

      featureElement.classList.add('feature__image');
      featureElement.classList.add('feature__image--' + item);
      offerFeaturesElement.appendChild(featureElement);
    });

    data.offer.photos.forEach(function (item) {
      var image = new Image(52, 42);
      image.src = item;
      offerPhotosElement.appendChild(image);
    });

    tokyoElement.appendChild(dialogClone);
  }

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
    dialogClone.classList.toggle(DIALOG_INVISIBLE, !flag);
    dialogClone.setAttribute('aria-hidden', !flag);
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

    fillDialog(data);
    toggleVisibility(true);

    document.addEventListener('keydown', dialogKeydownHandler);
    dialogCloseElement.addEventListener('click', dialogCloseClickHandler);
  };
})();
