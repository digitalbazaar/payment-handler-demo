/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

import * as polyfill from 'payment-mediator-polyfill';
import {utils} from 'web-request-rpc';

export default {
  controller: Ctrl,
  templateUrl: 'angular-payment-mediator-site/mediator-component.html'
};

/* @ngInject */
function Ctrl($compile, $location, $scope) {
  const self = this;
  self.paymentInstrumentOptions = [];
  self.permissions = [{
    name: 'Handle payment',
    icon: 'fa fa-money'
  }];

  if(window.location.ancestorOrigins &&
    window.location.ancestorOrigins.length > 0) {
    self.relyingOrigin = window.location.ancestorOrigins[0];
  } else {
    const query = $location.search();
    self.relyingOrigin = query.origin;
  }

  self.relyingDomain = utils.parseUrl(self.relyingOrigin).hostname;

  self.accept = async () => {
    self.permissionRequest('granted');
    self.display = null;
    await navigator.paymentMediator.hide();
  };

  self.deny = async () => {
    self.permissionRequest('denied');
    self.display = null;
    await navigator.paymentMediator.hide();
  };

  self.selectPaymentInstrument = async (selection) => {
    if(!selection) {
      self.display = null;
      self.requestPaymentPromise.resolve(null);
      return await navigator.paymentMediator.hide();
    }

    let response;
    try {
      response = await navigator.paymentMediator.ui.selectPaymentInstrument(
        selection.paymentInstrumentOption);
      console.log('response', response);
    } catch(e) {
      console.error(e);
      self.requestPaymentPromise.reject(e);
    }
    if(response) {
      self.requestPaymentPromise.resolve(response);
    }

    self.display = null;
    await navigator.paymentMediator.hide();
    $scope.$apply();
  };

  self.abortPayment = async () => {
    self.requestPaymentPromise.reject(new Error('Payment aborted.'));
    self.display = null;
    await navigator.paymentMediator.hide();
  };

  (async () => {
    try {
      await polyfill.load({
        relyingOrigin: self.relyingOrigin,
        requestPermission,
        showRequest,
        customizeHandlerWindow({webAppWindow}) {
          updateHandlerWindow(webAppWindow);
        }
      });
      console.log('payment mediator site loaded polyfill');
    } catch(e) {
      console.error('payment mediator site failed to load polyfill');
      console.error(e);
    }
  })();

  async function requestPermission(permissionDesc) {
    // prep display
    self.display = 'permissionRequest';
    const promise = new Promise(resolve => {
      self.permissionRequest = state => resolve({state: state});
    });
    $scope.$apply();

    // show display and return promise
    await navigator.paymentMediator.show();
    return promise;
  }

  async function showRequest(requestState) {
    // prep display
    self.display = 'paymentRequest';
    self.merchantOrigin = requestState.topLevelOrigin;
    self.merchantDomain = utils.parseUrl(self.merchantOrigin).hostname;
    self.paymentRequest = requestState.paymentRequest;
    self.loading = true;
    const promise = new Promise((resolve, reject) => {
      self.requestPaymentPromise = {resolve, reject};
    });
    $scope.$apply();

    // show display
    await navigator.paymentMediator.show();

    // get matching instruments
    const instrumentOptions = await navigator.paymentMediator.ui
      .matchPaymentInstruments(requestState.paymentRequest);
    self.paymentInstrumentOptions = instrumentOptions.map(option => ({
      name: option.paymentInstrument.name,
      icon: getIconDataUrl(option.paymentInstrument),
      origin: utils.parseUrl(option.paymentHandler).hostname,
      paymentInstrumentOption: option
    }));
    self.loading = false;
    $scope.$apply();

    console.log('instruments', self.paymentInstrumentOptions);

    return promise;
  }

  function updateHandlerWindow(handlerWindow) {
    const container = handlerWindow.container;
    const header = $compile(
      '<pm-handler-window-header pm-relying-domain="$ctrl.merchantDomain">')(
        $scope);
    container.insertBefore(header[0], handlerWindow.iframe);
    handlerWindow.iframe.style.background = 'white';
  }
}

function getIconDataUrl(paymentInstrument) {
  if(paymentInstrument.icons.length > 0) {
    // TODO: choose appropriately sized icon
    // return icon.fetchedImage;
  }
  return null;
}
