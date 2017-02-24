'use strict';

window.filterPins = (function () {

  var FilterPrice = {
    LOW: 10000,
    MIDDLE: 50000
  };

  var FilterPriceNames = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGHT: 'hight'
  };

  var FILTER_ANY = 'any';

  var tokyoFiltersForm = document.querySelector('.tokyo__filters');
  var tokyoFilterTypeElement = tokyoFiltersForm.querySelector('#housing_type');
  var tokyoFilterPriceElement = tokyoFiltersForm.querySelector('#housing_price');
  var tokyoFilterRoomsElement = tokyoFiltersForm.querySelector('#housing_room-number');
  var tokyoFilterGuestsElement = tokyoFiltersForm.querySelector('#housing_guests-number');
  var tokyoFilterFeatureElements = tokyoFiltersForm.querySelectorAll('input[type="checkbox"]');

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
      case (FilterPriceNames.LOW):
        return price < FilterPrice.LOW;
      case (FilterPriceNames.MIDDLE):
        return price >= FilterPrice.LOW && price <= FilterPrice.MIDDLE;
      case (FilterPriceNames.HIGHT):
        return price > FilterPrice.MIDDLE;
    }
    return false;
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
   * Сверяет количество гостей в апартаментах между значением фильтра и значением guests
   *
   * @param {number} guests
   * @return {boolean}
   */
  function checkApartmentGuests(guests) {
    var guestsElementValue = tokyoFilterGuestsElement.value;
    return guestsElementValue === FILTER_ANY || guestsElementValue === guests.toString();
  }

  /**
   * Сверяет выбранные в фильтре дополнительные с массивом features
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

    var compareCheckedAndFeatures = featureCheckedElements.every(function (apartmentFeature) {
      return features.indexOf(apartmentFeature) >= 0;
    });

    return compareCheckedAndFeatures;
  }


  /**
   * Возвращает фильтрованный массив
   *
   * @param {Array} pinsData
   * @return {Array}
   */
  return function (pinsData) {

    return pinsData.filter(function (apartment) {
      return checkApartmentType(apartment.offer.type) &&
             checkApartmentPrice(apartment.offer.price) &&
             checkApartmentRooms(apartment.offer.rooms) &&
             checkApartmentGuests(apartment.offer.guests) &&
             checkApartmentFeatures(apartment.offer.features);
    });

  };

})();
