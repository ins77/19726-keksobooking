'use strict';

/**
 * Отрисовка пинов, диалога
 */
window.initializePins = (function () {
  var utils = window.utils;

  var ClassNames = {
    DIALOG_INVISIBLE: 'dialog--invisible',
    PIN: 'pin',
    PIN_ACTIVE: 'pin--active',
  };

  var pinMapElement = document.querySelector('.tokyo__pin-map');
  var pinBtnElements = pinMapElement.querySelectorAll('.pin [role="button"]');
  var selectedPinElement = pinMapElement.querySelector('.pin--active');
  var dialogElement = document.querySelector('.dialog');
  var dialogCloseElement = dialogElement.querySelector('.dialog__close');


  return function () {
    /**
     * Устанавливает атрибуты aria-pressed
     */
    function initPinAriaPressedAttr() {
      Array.prototype.forEach.call(pinBtnElements, function (el) {
        el.setAttribute('aria-pressed', false);
      });
    }

    /**
     * Устанавливает активный пин, убирает активность с других пинов
     *
     * @param {Element} node
     */
    function setActivePin(node) {
      if (selectedPinElement === node) {
        return;
      }

      if (selectedPinElement) {
        selectedPinElement.classList.remove(ClassNames.PIN_ACTIVE);
        selectedPinElement.querySelector('[role="button"]').setAttribute('aria-pressed', false);
      }

      selectedPinElement = node;
      selectedPinElement.classList.add(ClassNames.PIN_ACTIVE);
      selectedPinElement.querySelector('[role="button"]').setAttribute('aria-pressed', true);
    }

    /**
     * Устанавливает/убирает видимость диалога, устанавливает/удаляет обработчики событий
     *
     * @param {Boolean} flag
     */
    function setDialogVisibility(flag) {
      dialogElement.classList.toggle(ClassNames.DIALOG_INVISIBLE, flag);
      dialogElement.setAttribute('aria-hidden', flag);

      if (flag) {
        document.removeEventListener('keydown', dialogKeydownHandler);
        dialogCloseElement.removeEventListener('click', dialogCloseClickHandler);
      } else {
        dialogCloseElement.focus();
        document.addEventListener('keydown', dialogKeydownHandler);
        dialogCloseElement.addEventListener('click', dialogCloseClickHandler);
      }
    }

    /**
     * Сбрасывает активный пин, скрывает диалог
     */
    function removeSelectedPin() {
      var pinBtn = selectedPinElement.querySelector('[role="button"]');

      selectedPinElement.classList.remove(ClassNames.PIN_ACTIVE);
      pinBtn.focus();
      pinBtn.setAttribute('aria-pressed', false);
      selectedPinElement = null;

      setDialogVisibility(true);
    }

    /**
     * Обработчик событий для pinMap
     *
     * @param {KeyboardEvent} event
     */
    function pinMapHandler(event) {
      if (!utils.isActivateEvent(event)) {
        return;
      }
      var target = event.target;
      var closestPinElement = utils.getClosestElement(target, '.' + ClassNames.PIN);

      if (!closestPinElement) {
        return;
      }

      if (dialogElement.classList.contains(ClassNames.DIALOG_INVISIBLE)) {
        setDialogVisibility(false);
      }

      setActivePin(closestPinElement);
    }

    /**
     * Обработчик клика для dialogCloseElement
     *
     * @param {KeyboardEvent} event
     */
    function dialogCloseClickHandler(event) {
      event.preventDefault();
      removeSelectedPin();
    }

    /**
     * Обработчик нажатия клавиши для document
     *
     * @param {KeyboardEvent} event
     */
    function dialogKeydownHandler(event) {
      if (event.keyCode === utils.KeyCodes.ESC) {
        removeSelectedPin();
      }
    }

    initPinAriaPressedAttr();

    pinMapElement.addEventListener('click', pinMapHandler);
    pinMapElement.addEventListener('keydown', pinMapHandler);
  }

})();
