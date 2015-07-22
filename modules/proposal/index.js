/* 
* @Author: Mike Reich
* @Date:   2015-07-22 09:20:50
* @Last Modified 2015-07-22
*/

'use strict';

module.exports = function(app, loaded) {
  app.on('router.gatherRoutes', function(gather) {
    gather('/proposal', function(req, res) {
      app.emit('partial.render.ejs', __dirname+"/views/proposal.ejs", {}, function(err, content) {
        app.emit('template.render', 'site.onePage', {content: content}, function(err, output) {
          res.send(output)
        })
      })
    })
  })
}