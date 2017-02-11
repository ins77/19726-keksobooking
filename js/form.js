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
 * Устанавливает атрибуты aria-pressed
 */
function initPinAriaPressedAttr() {
  Array.prototype.forEach.call(pinBtnElements, function (el) {
    el.setAttribute('aria-pressed', false);
  });
}

/**
 * Устанавливает значение поля Цена за ночь
 */
function setInputPriceMin() {
  var minPrice = typeToMinPriceMap[selectTypeElement.value];
  inputPriceElement.min = minPrice;
}

/**
 * Устанавливает значение поля Количество мест
 */
function setSelectCapacityValue() {
  if (selectRoomsElement.value === numberOfRooms.ONE) {
    selectCapacityElement.value = numberOfGuests.NONE;
  } else {
    selectCapacityElement.value = numberOfGuests.THREE;
  }
}

/**
 * Устанавливает значение поля Количество комнат
 */
function setSelectRoomsValue() {
  if (selectCapacityElement.value === numberOfGuests.NONE) {
    selectRoomsElement.value = numberOfRooms.ONE;
  } else {
    selectRoomsElement.value = numberOfRooms.TWO;
  }
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
    selectedPinElement.classList.remove(classes.PIN_ACTIVE);
    selectedPinElement.querySelector('[role="button"]').setAttribute('aria-pressed', false);
  }

  selectedPinElement = node;
  selectedPinElement.classList.add(classes.PIN_ACTIVE);
  selectedPinElement.querySelector('[role="button"]').setAttribute('aria-pressed', true);
}

/**
 * Устанавливает/убирает видимость диалога, устанавливает/удаляет обработчики событий
 *
 * @param {Boolean} flag
 */
function setDialogVisibility(flag) {
  dialogElement.classList.toggle(classes.DIALOG_INVISIBLE, flag);
  dialogElement.setAttribute('aria-hidden', flag);

  if (flag) {
    document.removeEventListener('keydown', dialogKeydownHandler);
    dialogCloseElement.removeEventListener('click', dialogCloseClickHandler);
  } else {
    dialogCloseElement.focus();
    document.addEventListener('keydown', dialogKeydownHandler);
    dialogCloseElement.addEventListener('click', dialogCloseClickHandler);
  }
}

/**
 * Сбрасывает активный пин, скрывает диалог
 */
function removeSelectedPin() {
  var pinBtn = selectedPinElement.querySelector('[role="button"]');

  selectedPinElement.classList.remove(classes.PIN_ACTIVE);
  pinBtn.focus();
  pinBtn.setAttribute('aria-pressed', false);
  selectedPinElement = null;

  setDialogVisibility(true);
}

/**
 * Проверяет нужная ли клавиша нажата
 *
 * @param {KeyboardEvent} event
 * @return {Boolean}
 */
function isActivateEvent(event) {
  return event.keyCode === keyCodes.ENTER || event.type === 'click';
}

/**
 * Обработчик событий для pinMap
 *
 * @param {KeyboardEvent} event
 */
function pinMapHandler(event) {
  if (!isActivateEvent(event)) {
    return;
  }
  var target = event.target;
  var closestPinElement = target.closest('.' + classes.PIN);

  if (!closestPinElement) {
    return;
  }

  if (dialogElement.classList.contains(classes.DIALOG_INVISIBLE)) {
    setDialogVisibility(false);
  }

  setActivePin(closestPinElement);
}

/**
 * Обработчик клика для dialogCloseElement
 *
 * @param {KeyboardEvent} event
 */
function dialogCloseClickHandler(event) {
  event.preventDefault();
  removeSelectedPin();
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

/**
 * Обработчик ввода для selectTimeOutElement
 */
function selectTimeOutInputHandler() {
  selectTimeInElement.value = selectTimeOutElement.value;
}

/**
 * Обработчик ввода для selectTimeInElement
 */
function selectTimeInInputHandler() {
  selectTimeOutElement.value = selectTimeInElement.value;
}

/**
 * Обработчик ввода для selectRoomsElement
 */
function selectRoomsInputHandler() {
  setSelectCapacityValue();
}

/**
 * Обработчик ввода для selectCapacityElement
 */
function selectCapacityInputHandler() {
  setSelectRoomsValue();
}

/**
 * Обработчик ввода для selectTypeElement
 */
function selectTypeInputHandler() {
  setInputPriceMin();
}

/**
 * Обработчик нажатия клавиши для document
 *
 * @param {KeyboardEvent} event
 */
function dialogKeydownHandler(event) {
  if (event.keyCode === keyCodes.ESC) {
    removeSelectedPin();
  }
}

initFormValues(config);
initPinAriaPressedAttr();
setSelectCapacityValue();
setSelectRoomsValue();
setInputPriceMin();

pinMapElement.addEventListener('click', pinMapHandler);
pinMapElement.addEventListener('keydown', pinMapHandler);
inputTitleElement.addEventListener('input', inputTitleInputHandler);
selectTimeInElement.addEventListener('input', selectTimeInInputHandler);
selectTimeOutElement.addEventListener('input', selectTimeOutInputHandler);
selectTypeElement.addEventListener('input', selectTypeInputHandler);
selectRoomsElement.addEventListener('input', selectRoomsInputHandler);
selectCapacityElement.addEventListener('input', selectCapacityInputHandler);
