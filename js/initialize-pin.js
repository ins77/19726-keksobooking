'use strict';

/**
 * Отрисовка пинов, диалога
 */
(function () {

  var utils = window.utils;
  var showCard = window.showCard;
  var load = window.load;
  var renderPin = window.renderPin;
  var filterPins = window.filterPins;

  var ClassNames = {
    PIN: 'pin',
    PIN_ACTIVE: 'pin--active',
  };

  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;
  var DATA_URL = 'https://intensive-javascript-server-pedmyactpq.now.sh/keksobooking/data';

  var pinMapElement = document.querySelector('.tokyo__pin-map');
  var selectedPinElement = pinMapElement.querySelector('.pin--active');
  var tokyoFiltersForm = document.querySelector('.tokyo__filters');
  var similarApartments = [];
  var pinElements = [];

  /**
   * Выделяет / снимает выделение с пина (pinElement), в зависимости от значения flag
   *
   * @param {Element} pinElement
   * @param {boolean} flag
   */
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
   * Устанавливает позицию пина
   *
   * @param {Element} pin
   * @param {Object} pinData
   */
  function setPinPosition(pin, pinData) {
    pin.style.left = pinData.location.x - PIN_WIDTH / 2 + 'px';
    pin.style.top = pinData.location.y - PIN_HEIGHT + 'px';
  }

  function getPinHandler(pinData) {
    /**
     * Обработчик для пина
     *
     * @param {Event} event
     */
    return function (event) {
      if (!utils.checkActivateEvent(event)) {
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
      showCard(pinData, cb);
    };
  }

  /**
   * Удаляет с карты пины и диалог, если он есть
   */
  function clearTokyoMap() {
    pinElements.forEach(function (pinElement) {
      pinElement.parentElement.removeChild(pinElement);
    });
    pinElements.length = 0;
    showCard(null, null, false);
  }

  /**
   * Добавляет в разметку пины в соответствии с данными из массива pinsData
   *
   * @param {Array} pinsData
   */
  function renderPins(pinsData) {
    var fragment = document.createDocumentFragment();

    pinsData.forEach(function (pinData) {
      var newPinElement = renderPin(pinData);

      pinElements.push(newPinElement);

      setPinPosition(newPinElement, pinData);

      newPinElement.addEventListener('click', getPinHandler(pinData));
      newPinElement.addEventListener('keydown', getPinHandler(pinData));

      fragment.appendChild(newPinElement);
    });

    pinMapElement.appendChild(fragment);
  }

  load(DATA_URL, function (data) {
    similarApartments = data;
    var pinsData = similarApartments.slice(0, 3);

    renderPins(pinsData);
  });

  tokyoFiltersForm.addEventListener('change', function () {
    clearTokyoMap();

    var filteredPins = filterPins(similarApartments);

    renderPins(filteredPins);
  });

})();
