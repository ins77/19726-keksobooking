'use strict';

window.synchronizeFields = (function () {

  /**
   * Синхронизирует поля firstField и secondField. Выставляет соответствующее значение secondField из массива secondFieldValues, в зависимости от позиции значения firstField в массиве firstFieldValues
   *
   * @param {Element} firstField
   * @param {Element} secondField
   * @param {Array} firstFieldValues
   * @param {Array} secondFieldValues
   * @param {Function} syncValues
   */
  return function (firstField, secondField, firstFieldValues, secondFieldValues, syncValues) {
    firstField.addEventListener('change', function () {
      var secondFieldValue = secondFieldValues[firstFieldValues.indexOf(firstField.value)];
      syncValues(secondField, secondFieldValue);
    });
  };

})();
