'use strict';

window.renderPin = (function () {
  var pinTemplate = document.querySelector('#pin-template');
  var pinElement = pinTemplate.content.querySelector('.pin');

  return function (data, index) {
    var pinClone = pinElement.cloneNode(true);
    var pinAvatar = pinClone.querySelector('img');

    pinAvatar.setAttribute('src', data.author.avatar);
    pinClone.setAttribute('data-key', index);
    pinClone.style.left = data.location.x + 'px';
    pinClone.style.top = data.location.y + 'px';

    return pinClone;
  };
})();
