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

  load(DATA_URL, function (data) {
    similarApartments = data;
    var similarApartmentsToRender = similarApartments.slice(0, 3);
    var fragment = document.createDocumentFragment();

    similarApartmentsToRender.forEach(function (apartment) {
      var newPinElement = renderPin(apartment);

      newPinElement.style.left = apartment.location.x - PIN_WIDTH / 2 + 'px';
      newPinElement.style.top = apartment.location.y - PIN_HEIGHT + 'px';

      newPinElement.addEventListener('click', function (event) {
        var closestPinElement = utils.getClosestElement(event.target, '.' + ClassNames.PIN);

        setActivePin(closestPinElement);
        showCard(apartment, removeSelectedPin);
      });
      newPinElement.addEventListener('keydown', function (event) {
        if (event.keyCode !== window.utils.KeyCodes.ENTER) {
          return;
        }

        var closestPinElement = utils.getClosestElement(event.target, '.' + ClassNames.PIN);

        setActivePin(closestPinElement);
        showCard(apartment, function () {
          selectedPinElement.querySelector('[role="button"]').focus();
          removeSelectedPin();
        });
      });

      fragment.appendChild(newPinElement);
    });

    pinMapElement.appendChild(fragment);
  });
})();
