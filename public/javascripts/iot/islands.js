var cheating = false;
var puzzleSolved = false;
var bubblesPopped = false;
var animationLoopID;
var addBubbleLoopID;
var screenWidth;
var bubbleWidth;

function switchCheat() {
	alert("switch");
	cheating = !cheating;
}

function initializeIslands()
{
    //alert("entering initialize islands");
    
	// This is the animation timer
	animationLoopID = setInterval("animationLoop()", 80);

	// This is the timer for adding new bubbles
	addBubbleLoopID = setInterval("addBubble()", 3000);
	
	// Go ahead and add the first bubble right now
	addBubble();
	
	// Get some globals
	bubbleWidth = parseInt($("#bubble-0").css("width"));
	screenWidth = parseInt($("#island-area").css("width"));
}

// Global bubble array
var bubbles = [];

function animationLoop()
{
    
	if (puzzleSolved) {
		clearInterval(animationLoopID);
		clearInterval(addBubbleLoopID);
		//setTimeout("goodJobAlert()", 1000);
	}
	

	// Move all the bubbles
	for (var index in bubbles)
	{
		// Access the bubble at the current index
		var bubble = bubbles[index];
		
		if (puzzleSolved) {
			$(bubble).fadeOut("slow");
			continue;
		}

		// Move the bubble position right 1 pixel	
		var left = parseInt(bubble.css("left"));
		var newLeft = left + 1;
		$(bubble).css("left", newLeft);
		
		//alert("l: "+left+" s: "+screenWidth+" b: "+bubbleWidth);
		if (left > screenWidth - bubbleWidth - 10) {
			$(bubble).fadeOut("fast");
		}
	}
}

function addBubble()
{
	// Figure out the bubble's id number
	var idNumber = bubbles.length;

	// Add the bubble HTML
	var randLetter = getRandomLetter();
	$("#island-area").append('<div id="bubble-' + idNumber + '" class="bubble">' + randLetter + '</div>');

	// Now, we need to grab a reference to the bubble we just added to the HTML
	var bubble = $("#bubble-" + idNumber);
	//bubble.click(popBubble);
	bubble.draggable();
	
	// Add the bubble to the bubbles array
	bubbles.push(bubble);

	// Set the bubble's position using a "helper" function
	initializePositionForBubble(bubble);
}

function popBubble() {
	$(this).fadeOut("fast");
	
	if ($(this).text() == "P") {
		puzzleSolved = true;
		$("#letter-1").text("P");
	}
}

function getRandomLetter() {
	if (cheating) {
		return "P";
	} else {
		return createRandomUpperCaseLetter();
	}
}

// Thanks to http://www.codehouse.com/javascript/tips/random_letter/
// 		but mine's better
function createRandomUpperCaseLetter()
{
   return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function initializePositionForBubble(bubble)
{
	// We will position the bubble above the top of the screen and at a random x position
	var bubbleHeight = parseInt(bubble.css("height"));
	var bubbleWidth  = parseInt(bubble.css("width"));
	var screenHeight = parseInt($("#island-area").css("height"));
	
	//alert ("trying to get position");
	
	var position = $("#timecontent").position();
	
	// Start the bubble just to the left of the screen
	var newBubbleLeft = (-1 * bubbleWidth);
	var newBubbleTop =  randomXToY(110, 260);                    //Math.floor(Math.random() * screenHeight);
	
	// Finally, update the bubble's position
	bubble.css("top", newBubbleTop);
	bubble.css("left", newBubbleLeft);
}

function floater(){
  $('#image-bubble').animate( {'marginTop':(Math.random() * $("#timecontent").height()) 
             + 'px','marginLeft':(Math.random() * $("#timecontent").width()) + 'px'}, 2000,'linear',function(){
                  setTimeout(floater,10);
                  } );
}


function randomXToY(minVal,maxVal)
{
  var randVal =  minVal+(Math.random()*(maxVal-minVal));
  
  return randVal;
}