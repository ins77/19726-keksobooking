'use strict';

/**
 * Отрисовка пинов, диалога
 */
(function () {
  var utils = window.utils;
  var showCard = window.showCard;
  var load = window.load;
  var renderPin = window.renderPin;

  var ClassNames = {
    PIN: 'pin',
    PIN_ACTIVE: 'pin--active',
  };

  var FilterPrice = {
    LOW: 10000,
    MIDDLE: 50000
  };

  var FilterPriceValue = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGHT: 'hight'
  };

  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;
  var DATA_URL = 'https://intensive-javascript-server-pedmyactpq.now.sh/keksobooking/data';
  var FILTER_ANY = 'any';

  var pinMapElement = document.querySelector('.tokyo__pin-map');
  var selectedPinElement = pinMapElement.querySelector('.pin--active');
  var tokyoElement = document.querySelector('.tokyo');
  var tokyoFiltersForm = tokyoElement.querySelector('.tokyo__filters');
  var tokyoFilterTypeElement = tokyoFiltersForm.querySelector('#housing_type');
  var tokyoFilterPriceElement = tokyoFiltersForm.querySelector('#housing_price');
  var tokyoFilterRoomsElement = tokyoFiltersForm.querySelector('#housing_room-number');
  var tokyoFilterGuestsElement = tokyoFiltersForm.querySelector('#housing_guests-number');
  var tokyoFilterFeatureElements = tokyoFiltersForm.querySelectorAll('input[type="checkbox"]');
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
      showCard(true, pinData, cb);
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
    showCard(false, null, null);
  }

  /**
   * Сверяет тип апартаментов между значением фильтра и значением type
   *
   * @param {string} type
   * @return {boolean}
   */
  function checkApartmentType(type) {
    var typeElementValue = tokyoFilterTypeElement.value;
    return typeElementValue === FILTER_ANY || typeElementValue === type;
  }

  /**
   * Сверяет цену апартаментов между значением фильтра и значением price
   *
   * @param {string} price
   * @return {boolean}
   */
  function checkApartmentPrice(price) {
    switch (tokyoFilterPriceElement.value) {
      case (FilterPriceValue.LOW):
        return price < FilterPrice.LOW;
      case (FilterPriceValue.MIDDLE):
        return price >= FilterPrice.LOW && price <= FilterPrice.MIDDLE;
      case (FilterPriceValue.HIGHT):
        return price > FilterPrice.MIDDLE;
      default:
        return false;
    }
  }

  /**
   * Сверяет количество комнат в апартаментах между значением фильтра и значением rooms
   *
   * @param {number} rooms
   * @return {boolean}
   */
  function checkApartmentRooms(rooms) {
    var roomsElementValue = tokyoFilterRoomsElement.value;
    return roomsElementValue === FILTER_ANY || roomsElementValue === rooms.toString();
  }

  /**
   * Сверяет количество комнат в апартаментах между значением фильтра и значением guests
   *
   * @param {number} guests
   * @return {boolean}
   */
  function checkApartmentGuests(guests) {
    var guestsElementValue = tokyoFilterGuestsElement.value;
    return guestsElementValue === FILTER_ANY || guestsElementValue === guests.toString();
  }

  /**
   * Сверяет выбранные в фильтре особенности апартаментов с массивом features
   *
   * @param {Array} features
   * @return {boolean}
   */
  function checkApartmentFeatures(features) {
    var featureCheckedElements = Array.prototype.filter.call(tokyoFilterFeatureElements, function (featureElement) {
      return featureElement.checked;
    }).map(function (featureElement) {
      return featureElement.value;
    });

    var mismatchFeatures = featureCheckedElements.filter(function (featureElement) {
      return features.indexOf(featureElement) < 0;
    });

    var isFeaturesMatch = features.some(function (apartmentFeature) {
      return mismatchFeatures.indexOf(apartmentFeature) >= 0;
    });

    return mismatchFeatures.length === 0 || isFeaturesMatch;
  }

  /**
   * Добавляет в разметку пины из массива pinsToRender
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

    var pinsData = similarApartments.filter(function (apartment) {
      return checkApartmentType(apartment.offer.type) &&
             checkApartmentPrice(apartment.offer.price) &&
             checkApartmentRooms(apartment.offer.rooms) &&
             checkApartmentGuests(apartment.offer.guests) &&
             checkApartmentFeatures(apartment.offer.features);
    });

    renderPins(pinsData);
  });

})();
