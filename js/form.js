'use strict';

var keyCodes = {
  ENTER: 13,
  ESC: 27
};

var classes = {
  DIALOG_INVISIBLE: 'dialog--invisible',
  PIN: 'pin',
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

function initDialogVisibility() {
  if (selectedPinElement) {
    dialogElement.classList.remove(classes.DIALOG_INVISIBLE);
    dialogElement.setAttribute('aria-hidden', false);
  } else {
    dialogElement.classList.add(classes.DIALOG_INVISIBLE);
    dialogElement.setAttribute('aria-hidden', true);
  }
}

function initPinAriaPressedAttr() {
  pinBtnElements.forEach(function (el) {
    var isPinActive = el.closest('.' + classes.PIN).classList.contains(classes.PIN_ACTIVE);
    el.setAttribute('aria-pressed', isPinActive);
  });
}

function initDialogCloseAriaHiddenAttr() {
  var isDialogVisible = dialogElement.classList.contains(classes.DIALOG_INVISIBLE);
  dialogCloseBtnElement.setAttribute('aria-hidden', isDialogVisible);
  dialogElement.setAttribute('aria-hidden', isDialogVisible);
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

// выставляем активный пин, убираем активность с других пинов
function setActivePin(node) {
  if (selectedPinElement === node) {
    return;
  }

  if (selectedPinElement) {
    selectedPinElement.classList.remove(classes.PIN_ACTIVE);
    selectedPinElement.querySelector('[role="button"]').setAttribute('aria-pressed', false);
  }

  selectedPinElement = node;
  selectedPinElement.classList.add(classes.PIN_ACTIVE);
  selectedPinElement.querySelector('[role="button"]').setAttribute('aria-pressed', true);
}

function resetPinActivity() {
  selectedPinElement.classList.remove(classes.PIN_ACTIVE);
  dialogElement.classList.add(classes.DIALOG_INVISIBLE);
  selectedPinElement.querySelector('[role="button"]').setAttribute('aria-pressed', false);
  dialogCloseBtnElement.setAttribute('aria-hidden', true);
  dialogElement.setAttribute('aria-hidden', true);
}

function isActivateEvent(event) {
  return event.keyCode === keyCodes.ENTER || event.type === 'click';
}

function pinMapElementClickAndKeydownHandler(event) {
  if (!isActivateEvent(event)) {
    return;
  }
  var target = event.target;
  var closestPinElement = target.closest('.' + classes.PIN);

  if (!closestPinElement) {
    return;
  }

  if (dialogElement.classList.contains(classes.DIALOG_INVISIBLE)) {
    dialogElement.classList.remove(classes.DIALOG_INVISIBLE);
    dialogCloseBtnElement.setAttribute('aria-hidden', false);
    dialogElement.setAttribute('aria-hidden', false);
  }

  setActivePin(closestPinElement);
}

function dialogCloseElementClickHandler(event) {
  event.preventDefault();
  resetPinActivity();
}

function inputTitleElementInputHandler() {
  inputTitleElement.setCustomValidity('');

  if (inputTitleElement.value.length < TITLE_MIN_VALUE && inputTitleElement.validity.valid) {
    inputTitleElement.setCustomValidity(errors.GREATER_THAN);
  }
}

function selectTimeOutElementInputHandler() {
  selectTimeInElement.value = selectTimeOutElement.value;
}

function selectTimeInElementInputHandler() {
  selectTimeOutElement.value = selectTimeInElement.value;
}

function selectRoomsElementInputHandler() {
  setSelectCapacityValue();
}

function selectCapacityElementInputHandler() {
  setSelectRoomsValue();
}

function selectTypeElementInputHandler() {
  setInputPriceMin();
}

function documentKeydownHandler(event) {
  if (!selectedPinElement) {
    return;
  }

  if (!dialogElement.classList.contains(classes.DIALOG_INVISIBLE)) {
    if (event.keyCode === keyCodes.ESC) {
      resetPinActivity();
      // сбрасываем selectedPinElement для того, чтобы после нажатия esc не срабатывало условие (selectedPinElement === node) в setActivePin()
      selectedPinElement = pinMapElement.querySelector('.' + classes.PIN_ACTIVE);
    }
  }
}

initFormValues(config);
initDialogVisibility();
initPinAriaPressedAttr();
initDialogCloseAriaHiddenAttr();
setSelectCapacityValue();
setSelectRoomsValue();
setInputPriceMin();

document.addEventListener('keydown', documentKeydownHandler);
pinMapElement.addEventListener('click', pinMapElementClickAndKeydownHandler);
pinMapElement.addEventListener('keydown', pinMapElementClickAndKeydownHandler);
dialogCloseElement.addEventListener('click', dialogCloseElementClickHandler);
inputTitleElement.addEventListener('input', inputTitleElementInputHandler);
selectTimeInElement.addEventListener('input', selectTimeInElementInputHandler);
selectTimeOutElement.addEventListener('input', selectTimeOutElementInputHandler);
selectTypeElement.addEventListener('input', selectTypeElementInputHandler);
selectRoomsElement.addEventListener('input', selectRoomsElementInputHandler);
selectCapacityElement.addEventListener('input', selectCapacityElementInputHandler);
