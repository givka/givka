const _ = require('lodash');
const Jimp = require('jimp');
const moment = require('moment');

angular.module('templates', []);
const app = angular.module('givka', []).config(($sceDelegateProvider) => {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://www.youtube.com/**']);
});
