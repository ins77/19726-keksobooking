'use strict';

window.renderPin = (function () {

  var pinTemplate = document.querySelector('#pin-template');
  var templateContent = 'content' in pinTemplate ? pinTemplate.content : pinTemplate;
  var pinElement = templateContent.querySelector('.pin');

  /**
   * Рендерит и возвращает пин, заполненный данными из объекта data
   *
   * @param {Object} data
   * @return {Element}
   */
  return function (data) {
    var pinClone = pinElement.cloneNode(true);
    var pinAvatar = pinClone.querySelector('img');

    pinAvatar.src = data.author.avatar;

    return pinClone;
  };

})();
