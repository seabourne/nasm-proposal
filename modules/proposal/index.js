/* 
* @Author: Mike Reich
* @Date:   2015-07-22 09:20:50
* @Last Modified 2015-07-22
*/

'use strict';

module.exports = function(app, loaded) {
  app.on('router.gatherRoutes', function(gather) {
    gather('/', function(req, res) {
      res.send('this is the homepage')
    })
  })
}