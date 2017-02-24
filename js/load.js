'use strict';

window.load = (function () {

  /**
   * Отправляет запрос по адресу url и если нет ошибок, выполняет функцию onLoad
   *
   * @param {string} url
   * @param {Function} onLoad
   */
  return function (url, onLoad) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function (event) {
      if (event.target.status >= 200) {
        onLoad(event.target.response);
      }
    });

    xhr.responseType = 'json';

    xhr.open('GET', url);
    xhr.send();
  };

})();
