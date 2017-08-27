/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import * as polyfill from 'payment-handler-polyfill';
import HomeComponent from './home-component';

'use strict';

const module = angular.module('angular-payment-merchant', []);
module.component('pmHome', HomeComponent);

bedrock.setRootModule(module);

//const MEDIATOR_ORIGIN = 'https://payment.mediator.dev:12443';
const MEDIATOR_ORIGIN = 'https://payment-mediator.demo.digitalbazaar.com';

const loadPolyfillPromise = polyfill.loadOnce(
  MEDIATOR_ORIGIN + '/mediator?origin=' +
  encodeURIComponent(window.location.origin));

/* @ngInject */
module.config($routeProvider => {
  $routeProvider
    .when('/', {
      title: 'Merchant Example',
      template: '<pm-home></pm-home>',
      resolve: {
        polyfill($q) {
          return $q.resolve(loadPolyfillPromise);
        }
      }
    });
});
