'use strict';

window.load = (function () {

  var errorHandler = function (err) {
    return err;
  };

  /**
   * Синхронизирует поля firstField и secondField. Выставляет соответствующее значение secondField из массива secondFieldValues, в зависимости от позиции значения firstField в массиве firstFieldValues
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
      if (event.target.status >= 400) {
        errorHandler('Failed to load data. Server returned status: ' + event.target.status);
      } else if (event.target.status >= 200) {
        onLoad(event.target.response);
      }
    });
    xhr.addEventListener('error', errorHandler);
    xhr.addEventListener('timeout', errorHandler);

    xhr.timeout = 10000;
    xhr.responseType = 'json';

    xhr.open('GET', url);
    xhr.send();
  };
})();
