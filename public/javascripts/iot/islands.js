/* ISLAND IMAGES */
/* CODE FOR ADDING THE RANDOM ISLAND IMAGES TO AN ARRAY WITH THEIR
   CATEGORY. WE WILL PICK A RANDOM ICON FROM THIS, AND ASSOCIATE AN 
   ICON OBJECT WITH EACH EVENT OBJECT TO ALLOW FOR SOME FILTERING 
 *******************************************************************/
//var islandImagePath = "/images/floatingiconsgif/";
var islandImagePath = "/images/floatingiconspng/";
//var categories      = ["milestone","mood"];

var islandImages = ["blox.png",
				    "cap.png",				
				    "cellphone.png",
                    "donut.png",
                    "exclamation.png",             
                    "gift.png",
                    "mail.png",                    
                    "milk.png",
                    "oj.png",
                    "pc.png",
                    "pencil.png",
                    "rain.png",
                    "safetycone.png",
                    "school.png",
                    "starjump.png",
                    "truck.png",
                    "xmas.png"             
                   ];   
                                      
var moodImages   = ["blah.png",
                    "elated.png",
                    "good.png",
                    "hee.png",
                    "neh.png",
                    "sad.png",
                    "sleepy.png",
                    "unhappy.png",
                    "wink.png"
                   ];
                   
/*
var islandImages = ["blox.gif",
				    "cap.gif",				
				    "cellphone.gif",
                    "donut.gif",
                    "exclamation.gif",             
                    "gift.gif",
                    "mail.gif",                    
                    "milk.gif",
                    "oj.gif",
                    "pc.gif",
                    "pencil.gif",
                    "rain.gif",
                    "safetycone.gif",
                    "school.gif",
                    "starjump.gif",
                    "truck.gif",
                    "xmas.gif"             
                   ];   
                                      
var moodImages   = ["blah.gif",
                    "elated.gif",
                    "good.gif",
                    "hee.gif",
                    "neh.gif",
                    "sad.gif",
                    "sleepy.gif",
                    "unhappy.gif",
                    "wink.gif"
                   ];
*/

var islandIcons = new Array();                 
function islandIcon(imagepath, category){
  this.imagepath = imagepath;
  this.category  = category;
}

function addIslandIcons(){
  //alert("adding island icons ");
  for (var i = 0; i < islandImages.length; i++){
    islandIcons.push(new islandIcon(islandImagePath + islandImages[i], "milestone"));
  }
  
  for (var i = 0; i < moodImages.length; i++){
    islandIcons.push(new islandIcon(islandImagePath + "mood/" + moodImages[i], "mood"));
  }
  
  //alert("we have " + islandIcons.length + " icons");
}
/*******************************************************************/

/* ISLAND GLOBALS 
****************************************************************************/
var islandWidth;
var islandScreenWidth;
var maxScreenWidth;
var animationLoopID;
var addIslandLoopID;

var MAXISLANDS = 900;
var RANDOMLEFT = false;

// Global Islands Array
var islandObjects = new Array();
/****************************************************************************/

/* ISLANDS CODE 
*****************************************************************************/
function createIslandDropSpace(){
  //alert("trying to attach droppable");
  $("#droppable").droppable({
    activeClass: 'ui-state-hover',
	hoverClass:  'ui-state-active',
	drop: function(event, ui) {
		    //$(this).addClass('ui-state-highlight').find('p').html('Dropped!');
		    //alert("in islands.js bubble dropped ");
		    
	      }
  });
}

function initializeIslands(){
  //create the island icons object array
  addIslandIcons();
  
  // Get some globals // also got in get_events.js.erb
  islandWidth = parseInt($(".bubble-container").css("width"));
  
  islandIconClickHandler();
  
  //hover handlers
  $('.bubble-container').live('mouseover mouseout', islandHoverHandler);
  
  //textarea mouseout handler
  $('.textfield_effect').live('focusout', textareaFocusOutHandler);
  
  //delete event alert dialog
  createDeleteEventAlertDialog();

}

function startIslands(){
  //alert("entering create islands");
 
  // This is the animation timer
  animationLoopID = setInterval("animationLoop()", 50);

  // This is the timer for adding new bubbles
  addIslandLoopID = setInterval("addIsland()", 20000);
	
  // Go ahead and add the first bubble right now
  //addIsland();
}

function attachDraggable(island){
  //alert("trying to attach draggable ");
  $(island).draggable({ 
       revert: 'invalid',
       stop:    afterDraggableStopped
  });
}

function attachIconBarDraggable(island){
  //alert("trying to attach draggable ");
  $(island).draggable({ 
       revert: 'invalid',
       appendTo: "droppable",
       helper: 'clone',
	   stack: 'true',
       stop:    afterDraggableStopped
  });
}

