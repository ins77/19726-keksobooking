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

  var pinMapElement = document.querySelector('.tokyo__pin-map');
  var selectedPinElement = pinMapElement.querySelector('.pin--active');
  var similarApartments = [];
  var apartmentItem;

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

  function setPinPosition(pin, apartment) {
    pin.style.left = apartment.location.x - PIN_WIDTH / 2 + 'px';
    pin.style.top = apartment.location.y - PIN_HEIGHT + 'px';
  }

  function newPinHandler(event) {
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
    showCard(apartmentItem, cb);
  }

  load(DATA_URL, function (data) {
    similarApartments = data;
    var similarApartmentsToRender = similarApartments.slice(0, 3);
    var fragment = document.createDocumentFragment();

    similarApartmentsToRender.forEach(function (apartment) {
      apartmentItem = apartment;
      var newPinElement = renderPin(apartment);

      setPinPosition(newPinElement, apartment);

      newPinElement.addEventListener('click', newPinHandler);
      newPinElement.addEventListener('keydown', newPinHandler);

      fragment.appendChild(newPinElement);
    });

    pinMapElement.appendChild(fragment);
  });
})();
