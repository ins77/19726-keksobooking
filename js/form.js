'use strict';

var classes = {
  INVISIBLE: 'invisible',
  PIN_ACTIVE: 'pin--active',
};

var errors = {
  GREATER_THAN: 'Value length must be greater than or equals to 30'
};

var pinMap = document.querySelector('.tokyo__pin-map');
var selectedPin = pinMap.querySelector('.pin--active');
var dialog = document.querySelector('.dialog');
var dialogClose = dialog.querySelector('.dialog__close');

var formNotice = document.querySelector('.notice__form');

var inputTitle = formNotice.querySelector('#title');
var inputAddress = formNotice.querySelector('#address');
var inputPrice = formNotice.querySelector('#price');

var selectTime = formNotice.querySelector('#time');
var selectTimeout = formNotice.querySelector('#timeout');
var selectType = formNotice.querySelector('#type');

// устанавливаем значение поля inputPrice, в зависимости от значения поля selectType
function setInputPriceMin() {
  switch (selectType.value) {
    case ('flat'):
      inputPrice.min = 1000;
      break;
    case ('shack'):
      inputPrice.min = 0;
      break;
    case ('palace'):
      inputPrice.min = 10000;
      break;
  }
}

function setInitialState() {
  dialog.classList.add(classes.INVISIBLE);
  inputTitle.required = true;
  inputTitle.maxLength = 100;
  inputAddress.required = true;
  inputPrice.required = true;
  inputPrice.max = 1000000;
  selectTimeout.value = selectTime.value;

  setInputPriceMin();
}

// выставляем активный пин, убираем активность с других пинов
function setActivePin(node) {
  if (selectedPin) {
    selectedPin.classList.remove(classes.PIN_ACTIVE);
  }
  selectedPin = node;
  selectedPin.classList.add(classes.PIN_ACTIVE);
}

function handlerPinMap(e) {
  var target = e.target;
  var closestPin = target.closest('.pin');

  if (!closestPin) {
    return;
  }

  dialog.classList.remove(classes.INVISIBLE);

  setActivePin(closestPin);
}

function handlerdialogClose(e) {
  e.preventDefault();
  dialog.classList.add(classes.INVISIBLE);
  selectedPin.classList.remove(classes.PIN_ACTIVE);
}

function handlerInputTitle() {
  inputTitle.setCustomValidity('');

  if (inputTitle.value.length < 30 && inputTitle.validity.valid) {
    inputTitle.setCustomValidity(errors.GREATER_THAN);
  }
}

function handlerSelectTime() {
  selectTimeout.value = selectTime.value;
}

function handlerSelectType() {
  setInputPriceMin();
}

setInitialState();

pinMap.addEventListener('click', handlerPinMap);
dialogClose.addEventListener('click', handlerdialogClose);
inputTitle.addEventListener('input', handlerInputTitle);
selectTime.addEventListener('input', handlerSelectTime);
selectType.addEventListener('input', handlerSelectType);
