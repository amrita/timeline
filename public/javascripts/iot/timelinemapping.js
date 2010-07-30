/*GLOBAL */
var BUBBLEWIDTH = 150;  //the bubble container is 150 px wide

//zoom factors
var ZOOM100     = 50;
var ZOOM75      = 38;
var ZOOM50      = 25;
var ZOOM25      = 13;
var ZOOM10      = 5;

var islandDate = new Date();

var islandObjects        = new Array();
var islandIconBarObjects = new Array();
var eventObjects         = new Array();

function eventObject(){
  this.id         = 0;
  this.div        = "";
  this.object     = null;
  this.timestamp  = "";
  this.year       = "";
  this.month      = "";
  this.date       = "";
  this.hour       = "";
  this.interval   = LIFESPAN;
  this.currentinterval = ""; //the interval the object is in right now
  this.visibility = true;
  this.top        = 0; //object top
  this.left       = 0; //object left
  this.locked     = false; //object unlocked
  this.deleted    = false; //should we consider the object or not
  this.icon       = "";
}

/* TIME MAPPING CODE
**************************************************************************/
//Using the x, y co-ordinates and the leftScroll get the x co-ordinate and map
//an island to a time. 
function getTimestampFromPosition(x, leftScroll, islandWidth, interval, iPartLen, index){
  var offset;
  var increment;
  var timestamp;
  var nextDate;
  var xLocation  = x + leftScroll + (islandWidth/2);  // compute the x value of where the island is located. 
  
  //alert("islandWidth is " + islandWidth);
  
  increment  = Math.floor(xLocation / iPartLen); //compute the incremental step where we need 
  islandDate = new Date(birthYear,0,1);

  //we don't use the resultant next date. We just use the timestamp to track the event.
  nextDate  = getNextDate(islandDate, interval, increment); 
  timestamp = islandDate.getFullYear().toString() + islandDate.getMonth().toString() + islandDate.getDate().toString() + islandDate.getHours().toString();
  
  eventObjects[index].year      = islandDate.getFullYear();
  eventObjects[index].month     = islandDate.getMonth();
  eventObjects[index].date      = islandDate.getDate();
  eventObjects[index].hour      = islandDate.getHours();
  eventObjects[index].timestamp = timestamp;
  
  //alert("timestamp: " + timestamp);
}


/* MAPPING EVENTS TO A DIFFERENT INTERVAL 
 *************************************************************************/
function mapAllEventsToInterval(cInterval){
  for (var i = 0; i < eventObjects.length; i++){
    mapTimestampToInterval(i, cInterval);
  }
}


//when you zoom out, move the bubble to the correct position on the interval space. 
function mapTimestampToInterval(index, cInterval){
  var mapDate    = new Date(eventObjects[index].year, eventObjects[index].month, eventObjects[index].date);
  var difference = 0;
  var xPosition; 

  var objectInterval = eventObjects[index].interval; //what interval was the object originally created in 
  
  //alert(" we have " + eventObjects[index].year + "  " + eventObjects[index].month + "  " + eventObjects[index].date);
  //we are zooming in, find a way to hide the events
  //prolly loop through the events at this level and higher 
  //and turn on the invisible flag. may not need to do higher
  if (objectInterval < cInterval){
    //alert("trying to zoom in");
    //hide events at higher zoom levels
    $(eventObjects[index].object).css("visibility","hidden");    
  }
  else if (objectInterval > cInterval) {
    //alert("trying to zoom out ");
    
    //make sure you make this event visible
    $(eventObjects[index].object).css("visibility","visible");  
   
   
    difference = getDateDifference(birthDate, mapDate, intervalStrings[cInterval + 1]);
   
    //alert("difference is " + difference );
    //alert("partlen is " + intervalObjects[cInterval - 1].partlen);
    
    xPosition  = difference * intervalObjects[cInterval - 1].partlen;
    
    //alert("xPosition is" + xPosition);
    
    //update the object position
    $(eventObjects[index].object).css("left",xPosition);
    
    //update the object size 
    var nuDimension;
    var nuZoom = "";
    var zoomfactor = eventObjects[index].interval - cInterval;
    //alert("zoomfactor " + zoomfactor);
    
    var bubble = $('#bubble-' + eventObjects[index].id);
    switch (zoomfactor){
      case 1:
        nuZoom      = "80%";
        break;
      case 2:
        nuZoom      = "75%";
        break;
      case 3:
        nuZoom      = "55%";
        break;
      case 4:
        nuZoom      = "35%";
        break;
      default:
        alert("incorrect zoomfactor " + zoomfactor);
        break;
    }
    
    //alert("trying to animate");
    bubble.css("background-size",nuZoom);
    bubble.css("background-repeat","no-repeat");   
  }
  //if they are the same reset to original size and position
  else{
    
    //make sure you make this event visible
    $(eventObjects[index].object).css("visibility","visible");  
    
    //set to original position
    $(eventObjects[index].object).css("left",eventObjects[index].left);
    
    var bubble  = $('#bubble-' + eventObjects[index].id);
    var nuZoom  = "100%";
        
    //set to original div size
    bubble.css("background-size",nuZoom);
    bubble.css("background-repeat","no-repeat");
  }
  
  return;
  
}
/*************************************************************************
                                  MAPPING EVENTS TO A DIFFERENT INTERVAL */
 
 

/* COPY THE ISLAND OBJECT OVER TO THE EVENTS ARRAY 
 *************************************************************************/
function deepCopyEventObject(island){
  var index;
  var islandArray;
  
  //look for the object in the global array
  index       =  getEventObject(islandObjects, island);
  islandArray = islandObjects;
  
  //couldn't find it .. look in the icon bar
  if (index == -1){
    index       =  getEventObject(islandIconBarObjects, island);
    islandArray = islandIconBarObjects;
  }
  
  if (index != -1){
    var newevent = new eventObject();
    newevent.id         = islandArray[index].id;
    newevent.div        = islandArray[index].div;
    newevent.object     = islandArray[index].object;
    newevent.top        = islandArray[index].top; //object top
    newevent.left       = islandArray[index].left; //object left
    newevent.icon       = islandArray[index].icon; //object left
    eventObjects.push(newevent);
    
    //hmm can we remove this element from islandObjects without screwing
    //it all up ?
    islandArray.splice(index,1);
    
    return eventObjects.length - 1; //index is always length - 1
  }
  
  return -1;
}

//searches through the event object array for the div and returns
//a pointer to the object
function getEventObject(array, object){
  var len = array.length;
 
  for (var i = 0; i < len; i++){
    if ( object.attr('id') == array[i].object.attr('id')){
      return i;
    }
  }

  return -1;
}
/*************************************************************************/