function afterDraggableStopped(event, ui){
  var index, eindex;
  var islandptr;  
  var index;
  var top;
  var left;
  var scrollLeft;
  
  var island = $(this);
  
  //add object to events array if it isn't already there
  eindex   =  getEventObject(eventObjects, island);
  
  if (eindex == -1){
    index = deepCopyEventObject(island);
    if (index == -1){
      alert("something messed up in the deep copy");
      return;
    }
    //set the current interval of the object
    eventObjects[index].interval = currentInterval;
  }
  else{
    index = eindex;
  }
  eventObjects[index].top      = $(island).position().top;
  eventObjects[index].left     = $(island).position().left;
  scrollLeft                   = $('#content-scroll').scrollLeft();
  //alert("ID:  " +  eventObjects[index].id + " TOP: " + eventObjects[index].top + " LEFT : " + eventObjects[index].left + " SCROLLLEFT: " + scrollLeft);
  //using slider interval because it has the string instead of the number
    getTimestampFromPosition(eventObjects[index].left, scrollLeft, islandWidth, sliderInterval, currentPartLen, index);
               
  //can we populate the event form ? 
  addUpdateEventFormHandler(index);
}

function textareaFocusOutHandler(event){
   
   var parent = $(this).parent();
   var id     = parseInt($(parent).attr('id').replace(/\D/g,''));

   arrayindex  =  getEventObject(eventObjects, parent);
   
   if (arrayindex != -1){
     eventObjects[arrayindex].desc = $('#btext-' + id).val();
   }
   else{
     eventObjects[arrayindex].desc = "No Description Available";
   }
   
   //call the form handler
   updateEventDescriptionFormHandler(arrayindex);
   
}
/***************************************************************************/

/* ISLAND CREATION AND ANIMATION CODE 
 ***************************************************************************/
/* find a way to pre-populate the content space */
function populateWithIslands(){
 
  //reset array
  islandObjects = [];
  
  // set some globals // global defined in timelinemapping.js 
  islandWidth = BUBBLEWIDTH; 
  
  for (var i = 0; i < MAXISLANDS; i++){
    //shift left
    addIsland();
  }
}
/***************************************************************************/

function addIsland()
{

	// Figure out the island's id number
	var idNumber = getId(); 
	//alert("id is " + idNumber);
	
	// This should be replaced by a function that gets a random background image 
	var randomIcon = getRandomNumber(0, islandIcons.length);
	//alert("adding random icon " + randomIcon);
	
	var appendObject = $('#islands');
	createAndAppendIslandDiv(idNumber, randomIcon,appendObject);

	// Now, we need to grab a reference to the island we just added to the HTML
	var island = $("#island-" + idNumber);
	attachDraggable(island);
	
	// Set the island's position using a "helper" function
	initializePositionForIsland(island);
	
	addIslandToList(idNumber, randomIcon, island, islandObjects);
}
/**************************************************************************/

function addIslandToList(idNumber, randomIcon, island, islandArray){
  // Add the island to the islands array
  var iObject      = new eventObject();
	
  iObject.id       = idNumber;
  iObject.div      = "#island-" + idNumber;
  iObject.object   = island;
  iObject.top      = parseInt($(island).css("top"));
  iObject.left     = parseInt($(island).css("left"));
  iObject.icon     = islandIcons[randomIcon].imagepath;
	
  islandArray.push(iObject);
  
  //alert("iObject TOP: " + iObject.top + "  " + islandObjects[0].top);
  return;
}

