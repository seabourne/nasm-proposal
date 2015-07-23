/* Theme Name: The Project - Responsive Website Template
 * Author:HtmlCoder
 * Author URI:http://www.htmlcoder.me
 * Author e-mail:htmlcoder.me@gmail.com
 * Version:1.0.0
 * Created:March 2015
 * License URI:http://support.wrapbootstrap.com/
 * File Description: Place here your custom scripts
 */
(function($){

  $(document).ready(function(){

    var client = new Keen({
      projectId: "55afc22296773d39f2a15708",
      writeKey: "735974e2643dd2ed6456f278c8eb8771e31e4fd21decf5df5c7c90699fd1dc7ff889b9ecd1760e153a18aa0161eeb048719142543971fd99ad044b8cdaecbfde159c7112c9f389fe15344af7ae81ad61761e4c9f1032a6e5f999e176a8b54368c0acaa1dec9c108a0c281a851f2db4fb"
    });

    var renderStatsPage = function() {
      var correct = 0;
      var questions = []
      try{
        questions[0] = JSON.parse($.cookie("question1"))
        questions[1] = JSON.parse($.cookie("question2"))
        questions[2] = JSON.parse($.cookie("question3"))
        questions[3] = JSON.parse($.cookie("question4"))
      } catch (e) {
        console.log($.cookie("question1"))
        console.log('e', e)
      }
      questions.forEach(function(q) {
        if(q.correct) correct += 1;
      })

      var correctTemplate = '<li><span class="btn radius-50 btn-success btn-lg btn-round"><i class="fa fa-check"></i></span>'
      var incorrectTemplate = '<li><span class="btn radius-50 btn-danger btn-lg btn-round"><i class="fa fa-close"></i></span>'

      for(var i = 0; i < 4; i++) {
        var answer = questions[i] && questions[i].correct ? correctTemplate : incorrectTemplate;
        answer += questions[i].answerText+"</li>"
        $("#answerList").append(answer)
      }

      $("#correct").text(correct)
    }
    
    window.addEvent = function(eventName, object, cb) {
      client.addEvent(eventName, object, cb);
    }

    window.correctAnswer = function(e, questionId) {
      if(!$(e).attr('href'))
        e = $(e).findParent('a')
      $.cookie("question"+questionId, JSON.stringify({correct: true, answerText: $(e).text()}), { path: '/' })
      addEvent("answer", {correct: true, questionId: questionId, answerText: $(e).text(), userId: window.userId}, function() {
        window.location = $(e).attr('href')
      });
    }

    window.incorrectAnswer = function(e, questionId) {
      if(!$(e).attr('href'))
        e = $(e).findParent('a')
      $.cookie("question"+questionId, JSON.stringify({correct: false, answerText: $(e).text()}), { path: '/' })
      addEvent("answer", {correct: false, questionId: questionId, answerText: $(e).text(), userId: window.userId}, function() {
        window.location = $(e).attr('href')
      });
    }

    window.startQuiz = function(e) {
      var href = $(e).attr('href')
      addEvent("quizStarted", {userId: window.userId}, function() {
        window.location = href
      })
    }

    window.completeQuiz = function(e) {
      addEvent("quizCompleted", {userId: window.userId}, function() {})
    }

    window.setUserId = function() {
      if($.cookie('userId'))
        window.userId = $.cookie('userId')
      else {
        window.userId = Date.now()
        $.cookie('userId', window.userId, { path: '/' })
      }
      console.log('UserId is', window.userId)
    }

    window.resetUserId = function() {
      $.removeCookie('userId', { path: '/' })
      setUserId()
    }

    setUserId()

    if($("#correct").length > 0) {
      renderStatsPage()
    }
  }); // End document ready

})(this.jQuery);