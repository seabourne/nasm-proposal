/* Theme Name: The Project - Responsive Website Template
 * Author:HtmlCoder
 * Author URI:http://www.htmlcoder.me
 * Author e-mail:htmlcoder.me@gmail.com
 * Version:1.0.0
 * Created:March 2015
 * License URI:http://support.wrapbootstrap.com/
 * File Description: Place here your custom scripts
 */

function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

(function($){

  $(document).ready(function(){

    var client = new Keen({
      projectId: "55afc22296773d39f2a15708",
      writeKey: "735974e2643dd2ed6456f278c8eb8771e31e4fd21decf5df5c7c90699fd1dc7ff889b9ecd1760e153a18aa0161eeb048719142543971fd99ad044b8cdaecbfde159c7112c9f389fe15344af7ae81ad61761e4c9f1032a6e5f999e176a8b54368c0acaa1dec9c108a0c281a851f2db4fb",
      readKey: "416b862211d745d557d5ddf8b2a6b664eebac54e4df84d78ab709661e63d07ca166fd3f6a35ce9d10237768b4c8e66762b39c7f767526822e4e2ac94e390befd5b57225ed2192cd034fdf0ff120596813359ec404450403b7c69e436711dad019cc39d3af7b93d467fe68df46c7b2780"
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

    var getStarts = function() {
      var query = new Keen.Query("count", {
        eventCollection: "quizStarted",
        timezone: "UTC"
      });
      
      client.run(query, function(err, response){
        if(err) return console.log('err', err)
        $("#plays_count").html(response.result)
        
      });    
    }

    var getCompletions = function() {
      var query = new Keen.Query("count", {
        eventCollection: "quizCompleted",
        timezone: "UTC"
      });
      
      client.run(query, function(err, response){
        if(err) return console.log('err', err)
        $("#completions_count").html(response.result)
        
      }); 
    }

    var getAnswers = function() {
      var query = new Keen.Query("count", {
        eventCollection: "answer",
        groupBy: "correct",
        timezone: "UTC"
      });
      
      client.run(query, function(err, response){
        if(err) return console.log('err', err)
        $("#correct_count").html(_.findWhere(response.result, {correct:true}).result);
        $("#incorrect_count").html(_.findWhere(response.result, {correct:false}).result);
      });
    }

    var getAnswerBreakdown = function() {
      var answers = []
      getAnswersForQuestion(1, answers, function(answers) {
        getAnswersForQuestion(2, answers, function(answers) {
          getAnswersForQuestion(3, answers, function(answers) {
            getAnswersForQuestion(4, answers, function(answers) {
              drawAnswerBreakdown(answers)
            })
          })
        })
      })
    }

    var getAnswersForQuestion = function (questionId, answers, cb) {
      var query = new Keen.Query("count", {
        eventCollection: "answer",
        filters: [{"operator":"eq","property_name":"questionId","property_value":questionId}],
        groupBy: "correct",
        timezone: "UTC"
      });
      
      client.run(query, function(err, response){
        if(err) return console.log('err', err)
        var res = _.map(response.result, function(e) {e.questionId = questionId; return e})
        answers = answers.concat(res)
        if(cb) cb(answers)
      });
    }

    var drawAnswerBreakdown = function(answers) {
      console.log('drawing breakdown', answers)
      var correctData = [];
      var incorrectData = [];
      for(var i = 1; i < 5; i++) {
        var a = _.findWhere(answers, {questionId: i, correct: false})
        var b = _.findWhere(answers, {questionId: i, correct: true})
        correctData.push(b.result)
        incorrectData.push(a.result)
      }
      var barChartData = {
        labels : ["Question 1", "Question 2", "Question 3", "Question 4"],
        datasets : [
          {
            fillColor : "#09afdf",
            strokeColor : "#09afdf",
            highlightFill: "#6BD5F4",
            highlightStroke: "#6BD5F4",
            label: "Correct",
            data : correctData
          },
          {
            fillColor : "#FDB45C",
            strokeColor : "#FDB45C",
            highlightFill: "#FFC870",
            highlightStroke: "#FFC870",
            label: "Incorrect",
            data : incorrectData
          },
        ]
      }
      var ctx = document.getElementById("bars-graph").getContext("2d");
      window.myBar = new Chart(ctx).Bar(barChartData, {
        //responsive: true,
        showTooltips: true,
        multiTooltipTemplate: "<%= datasetLabel %>: <%= value %>",
        scaleFontColor: "#ccc"
      });
    }

    var getDailyStarts = function() {
      var query = new Keen.Query("count", {
        eventCollection: "quizStarted",
        interval: "daily",
        timeframe: "this_7_days",
        timezone: "UTC"
      });

      client.run(query, function(err, response){
        if(err) return console.log('err', err)
        var labels = _.map(response.result, function(e) {
          var date = new Date(e.timeframe.start);
          return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
        })

        var values = _.map(response.result, function(e) {
          return e.value
        })

        var lineChartData = {
          labels : labels,
          datasets : [
            {
              label: "Visits",
              fillColor : "rgba(188,188,188,0.2)",
              strokeColor : "rgba(188,188,188,1)",
              pointColor : "rgba(188,188,188,1)",
              pointStrokeColor : "#fff",
              pointHighlightFill : "#fff",
              pointHighlightStroke : "rgba(188,188,188,1)",
              data : values
            }
          ]
        }

        // Line Charts Initialization
        var ctx = document.getElementById("lines-graph").getContext("2d");
        window.newLine = new Chart(ctx).Line(lineChartData, {
          //responsive: true,
          bezierCurve : false,
          scaleFontColor: "#ccc"
        });
      });
    }

    if($(".stats").length > 0) {
      getStarts();
      getCompletions();  
      getAnswers();
      getAnswerBreakdown();
      getDailyStarts();
    }

    if($("#correct").length > 0) {
      renderStatsPage()
    }

    if ($(".budget.bar").length>0) {
      // Data for bar charts
      var barChartData = {
        labels : ["August","September","October"],
        datasets : [
          {
            fillColor : "#09afdf",
            strokeColor : "#09afdf",
            highlightFill: "#6BD5F4",
            highlightStroke: "#6BD5F4",
            label: "Design",
            data : [
              8000,
              24000,
              8000
            ]
          },
          {
            fillColor : "#FDB45C",
            strokeColor : "#FDB45C",
            highlightFill: "#FFC870",
            highlightStroke: "#FFC870",
            label: "Development",
            data : [
              16000,
              32000,
              8000
            ]
          },
          {
            fillColor : "#4D5360",
            strokeColor : "#4D5360",
            highlightFill: "#616774",
            highlightStroke: "#616774",
            label: "Testing/QA",
            data : [
              0,
              0,
              16000
            ]
          },
          {
            fillColor : "#4cae4c",
            strokeColor : "#4cae4c",
            highlightFill : "#5cb85c",
            highlightStroke : "#5cb85c",
            label: "PM",
            data : [
              3840,
              5760,
              3200
            ]
          }
        ]
      }
      
      // Bar Charts Initialization    
      $(window).load(function() {
        var ctx = document.getElementById("bars-graph").getContext("2d");
        window.myBar = new Chart(ctx).Bar(barChartData, {
          responsive: true,
          showTooltips: true,
          multiTooltipTemplate: "<%= datasetLabel %>: $<%= addCommas(value) %>",
        });
      });
    }
    if ($(".budget.pie").length>0) {     
      // Data for pie chart
      var pieData = [
        {
          value: 32000.00,
          color:"#09afdf",
          highlight: "#6BD5F4",
          label: "Design"
        },
        {
          value: 64000.00,
          color: "#FDB45C",
          highlight: "#FFC870",
          label: "Development"
        },
        {
          value: 16000.00,
          color: "#4D5360",
          highlight: "#616774",
          label: "Testing/QA"
        },
        {
          value: 12800.00,
          color: "#4cae4c",
          highlight: "#5cb85c",
          label: "Project Management"
        }
      ];

      // Pie Chart Initialization
      $(window).load(function() {
        var ctx = document.getElementById("pie-graph").getContext("2d");
        window.myPie = new Chart(ctx).Pie(pieData, {
          tooltipTemplate: "<%= label %>: $<%= addCommas(value) %>"
        });
      });
    }
  }); // End document ready

})(this.jQuery);