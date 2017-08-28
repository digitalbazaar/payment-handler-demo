/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

export default {
  bindings: {
    //card: '&phCard'
  },
  controller: Ctrl,
  templateUrl: 'angular-payment-handler/credit-card-component.html'
};

/* @ngInject */
function Ctrl() {
  const self = this;

  self.card = {
    name: 'Pat Doe',
    number: '4111111111111234',
    type: 'visa'
  };

  const supportedCards = {
    visa: 'visa',
    'master-card': 'mastercard',
    'american-express': 'amex',
    'diners-club': 'diners-club',
    discover: 'discover',
    jcb: 'jcb'
  };

  self.cardIcon = 'fa-cc-' + supportedCards[self.card.type];

  // TODO:
}
