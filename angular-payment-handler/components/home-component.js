/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
'use strict';

import localforage from 'localforage';

export default {
  controller: Ctrl,
  templateUrl: 'angular-payment-handler/home-component.html'
};

const CARD_ICONS = {
  visa: {
    src: '/images/new_visa.gif',
    sizes: '40x40',
    type: 'image/gif'
  },
  mastercard: {
    src: '/images/mastercard_logo_2.gif',
    sizes: '40x40',
    type: 'image/gif'
  },
  amex: {
    src: '/images/american_express_logo_1.gif',
    sizes: '40x40',
    type: 'image/gif'
  }
};

/* @ngInject */
function Ctrl($mdDialog, $scope) {
  const self = this;

  const cardStorage = localforage.createInstance({name: 'cards'});

  let registration;

  self.$onInit = async () => {
    try {
      registration = await getRegistration();
      self.cards = await getCards(registration);
      self.installed = true;
    } catch(e) {
      // assume permission denied for demo
      self.installed = false;
      self.cards = [];
    }
    $scope.$apply();
  };

  self.install = async () => {
    try {
      registration = await install();
      self.installed = true;
      $scope.$apply();
    } catch(e) {
      console.error('installation failed,', e);
    }
  };

  self.uninstall = async () => {
    try {
      self.installed = self.uninstalled = false;
      await uninstall();
      await cardStorage.clear();
      self.uninstalled = true;
      registration = null;
      $scope.$apply();
    } catch(e) {
      console.error('uninstallation failed,', e);
    }
  };

  self.addCard = async () => {
    let card;
    try {
      card = await $mdDialog.show({
        templateUrl: 'angular-payment-handler/add-credit-card-dialog.html',
        controller: () => {},
        bindToController: true,
        controllerAs: '$ctrl',
        locals: {
          home: self
        },
        clickOutsideToClose: false,
        escapeToClose: true,
        fullscreen: true
      });
    } catch(e) {
      // assume canceled
      return;
    }

    // add card
    card.key = uuid();
    await cardStorage.setItem(card.key, card);
    await addInstrument(registration, card);

    // refresh cards
    self.cards = await getCards(registration);
    console.log('got cards', self.cards);

    $scope.$apply();
  };

  self.confirmAddCard = async (card) => {
    $mdDialog.hide(card);
  };

  self.cancelAddCard = async () => {
    $mdDialog.cancel();
  };

  self.clearCards = async () => {
    console.log('clearing cards');
    await cardStorage.clear();
    await registration.paymentManager.instruments.clear();
    self.cards = await getCards(registration);
    $scope.$apply();
  };

  self.deleteCard = async (card) => {
    console.log('deleting card', card);
    await cardStorage.setItem(card.key, card);
    await registration.paymentManager.instruments.delete(card.key);
    self.cards = await getCards(registration);
    $scope.$apply();
  };

  async function getCards(registration) {
    const keys = await registration.paymentManager.instruments.keys();
    const cards = await Promise.all(keys.map(key => cardStorage.getItem(key)));
    return cards.filter(card => !!card);
  }
}

async function getRegistration() {
  const PaymentHandlers = navigator.paymentPolyfill.PaymentHandlers;

  let registration;
  try {
    // get payment handler registration
    registration = await PaymentHandlers.register('/payment-handler');
  } catch(e) {
    // ignore
  }
  return registration;
}

async function install() {
  console.log('installing...');

  const PaymentManager = navigator.paymentPolyfill.PaymentManager;

  // ensure permission has been granted to add a payment instrument
  const result = await PaymentManager.requestPermission();
  if(result !== 'granted') {
    throw new Error('Permission denied.');
  }

  const registration = await getRegistration();
  if(!registration) {
    throw new Error('Payment handler not registered.');
  }

  console.log('installation complete.');
  return registration;
}

async function uninstall() {
  console.log('uninstalling...');

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

  console.log('uninstallation complete.');
}
/*
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
}*/

async function addInstrument(registration, card) {
  const name = card.type[0].toUpperCase() + card.type.substr(1) +
    ' *' + card.number.substr(-4);
  const icon = CARD_ICONS[card.type];

  return registration.paymentManager.instruments.set(
    card.key, {
      name: name,
      icons: icon ? [icon] : [],
      enabledMethods: ['basic-card'],
      capabilities: {
        supportedNetworks: [card.type],
        supportedTypes: ['credit', 'debit', 'prepaid']
      }
    });
}

async function getInstruments(registration) {
  const keys = await registration.paymentManager.instruments.keys();
  const instruments = await Promise.all(
    keys.map(key => registration.paymentManager.instruments.get(key)));

  return instruments.map((instrument, index) => Object.assign({
    key: keys[index]
  }, instrument));
}

function uuid(a){return a?(0|Math.random()*16).toString(16):(""+1e7+-1e3+-4e3+-8e3+-1e11).replace(/1|0/g,uuid)};
