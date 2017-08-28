/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import * as polyfill from 'payment-handler-polyfill';
import {activate as activateHandler} from './payment-handler.js';
import AddCreditCardComponent from './add-credit-card-component.js';
import HomeComponent from './home-component.js';
import PaymentRequestComponent from './payment-request-component.js';

'use strict';

const module = angular.module('angular-payment-handler', ['ngMaterial']);
module.component('phAddCreditCard', AddCreditCardComponent);
module.component('phHome', HomeComponent);
module.component('phPaymentRequest', PaymentRequestComponent);

console.log('payment handler loading at ', window.location.href);

//const MEDIATOR_ORIGIN = 'https://payment.mediator.dev:12443';
const MEDIATOR_ORIGIN = 'https://payment-mediator.demo.digitalbazaar.com';

const loadPolyfillPromise = polyfill.loadOnce(
  MEDIATOR_ORIGIN + '/mediator?origin=' +
  encodeURIComponent(window.location.origin));

if(window.location.pathname === '/payment-handler') {
  (async () => {
    await loadPolyfillPromise;
    activateHandler();
  })();
  bedrock.setRootModule(false);
} else {
  // only bootstrap AngularJS app when not using payment handler
  bedrock.setRootModule(module);
}

/* @ngInject */
module.config($routeProvider => {
  $routeProvider
    .when('/', {
      title: 'Payment Handler Example',
      template: '<ph-home></ph-home>',
      resolve: {
        polyfill($q) {
          return $q.resolve(loadPolyfillPromise);
        }
      }
    })
    .when('/payment-request', {
      title: 'Payment Request',
      template: '<ph-payment-request></ph-payment-request>',
      resolve: {
        polyfill($q) {
          return $q.resolve(loadPolyfillPromise);
        }
      }
    });
});
