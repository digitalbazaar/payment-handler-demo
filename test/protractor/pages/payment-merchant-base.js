/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = global.bedrock;
const EC = protractor.ExpectedConditions;

const api = {};
module.exports = api;

const pm = bedrock.sites['payment-merchant'];

api.btnAddCard = () => element(by.buttonText('Add'));

api.btnBuy = () => element(by.buttonText('Buy'));

api.check = () => {
  browser.wait(EC.visibilityOf($('pm-home')), 3000);
  api.btnBuy().isDisplayed().should.eventually.be.true;
};

api.get = () => {
  bedrock.get(pm.url);
};
