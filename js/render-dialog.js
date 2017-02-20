// 'use strict';
//
// window.renderDialog = (function () {
//
//   var dialogTemplate = document.querySelector('#dialog-template');
//
//   return function (data) {
//     var dialogElement = dialogTemplate.content.querySelector('.dialog');
//     var dialogClone = dialogElement.cloneNode(true);
//     var tokyoElement = document.querySelector('.tokyo');
//
//     var offerTitleElement = dialogClone.querySelector('.lodge__title');
//     var offerAddressElement = dialogClone.querySelector('.lodge__address');
//     var offerPriceElement = dialogClone.querySelector('.lodge__price');
//     var offerTypeElement = dialogClone.querySelector('.lodge__type');
//     var offerRoomsAndGuestsElement = dialogClone.querySelector('.lodge__rooms-and-guests');
//     var offerCheckinTimeElement = dialogClone.querySelector('.lodge__checkin-time');
//     var offerDescriptionElement = dialogClone.querySelector('.lodge__description');
//     var offerPhotosElement = dialogClone.querySelector('.lodge__photos');
//     var offerFeaturesElement = dialogClone.querySelector('.lodge__features');
//
//     offerPhotosElement.innerHTML = '';
//     offerFeaturesElement.innerHTML = '';
//     offerTitleElement.innerText = data.offer.title;
//     offerAddressElement.innerText = data.offer.address;
//     offerPriceElement.innerText = data.offer.price + ' ₽/ночь';
//     offerTypeElement.innerText = data.offer.type;
//     offerRoomsAndGuestsElement.innerText = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
//     offerCheckinTimeElement.innerText = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
//     offerDescriptionElement.innerText = data.offer.description;
//
//     data.offer.features.forEach(function (item) {
//       var featureElement = document.createElement('span');
//
//       featureElement.classList.add('feature__image');
//       featureElement.classList.add('feature__image--' + item);
//       offerFeaturesElement.appendChild(featureElement);
//     });
//
//     data.offer.photos.forEach(function (item) {
//       var image = new Image(52, 42);
//
//       image.src = item;
//       offerPhotosElement.appendChild(image);
//     });
//
//     tokyoElement.appendChild(dialogClone);
//
//     return dialogClone;
//   };
// })();
