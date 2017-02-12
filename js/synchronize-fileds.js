'use strict';

/**
 * Синхронизирует поля syncField и syncFieldAnother между собой, выставляя соотвтествующее значение из массивов syncFieldValues и syncFieldAnotherValues
 *
 * @param {Element} syncField
 * @param {Element} syncFieldAnother
 * @param {Array} syncFieldValues
 * @param {Array} syncFieldAnotherValues
 * @param {string} syncFieldProp
 */
window.synchronizeFields = function (syncField, syncFieldAnother, syncFieldValues, syncFieldAnotherValues, syncFieldProp) {
  function syncFieldHandler() {
    syncFieldAnother[syncFieldProp] = syncFieldAnotherValues[syncFieldValues.indexOf(syncField.value)];
  }

  function syncFieldAnotherHandler() {
    syncField[syncFieldProp] = syncFieldValues[syncFieldAnotherValues.indexOf(syncFieldAnother.value)];
  }

  syncFieldAnother[syncFieldProp] = syncFieldAnotherValues[syncFieldValues.indexOf(syncField.value)];

  syncField.addEventListener('input', syncFieldHandler);

  if (syncFieldProp === 'value') {
    syncField[syncFieldProp] = syncFieldValues[syncFieldAnotherValues.indexOf(syncFieldAnother.value)];

    syncFieldAnother.addEventListener('input', syncFieldAnotherHandler);
  }
};
