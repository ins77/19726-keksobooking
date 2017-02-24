'use strict';

window.load = (function () {

  var errorHandler = function (err) {
    return err;
  };

  var StatusCode = {
    ERROR_CLIENT_SIDE: 400,
    ERROR_SERVER_SIDE: 500,
    SUCCESS: 200
  };

  /**
   * Отправляет запрос по адресу url и если нет ошибок, выполняет функцию onLoad
   *
   * @param {string} url
   * @param {Function} onLoad
   * @param {Function} onError
   */
  return function (url, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    if (typeof onError === 'function') {
      errorHandler = onError;
    }

    xhr.addEventListener('load', function (event) {
      if (event.target.status >= StatusCode.ERROR_CLIENT_SIDE) {
        errorHandler('Ошибка загрузки данных на стороне клиента. Код ошибки: ' + event.target.status);
      } else if (event.target.status >= StatusCode.ERROR_SERVER_SIDE) {
        errorHandler('Ошибка на стороне сервера. Код ошибки ' + event.target.response);
      } else if (event.target.status >= StatusCode.SUCCESS) {
        onLoad(event.target.response);
      }
    });

    xhr.addEventListener('error', function (evt) {
      errorHandler('Ошибка');
    });

    xhr.responseType = 'json';

    xhr.open('GET', url);
    xhr.send();
  };

})();
