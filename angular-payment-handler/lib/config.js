/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const config = require('bedrock').config;
const path = require('path');
require('bedrock-express');
require('bedrock-server');

// server info
config.server.port = 11443;
config.server.httpPort = 11080;
config.server.domain = 'example.payment-handler.localhost';

// angular-payment-handler pseudo package
const rootPath = path.join(__dirname, '..');
config.views.system.packages.push({
  path: path.join(rootPath, 'components'),
  manifest: path.join(rootPath, 'package.json')
});

config.express.static.push({
  route: '/images',
  path: path.join(rootPath, 'components', 'images'),
  cors: true
});
