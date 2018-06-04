(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Contains functions that are used by all experiment modules. This includes recording button events and checking for anamolies.
 *@module general 
 *@nameSpace generalModule 
 */

var socket;



/**
 *module representing the pageId 
 *@module general
 *@global
 *@type string
 */
exports.pageId;
var interactionGroup = [];
data = {};
buttonArray = [];

module.exports = {
	/** Test to see if the module is loaded
	 *@memberof generalModule
	 *@function test
	 */
	test: function() {
		console.log("General.js can be used here");
	},
	/** releases next botton and ends timer at the end of the experiment 
	 *@memberof generalModule
	 *@function validate 
	 */
	validate: function() {
		experimentr.setPageType(exports.pageId);
		data.mouseAction = interactionGroup;
		experimentr.merge(data);
		experimentr.endTimer(exports.pageId);
		experimentr.release();
	},
	/** Adds visual cues that interaction has been detected
	 *@memberof generalModule
	 *@function pushBorder
	 */
	pushBorder: function() {
		d3.select(".border")
			.transition()
			.duration(500)
			.attr("rx", 70)
			.attr("ry", 70)
			.transition()
			.duration(500)
			.attr("rx", 20)
			.attr("ry", 20);
	},
	addSubmitFunctionality: function() {
		submitButton = d3.select(".submitButton")
			.on("mousedown", function() {
				buttonArray.push("submit");

				if (!d3.select("div#catagoryButtonContainer").empty()) {
					onButtons = d3.selectAll("button.catagoryButtons[value='on']");
					if (onButtons.empty() || brush.empty()) {
						general.launchWarning()
					} else {
						onButtons.each(function() {
							buttonArray.push(d3.select(this).attr("name"));
							d3.select(this).attr("value", "off");
						})

						general.feedBack(buttonArray, "button");
						d3.select(".brush").call(brush.clear());

					}
				}else {
					if (brush.empty() || d3.selectAll("#lineCopy").empty()) {
							general.launchWarning();
					} else {
						general.feedBack(buttonArray, "button");
						d3.select(".brush").call(brush.clear());
					
					}
				}
				d3.selectAll("#lineCopy").remove();
				buttonArray = [];
			})
	},
	/** Sends interaction information to backend on button pressed 
	 *@memberof generalModule
	 *@function pressed
	 *@param {string}  buttonTitle indicates what button is pressed
	 *@param {string}  type indicates what type of button 
	 */
	pressed: function(buttonTitle, type) {
		console.log('button pressed')
		general.pushBorder();
		if (d3.select(".svg2")[0][0] != null) {
			var linesOnDisplay = d3.selectAll("#lineCopy");
			d3.selectAll(".brush").remove();
			linesOnDisplay.remove();
			general.addCopy();
			component.addBrush();

			if (!d3.select("div#catagoryButtonContainer").empty()) {
				catagoryButton = d3.selectAll(".catagoryButtons")
					.on("mousedown", function() {
						if (d3.select(this).attr('value') == 'on') {
							d3.select(this).attr('value', 'off')
						} else {
							console.log("in else")
							d3.select(this).attr('value', 'on')
						}

					})
			}
		} else {
			general.feedBack(buttonTitle, type);
		}

		//socket.emit('mouseClick',{interactionType: type, buttonTitle: buttonTitle, timePressed: timePressed, f: postId, timestamp:timestamp, AnomalyPresent: isPresent, pageId:exports.pageId});
	},
	/** 
	 *Checks to see if the spacebar or the enter key has been pressed
	 *@memberof generalModule
	 *@function checkKeyPressed
	 *@param {event} e events from users
	 */
	checkKeyPressed: function(e) {
		if (e.keyCode == "13" || e.keyCode == "32") {
			general.pressed(e.keyCode, "key");
			//console.log('key pressed')
		}
	},
	/** Sets the page ID in this module
	 *@memberof generalModule
	 *@function setPageVars
	 *@param {string} pageId pageID from html id 
	 */
	setPageVars: function(pageId) {
		exports.pageId = pageId;
		//console.log('pageId are set', exports.pageId);
	},
	/** Connects websockets to record user mouse movements
	 *@memberof generalModule
	 *@function connectSockets
	 */
	connectSockets: function() {
		socket = io.connect();
		socket.on('connect', function() {
			//console.log('Client has connected to the server!');
		});

		document.onmousemove = experimentr.sendMouseMovement;
	},
	/** Creates and initializes a countdown clock 
	 *@memberof generalModule
	 *@function countdown
	 *@param {string} elementName 
	 *@param {integer} minutes 
	 *@param {integer} seconds
	 */
	countdown: function(elementName, minutes, seconds) {
		var element, endTime, hours, mins, msLeft;

		function twoDigits(n) {
			return (n <= 9 ? "0" + n : n);
		}

		function updateTimer() {

			msLeft = endTime - (+new Date);

			if (msLeft < 1000) {
				element.innerHTML = "countdown's over!";
				Mousetrap.reset();
				// document.onmousemove = experimentr.stopMouseMovementRec;
				experimentr.showNext();
				general.pressed('next-button', "button");

				if (!d3.select(".submitButton").empty()) {
					d3.select(".submitButton").remove();
				}
				if (!d3.selectAll(".catagoryButtons").empty()) {
					d3.selectAll(".catagoryButtons").remove();
				}
				// socket.emit('disconnect');
			} else {
				time = new Date(msLeft);
				hours = time.getUTCHours();
				mins = time.getUTCMinutes();
				// console.log("Is Anomoly present : "+ general.checkForAnamoly()+", time "+(hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() ))
				element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());
				setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
			}
		}

		element = document.getElementById(elementName);
		endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
		updateTimer();
	},
	/** Selects currently visible data and checks if an anamoly exists
	 *@memberof generalModule
	 *@function checkForAnamoly
	 *@returns {boolean} If anamoly is present boolean is true
	 */
	checkForAnamoly: function() {
		selectedPoints = component.getSelected();
		if (d3.select(".svg2")[0][0] == null) {
			lines = new general.getPoints();
		}
		allNoise = d3.select(".svg2")[0][0] == null ? lines.noise : selectedPoints;
		if (allNoise) {
			var currentAnoms = []
			if (allNoise.includes("T")) {
				currentAnoms = lines.anoms.filter(function(n) {
					return n != 0
				});
				// console.log("currently anomoly" + currentAnoms)
			}
			var areAnomsPresent = [allNoise.includes("T"), currentAnoms]
			return areAnomsPresent
		}

	},
	/** Clears brush component and saves all selected data
	 *@memberof generalModule
	 *@function feedBack
	 */
	feedBack: function(buttonTitle, type) {
		var interaction = {};
		var isPresent = general.checkForAnamoly();
		timePressed = experimentr.now(exports.pageId);
		timestamp = new Date().getTime();
		var postId = experimentr.postId();
		console.log("button title", buttonTitle)
		console.log("is it present", isPresent)
		interaction.interactionType = type;
		interaction.buttonTitle = buttonTitle;
		interaction.timePressed = timePressed;
		interaction.postId = postId;
		interaction.timestamp = timestamp;
		interaction.AnomalyPresent = isPresent;
		interaction.pageId = exports.pageId;
		interactionGroup.push(interaction);

	},

	/* Creates a copy of all the data currently displayed 
	 *@memberof generalModule
	 *@function getPoints
	 */
	getPoints: function() {
		try {

			var line1 = d3.select(".line1").datum().map(function(a) {
				return [a.value, a.noise, a.anomCode];
			});

			var line2 = d3.select(".line2").datum().map(function(a) {
				return [a.value, a.noise, a.anomCode];
			});

			var line3 = d3.select(".line3").datum().map(function(a) {
				return [a.value, a.noise, a.anomCode];
			});


			this.points1 = line1.map(function(a) {
				return a[0]
			});
			this.points2 = line2.map(function(a) {
				return a[0]
			});
			this.points3 = line3.map(function(a) {
				return a[0]
			});
			this.noise = line1.map(function(a) {
				return a[1]
			}).concat(line2.map(function(a) {
				return a[1]
			}).concat(line3.map(function(a) {
				return a[1]
			})));

			this.noise1 = line1.map(function(a) {
				return a[1]
			});
			this.noise2 = line2.map(function(a) {
				return a[1]
			});
			this.noise3 = line3.map(function(a) {
				return a[1]
			});

			this.anoms = line1.map(function(a) {
				return a[2]
			}).concat(line2.map(function(a) {
				return a[2]
			})).concat(line3.map(function(a) {
				return a[2]
			}));
		} catch (err) {
			return 0
		}
	},
	/* sets off warning when user is incorrect
	 *@memberof generalModule
	 *@function launchWarning 
	 */
	launchWarning: function() {
		var warning = d3.select("div#warning");
		console.log("warning launched");

		warning.style('display', 'inline')
			.style("opacity", 0.0)
			.transition()
			.duration(1200)
			.style("opacity", 1.0)
			.each("end", function() {
				warning.style("opacity", 1.0)
					.transition()
					.duration(800)
					.style("opacity", 0.0)
			});

	},
	/*Appends the copy of the active graph to the analysis graph for the user
	 *@memberof generalModule
	 *@fuction addCopy 
	 */
	addCopy: function() {
		lines = new general.getPoints();
		points1 = lines.points1;
		points2 = lines.points2;
		points3 = lines.points3;
		var copy1 = d3.svg.line()
			.x(function(d, i) {
				return x(i);
			})
			.y(function(d) {
				return y(parseFloat(d));
			})
			.interpolate("basis");

		var copy2 = d3.svg.line()
			.x(function(d, i) {
				return x(i);
			})
			.y(function(d) {
				return y2(parseFloat(d));
			})
			.interpolate("basis");

		var copy3 = d3.svg.line()
			.x(function(d, i) {
				return x(i);
			})
			.y(function(d) {
				return y3(parseFloat(d));
			})
			.interpolate("basis");

		var copyPath1 = svg2.append("g")
			.attr("clip-path", "url(#clip)")
			.append("path")
			.datum(points1)
			.attr("class", "line1 copy1")
			.attr("id", "lineCopy")
			.attr("d", copy1);
		var copyPath2 = svg2.append("g")
			.attr("clip-path", "url(#clip)")
			.append("path")
			.datum(points2)
			.attr("class", "line2 copy2")
			.attr("id", "lineCopy")
			.attr("d", copy2);

		var copyPath3 = svg2.append("g")
			.attr("clip-path", "url(#clip)")
			.append("path")
			.datum(points3)
			.attr("class", "line3 copy3")
			.attr("id", "lineCopy")
			.attr("d", copy3);
	}
};
},{}],2:[function(require,module,exports){
/**

*@nameSpace ComponentsModule
*/

/**
*These functions set up the diffrent visual components that apply across conditions
*@module conditionComponents
*/


n = 80;
var domain1 = -2.5;
var domain2 = 2.5;
var margin = {top:20, right:20, bottom:20, left:20},
width = 600 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;


x = d3.scale.linear()
.domain([0,n-1])
.range([0,width]);

y = d3.scale.linear()
.domain([domain1, domain2])
.range([height/3, 0]);

y2 = d3.scale.linear()
.domain([domain1, domain2])
.range([height*2/3, height/3]);

y3 = d3.scale.linear()
.domain([domain1, domain2])
.range([height, height*2/3]);

var selectedPoints=[];


module.exports = {
	/** Creates the buttons for detecting an anamoly and also the axis and container for graphs
	*@memberof ComponentsModule
	*@function createGraphViewer
	*/ 
	createGraphViewer:function(className){
		general.test();

		if(className.substring(0,2)=="d1"){
			component.addAnomalyButton(className);
		}

		var svgContainer = d3.select("#"+className).append("svg")
		.attr("width", 1500)
		.attr("height", 500);

		var xAxis=d3.svg.axis().tickFormat("").scale(x).orient("bottom");

		svg1 = svgContainer.append("g")
		.attr("class","svg1")
		.attr("transform", "translate(" +40+ "," + 20 + ")");

		svg1.append("g")
		.attr("class","x axis")
		.attr("transform","translate(0," + y(0)+")")
		.call(xAxis);

		svg1.append("defs").append("clipPath")
		.attr("id","clip")
		.append("rect")
		.attr("width",width)
		.attr("height",height+500);

		svg1.append("defs").append("clipPath")
		.attr("id","clip2")
		.append("rect")
		.attr("transform","translate(0,0)")
		.attr("width",width)
		.attr("height",height+500);

		svg1.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + y2(0) + ")")
		.call(xAxis);

		svg1.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + y3(0) + ")")
		.call(xAxis);

		var borderPath = svg1.append("rect")
		.attr("class","border")
		.attr("x",0)
		.attr("y",0)
		.attr("width",width)
		.attr("height",height)
		.style("stroke","#A4A4A4")
		.style("fill","none")
		.style("stroke-width",3)
		.attr("rx",20)
		.attr("ry",20);
	},
	/** Adds the button for condition one based on className
	*@memberof ComponentsModule
	*@function addAnomalyButton
	*@param {string} className
	*/
	addAnomalyButton:function(className){
		d3.select("#"+className)
		.append('div')
		.attr('id', 'test-buttons')
		.append("button")
		.text('Anomaly Detected')
		.attr('id', 'button1')
		.attr('name','researchButton')
		.on('click',function(){
			general.pressed(d3.select(this).attr('id') , "button");
			// console.log(' research button pressed'+ d3.select(this).attr('id'));
		});
	},
	/** Imports data files and adds lines to the graph container 
	*@memberof ComponentsModule
	*@function addGraph
	*/
	addGraph:function(className, dataPath1, dataPath2, dataPath3, duration){
		var q = d3.queue();
		q.defer(d3.tsv, dataPath1)
		q.defer(d3.tsv, dataPath2)
		q.defer(d3.tsv, dataPath3)
		.await(setUp); 

		function setUp(error, data1, data2, data3){
			if (error) throw error;


			var disData1 = data1.slice(0,n);
			var disData2 = data2.slice(0,n);
			var disData3 = data3.slice(0,n);
			
			data1.splice(0,n);
			data2.splice(0,n);
			data3.splice(0,n);

			var line1  = d3.svg.line()
			.x(function(d,i){return x(i);})
			.y(function(d){ return  y(parseFloat(d.value));})
			.interpolate("basis");

			var line2 = d3.svg.line()
			.x(function(d,i){return x(i);})
			.y(function(d){ return  y2(parseFloat(d.value));})
			.interpolate("basis");

			var line3 = d3.svg.line()
			.x(function(d,i){return x(i);})
			.y(function(d){ return  y3(parseFloat(d.value));})
			.interpolate("basis");

			var path1 =svg1.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData1)
			.attr("class","line1")
			.attr("d",line1);

			var path2 = svg1.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData2)
			.attr("class","line2")
			.attr("d",line2);

			var path3= svg1.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData3)
			.attr("class","line3")
			.attr("d",line3);

			tick();

			function tick(){

				disData1.push(data1.slice(0,1)[0]);
				data1.splice(0,1);

				if((!d3.select('#countdown').empty()) && d3.select('#countdown').html() == "countdown's over!"){
					data1=[];
				}

				if(data1.length>=1){
					path1
					.attr("d",line1)
					.attr("transform",null)
					.transition()
					.duration(duration)
					.ease("linear")
					.attr("transform", "translate(" + x(-1) + ",0)")
					disData1.shift();

					disData2.push(data2.slice(0,1)[0]);
					data2.splice(0,1);
					path2
					.attr("d",line2)
					.attr("transform",null)
					.transition()
					.duration(duration)
					.ease("linear")
					.attr("transform", "translate(" + x(-1) + ",0)")
					disData2.shift();

					disData3.push(data3.slice(0,1)[0]);;
					data3.splice(0,1);
					path3
					.attr("d",line3)
					.attr("transform",null)
					.transition()
					.duration(duration)
					.ease("linear")
					.attr("transform", "translate(" + x(-1) + ",0)")
					.each("end",tick);
					disData3.shift();
				}else{
					general.validate();

				}

			};
		};
	},