function createAndAppendIslandDiv(idNumber,randomIcon, appendObject){
  var string = new Array();
  var icon   = "url('" + islandIcons[randomIcon].imagepath + "')";
  
  
  string.push('<div id="island-' + idNumber + '" class="bubble-container" title="Drag me to create a new isle">');
  string.push('<div class="myId" style="display:none">' + idNumber + '</div>');
  string.push('<textarea class="textfield_effect commontreb bubbletext" rows="2" col="18" maxlength="47" id="btext-' + idNumber + '"/>');
  string.push('<div class="bcontainer-' + idNumber + ' icon-lock bubbleicons" style="opacity:0">');
  string.push('<a href = "link/to/trash/script/when/we/have/js/off" title="Lock Isle" class="ui-icon ui-icon-unlocked">Lock Event</a>');
  string.push('</div>');
  string.push('<div id="bubble-' + idNumber + '" class="bubble" style="background:' + icon + '"></div>');
  string.push('<div class="bcontainer-' + idNumber + ' bubbleicons" style="opacity:0">');
  string.push('<a href = "link/to/trash/script/when/we/have/js/off" title="View Isle"   class="ui-icon ui-icon-zoomin">View Event</a>');
  string.push('<a href = "link/to/trash/script/when/we/have/js/off" title="Edit Isle"   class="ui-icon ui-icon-pencil">Edit Event</a>');
  string.push('<a href = "link/to/trash/script/when/we/have/js/off" title="Delete Isle" class="ui-icon ui-icon-trash">Delete Event</a>');
  string.push('</div>');
  string.push('</div>');

  var writestring = string.join('');
  $(appendObject).append(writestring);
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

var increment  = 0;
var globalLeft = 0;
var maxAnimate = 0;
function updatePositionsForIslands(){
   
   increment  = BUBBLEWIDTH + 100;
   globalLeft = 20;
  
   //alert("in update positions for islands " + contentWidth);
   //find max number of islands to animate
   maxAnimate = Math.ceil(contentWidth / increment);
   //alert("max Animate is " + maxAnimate);
   
   for (var i = 0; i < maxAnimate && i < islandObjects.length ; i++){
     var newIslandLeft = globalLeft;
     globalLeft       += increment;
     $(islandObjects[i].div).css("left", newIslandLeft);
   }
   
   for (var j = maxAnimate; j < islandObjects.length; j++){
     var newIslandLeft = -1 * islandWidth;
      $(islandObjects[i].div).css("left", newIslandLeft);
   }
   
   return;
}
/**************************************************************************/


/* CODE TO ANIMATE THE ISLANDS
*************************************************************************/
function animationLoop()
{	
    //alert("entering animation loop " + islandObjects.length);
    
	// Move all the islands
	for (var i = 0; i < maxAnimate ; i++){
      // Access the island at the current index
	  var island       = islandObjects[i].object;
	
	  // Move the bubble position right 1 pixel	
	  var left    = parseInt(island.css("left"));
	  var newLeft = left + 1;
	  $(island).css("left", newLeft);
		
	  //delete the island once it goes off screen ?
	  if (left > islandScreenWidth - islandWidth - 10) {
	    $(island).fadeOut(100).remove();
	    islandObjects.splice(i,1);
	  }

	}
}
/*************************************************************************/


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

  //alert("trying to attach the click handler");
  
  $('.bubble-container').live ('click', function(ev) {
    var $item = $(this);
    var $target = $(ev.target);
  
    //alert("bubble container was clicked ");
    
    if ($target.is('a.ui-icon-zoomin')) {  //view event 
      viewEvent(ev,$item); 
    } else if ($target.is('a.ui-icon-pencil')) { //edit event
      editEvent(ev,$item);
    } else if ($target.is('a.ui-icon-trash')) {  //delete event
      deleteEvent($item);
    } else if ($target.is('a.ui-icon-locked')) {  //delete event
      toggleLock($item, $target, "locked");
    } else if ($target.is('a.ui-icon-unlocked')) {  //delete event
      toggleLock($item, $target, "unlocked");
    }

    return false;
  });  
}

/* MANIPULATING THE LITTLE ICONS ....
 **********************************************************************/
function viewEvent(ev,$item){
  var ofind  =  $item.find('div.myId');
  var id     =  $(ofind).text();
  
  eventId     = id; //setting the global here 
  //alert("event id is " + eventId);

  //alert ("trying to view the image ");
  //pass this to the form ?
  getEventMediaContent();
  
  eventViewOpenClickHandler(ev);
}

function editEvent(ev,$item){
  //alert ("trying to edit the image ");
  var ofind  =  $item.find('div.myId');
  var id     =  $(ofind).text();
  
  eventId     = id; //setting the global here 
  eventEditOpenClickHandler(ev);
}

function deleteEvent($item) {
  //alert ("trying to delete the image ");
  var ofind  =  $item.find('div.myId');
  var id     =  $(ofind).text();
  
  $("#deleteevent-alert").dialog("option", "buttons", { 
                   "Ok": function() {  $item.fadeOut(function(){$item.find('a.ui-icon-trash').remove();});  $(this).dialog('close'); }, 
                   "Cancel": function() { $(this).dialog('close'); } } );
  
  $("#deleteevent-alert").dialog('open');
  
  //call the form handler 
  deleteEventFormHandler(id);
  
}

function createDeleteEventAlertDialog(){
  //convert the event window into a dialog ?
  $("#deleteevent-alert").dialog({
            autoOpen: false,
			height: 165,
			width: 240,
			resizable: false,
			position: ['center','middle'],
  });
}

function toggleLock($item, $target, lockString){
  if (lockString == "locked"){
    $target.removeClass("ui-icon-locked");
    $target.addClass("ui-icon-unlocked");
    $item.draggable( "option", "disabled", false );
  }
  else{
    $target.removeClass("ui-icon-unlocked");
    $target.addClass("ui-icon-locked");
    $item.draggable( "option", "disabled", true );
  }
}
/* MANIPULATING THE LITTLE ICONS ....
 **********************************************************************/

