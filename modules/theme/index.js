/* 
* @Author: Mike Reich
* @Date:   2015-07-22 09:37:35
* @Last Modified 2015-07-22
*/

'use strict';

var SitesTemplate = function (app, loaded) {
  
  app.on('app.startup.before', () => {
    app.emit('router.setStatic', __dirname+"/assets", '/template')
  })

  app.on('templates.gatherTemplates', function(gather) {
    gather('site.onePage', _render)
    gather('site.landing', _landing)
  })

  var _render = function(opts, callback) {
    var index = __dirname+"/views/index.ejs"

    app.emit('partial.render.ejs', index, opts, callback)
  }

  var _landing = function(opts, callback) {
    var index = __dirname+"/views/landing.ejs"

    app.emit('partial.render.ejs', index, opts, callback)
  }

  loaded()
}

module.exports = function(app, loaded) {
  return new SitesTemplate(app, loaded)
}