/** Creates the view for selected data for the view to analyze
*@memberof ComponentsModule
*@function createCopyViewer
*@param {string} className indicates what id to attach to 
*/
createCopyViewer:function(className){

	brush = d3.svg.brush()
		.x(x)
		.on("brushend",component.brushed)
		.on("brush", component.boundedBrushmove(1, 25));

	var xAxis=d3.svg.axis().tickFormat("").scale(x).orient("bottom");
	
	var svgContainer = d3.select("svg")
	
	svg2 = svgContainer.append("g")
	.attr("class","svg2")
	.attr("transform", "translate(" +650+ "," + 20 + ")");
	
	svg2.append("g")
	.attr("class","x axis")
	.attr("transform","translate(0," + y(0)+")")
	.call(xAxis);

	svg2.append("defs").append("clipPath")
	.attr("id","clip")
	.append("rect")
	.attr("width",width)
	.attr("height",height+500);

	svg2.append("defs").append("clipPath")
	.attr("id","clip2")
	.append("rect")
	.attr("transform","translate(0,0)")
	.attr("width",width)
	.attr("height",height+500);

	svg2.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + y2(0) + ")")
	.call(xAxis);

	svg2.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + y3(0) + ")")
	.call(xAxis);

	var borderPath = svg2.append("rect")
	.attr("class","border")
	.attr("x",0)
	.attr("y",0)
	.attr("width",width)
	.attr("height",height)
	.style("stroke","#A4A4A4")
	.style("fill","none")
	.style("stroke-width",3)
	.attr("rx",20)
	.attr("ry",20);
	

},
/** Adds a submit button for conditions d2 and d3 
*@memberof ComponentsModule
*@function addSubmitButton
*@param {string} className indicates what id to attach to 
*/
addSubmitButton : function(className){
	var submitButton = d3.select("#"+className)
	.append("button")
	.text('submit')
	.attr('class', 'submitButton')
	.attr('name','researchButton');
}, 
/** Adds anomaly catagory buttons for condition d3 
*@memberof ComponentsModule
*@function add<script src = "tutorial.js"></script>crButtons
*@param {string} className indicates what id to attach to 
*/
addCatagoryButtons: function(className){

	var mainContainer =	 d3.select('#'+className)
	.append("div")
	.attr('id', "catagoryButtonContainer");

	var stretchButton = mainContainer
		.append('button')
		.text('Stretched Anomaly')
		.attr("class", "catagoryButtons")
		.attr('name', 'stretch')
		.attr('value', 'off');

	var compressedButton = mainContainer
		.append('button')
		.text('Compressed Anomaly')
		.attr('class', 'catagoryButtons')
		.attr('name', 'compress')
		.attr('value', 'off');

	var spikeButton  = mainContainer
		.append('button')
		.text('Spike Anomaly')
		.attr('class', 'catagoryButtons')
		.attr('name', 'spike')
		.attr('value', 'off');
},
/** creates brush component for user graph analysis
*@memberof ComponentsModule
*@function addBrush
*/
addBrush:function(){
	// console.log("add Brush called")
	svg2.append("g")
	.attr("class","brush")
	.call(brush)
	.selectAll("rect")
	.attr("height",height);
},

