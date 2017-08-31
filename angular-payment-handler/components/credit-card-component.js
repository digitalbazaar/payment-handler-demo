/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

export default {
  bindings: {
    card: '<phCard',
    onDelete: '&phOnDelete'
  },
  controller: Ctrl,
  templateUrl: 'angular-payment-handler/credit-card-component.html'
};

/* @ngInject */
function Ctrl() {
  const self = this;

  self.$onChanges = () => {
    self.cardIcon = 'fa-cc-' + self.card.capabilities.supportedNetworks[0];
  };
}
