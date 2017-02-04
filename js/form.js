'use strict';

var classes = {
  DIALOG_INVISIBLE: 'dialog--invisible',
  PIN_ACTIVE: 'pin--active',
};

var errors = {
  GREATER_THAN: 'Value length must be greater than or equals to 30'
};

var TITLE_MIN_VALUE = 30;

var pinMapElement = document.querySelector('.tokyo__pin-map');
var selectedPinElement = pinMapElement.querySelector('.pin--active');
var dialogElement = document.querySelector('.dialog');
var dialogCloseElement = dialogElement.querySelector('.dialog__close');
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
      max: 1000000
    }
  },
  {
    element: selectTimeOutElement,
    attr: {
      value: selectTimeInElement.value
    }
  }
];

Element.prototype.closest = function (el) {
  var node = this;

  while (node) {
    if (node.matches(el)) {
      return node;
    } else {
      node = node.parentElement;
    }
  }

  return null;
};

// устанавливаем начальные значения полей формы
function setInitiaFormValues(formConfig) {
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

// устанавливаем значение поля inputPrice, в зависимости от значения поля selectType
function setInputPriceMin() {
  switch (selectTypeElement.value) {
    case ('flat'):
      inputPriceElement.min = 1000;
      break;
    case ('shack'):
      inputPriceElement.min = 0;
      break;
    case ('palace'):
      inputPriceElement.min = 10000;
      break;
  }
}

function setSelectCapacityValue() {
  if (selectRoomsElement.value === '1') {
    selectCapacityElement.value = '0';
  } else {
    selectCapacityElement.value = '3';
  }
}

function setSelectRoomsValue() {
  if (selectCapacityElement.value === '0') {
    selectRoomsElement.value = '1';
  } else {
    selectRoomsElement.value = '2';
  }
}

// выставляем активный пин, убираем активность с других пинов
function setActivePin(node) {
  if (selectedPinElement === node) {
    return;
  } else {
    if (selectedPinElement) {
      selectedPinElement.classList.remove(classes.PIN_ACTIVE);
    }
    selectedPinElement = node;
    selectedPinElement.classList.add(classes.PIN_ACTIVE);
  }
}

function changePinMapHandler(e) {
  var target = e.target;
  var closestPinElement = target.closest('.pin');

  if (!closestPinElement) {
    return;
  }

  if (!closestPinElement.classList.contains(classes.PIN_ACTIVE)) {
    setActivePin(closestPinElement);
  }

  dialogElement.classList.remove(classes.PIN_INVISIBLE);
}

function closeDialogHandler(e) {
  e.preventDefault();
  dialogElement.classList.add(classes.PIN_INVISIBLE);
  selectedPinElement.classList.remove(classes.PIN_ACTIVE);
}

function setInputTitleErrorHandler() {
  inputTitleElement.setCustomValidity('');

  if (inputTitleElement.value.length < TITLE_MIN_VALUE && inputTitleElement.validity.valid) {
    inputTitleElement.setCustomValidity(errors.GREATER_THAN);
  }
}

function changeTimeOutHandler() {
  selectTimeInElement.value = selectTimeOutElement.value;
}

function changeTimeInHandler() {
  selectTimeOutElement.value = selectTimeInElement.value;
}

function changeSelectRoomsHandler() {
  setSelectCapacityValue();
}

function changeSelectCapacityHandler() {
  setSelectRoomsValue();
}

function changeSelectTypeHandler() {
  setInputPriceMin();
}

setInitiaFormValues(config);
setSelectCapacityValue();
setSelectRoomsValue();
setInputPriceMin();

pinMapElement.addEventListener('click', changePinMapHandler);
dialogCloseElement.addEventListener('click', closeDialogHandler);
inputTitleElement.addEventListener('input', setInputTitleErrorHandler);
selectTimeInElement.addEventListener('input', changeTimeInHandler);
selectTimeOutElement.addEventListener('input', changeTimeOutHandler);
selectTypeElement.addEventListener('input', changeSelectTypeHandler);
selectRoomsElement.addEventListener('input', changeSelectRoomsHandler);
selectCapacityElement.addEventListener('input', changeSelectCapacityHandler);