/*Creates an array of data selected by brush component
*@memberof ComponentsModule
*@function brushed
*/
brushed:function(){
	var extent = brush.extent();
	var min = Math.round(extent[0]);
	var max = Math.round(extent[1]);
	// console.log("min"+ min+ "max" + max);
	if (d3.select(".copy3")[0][0] != null){
		selectedPoints = lines.noise1.slice(min,max).concat(lines.noise2.slice(min,max)).concat(lines.noise3.slice(min,max));
		// console.log('in create components: selected Points = ',selectedPoints);
	}
},
/** Creates warning text depeding on condition. Only applies to d2 or d3 
*@memberof ComponentsModule
*@function setupWarning
*@param {string} className indicates what id to attach to 
*/
setupWarning:function(className){
	var warning = d3.select("#"+className).append("div").attr("id", "warning");

	if(/d3.*/.test(className)){
	
		warning.text("Please select section of graph and catagorize anomaly before submitting");

	}else{
		
		warning.text("Please select section of graph before submitting");
	}

	warning.style("display", "none");
},
/** Limits the size of selected brush movement
*@memberof ComponentsModule
*@function boundedBrushmove
*@param {string} min the minimum brush size 
*@param {string} max  the max brush size
*/
boundedBrushmove:function ( min, max) {
  return function(){
    var extent = brush.extent(),
      diff = extent[1] - extent[0];
    
    if(min && (diff < min)) {
      extent[1] = extent[0] + min;
    }else if(max && (diff > max)){
      extent[1] = extent[0] + max;
    }else{
      return;
    }
    brush.extent(extent)(d3.select(this));
  }
},

