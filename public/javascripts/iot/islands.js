/* ISLAND GLOBALS 
****************************************************************************/
var islandWidth;
var islandScreenWidth;
var animationLoopID;
var addIslandLoopID;

// Global Islands Array
var islands = [];
var deleted = [];

/* ISLANDS CODE 
*****************************************************************************/
function createIslandDropSpace(){
  //alert("trying to attach droppable");
  $("#droppable").droppable({
    activeClass: 'ui-state-hover',
	hoverClass:  'ui-state-active',
	drop: function(event, ui) {
		    $(this).addClass('ui-state-highlight').find('p').html('Dropped!');
		    alert("in islands.js bubble dropped ");
	      }
  });
}

function createIslands(){
  alert("entering create islands");
    
  // This is the animation timer
  animationLoopID = setInterval("animationLoop()", 50);

  // This is the timer for adding new bubbles
  addIslandLoopID = setInterval("addIsland()", 10000);
	
  // Go ahead and add the first bubble right now
  addIsland();
	
  // Get some globals
  islandWidth = parseInt($("#island-0").css("width"));
  islandScreenWidth = parseInt($("#islands").css("width"));

  islandIconClickHandler();
}

function attachDraggable(island){
  //alert("trying to attach draggable ");
  $(island).draggable({ 
       cancel: 'a.ui-icon', // clicking an icon won't initiate dragging
       cursor: 'move',
       revert: 'invalid',
       stop: function(event, ui) {
         //$(this).css("position", "relative");
         alert("top position after stopping is " + $(this).position().top + " left position after stopping is " + $(this).position().left);
         alert(" left position after stopping is " + $('#content-scroll').scrollLeft());
         
         var tmpisland = island; //this will be added to the events table
         var index     = islands.indexOf(island);
         alert("id is " + island.attr('id') + "index is " + index);
         stopAnimationLoop();
         islands.remove(index);
         startAnimationLoop();
       }
  });
}

/* ISLAND CREATION AND ANIMATION CODE 
 ***************************************************************************/
 var counter = 0;
function addIsland()
{
	// Figure out the island's id number
	var idNumber = counter; //islands.length;
	counter++;
	
	//alert("creating a new id " + idNumber);
	//alert("id is " + idNumber);

	// This should be replaced by a function that gets a random background image 
	//var randLetter = getRandomLetter();
	createAndAppendIslandDiv(idNumber)

	// Now, we need to grab a reference to the island we just added to the HTML
	var island = $("#island-" + idNumber);
	attachDraggable(island);
	
	// Add the island to the islands array
	islands.push(island);

	// Set the island's position using a "helper" function
	initializePositionForIsland(island);
}
/**************************************************************************/

function createAndAppendIslandDiv(idNumber){
  var string = new Array();
  
  string.push('<div id="island-' + idNumber + '" class="bubble-container ui-widget-content ui-corner-tr" title="Drag me to create a new event">');
  string.push('<h5 class ="ui-widget-header">Bubble Header</h5>');
  string.push('<div class = "bubble"> </div>');
  string.push('<div class = "bubbleicons">');
  string.push('<a href = "link/to/trash/script/when/we/have/js/off" title="View Event"   class="ui-icon ui-icon-zoomin">View Event</a>');
  string.push('<a href = "link/to/trash/script/when/we/have/js/off" title="Edit Event"   class="ui-icon ui-icon-pencil">Edit Event</a>');
  string.push('<a href = "link/to/trash/script/when/we/have/js/off" title="Delete Event" class="ui-icon ui-icon-trash">Delete Event</a>');
  string.push('</div>');
  string.push('</div>');

  var writestring = string.join('');
  $('#islands').append(writestring);
}
/**************************************************************************/

function initializePositionForIsland(island)
{
	// We will position the island above the top of the screen and at a random x position
	var islandHeight = parseInt(island.css("height"));
	var islandWidth  = parseInt(island.css("width"));
	
	// Start the island just to the left of the screen
	var newIslandLeft = (-1 * islandWidth);
	
	//the island top should be somewhere within the islands region
	var islands      = $('#islands');
	var position     = islands.position();
	var minHeight    = position.top;
	var maxHeight    = minHeight + islands.height() - islandHeight;
	var newIslandTop = getRandomNumber(minHeight, maxHeight);
	
	// Finally, update the island's position
	island.css("top", newIslandTop);
	island.css("left", newIslandLeft);
} 
/**************************************************************************/


/* CODE TO ANIMATE THE ISLANDS
*************************************************************************/
function animationLoop()
{
	
	// Move all the islands
	for (var index in islands)
	{
		// Access the island at the current index
		var island       = islands[index];
	
		// Move the bubble position right 1 pixel	
		var left    = parseInt(island.css("left"));
		var newLeft = left + 1;
		$(island).css("left", newLeft);
		
		//delete the island once it goes off screen ?
		if (left > islandScreenWidth - islandWidth - 10) {
		   $(island).fadeOut(100).remove();
		}

	}
}

function stopAnimationLoop(){
  clearInterval(animationLoopID);
  clearInterval(addIslandLoopID);
}

function startAnimationLoop(){
  // This is the animation timer
  animationLoopID = setInterval("animationLoop()", 50);

  // This is the timer for adding new bubbles
  addIslandLoopID = setInterval("addIsland()", 10000);
}

//extension of array remove !!! 
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
/**************************************************************************
                                       ISLAND CREATION AND ANIMATION CODE */

/* ISLAND ICON CODE 
*****************************************************************************/
function islandIconClickHandler(){
  $('.bubble-container').live ('click', function(ev) {
    var $item = $(this);
    var $target = $(ev.target);
  
    alert("bubble container was clicked ");
    
    if ($target.is('a.ui-icon-zoomin')) {  //view event 
      viewEvent($item); 
    } else if ($target.is('a.ui-icon-pencil')) { //edit event
      editEvent($item);
    } else if ($target.is('a.ui-icon-trash')) {  //delete event
      deleteEvent($item);
    }

    return false;
  });  
}

function viewEvent($item){
  alert ("trying to view the image ");
}

function editEvent($item){
  alert ("trying to edit the image ");
}

function deleteEvent($item) {
  alert ("trying to delete the image ");
  $item.fadeOut(function() {
    $item.find('a.ui-icon-trash').remove();
  });
}
/*****************************************************************************
                                                            ISLAND ICON CODE */


function getRandomNumber(minVal,maxVal)
{
  var randVal =  minVal+(Math.random()*(maxVal-minVal));
  
  return randVal;
}
