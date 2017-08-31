/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

export default {
  controller: Ctrl,
  templateUrl: 'angular-payment-merchant/home-component.html'
};

/* @ngInject */
function Ctrl($scope) {
  const self = this;
  self.bought = false;
  self.buying = false;
  const PaymentRequest = navigator.paymentPolyfill.PaymentRequest;

  self.buy = async () => {
    self.buying = true;

    const pr = new PaymentRequest([{
      supportedMethods: ['basic-card']
    }], {
      // displayItems not strictly required
      displayItems: [{
        label: 'Sub total',
        amount: {currency: 'USD', value: '0.95'}
      }, {
        label: 'Sales tax',
        amount: {currency: 'USD', value: '0.05'}
      }],
      total: {
        label: 'Total',
        amount: {currency: 'USD', value: '1.00'}
      }
    });
    try {
      const response = await pr.show();
      console.log('response at merchant site', response);
      self.paymentDetails = response.details;
      self.bought = true;
      $scope.$apply();
    } catch(e) {
      console.error(e);
    }

    self.buying = false;
    $scope.$apply();
  };
}
