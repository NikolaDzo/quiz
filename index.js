/*-----------------------------------------------------
  REQUIRE
-------------------------------------------------------*/
var yo       = require('yo-yo')
var csjs     = require('csjs-inject')
var minixhr  = require('minixhr')
var chart    = require('chart.js')
/*-----------------------------------------------------
  THEME
-------------------------------------------------------*/
var font        = 'Kaushan Script, cursive'
var yellow      = 'hsla(52,35%,63%,1)'
var white       = 'hsla(120,24%,96%,1)'
var violet      = 'hsla(339,23%,57%,1)'
var lightViolet = 'hsla(339,21%,68%,1)'
var blue        = 'hsla(208,95%,50%, 1)'
var azureblue   = 'hsla(208,100%,87%, 1)'
var pigeonblue  = 'hsla(208,97%,87%, 1)'
var lightblue   = 'hsla(208,45%,82%, 1)'
var lightBrown  = 'hsla(29,21%,67%,1)'
var darkBrown   = 'hsla(13,19%,45%,1)'
var black       = 'hsla(0,0%,0%,1)'
/*-----------------------------------------------------------------------------
  LOADING FONT
-----------------------------------------------------------------------------*/
var links = ['https://fonts.googleapis.com/css?family=Kaushan+Script']
var font = yo`<link href=${links[0]} rel='stylesheet' type='text/css'>`
document.head.appendChild(font)
/*-----------------------------------------------------------------------------
LOADING DATA
-----------------------------------------------------------------------------*/
var questions = [
`
Statement #1:
Super Saiyan Blue Goku is stronger
than Super Saiyan 4 Goku.
`,
`
Statement #2:
There is level beyond Super Saiyan Blue
for Goku and Vegeta.
`,
`
Statement #3:
Whis is stronger than Super Saiyan Rose.
`,
`
Statement #4:
Beerus is stronger than Super Saiyan Rose.
`,
`
Statement #5:
Gogeta is stronger than Whis.

`,
`
Statement #6:
Dragon ball Super is worthy continuation
of Dragon ball Z.
`
]
var i               = 0
var question        = questions[i]
var results         = []
var answerOptions   = [1,2,3,4,5,6]
/*-----------------------------------------------------------------------------
  QUIZ
-----------------------------------------------------------------------------*/
function quizComponent () {
  var css = csjs`
    .quiz {
      background-color: ${pigeonblue};
      text-align: center;
      font-family: 'Kaushan Script', cursive;
      padding-bottom: 200px;
    }
    .welcome {
      font-size: 4em;
      padding: 50px;
      color: ${lightViolet}
    }
    .question {
      font-size: 2em;
      color: ${darkBrown};
      padding: 40px;
      margin: 0 5%;
    }
    .answers {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 5%;
    }
    .answer {
      background-color: ${violet};
      padding: 15px;
      margin: 5px;
      border: 2px solid ${darkBrown};
      border-radius: 30%;
    }
    .answer:hover {
      background-color: ${lightBrown};
      cursor: pointer;
    }
    .instruction {
      color: ${darkBrown};
      font-size: 1em;
      margin: 0 15%;
      padding: 20px;
    }
    .results {
      background-color: ${pigeonblue};
      text-align: center;
      font-family: 'Kaushan Script', cursive;
      padding-bottom: 200px;
    }
    .resultTitle{
      font-size: 4em;
      padding: 50px;
      color: ${violet}
    }
    .back {
      display: flex;
      justify-content: center;
    }
    .backImg {
      height: 30px;
      padding: 5px;
    }
    .backText {
      color: ${lightViolet};
      font-size: 25px;
    }
    .showChart {
      font-size: 2em;
      color: ${violet};
      margin: 35px;
    }
    .showChart:hover {
      color: ${lightViolet};
      cursor: pointer;
    }
    .myChart {
      width: 300px;
      height: 300px;
    }
  `

  function template () {
    return yo`
      <div class="${css.quiz}">
        <div class="${css.welcome}">
          Welcome to Dragon ball Super quiz!
        </div>
        <div class="${css.question}">
          ${question}
        </div>
        <div class="${css.answers}">
          ${answerOptions.map(x=>yo`<div class="${css.answer}" onclick=${nextQuestion(x)}>${x}</div>`)}
        </div>
        <div class="${css.instruction}">
          Choose how strongly do you agree with the statement<br>
          (1 - don't agree at all, 6 - completely agree)
        </div>
           <div class="${css.back}" onclick=${back}>
           <img src="http://i.imgur.com/L6kXXEi.png" class="${css.backImg}">
           <div class="${css.backText}">Back</div>
        </div>
      </div>
    `
  }
  var element = template()
  document.body.appendChild(element)

  return element

  function nextQuestion(id) {
    return function () {
      if (i < (questions.length-1)) {
        results[i] = id
        i = i+1
        question = questions[i]
        yo.update(element, template())
      } else {
        results[i] = id
        sendData(results)
        yo.update(element, seeResults(results))
      }
    }
	}

  function seeResults(data) {
  var ctx = yo`<canvas class="${css.myChart}"></canvas>`
  return yo`
    <div class="${css.results}">
      <div class="${css.resultTitle}">
        Compare your answers
      </div>
        <div class="${css.showChart}" onclick=${function(){createChart(ctx, data)}}>
        Click to see the chart
      </div>
      ${ctx}
    </div>
  `
	}

  function back() {
    if (i > 0) {
      i = i-1
      question = questions[i]
      yo.update(element, template())
    }
  }

  function sendData(results) {
    var request  = {
      url          : 'https://quiz-8f7cd.firebaseio.com/results.json',
      method       : 'POST',
      data         : JSON.stringify(results)
    }
    minixhr(request)
  }

  function createChart(ctx, myData) {
    minixhr('https://quiz-8f7cd.firebaseio.com/results.json', responseHandler)
    function responseHandler (data, response, xhr, header) {
      var data = JSON.parse(data)
      var keys = Object.keys(data)
      var arrayOfAnswers = keys.map(x=>data[x])
      var stats = arrayOfAnswers.reduce(function(currentResult,answer,i) {
        var newResult=currentResult.map((x,count)=>(x*(i+1)+answer[count])/(i+2))
        return newResult
      }, myData)
      var data = {
        labels: [
          "Statement #1", "Statement #2", "Statement #3",
          "Statement #4", "Statement #5", "Statement #6"
        ],
        datasets: [
          {
            label: "My statments",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: myData
          },
          {
            label: "Others statements",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: stats
          }
        ]
      }
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
          scale: {
            scale: [1,2,3,4,5,6],
            ticks: {
              beginAtZero: true
            }
          }
        }
      })
    }
  }

}
quizComponent()
