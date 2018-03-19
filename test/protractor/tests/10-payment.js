/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = global.bedrock;
const uuid = require('uuid/v4');
const phBase = bedrock.pages['payment-handler'].base;
const pmBase = bedrock.pages['payment-merchant'].base;
const EC = protractor.ExpectedConditions;

const cardHolderName = uuid();

describe('Payment Handler Tests', () => {
  it('installs the payment handler', () => {
    phBase.get();
    phBase.check();
    phBase.btnInstall().click();
    browser.wait(EC.visibilityOf($('iframe')), 30000);
    const iframeElement = browser.driver.findElement(by.tagName('iframe'));
    browser.switchTo().frame(iframeElement);
    browser.wait(EC.visibilityOf($('pm-mediator')), 5000);
    element(by.buttonText('Allow')).click();
    browser.switchTo().defaultContent();
    browser.wait(EC.invisibilityOf($('iframe')), 5000);
  });
  it('adds a payment card', () => {
    browser.wait(EC.elementToBeClickable(phBase.btnAddCard()), 5000);
    phBase.btnAddCard().click();
    const dialog = $('md-dialog');
    browser.wait(EC.visibilityOf(dialog), 5000);
    dialog.element(by.model('$ctrl.card.name'))
      .clear()
      .sendKeys(cardHolderName);
    dialog.element(by.buttonText('Add')).click();
    browser.wait(EC.invisibilityOf(dialog), 5000);
    const cards = element.all(by.repeater('card in $ctrl.cards'));
    browser.wait(() => cards.then(c => !!c.length), 5000);
    cards.map(c => c.$('.md-headline').getText())
      .should.eventually.include(cardHolderName);
  });
  it('makes a purchase', () => {
    pmBase.get();
    pmBase.check();
    pmBase.btnBuy().click();
    browser.wait(EC.visibilityOf($('iframe')), 5000);
    const iframeElement = browser.driver.findElement(by.tagName('iframe'));
    browser.switchTo().frame(iframeElement);
    browser.wait(EC.visibilityOf($('pm-mediator')), 5000);
    element(by.buttonText('Pay')).click();
    browser.wait(EC.visibilityOf($('iframe')), 5000);
    // NOTE: this is a non-angular page and has 2 child iframes
    browser.switchTo().frame(0);
    // NOTE: this page is angular
    browser.switchTo().frame(1);
    browser.wait(EC.visibilityOf($('ph-payment-request')), 5000);
    element(by.buttonText('Confirm')).click();
    browser.switchTo().defaultContent();
  });
  it('confirms payment details', () => {
    browser.wait(EC.visibilityOf($('pm-home')), 5000);
    element.all(by.linkText('here')).get(0).click();
    $('pre').getText().then(paymentText => {
      const paymentDetails = JSON.parse(paymentText);
      paymentDetails.name.should.equal(cardHolderName);
    });
  });
});
