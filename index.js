/* 
* @Author: Mike Reich
* @Date:   2015-07-22 09:18:57
* @Last Modified 2015-07-22
*/

'use strict';

require("babel/register")({
  stage: 0,
  // this will ensure that only datadash modules are transpiled
  ignore: new RegExp("^(.*node_modules/.*)")
})

var App = require('@nxus/core')

var app = new App()

app.start()