'use strict';

window.load = (function () {

  /**
   * Синхронизирует поля firstField и secondField. Выставляет соответствующее значение secondField из массива secondFieldValues, в зависимости от позиции значения firstField в массиве firstFieldValues
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
