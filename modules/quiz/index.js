/* 
* @Author: Mike Reich
* @Date:   2015-07-22 09:26:27
* @Last Modified 2015-07-22
*/

'use strict';

module.exports = function(app) {
  app.on('router.gatherRoutes', (gather) => {
    gather("/quiz/intro", (req, res) => {
      app.emit('partial.render.ejs', __dirname+"/views/intro.ejs", {}, function(err, content) {
        app.emit('template.render', 'site.onePage', {content: content}, function(err, output) {
          res.send(output)
        })
      })
    })

    gather("/quiz/stats", (req, res) => {
      app.emit('partial.render.ejs', __dirname+"/views/stats.ejs", {}, function(err, content) {
        app.emit('template.render', 'site.onePage', {content: content}, function(err, output) {
          res.send(output)
        })
      })
    })

    gather("/quiz/question/:number", (req, res) => {
      var number = req.params('number')
      if(number > 4) return res.status(404).send()
      app.emit('partial.render.ejs', __dirname+"/views/question"+number+".ejs", {}, function(err, content) {
        app.emit('template.render', 'site.onePage', {content: content}, function(err, output) {
          res.send(output)
        })
      })
    })
  })
}