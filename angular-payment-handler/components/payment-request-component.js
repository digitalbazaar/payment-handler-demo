/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import localforage from 'localforage';
import {utils} from 'web-request-rpc';

export default {
  controller: Ctrl,
  templateUrl: 'angular-payment-handler/payment-request-component.html'
};

/* @ngInject */
function Ctrl($scope) {
  const self = this;
  self.loading = true;

  const cardStorage = localforage.createInstance({
    // FIXME: forced to localstorage for Safari compatibility
    driver: localforage.LOCALSTORAGE,
    name: 'cards'
  });

  window.addEventListener('message', async event => {
    console.log('frontend got payment request info', event.data);
    self.paymentRequest = event.data;
    self.merchantDomain = utils.parseUrl(
      self.paymentRequest.topLevelOrigin).hostname;
    self.card = await cardStorage.getItem(self.paymentRequest.instrumentKey);
    console.log('card', self.card);
    delete self.card.key;
    self.loading = false;
    $scope.$apply();
  });

  self.pay = () => {
    self.paying = true;
    window.parent.postMessage({
      // TODO: update once data sent to handler is cleaned up
      methodName: self.paymentRequest.methodData[0].supportedMethods[0],
      details: self.card
    }, window.location.origin);
  };

  (async () => {
    // request payment request
    window.parent.postMessage({type: 'request'}, window.location.origin);

    console.log('loaded payment request UI');
  })();
}
