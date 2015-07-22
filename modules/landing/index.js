/* 
* @Author: Mike Reich
* @Date:   2015-07-22 13:23:18
* @Last Modified 2015-07-22
*/

'use strict';

module.exports = function(app, loaded) {
  app.on('router.gatherRoutes', function(gather) {
    gather('/', function(req, res) {
      app.emit('partial.render.ejs', __dirname+"/views/index.ejs", {}, function(err, content) {
        app.emit('template.render', 'site.landing', {content: content}, function(err, output) {
          res.send(output)
        })
      })
    }, 'get')
  })
}