function islandHoverHandler(ev){
  var index = parseInt($(this).attr('id').replace(/\D/g,''));
  
  if (event.type == 'mouseover') {
     // do something on mouseover
     $(this).addClass("ui-state-hover");
     $('.bcontainer-' + index).css("opacity","1");
  } else {
     // do something on mouseout
     $(this).removeClass("ui-state-hover");
     $('.bcontainer-' + index).css("opacity","0");
  }
}
/*****************************************************************************
                                                            ISLAND ICON CODE */


/* HELPER FUNCTIONS 
 ****************************************************************************/
function getRandomNumber(minVal,maxVal)
{
  var    randVal =  Math.floor(minVal + (Math.random()*(maxVal-minVal)));
  return randVal;
}

/* used to generate an id for the bubbles. can prolly be replaced by a better
   id generator at some point 
 */
var counter = 0;
function getId(){
  counter = Math.round(new Date().getTime()); //get the epoch time in seconds
  return counter;
}

function printEventObject(object){

  alert(" id is " + object.id + " TOP: " + object.top + " LEFT:" + object.left);
}
/*****************************************************************************/


/* CREATE AN ISLANDS TOOL BAR 
 *****************************************************************************/
/*
function addIslandsToIconBar()
{

    //set up the slider
    setIslandIconBarSlider();
    
	//initialize default positions
	inc     = BUBBLEWIDTH + 50;
    newLeft = 20;
    newTop  =  0;
    //alert("new top is " + newTop);
       
	var appendObject = $('#island-scroll');
	
	// This should be replaced by a function that gets a random background image 
	for (var idx = 0; idx < islandIcons.length; idx++){
	  // Figure out the island's id number
	  var idNumber = getId(); 
	  //alert("id is " + idNumber);
	
	  createAndAppendIslandDiv(idNumber, idx,appendObject);

	  // Now, we need to grab a reference to the island we just added to the HTML
	  var island = $("#island-" + idNumber);
	  attachIconBarDraggable(island);
	
	  // Set the island's position using a "helper" function
       $(island).css("left", newLeft);
       $(island).css("top", newTop);
	
	   addIslandToList(idNumber, idx, island, islandIconBarObjects);
	   
	   //increment newLeft
	   newLeft += inc;
	   //alert("new left is " + newLeft);
	   setTimeout(5000);
	}
}
 
function setIslandIconBarSlider(){
  // initialize the content slider 
  $("#island-iconbar-slider").slider({
    animate: true,
    min:     0,
    max:     islandIcons.length,
    value:   0,
    change:  iconBarSliderChange,
    slide:   iconBarSliderSlide
  });
}
 
function iconBarSliderChange(e, ui)
{
  var maxIconScroll = $("#island-scroll").attr("scrollWidth") - 
                      $("#island-scroll").width();
  $("#island-scroll").animate({scrollLeft: ui.value * 
     (maxIconScroll / 100) }, 1000);
}

function iconBarSliderSlide(e, ui)
{
  var maxIconScroll = $("#island-scroll").attr("scrollWidth") - 
                      $("#island-scroll").width();
  $("#island-scroll").attr({scrollLeft: ui.value * (maxIconScroll / 100) });
}
*/
 /***************************************************************************
 												  CREATING AN ICON TOOL BAR */
 
 

/*FORM STUFF 
 ****************************************************************************/
function  addUpdateEventFormHandler(index){
  //alert("trying to populate these events with " + index);
  
  $('#event_eventid').val(eventObjects[index].id);
  $('#event_desc').val("");
  $('#event_div').val(eventObjects[index].div);
  $('#event_top').val(eventObjects[index].top);
  $('#event_left').val(eventObjects[index].left);
  $('#event_year').val(eventObjects[index].year);
  $('#event_month').val(eventObjects[index].month);
  $('#event_day').val(eventObjects[index].date);
  $('#event_hour').val(eventObjects[index].hour);
  $('#event_interval').val(eventObjects[index].interval);
  $('#event_icon').val(eventObjects[index].icon);
  
  //call the form submit
  $("#new_event_row").submit();
}

function updateEventDescriptionFormHandler(index){
   //lets update the form from here
   $('#event_update_eventid').val(eventObjects[index].id);
   $('#event_update_desc').val(eventObjects[index].desc);
   
   //call the form submit
   $("#update_event_desc").submit();
}
 
function deleteEventFormHandler(id){
  //lets update the form from here
   $('#event_delete_eventid').val(id);
   
   //call the form submit
   $("#delete_event_row").submit();
}

function getEventsFormHandler(){

}
/***************************************************************************
																FORM STUFF */
              