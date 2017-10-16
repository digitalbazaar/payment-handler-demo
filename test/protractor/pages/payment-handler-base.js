/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = global.bedrock;
const EC = protractor.ExpectedConditions;

const api = {};
module.exports = api;

const ph = bedrock.sites['payment-handler'];

api.btnAddCard = () => element(by.buttonText('Add'));

api.btnInstall = () => element(by.buttonText('Install'));

api.check = () => {
  browser.wait(EC.visibilityOf($('ph-home')), 30000);
  api.btnInstall().isDisplayed().should.eventually.be.true;
};

api.get = () => {
  bedrock.get(ph.url);
};
