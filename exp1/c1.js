
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




// STIMULI AND TRIAL TYPES


var conditions = ["sequential", "summary_visual", "summary_symbolic"]

var colors = ["orange", "blue"]

//-----------------------------------------------

showSlide("prestudy");

// MAIN EXPERIMENT
var experiment = {

	subid: "",

	subage: 0,

	counter: 1,

	trialtype: 0,

	trialtypes: [],

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

		if (experiment.condition == "sequential") {
			experiment.trialtypes = [1,1,1,2,2,2,2,2,2,2,2,2]
			experiment.trialtypes = shuffle(experiment.trialtypes)
			experiment.numtrials = 12
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
	next: function(phase) {

		console.log("counter is " + experiment.counter)
		if (experiment.counter > (experiment.numtrials)) {
			experiment.attncheck()
			return;
		}

		if (phase == "training") {

			console.log("got to training")
			console.log(experiment.condition)

			if (experiment.condition == "sequential") {
				experiment.trialtype = experiment.trialtypes.pop()
				if (experiment.trialtype == 1) {
					$(sobject1).attr("src", "stim_images/object2redbig.jpg");
				} else if (experiment.trialtype == 2) {
					$(sobject1).attr("src", "stim_images/object2greenbig.jpg");
				}
			} else if (experiment.condition == "summary_visual") {
				$(sobject1).attr("src", "stim_images/object2greybig.jpg");
			} else if (experiment.condition == "summary_symbolic") {
				$(sobject1).attr("src", "stim_images/object2purplebig.jpg");
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
						
						setTimeout(function() {
							$("#searchstage").fadeOut(500);
							experiment.next("training");
						}, 500);
					}
				});
				
			}


			setTimeout(function(){$("#searchstage").fadeIn(500)},300);

			experiment.starttime = Date.now();
			
			setTimeout(function() {experiment.canclick = true;}, 200)

		} 
	},

	

	start: function() {

		// put column headers in data file
		var coltitles = "subid, condition, counter, trialtype \n";
		experiment.data.push(coltitles)
		
		experiment.next("training");
	},


}
