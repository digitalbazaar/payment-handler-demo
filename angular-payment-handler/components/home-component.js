/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

export default {
  controller: Ctrl,
  templateUrl: 'angular-payment-handler/home-component.html'
};

/* @ngInject */
function Ctrl($scope) {
  const self = this;

  self.install = async () => {
    console.log('installing...');
    try {
      await install();
      console.log('installation complete.');
      self.installed = true;
      $scope.$apply();
    } catch(e) {
      console.error('installation failed,', e);
    }
  };

  self.uninstall = async () => {
    console.log('uninstalling...');
    try {
      self.installed = self.uninstalled = false;
      await uninstall();
      self.uninstalled = true;
      $scope.$apply();
      console.log('uninstallation complete.');
    } catch(e) {
      console.error('uninstallation failed,', e);
    }
  };

  self.addCard = async () => {
    // TODO:
  };
}

async function install() {
  const PaymentHandlers = navigator.paymentPolyfill.PaymentHandlers;
  const PaymentManager = navigator.paymentPolyfill.PaymentManager;

  // ensure permission has been granted to add a payment instrument
  const result = await PaymentManager.requestPermission();
  if(result !== 'granted') {
    throw new Error('Permission denied.');
  }

  // get payment handler registration
  const registration = await PaymentHandlers.register('/payment-handler');

  console.log('adding instruments');
  await addInstruments(registration);
  console.log('payment instruments added');
}

async function uninstall() {
  const PaymentHandlers = navigator.paymentPolyfill.PaymentHandlers;
  const PaymentManager = navigator.paymentPolyfill.PaymentManager;

  // ensure permission has been granted to add a payment instrument
  const result = await PaymentManager.requestPermission();
  if(result !== 'granted') {
    throw new Error('Permission denied.');
  }

  // unregister payment handler registration
  await PaymentHandlers.unregister('/payment-handler');
  console.log('payment handler unregistered');

  // revoke permission (useful for demonstration purposes)
  await navigator.paymentPolyfill.permissions.revoke({name: 'paymenthandler'});
}

async function addInstruments(registration) {
  // TODO: add instrument collected from a UI credit card component instead of
  // hard coded data here
  return Promise.all([
    registration.paymentManager.instruments.set(
      'default',
      {
        name: 'Visa *1234',
        icons: [{
          src: '/images/new_visa.gif',
          sizes: '40x40',
          type: 'image/gif'
        }],
        enabledMethods: ['basic-card'],
        capabilities: {
          supportedNetworks: ['visa'],
          supportedTypes: ['credit', 'debit', 'prepaid']
        }
      }),
    registration.paymentManager.instruments.set(
      'option1',
      {
        name: 'Mastercard *5678',
        icons: [{
          src: '/images/mastercard_logo_2.gif',
          sizes: '40x40',
          type: 'image/gif'
        }],
        enabledMethods: ['basic-card'],
        capabilities: {
          supportedNetworks: ['mastercard'],
          supportedTypes: ['credit', 'debit', 'prepaid']
        }
      }),
    registration.paymentManager.instruments.set(
      'option2',
      {
        name: 'Amex *2233',
        icons: [{
          src: '/images/american_express_logo_1.gif',
          sizes: '40x40',
          type: 'image/gif'
        }],
        enabledMethods: ['basic-card'],
        capabilities: {
          supportedNetworks: ['amex'],
          supportedTypes: ['credit', 'debit', 'prepaid']
        }
      })
    ]);
}
