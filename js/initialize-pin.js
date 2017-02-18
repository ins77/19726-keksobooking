'use strict';

/**
 * Отрисовка пинов, диалога
 */
(function () {
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
  var isDialogShowsAfterKeydown = false;

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
   * Сбрасывает активный пин, скрывает диалог
   */
  function removeSelectedPin() {
    var pinBtn = selectedPinElement.querySelector('[role="button"]');

    selectedPinElement.classList.remove(ClassNames.PIN_ACTIVE);
    pinBtn.focus();
    pinBtn.setAttribute('aria-pressed', false);
    selectedPinElement = null;

    isDialogShowsAfterKeydown = false;
  }

  /**
   * Переключает активный пин, скрывает диалог
   *
   * @param {KeyboardEvent} event
   */
  function toggleSelectedPin(event) {
    if (!utils.isActivateEvent(event)) {
      return;
    }
    var target = event.target;
    var closestPinElement = utils.getClosestElement(target, '.' + ClassNames.PIN);

    if (!closestPinElement) {
      return;
    }

    if (dialogElement.classList.contains(ClassNames.DIALOG_INVISIBLE)) {
      window.showCard();
    }

    setActivePin(closestPinElement);
  }

  /**
   * Обработчик клавиатурных событий для pinMap
   *
   * @param {KeyboardEvent} event
   */
  function pinMapKeydownHandler(event) {
    isDialogShowsAfterKeydown = true;
    toggleSelectedPin(event);

    if (isDialogShowsAfterKeydown) {
      window.showCard(removeSelectedPin);
    }
  }

  /**
   * Обработчик клика для pinMap
   *
   * @param {KeyboardEvent} event
   */
  function pinMapClickHandler(event) {
    toggleSelectedPin(event);
  }


  initPinAriaPressedAttr();

  pinMapElement.addEventListener('click', pinMapClickHandler);
  pinMapElement.addEventListener('keydown', pinMapKeydownHandler);
})();
