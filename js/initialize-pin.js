'use strict';

/**
 * Отрисовка пинов, диалога
 */
(function () {
  var utils = window.utils;
  var showCard = window.showCard;

  var ClassNames = {
    PIN: 'pin',
    PIN_ACTIVE: 'pin--active',
  };

  var pinMapElement = document.querySelector('.tokyo__pin-map');
  var pinBtnElements = pinMapElement.querySelectorAll('.pin [role="button"]');
  var selectedPinElement = pinMapElement.querySelector('.pin--active');

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
    selectedPinElement.classList.remove(ClassNames.PIN_ACTIVE);
    selectedPinElement.querySelector('[role="button"]').setAttribute('aria-pressed', false);
    selectedPinElement = null;
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
    var cb = function () {
      removeSelectedPin();
    };

    if (!closestPinElement) {
      return;
    }

    if (event.type === 'keydown') {
      cb = function () {
        selectedPinElement.querySelector('[role="button"]').focus();
        removeSelectedPin();
      };
    }

    showCard(cb);
    setActivePin(closestPinElement);
  }


  initPinAriaPressedAttr();

  pinMapElement.addEventListener('click', pinMapHandler);
  pinMapElement.addEventListener('keydown', pinMapHandler);
})();
