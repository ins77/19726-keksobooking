'use strict';

window.renderPin = (function () {
  var pinTemplate = document.querySelector('#pin-template');
  var pinElement = pinTemplate.content.querySelector('.pin');

  return function (data, index) {
    var pinClone = pinElement.cloneNode(true);
    var pinAvatar = pinClone.querySelector('img');

    pinClone.setAttribute('data-key', index);
    pinAvatar.src = data.author.avatar;
    pinClone.style.left = data.location.x + 'px';
    pinClone.style.top = data.location.y + 'px';

    return pinClone;
  };
})();
