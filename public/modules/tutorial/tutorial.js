(function() {
	var data = {};
	data.pageId = "tutorial";
	experimentr.startTimer('tutorial');

	var introPages = 5;
	var exitPages = 1;
	var step = -1;

	var svg = d3.select(".content")
	.append("svg:svg")
	.attr("id", "container")
	.attr("width", 1500)
	.attr("height", 500)
	.append("g");

	d3.select(".content").attr("align", "center");

	/** Initializes tutorial by binding the mouse and hiding the next button 
	*@memberof tutorialModule
	*@function initTutorial
	*/ 
	initTutorial = function() {
		setArrowDirection(step);
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
		d3.selectAll("text")
			.remove();
		d3.selectAll("image")
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

		if (step >= 0 && step <= introPages - 1) {
			introduction(step)
		} else if (step >= introPages && step <= introPages + exitPages - 1) {
			//the exit 
			exit(step - introPages)
		} 
	}

	/** Once the tutorial is over ends timer and releases next button
	*@memberof tutorialModule
	*@function validate
	*/ 
	function validate() {
		experimentr.endTimer('tutorial');
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

			case 4:
				svg.append("text")
					.text("You must answer as accurate as possible.")
					.style("font-weight","bold")
					.style("font-size","24px")
					.attr("x", 360)
					.attr("y", 70);

				svg.append("text")
					.text("you will earn a")
					.attr("x", 200)
					.attr("y", 110);

				svg.append("text")
					.text("$0.10 bonus")
					.style("font-weight","bold")
					.style("font-size","22px")
					.attr("x", 360)
					.attr("y", 110)

				svg.append("text")
					.text("for each answer")
					.attr("x", 530)
					.attr("y", 110)

				svg.append("text")
					.text("that is within 1 point of correct.")
					.attr("x", 360)
					.attr("y", 140)

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

		svg.select("svg#container").attr("height", "150");

		validate();
		experimentr.showNext();
		experimentr.release();
	}
}());