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

  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;
  var DATA_URL = 'https://intensive-javascript-server-pedmyactpq.now.sh/keksobooking/data';
  var FILTER_ANY = 'any';
  var FILTER_PRICE_LOW = 10000;
  var FILTER_PRICE_MIDDLE = 50000;

  var pinMapElement = document.querySelector('.tokyo__pin-map');
  var selectedPinElement = pinMapElement.querySelector('.pin--active');
  var tokyoElement = document.querySelector('.tokyo');
  var tokyoPinMapElement = tokyoElement.querySelector('.tokyo__pin-map');
  var tokyoFiltersForm = tokyoElement.querySelector('.tokyo__filters');
  var tokyoFilterTypeElement = tokyoFiltersForm.querySelector('#housing_type');
  var tokyoFilterPriceElement = tokyoFiltersForm.querySelector('#housing_price');
  var tokyoFilterRoomsElement = tokyoFiltersForm.querySelector('#housing_room-number');
  var tokyoFilterGuestsElement = tokyoFiltersForm.querySelector('#housing_guests-number');
  // var tokyoFilterFeatureElements = tokyoFiltersForm.querySelectorAll('input[type="checkbox"]');
  var similarApartments = [];

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
      showCard(pinData, cb);
    };
  }

  function clearTokyoMap() {
    var pinElements = tokyoPinMapElement.querySelectorAll('.pin:not(.pin__main)');
    Array.prototype.forEach.call(pinElements, function (pinElement) {
      tokyoPinMapElement.removeChild(pinElement);
    });
    showCard(false);
  }

  function checkApartmentType(apartment) {
    return tokyoFilterTypeElement.value === FILTER_ANY || tokyoFilterTypeElement.value === apartment.offer.type;
  }

  function checkApartmentPrice(apartment) {
    switch (tokyoFilterPriceElement.value) {
      case ('low'):
        return apartment.offer.price < FILTER_PRICE_LOW;
      case ('middle'):
        return apartment.offer.price >= FILTER_PRICE_LOW && apartment.offer.price <= FILTER_PRICE_MIDDLE;
      case ('hight'):
        return apartment.offer.price > FILTER_PRICE_MIDDLE;
      default:
        return false;
    }
  }

  function checkApartmentRooms(apartment) {
    return tokyoFilterRoomsElement.value === FILTER_ANY || tokyoFilterRoomsElement.value === apartment.offer.rooms.toString();
  }

  function checkApartmentGuests(apartment) {
    return tokyoFilterGuestsElement.value === FILTER_ANY || tokyoFilterGuestsElement.value === apartment.offer.guests.toString();
  }

  // function checkApartmentFeatures(apartment) {
  //   var apartmentFeatures = apartment.offset.features;
  //   var featureCheckedElements = Array.prototype.filter.call(tokyoFilterFeatureElements, function (featureElement) {
  //     return featureElement.checked;
  //   }).map(function (featureElement) {
  //     return featureElement.value;
  //   });
  //
  //   var flag = false;
  //
  //   featureCheckedElements.forEach(function (featureElement) {
  //     apartmentFeatures.forEach(function (apartmentFeature) {
  //       flag = featureElement === apartmentFeature;
  //     });
  //   });
  //
  //   return flag;
  // }

  function renderPins(apartmentsToRender) {
    var fragment = document.createDocumentFragment();
    apartmentsToRender.forEach(function (apartment) {
      var newPinElement = renderPin(apartment);
      setPinPosition(newPinElement, apartment);
      newPinElement.addEventListener('click', getPinHandler(apartment));
      newPinElement.addEventListener('keydown', getPinHandler(apartment));
      fragment.appendChild(newPinElement);
    });
    pinMapElement.appendChild(fragment);
  }

  load(DATA_URL, function (data) {
    similarApartments = data;
    var similarApartmentsToRender = similarApartments.slice(0, 3);

    renderPins(similarApartmentsToRender);
  });

  tokyoFiltersForm.addEventListener('change', function () {
    clearTokyoMap();

    var similarApartmentsToRender = similarApartments.filter(function (apartment) {
      return checkApartmentType(apartment) &&
             checkApartmentPrice(apartment) &&
             checkApartmentRooms(apartment) &&
             checkApartmentGuests(apartment);
    });

    renderPins(similarApartmentsToRender);
  });

})();
