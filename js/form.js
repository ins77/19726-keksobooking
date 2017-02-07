'use strict';

var keyNames = {
  ENTER: 13,
  ESC: 27
};

var classes = {
  DIALOG_INVISIBLE: 'dialog--invisible',
  PIN: '.pin',
  PIN_ACTIVE: 'pin--active',
};

var errors = {
  GREATER_THAN: 'Value length must be greater than or equals to 30'
};

var numberOfRooms = {
  ONE: '1',
  TWO: '2',
  ONE_HUNDRED: '100'
};

var numberOfGuests = {
  NONE: '0',
  THREE: '3'
};

var typeToMinPriceMap = {
  'flat': 1000,
  'shack': 0,
  'palace': 10000
};

var TITLE_MIN_VALUE = 30;

var pinMapElement = document.querySelector('.tokyo__pin-map');
var pinBtnElements = pinMapElement.querySelectorAll('.pin [role="button"]');
var selectedPinElement = pinMapElement.querySelector('.pin--active');
var dialogElement = document.querySelector('.dialog');
var dialogCloseElement = dialogElement.querySelector('.dialog__close');
var dialogCloseBtnElement = dialogCloseElement.querySelector('[role="button"]');
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

function setInputPriceMin() {
  var minPrice = typeToMinPriceMap[selectTypeElement.value];
  inputPriceElement.min = minPrice;
}

function setSelectCapacityValue() {
  if (selectRoomsElement.value === numberOfRooms.ONE) {
    selectCapacityElement.value = numberOfGuests.NONE;
  } else {
    selectCapacityElement.value = numberOfGuests.THREE;
  }
}

function setSelectRoomsValue() {
  if (selectCapacityElement.value === numberOfGuests.NONE) {
    selectRoomsElement.value = numberOfRooms.ONE;
  } else {
    selectRoomsElement.value = numberOfRooms.TWO;
  }
}

function setDialogVisibility() {
  for (var i = 0; i < pinBtnElements.length; i++) {
    var pinElement = pinBtnElements[i].closest(classes.PIN);
    if (pinElement.classList.contains(classes.PIN_ACTIVE)) {
      dialogElement.classList.remove(classes.DIALOG_INVISIBLE);
      return;
    }
  }

  dialogElement.classList.add(classes.DIALOG_INVISIBLE);
}

function setPinAriaPressed() {
  pinBtnElements.forEach(function (el) {
    var isPinActive = el.closest(classes.PIN).classList.contains(classes.PIN_ACTIVE);
    el.setAttribute('aria-pressed', isPinActive);
  });
}

function setDialogCloseAriaHidden() {
  var isDialogVisible = dialogElement.classList.contains(classes.DIALOG_INVISIBLE);
  dialogCloseBtnElement.setAttribute('aria-hidden', isDialogVisible);
}

// выставляем активный пин, убираем активность с других пинов
function setActivePin(node) {
  if (selectedPinElement === node) {
    return;
  }

  if (selectedPinElement) {
    selectedPinElement.classList.remove(classes.PIN_ACTIVE);
  }

  selectedPinElement = node;
  selectedPinElement.classList.add(classes.PIN_ACTIVE);
  setPinAriaPressed();
}

function resetPinActivity() {
  selectedPinElement.classList.remove(classes.PIN_ACTIVE);
  dialogElement.classList.add(classes.DIALOG_INVISIBLE);
  dialogCloseBtnElement.setAttribute('aria-hidden', true);
}

function isActivateEvent(e) {
  return e.keyCode === keyNames.ENTER || e.type === 'click';
}

function changePinMapHandler(e) {
  if (!isActivateEvent(e)) {
    return;
  }
  var target = e.target;
  var closestPinElement = target.closest(classes.PIN);

  if (!closestPinElement) {
    return;
  }

  setActivePin(closestPinElement);
  dialogElement.classList.remove(classes.DIALOG_INVISIBLE);
  dialogCloseBtnElement.setAttribute('aria-hidden', false);
}

function closeDialogHandler(e) {
  e.preventDefault();
  resetPinActivity();
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

function resetPinActivityHandler(e) {
  if (!selectedPinElement) {
    return;
  }

  if (e.keyCode === keyNames.ESC) {
    resetPinActivity();
  }

  // сбрасываем selectedPinElement для того, чтобы после нажатия esc не срабатывало условие (selectedPinElement === node) в setActivePin()
  selectedPinElement = pinMapElement.querySelector('.pin--active');
}

setInitiaFormValues(config);
setSelectCapacityValue();
setSelectRoomsValue();
setInputPriceMin();
setDialogVisibility();
setPinAriaPressed();
setDialogCloseAriaHidden();

document.addEventListener('keydown', resetPinActivityHandler);
pinMapElement.addEventListener('click', changePinMapHandler);
pinMapElement.addEventListener('keydown', changePinMapHandler);
dialogCloseElement.addEventListener('click', closeDialogHandler);
inputTitleElement.addEventListener('input', setInputTitleErrorHandler);
selectTimeInElement.addEventListener('input', changeTimeInHandler);
selectTimeOutElement.addEventListener('input', changeTimeOutHandler);
selectTypeElement.addEventListener('input', changeSelectTypeHandler);
selectRoomsElement.addEventListener('input', changeSelectRoomsHandler);
selectCapacityElement.addEventListener('input', changeSelectCapacityHandler);
