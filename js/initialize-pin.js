'use strict';

/**
 * Отрисовка пинов, диалога
 */
(function () {
  var utils = window.utils;
  var showCard = window.showCard;
  var load = window.load;

  var ClassNames = {
    PIN: 'pin',
    PIN_ACTIVE: 'pin--active',
  };

  var DATA_URL = 'https://intensive-javascript-server-pedmyactpq.now.sh/keksobooking/data';

  var pinMapElement = document.querySelector('.tokyo__pin-map');
  var pinBtnElements = pinMapElement.querySelectorAll('.pin [role="button"]');
  var selectedPinElement = pinMapElement.querySelector('.pin--active');
  var similarApartments = [];
  var templateElement = document.querySelector('#pin-template');
  var elementToClone = templateElement.content.querySelector('.pin');

  /**
   * Устанавливает атрибуты aria-pressed
   */
  function initPinAriaPressedAttr() {
    Array.prototype.forEach.call(pinBtnElements, function (el) {
      el.setAttribute('aria-pressed', false);
    });
  }

  function selectPin(pinElement, flag) {
    pinElement.classList.toggle(ClassNames.PIN_ACTIVE, flag);
    pinElement.querySelector('[role="button"]').setAttribute('aria-pressed', flag);
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
      selectPin(selectedPinElement, false);
    }

    selectedPinElement = node;
    selectPin(selectedPinElement, true);
  }

  /**
   * Сбрасывает активный пин, скрывает диалог
   */
  function removeSelectedPin() {
    selectPin(selectedPinElement, false);
    selectedPinElement = null;
  }

  /**
   * Обработчик событий для pinMap
   *
   * @param {KeyboardEvent} event
   * @param {Array} data
   */
  function pinMapHandler(event) {
    if (!utils.isActivateEvent(event)) {
      return;
    }

    var target = event.target;
    var closestPinElement = utils.getClosestElement(target, '.' + ClassNames.PIN);
    var cb;

    if (!closestPinElement) {
      return;
    }

    if (event.type === 'click') {
      cb = removeSelectedPin;
    } else {
      cb = function () {
        selectedPinElement.querySelector('[role="button"]').focus();
        removeSelectedPin();
      };
    }

    setActivePin(closestPinElement);
    load(DATA_URL, function (data) {
      var imgPath = selectedPinElement.querySelector('img');

      for (var i = 0; i < data.length; i++) {
        if (data[i].author.avatar === imgPath.getAttribute('src')) {
          showCard(cb, data[i]);
          return;
        }
      }
    });
  }

  initPinAriaPressedAttr();

  function renderPins(data) {
    similarApartments = data;
    var similarApartmentsToRender = similarApartments.slice(0, 3);
    var newElement;

    similarApartmentsToRender.forEach(function (element) {
      newElement = elementToClone.cloneNode(true);
      var image = newElement.querySelector('img');
      image.src = element.author.avatar;
      newElement.style.left = element.location.x + 'px';
      newElement.style.top = element.location.y + 'px';
      pinMapElement.appendChild(newElement);
    });
  }

  load(DATA_URL, renderPins);

  pinMapElement.addEventListener('click', pinMapHandler);
  pinMapElement.addEventListener('keydown', pinMapHandler);
})();
