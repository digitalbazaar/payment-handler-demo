# payment-handler-demo
Payment Handler API polyfill demo

The demo works in Chrome, Firefox, and Edge. To make it work in Safari, you will have to allow third party cookies "Always":

https://stackoverflow.com/questions/38584273/local-storage-cross-domain-safari-disables-it-by-default/38793832

A live version of this demo can be run by following these steps:

1. Go to https://payment-handler.demo.digitalbazaar.com/ and install a payment handler and add some credit cards.
2. Go to https://payment-merchant.demo.digitalbazaar.com/ and make a (fake) payment!

A video of the demo can be found here:

https://www.youtube.com/watch?v=Yb-gWT1t1Rg

## Running the Merchant Demo Site

If you would like to run the merchant demo site yourself, follow these instructions:

1. Clone this repository:

```
git clone https://github.com/digitalbazaar/payment-handler-demo
```

2. Enter the merchant site directory:

```
cd angular-payment-merchant
```

3. Install npm packages.

```
npm install
```

4. Ensure an entry for the local site is in your `/etc/hosts` file. To do this, edit `/etc/hosts` (as root) and map `example.merchant.localhost` to `127.0.0.1`.

5. Run the merchant site in dev mode:

```
node dev.js
```

6. Visit https://example.merchant.localhost:10443 in a browser.
7. Accept invalid demo SSL certificate.
8. The merchant demo page should show.

To run the live demo against your local merchant demo site:

1.  Visit https://payment-handler.demo.digitalbazaar.com/ and install the payment handler and add some credit cards.
1.  Visit https://example.merchant.localhost:10443 and click "Buy".
