'use strict';

window.synchronizeFields = (function () {
  /**
   * Синхронизирует поля firstField и secondField. Выставляет соответствующее значение secondField из массива secondFieldValues, в зависимости от позиции значения firstField в массиве firstFieldValues
   *
   * @param {Element} firstField
   * @param {Element} secondField
   * @param {Array} firstFieldValues
   * @param {Array} secondFieldValues
   * @param {string} secondFieldProp
   */
  return function (firstField, secondField, firstFieldValues, secondFieldValues, secondFieldProp) {
    firstField.addEventListener('input', function () {
      secondField[secondFieldProp] = secondFieldValues[firstFieldValues.indexOf(firstField.value)];
    });
  }
})();
