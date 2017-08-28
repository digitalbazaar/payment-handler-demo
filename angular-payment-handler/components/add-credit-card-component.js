/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import creditCardType from 'credit-card-type';

export default {
  bindings: {
    //onAdd: '&phOnAdd'
  },
  controller: Ctrl,
  templateUrl: 'angular-payment-handler/add-credit-card-component.html'
};

/* @ngInject */
function Ctrl() {
  const self = this;
  self.card = {};
  self.cardClass = {};

  self.months = {
    'Jan - 01': '01',
    'Feb - 02': '02',
    'Mar - 03': '03',
    'Apr - 04': '04',
    'May - 05': '05',
    'Jun - 06': '06',
    'Jul - 07': '07',
    'Aug - 08': '08',
    'Sep - 09': '09',
    'Oct - 10': '10',
    'Nov - 11': '11',
    'Dec - 12': '12'
  };

  self.years = {};
  const firstYear = new Date().getFullYear();
  const lastYear = firstYear + 20;
  for(let i = firstYear; i < lastYear; ++i) {
    self.years[i.toString()] = i.toString().substr(2);
  }

  const supportedCards = {
    visa: 'visa',
    'master-card': 'mastercard',
    'american-express': 'amex',
    'diners-club': 'diners-club',
    discover: 'discover',
    jcb: 'jcb'
  };

  self.onChange = () => {
    self.cardClass = {};
    if(self.card.number) {
      const card = creditCardType(self.card.number)[0];
      console.log('card', card);
      if(card && card.type in supportedCards) {
        self.cardClass['fa-cc-' + supportedCards[card.type]] = true;
      }
    }
  };
}