/** a getter method for the selected points from brush for the General module
*@memberof ComponentsModule
*@function getSelected
*@returns {string|Array} all selected points of brush component
*/
getSelected: function(){
	return selectedPoints;
}
}
},{}],3:[function(require,module,exports){
/**

*@nameSpace tutorialModule
*/

/**
*These functions set and run the tutorial for the experiments
*@module tutorial
*/

general = require('../conditions/general')
component = require('../conditions/conditionComponents')

step = 0;
var n = 10;
var tduration = 200000;
var tduration2 = 100;

var tx = d3.scale.linear()
	.domain([0, 40])
	.range([0, 350]);

var tx2 = d3.scale.linear()
	.domain([0, 10])
	.range([0, 350]);
var ty = d3.scale.linear()
	.domain([-0.6, 0.6])
	.range([200, 0]);

var ty1 = d3.scale.linear()
	.domain([-2.5, 2.5])
	.range([150, 50]);

var ty2 = d3.scale.linear()
	.domain([-2.5, 2.5])
	.range([250, 150]);

var ty3 = d3.scale.linear()
	.domain([-2.5, 2.5])
	.range([350, 250]);

var tmargin = {
		top: 20,
		right: 20,
		bottom: 20,
		left: 20
	},
	twidth = 600 - tmargin.left - tmargin.right,
	theight = 500 - tmargin.top - tmargin.bottom;

var svg = d3.select(".content")
	.append("svg:svg")
	.attr("id", "container")
	.attr("width", 1500)
	.attr("height", 500)
	.append("g");

d3.select(".content").attr("align", "center");

var introPages = 4;
var exitPages = 1;

var pageId = null;
var step = -1;


/** Initializes tutorial by binding the mouse and hiding the next button 
*@memberof tutorialModule
*@function initTutorial
*/ 
initTutorial = function() {
	setArrowDirection(step);
	setPageID();
	Mousetrap.bind('left', function(e, n) {
		checkKeyPressed(n);
	});
	Mousetrap.bind('right', function(e, n) {
		checkKeyPressed(n);
	});

	if (this.pageId == "introduction") {
		Mousetrap.bind('enter', function(e, n) {
		});
	}

	experimentr.hideNext();

}()

/** Sets the number of tutorial pages should exist 
*@memberof tutorialModule
*@function setPageID
*/ 
function setPageID() {
	this.pageId = d3.select("#module").selectAll("div")[0][0].getAttribute('id')
	console.log(this.pageId);

}

/** Set the direction for the arrow based on the page number 
*@memberof tutorialModule
*@function setArrowDirection
*/ 
function setArrowDirection(step) {
	if (step <= 0) {
		d3.select("#back-button").style("visibility", "hidden");
		d3.select("#forward-button").style("visibility", "visible");
	} else if (step == introPages + exitPages - 1) {
		d3.select("#back-button").style("visibility", "visible");
		d3.select("#forward-button").style("visibility", "hidden");
	} else {
		d3.select("#back-button").style("visibility", "visible");
		d3.select("#forward-button").style("visibility", "visible");
	}
}

/** This function removes all content before updloading the next tutorial page 
*@memberof tutorialModule
*@function removePrevious
*/ 
function removePrevious() {
	svg.selectAll(".line")
		.remove();
	svg.selectAll("text")
		.remove();
	svg.selectAll("#line")
		.remove();
	svg.selectAll("image")
		.remove();
	d3.selectAll("g.svg2")
		.remove();
	d3.selectAll("g.svg1")
		.remove();

	d3.select("button.submitButton").remove()
	d3.select("div#catagoryButtonContainer").remove()
	d3.select("svg#container")
		.attr("height", 500)
		.attr("width", 750);
}

/** Makes sure that the step number doesnt exeed the limits 
*@memberof tutorialModule
*@function keepInBounds
*/ 
function keepInBounds(step) {
	if (step < 0) {
		step = 0;
	}

	if (step > introPages + exitPages - 1) {
		step = introPages + exitPages - 1;
	}
	return step
}

/** Makes sure that the step number doesnt exeed the limits 
*@memberof tutorialModule
*@function checkKeyPressed
*/ 
function checkKeyPressed(key) {
	if (key == "right") {
		step += 1;
	} else if (key == "left") {
		step -= 1;
	}

	step = keepInBounds(step)
	removePrevious()
	setArrowDirection(step)
	console.log('step', step)
	console.log("introPages", introPages);
	console.log('introPages + exitPages', introPages + exitPages)

	if (step >= 0 && step <= introPages - 1) {
		introduction(step)
		console.log('introduction')
	} else if (step >= introPages && step <= introPages + exitPages - 1) {
		//the exit 
		exit(step - introPages)
	} else {
		//see if I missed something. 
		console.log("this is whate")
	}
}
/** Once the tutorial is over ends timer and releases next button
*@memberof tutorialModule
*@function validate
*/ 
function validate() {
	experimentr.endTimer('demo');
	experimentr.release();
}
/** Runs the introduction to all tutorials.
*@memberof tutorialModule
*@function introduction
*/ 
function introduction(i) {
	console.log(i)
	switch (i) {

		case 0:

			svg.append("image")
				.attr("xlink:href", "modules/tutorial/images/tutorial-1.gif"+"?a="+Math.random())
				.attr("width", 720)
				.attr("height", 400)
				.attr("x", 0)
				.attr("y", 0);

			svg.append("text")
				.text("A number is given to you to match on the slider bar.")
				.attr("x", 360)
				.attr("y", 410);

			svg.append("text")
				.text("5/10 means find 5 on the slider whose values range from 1 to 10.")
				.attr("style", "font-size:15px")
				.attr("x", 360)
				.attr("y", 440);

			break;
            
		case 1:

			svg.append("image")
				.attr("xlink:href", "modules/tutorial/images/tutorial-3.gif"+"?a="+Math.random())
				.attr("width", 720)
				.attr("height", 400)
				.attr("x", 0)
				.attr("y", 0);

			svg.append("text")
				.text("You can use your mouse to drag the slider.")
				.attr("x", 360)
				.attr("y", 410);

			svg.append("text")
				.text("For example, 5/10 is the midpoint on the slider.")
				.attr("x", 360)
				.attr("y", 440)
				.attr("style", "font-size:15px");

			break;

		case 2:
			svg.append("image")
				.attr("xlink:href", "modules/tutorial/images/tutorial-2.gif"+"?a="+Math.random())
				.attr("width", 720)
				.attr("height", 400)
				.attr("x", 0)
				.attr("y", 0);

			svg.append("text")
				.text("You have 10 seconds to respond to each slider.")
				.attr("x", 360)
				.attr("y", 410);

			svg.append("text")
				.text("The progress bar shows the remaining time.")
				.attr("style", "font-size:15px")
				.attr("x", 360)
				.attr("y", 440);

			break;

			function type(d) {
				d.index = d.index;
				d.value = d.value;
				return d;
			}
            
        case 3:

			svg.append("image")
				.attr("xlink:href", "modules/tutorial/images/tutorial4.gif"+"?a="+Math.random())
				.attr("width", 720)
				.attr("height", 400)
				.attr("x", 0)
				.attr("y", 0);

			svg.append("text")
				.text("A total of 6 sliders will appear on the screen one after another.")
				.attr("x", 360)
				.attr("y", 430);

			svg.append("text")
				.text("Please make sure to respond to all 6 sliders.")
				.attr("x", 360)
				.attr("y", 455)
				.attr("style", "font-size:15px");

			svg.append("text")
				.text("If you miss one, you will not be able to proceed to the next page")
				.attr("x", 360)
				.attr("y", 475)
				.attr("style", "font-size:15px");

			svg.append("text")
				.text("and would have to refresh the page to restart the experiment.")
				.attr("x", 360)
				.attr("y", 495)
				.attr("style", "font-size:15px");

			break;
	}
}
/** Has the content for the final pages of tutorial
*@memberof tutorialModule
*@function exit
*/ 
function exit(i) {

	svg.append("text")
		.style("font-weight", "bold")
		.text("This completes the tutorial.")
		.attr("x", 360)
		.attr("y", 50);

	svg.append("text")
		.text("When you are ready to begin the experiment,")
		.attr("x", 360)
		.attr("y", 80);

	svg.append("text")
		.text('please click the button "Next" below.')
		.attr("x", 360)
		.attr("y", 110);

	d3.select("svg#container").attr("height", "150");

	validate();
	experimentr.showNext();
	experimentr.release();
}

},{"../conditions/conditionComponents":2,"../conditions/general":1}]},{},[3]);
