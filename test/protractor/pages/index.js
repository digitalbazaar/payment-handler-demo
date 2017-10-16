/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const pages = global.bedrock.pages || {};
module.exports = pages;

pages['payment-handler'] = {
  base: require('./payment-handler-base')
};
pages['payment-merchant'] = {
  base: require('./payment-merchant-base')
};
