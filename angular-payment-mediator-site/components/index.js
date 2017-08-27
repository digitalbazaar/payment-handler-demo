/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import HandlerWindowHeaderComponent from './handler-window-header-component.js';
import HomeComponent from './home-component';
import MediatorComponent from './mediator-component';

'use strict';

const module = angular.module(
  'angular-payment-mediator-site', ['web-request-mediator']);
module.component('pmHandlerWindowHeader', HandlerWindowHeaderComponent);
module.component('pmHome', HomeComponent);
module.component('pmMediator', MediatorComponent);

bedrock.setRootModule(module);

/* @ngInject */
module.config($routeProvider => {
  $routeProvider
    .when('/', {
      title: 'Payment Mediator Example',
      template: '<pm-home></pm-home>'
    })
    .when('/mediator', {
      title: 'Payment Mediator',
      template: '<pm-mediator></pm-mediator>'
    });
});
