
// show slide function
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}

//array shuffle function
shuffle = function (o) { //v1.0
	for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
}

getCurrentDate = function() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

function updateText(value) {
	$("#sliderlabel").html(value + "%");
}

//currently not called; could be useful for reaction time?
getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

function createArray(length) {
	var arr = new Array(length || 0),
	i = length;

	if (arguments.length > 1) {
		var args = Array.prototype.slice.call(arguments, 1);
		while(i--) arr[length-1 - i] = createArray.apply(this, args);
	}

	return arr;
}

function makeStims(numerator, denominator, pos_value, neg_value) {
	var pos_vals = Array(numerator).fill(pos_value)
	var neg_vals = Array((denominator - numerator)).fill(neg_value)
	var stims = shuffle(pos_vals.concat(neg_vals))
	return(stims)
}



// STIMULI AND TRIAL TYPES


var conditions = ["sequential"]

var variants = [[[7, 9], [9, 17]], [[7, 16], [2, 10]], [[3, 15], [9, 11]], [[3, 8], [16, 18]], [[10, 13], [4, 13]]]

var num_conditions = ["small_big", "big_small", "med_med"]

var nums = {"small": 12, "big": 20, "med": 16}

var colors = ["orange", "green"]

//-----------------------------------------------


showSlide("prestudy");

// MAIN EXPERIMENT
var experiment = {

	subid: "",

	subage: 0,

	counter: 1,

	trialtype: 0,

	props: [],

	trialtypes_one: [],

	trialtypes_two: [],

	percentage: 0,

	major_color: "",

	minor_color: "",

	condition: "",

	date: getCurrentDate(),

	timestamp: getCurrentTime(),

	rtsearch: 0,

	numtrials: 0,

	data: [],

	canclick: false,

	startexp: function() {

		document.body.style.background = "white";
		$("#pauseslide").hide();
		setTimeout(function () {
			experiment.start();
		}, 100);

	},

	pauseslide: function() {

		conditions = shuffle(conditions);
		experiment.condition = conditions.pop();
		colors = shuffle(colors)
		experiment.major_color = colors.pop()
		experiment.minor_color = colors.pop()
		variants = shuffle(variants)
		experiment.props = shuffle(variants.pop())
		console.log(experiment.props)
		

		if (experiment.condition == "sequential") {
			experiment.trialtypes_one = makeStims(experiment.props[0][0], experiment.props[0][1], experiment.major_color, experiment.minor_color)
			console.log(experiment.trialtypes_one)
			experiment.trialtypes_two = makeStims(experiment.props[1][0], experiment.props[1][1], experiment.major_color, experiment.minor_color)
			experiment.numtrials = experiment.props[0][1] + experiment.props[1][1]
			console.log(experiment.trialtypes_two)
		} else {
			experiment.numtrials = 1
		} 

		$("#prestudy").hide();
		$(startimg).attr("src", "images/orange-button.png");

		$( "#startimg" ).click(function() {
			setTimeout(function() {
				$("#pauseslide").fadeOut(1000);
				experiment.startexp();
			}, 1000);
		});

		showSlide("pauseslide");
	},

	checkInput: function() {
		experiment.pauseslide();
	},

	getNext: function() {
		console.log(experiment.trialtypes_one.length)
		if (experiment.trialtypes_one.length == 0) {
			experiment.next("test", 2)
		} else {
			experiment.next("training", 1);
		}
	},


	//the end of the experiment
	end: function () {
    	// use line below for mmturkey version
    	setTimeout(function() { turk.submit(experiment, true) }, 1500);
    	showSlide("finish");
    	document.body.style.background = "black";
    },

	//concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function() {
		
		var dataforRound = experiment.subid + "," + experiment.condition; 
		dataforRound += "," + experiment.counter + "," + experiment.trialtype;
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.rtsearch + "\n";
		// use line below for mmturkey version
		experiment.data.push(dataforRound);	
	},

	attncheck: function() {
		setTimeout(function () {
			$("#stage").fadeOut();
		}, 100);

		showSlide("attnCheck")
	},
	

	// MAIN DISPLAY FUNCTION
	next: function(phase, block) {

		console.log("counter is " + experiment.counter)
		if (block > 2) {
			//experiment.attncheck() 
			experiment.end()
			return;
		}

		if (phase == "training") {

			if (block == 1) {
				if (experiment.condition == "sequential") {
					experiment.trialtype = experiment.trialtypes_one.pop()
					
					$(sobject1).attr("src", "stim_images/" + experiment.trialtype + "_dot.png");
										
				} else if (experiment.condition == "summary_visual") {
					$(sobject1).attr("src", "stim_images/grey_dot.jpg");
				} else if (experiment.condition == "summary_symbolic") {
					$(sobject1).attr("src", "stim_images/purple_dot.jpg");
				}
			} else if (block == 2) {
				console.log("IN PHASE TWO")
				if (experiment.condition == "sequential") {
					experiment.trialtype = experiment.trialtypes_two.pop()
					$(sobject1).attr("src", "stim_images/" + experiment.trialtype + "_dot.png");
				} else if (experiment.condition == "summary_visual") {
					$(sobject1).attr("src", "stim_images/grey_dot.jpg");
				} else if (experiment.condition == "summary_symbolic") {
					$(sobject1).attr("src", "stim_images/purple_dot.jpg");
				}
			}



			$(sobject1).css({"border-color": "#FFFFFF", 
				"border-width":"2px", 
				"border-style":"solid"});


			if (experiment.counter == 1) {
				$( "#sobject1" ).click(function() {
					if (experiment.canclick) {
						experiment.canclick = false;
						$(sobject1).css({"border-color": "#000000", 
							"border-width":"2px", 
							"border-style":"solid"});

						experiment.rtsearch = Date.now() - experiment.starttime;
						experiment.processOneRow();
						experiment.counter++;
						$("#searchstage").fadeOut(500);
						setTimeout(function() {
							experiment.getNext();
						}, 500);
					}
				});

				$("#slider").slider({
	        		change: function(event, ui) {
	            	$("#custom-handle").show();
	            	clickDisabled = false;
  	 				$( "#nexttrialbutton" ).attr('disabled', false);
	        		}
   				});

   				$( "#nexttrialbutton" ).click(function() {
					experiment.percentage = $("#slider").slider("option", "value");
					experiment.rttest = Date.now() - experiment.starttime;
					experiment.timestamp = getCurrentTime()
					experiment.processOneRow();
					experiment.counter++;
					$("#testingstage").fadeOut(500);
						setTimeout(function() {
							experiment.next("search");
					}, 550);
			
				});
				
			}


			setTimeout(function(){$("#searchstage").fadeIn(500)},300);

			experiment.starttime = Date.now();
			
			setTimeout(function() {experiment.canclick = true;}, 200)

		} else if (phase == "test") {

			$("#sselector").hide();
			$("#sobject1").hide();


			$("#searchstage").hide();

	    	//$("#tinstructions").html("On this planet, what percentage of " + experiment.targetword[1] + " do you think are " + experiment.targetcolor + "? <br> Use the slider below to indicate a response.");
	    	//$("#tinstructions").show();
	    	
	    	$("#slider").show();
	    	$("#custom-handle").hide();

	    	experiment.percentage = document.getElementById("slider").value = 0;

		    $("#testingstage").fadeIn();
		    experiment.starttime = Date.now();
		}
	},

	

	start: function() {
		// put column headers in data file
		var coltitles = "subid, condition, counter, trialtype \n";
		experiment.data.push(coltitles)
		
		experiment.next("training", "one");
	},


}
