/* 
* @Author: Mike Reich
* @Date:   2015-07-22 09:20:50
* @Last Modified 2015-07-22
*/

'use strict';

module.exports = function(app, loaded) {
  app.on('router.gatherRoutes', function(gather) {
    gather('/', function(req, res) {
      app.emit('template.render', 'site.index', {}, function(err, output) {
        res.send(output)
      })
    }, 'get')
  })
}