'use strict';

var errors = {
  GREATER_THAN: 'Value length must be greater than or equals to 30'
};

var TITLE_MIN_VALUE = 30;
var NUMBER_OF_ROOMS = ['1', '2', '100'];
var NUMBER_OF_GUESTS = ['0', '3', '3'];
var TIME_IN_VALUES = ['12', '13', '14'];
var TIME_OUT_VALUES = Array.prototype.slice.call(TIME_IN_VALUES);
var TYPE_OF_APARTAMENTS = ['flat', 'shack', 'palace'];
var APARTMENTS_PRICE_MIN = [1000, 0, 10000];

var formNoticeElement = document.querySelector('.notice__form');
var inputTitleElement = formNoticeElement.querySelector('#title');
var inputAddressElement = formNoticeElement.querySelector('#address');
var inputPriceElement = formNoticeElement.querySelector('#price');
var selectTimeInElement = formNoticeElement.querySelector('#time');
var selectTimeOutElement = formNoticeElement.querySelector('#timeout');
var selectTypeElement = formNoticeElement.querySelector('#type');
var selectRoomsElement = formNoticeElement.querySelector('#room_number');
var selectCapacityElement = formNoticeElement.querySelector('#capacity');

var config = [
  {
    element: inputTitleElement,
    attr: {
      required: true,
      maxLength: 100
    }
  },
  {
    element: inputAddressElement,
    attr: {
      required: true
    }
  },
  {
    element: inputPriceElement,
    attr: {
      required: true,
      max: 1000000,
      min: 1000
    }
  },
  {
    element: selectTimeOutElement,
    attr: {
      value: selectTimeInElement.value
    }
  }
];

/**
 * Устанавливает начальные значения полей формы
 *
 * @param {Array} formConfig
 */
function initFormValues(formConfig) {
  var formElement;
  var formElementAttr;
  for (var i = 0; i < formConfig.length; i++) {
    formElement = formConfig[i].element;
    formElementAttr = formConfig[i].attr;
    for (var attr in formElementAttr) {
      if (formElementAttr.hasOwnProperty(attr)) {
        formElement[attr] = formElementAttr[attr];
      }
    }
  }
}

/**
 * Обработчик ввода для inputTitleElement
 */
function inputTitleInputHandler() {
  inputTitleElement.setCustomValidity('');

  if (inputTitleElement.value.length < TITLE_MIN_VALUE && inputTitleElement.validity.valid) {
    inputTitleElement.setCustomValidity(errors.GREATER_THAN);
  }
}

initFormValues(config);

inputTitleElement.addEventListener('input', inputTitleInputHandler);

window.initializePins();
window.synchronizeFields(selectRoomsElement, selectCapacityElement, NUMBER_OF_ROOMS, NUMBER_OF_GUESTS, 'value');
window.synchronizeFields(selectCapacityElement, selectRoomsElement, NUMBER_OF_GUESTS, NUMBER_OF_ROOMS, 'value');
window.synchronizeFields(selectTimeInElement, selectTimeOutElement, TIME_IN_VALUES, TIME_OUT_VALUES, 'value');
window.synchronizeFields(selectTimeOutElement, selectTimeInElement, TIME_OUT_VALUES, TIME_IN_VALUES, 'value');
window.synchronizeFields(selectTypeElement, inputPriceElement, TYPE_OF_APARTAMENTS, APARTMENTS_PRICE_MIN, 'min');
