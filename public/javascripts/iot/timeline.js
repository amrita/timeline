/* GLOBALS
 ************************************************************************/
 var startDate;
 var endDate;
 var birthYear = 2000;
 var lifeSpan  = "My Life So Far";
 var sliderInterval  = "";
 var prevInterval;
 
 var sliderDate   = new Date(); 
 var currentDate  = new Date();
 var birthDate    = new Date();
 
 
 
 var LIFESPAN = 1;
 var YEAR     = 2;
 var MONTH    = 3;
 var WEEK     = 4;
 var DAY      = 5;
 var HOUR     = 6;
 
 var TIMELINELEN = 960; //default timeline length
 
var Months        = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var weekDays      = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var Hours         = ["12 A.M.", "1 A.M.", "2 A.M.", "3 A.M.", "4 A.M.", "5 A.M.", "6 A.M.", "7 A.M.", "8 A.M.", "9 A.M.", "10 A.M.", "11 A.M.", 
				     "12 P.M.", "1 P.M.", "2 P.M.", "3 P.M.", "4 P.M.", "5 P.M.", "6 P.M.", "7 P.M.", "8 P.M.", "9 P.M.", "10 P.M.", "11 P.M." ];

var daysofmonth   = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var daysofmonthLY = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var nMonths     = 12;
var nWeeks      = 52;
var nDaysInWeek = 7;
var nDaysInYear = 365;
var nHours      = 24;

var nIntervals      = 5; //life, year, month, week, day
var intervalStrings = ["", "", "years","months","weeks","days","hours"];

var currentInterval; //the default is life
var currentPartLen  = 0; //the length of each date interval 

var windowWidth    = TIMELINELEN; //the width of the window
var contentWidth   = TIMELINELEN; //width of the timeline
var timelinePalette  = ["#BFD73B","#BFD73B","#F05F8A","#F15F2D","#AFDFE5","#FFE73B"];

/* ICONS
*************************************************/
//year, month, week, day
var intervalLeft   = ["","","/images/icons/slider_year_L.png","/images/icons/slider_month_L.png","/images/icons/slider_week_L.png","/images/icons/slider_day_L.png"];
var intervalRight  = ["","","/images/icons/slider_year_R.png","/images/icons/slider_month_R.png","/images/icons/slider_week_R.png","/images/icons/slider_day_R.png"];

//to display on hover
var hoverLeft  = ["","","/images/icons/slider_year_L_bg.png","/images/icons/slider_month_L_bg.png","/images/icons/slider_week_L_bg.png","/images/icons/slider_day_L_bg.png"];
var hoverRight = ["","","/images/icons/slider_year_R_bg.png","/images/icons/slider_month_R_bg.png","/images/icons/slider_week_R_bg.png","/images/icons/slider_day_R_bg.png"];

/* INITIALIZE 
 ************************************************************************************/
jQuery.ajaxSetup({ 
  'beforeSend': function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
})

jQuery.fn.submitWithAjax = function() {
  this.submit(function() {
    $.post($(this).attr("action"), $(this).serialize(), null, "script");
    return false;
  });
  return this;
};

$(document).ready(function(){

  $("#new_event_row").submitWithAjax();
  $("#get_event_rows").submitWithAjax();

  //Set maxlength of all the textarea (call plugin)
  $().maxlength();

  //resize the windows
  resizeWindows();
    
  //compute the start and end dates
  birthDate   = new Date(birthYear,0,1); /********* GLOBAL VAR SETUP *********/
  startDate   = new Date(birthYear,0,1);
  endDate     = new Date((new Date).getFullYear(),nMonths - 1, daysofmonth[nMonths - 1]);
  
  //initialize the slider date
  initializeSliderDate();
  
  $('#prev, #next').click(handleSliderArrowClicked);
  
  //create the timelines
  prevInterval    = LIFESPAN;
  currentInterval = LIFESPAN;
  createTimelines();

  $('#clickme')
			.button()
			.click(function() {
			    alert(" current slider date is " + sliderDate.getFullYear() + "  " + sliderDate.getMonth() + "  " + sliderDate.getDate() + "  slider value is " + slidervalue);
			    alert("total elements are " + islands.length);
			});
			
  $("#toggle").button().click(eventViewOpenClickHandler);

  //create the interval icon deck
  createIntervalIconDeck();
  
  //create the islands and a drag and drop space
  initializeIslands();
  createIslandDropSpace();
  
  //initialize the event editor and the event editor space
  initializeEditLayout();
  
  //initialize the event viewer and the event viewer space
  initializeEventViewer();
});

function resizeWindows(){
  // set the timeline areas to the window width 
  var offset  = 20;
  windowWidth = $(window).width() - offset;
  
  $('#main').width(windowWidth);
  $('#content-scroll').width(windowWidth);
  $('#islands').width(windowWidth);
  $('#droppable').width(windowWidth);

}

//update island and droppable window sizes to match the context width
function updateWindowSize(contentWidth){
  $('#islands').width(contentWidth);
  islandScreenWidth = contentWidth;
  $('#droppable').width(contentWidth);
}
/************************************************************************************
																		 INITIALIZE */
                                               
                                               
/* TIMELINE INTERVAL ICONS CODE 
 *********************************************************************/  
 function createIntervalIconDeck(){
 var html = new Array();
 
   for (var i = 1; i <= nIntervals; i++){
     html.push('<div id = "interval-' + i + '" class="intervalicon levels"></div>');
     html.push('<div id = "intervalbg-' + i + '" class="intervalicon levels"></div>');
   }
   var writestring = html.join('');
   
   $('#intervals').append(writestring);
   
   //adjust the icon positions
   adjustIconPositions();
   
   //populate the icon deck
   updateIntervalIconDeck(1);
   
   //bind the hover handler
   intervalIconHoverHandler();
   
   //bind the click handler
   $('.intervalicon').click(intervalIconClickHandler);
 }
 /*********************************************************************/
 
 function updateIntervalIconDeck(currentIdx){
  
  for (var i = 1; i < currentIdx ; i++){
    var newLIcon    = "url('" + intervalLeft[i] + "')";
    var newLHover   = "url('" + hoverLeft[i] + "')";
    
    $('#interval-' + i).css("background",newLIcon);
    $('#intervalbg-' + i).css("background",newLHover);
  }
 
  for (var i = currentIdx; i <= nIntervals ; i++){
    var newRIcon    = "url('" + intervalRight[i] + "')";
    var newRHover   = "url('" + hoverRight[i] + "')";
    
    $('#interval-' + i).css("background",newRIcon);
    $('#intervalbg-' + i).css("background",newRHover);
  }
}
/*********************************************************************/

function adjustIconPositions(){
  var width  = parseInt($('.intervalicon').width());
  var start  = (parseInt($('#intervals').width()) - (width * nIntervals)) / 2;
  var offset = 10;
  
  for(var i = 1; i <= nIntervals; i++){
    $('#interval-' + i).css("margin-left",start);
    $('#interval-' + i).css("z-index",10);
    $('#intervalbg-' + i).css("margin-left",start);
    start += width + offset;
  }
}
/*********************************************************************/

function intervalIconHoverHandler(){
  $('.intervalicon').hover(
   function() {
     $(this).animate({"opacity": "0"}, "slow");
   },
   function() {
     $(this).animate({"opacity": "1"}, "slow");
   });
}

function intervalIconClickHandler(event){
  var cInterval   =  parseInt($(this).attr('id').replace(/\D/g,''));
  currentInterval =  cInterval; /********* GLOBAL VAR SETUP *********/
 
  //update the interval
  updateInterval(cInterval);
  
  //update the icon deck
  updateIntervalIconDeck(cInterval);
  
  $(this).css("opacity", "0"); //not working
}
/********************************************************************
                                      TIMELINE INTERVAL ICONS CODE **/ 


/* TIMELINE INTERVAL SELECTION BEFORE CREATION 
 *********************************************************************/
var intervalObjects = new Array();
function intervalObject(){
  this.interval       = LIFESPAN;
  this.partsinterval  = "";
  this.parts          = 0;
  this.partlen        = 0;
  this.sliderinterval = "";
}
 
function createTimelines(){
  var html    = "";
  var objects = new Array();
  
  //create a new content holder for each one 
  for (var i = 1; i <= nIntervals; i++){
   html += '<div class="contentholder" id="content-holder-' + i + '"></div>'; 
   var obj = new intervalObject();
   intervalObjects.push(obj);
  }
  $('#content-scroll').append(html);
  
  addLife();
  addYears();
  addMonths();
  addWeeks();
  addDays();
  
  //show the life time timeline 
  updateInterval(LIFESPAN);
}
 
function addLife(){
  intervalObjects[LIFESPAN - 1].sliderinterval = intervalStrings[YEAR];
  createTimeline(LIFESPAN, "life", 1, "years",1, null);  
}

function addYears(){
  intervalObjects[YEAR - 1].sliderinterval = intervalStrings[MONTH];
  createTimeline(YEAR, "years", 1, "months",1, Months);
}

function addMonths(){
  intervalObjects[MONTH - 1].sliderinterval = intervalStrings[DAY];
  createTimeline(MONTH, "months", 1, "days",1, null);
}

function addWeeks(){
  intervalObjects[WEEK - 1].sliderinterval = intervalStrings[WEEK];
  createTimeline(WEEK, "weeks", 1, "weeks",0, weekDays);
}

function addDays(){
  intervalObjects[DAY - 1].sliderinterval = intervalStrings[HOUR];
  createTimeline(DAY, "days", 1, "hours",0, Hours);
}


function updateInterval(cInterval){
  
  //set all the intervals to display none. do not use visibility that screws
  //this up. 
  for (var i = 1; i <= nIntervals; i++){
    $('#content-holder-' + i).css("display","none");
  }
  
  //update visibility and width for this interval
  var cObject = $('#content-holder-' + cInterval);
  $(cObject).css("display","inline");
  
  //update the content window sizes  
  updateWindowSize($(cObject).width());
  
  //populate window with static islands
  //populateWithIslands($(cObject).width());
  
  //update the slider initialize the slider max value, and then set 
  //slider interval to compute the correct zooming points
  initializeContentSlider(intervalObjects[cInterval - 1].partsinterval, intervalObjects[cInterval - 1].parts);
  sliderInterval = intervalObjects[cInterval - 1].sliderinterval;
  
  //update the color palette. set background color for this interval.
  $('.content-item').css("background", timelinePalette[cInterval]);
  
  //set ze globals 
  currentPartLen =  intervalObjects[cInterval - 1].partlen; /********* GLOBAL VAR SETUP *********/

  //trying to map ze events
  mapAllEventsToInterval(cInterval);
  
  //save the current interval for the next update
  prevInterval = cInterval;
}
/********************************************************************
                        TIMELINE INTERVAL SELECTION BEFORE CREATION */


/* TIMELINE CREATION CODE
 *********************************************************************/
function createTimeline(sInterval, segmentInterval, sStep, partsInterval, pStep, intervalStrings, object){
  var days = daysofmonth;
  
  //initialize current date
  initializeCurrentDate();

  //compute the number of segments to be added 
  var nSegments = getDateDifference(startDate,endDate, segmentInterval) + sStep;
  var string    = new Array();
  
  //compute and set the total width of content-holder
  contentWidth = windowWidth * nSegments;
  $('#content-holder-' + sInterval).width(contentWidth);
  
  //compute the number of parts the segments should be divided into
  if (partsInterval == "weeks"){
    var nParts = nSegments * nDaysInWeek;
  }
  else{
    var nParts = getDateDifference(startDate,endDate, partsInterval) + pStep;
  }
  var nPartLen   = parseInt(contentWidth / nParts);
  intervalObjects[sInterval - 1].partlen = nPartLen;
  
  //compute parts per segment
  nPartsPerSegment = Math.ceil(nParts/nSegments);
  
  //save the interval parts and parts interval values for the slider 
  // instantiation
  intervalObjects[sInterval - 1].partsinterval = partsInterval;
  intervalObjects[sInterval - 1].parts         = nParts;

  
  if (segmentInterval == "months"){ 
    //add one segment at a time and add the total part labels to each segment
    for (var i = 0; i < nSegments; i++){
      string.push('<div class="content-item" style="width:' + windowWidth + 'px">');
      //find a way to add the part labels here 
      if (isLeapYear(currentDate.getFullYear()))
        days = daysofmonthLY; 
      else
        days = daysofmonth;
      nPartsPerSegment = days[currentDate.getMonth()];
      labelstring = createLabels(0, nPartsPerSegment, nPartLen, partsInterval, intervalStrings, segmentInterval);
      string.push(labelstring);
      string.push('</div>');
    }  
  }
  else{
    //add one segment at a time and add the total part labels to each segment
    for (var i = 0; i < nSegments; i++){
      string.push('<div class="content-item" style="width:' + windowWidth + 'px">');
      //find a way to add the part labels here 
      labelstring = createLabels(0, nPartsPerSegment, nPartLen, partsInterval, intervalStrings, segmentInterval);
      string.push(labelstring);
      string.push('</div>');
    }
  }
  
  //add all the segments to the content holder
  var writestring = string.join('');
  var element     = document.getElementById('content-holder-' + sInterval);
  withRemove(element,writestring);
} // createTimeline ends


/* Supposedly faster than innerHTML = */
function withRemove(el,html){
  var nextSibling = el.nextSibling;
  var parent = el.parentNode;
  parent.removeChild(el);
  el.innerHTML = html;
  if(nextSibling)
    parent.insertBefore(el,nextSibling)
  else
    parent.appendChild(el);
} 
/****************************************************************************
												     TIMELINE CREATION CODE */
												     

/* TIMELINE LABEL CREATION CODE
 *****************************************************************************/
 function createLabels(startIdx, nParts, nPartLen, interval, intervalStrings, segmentInterval){
   var lstring    = new Array();
   var nextDate;
   
   //lets now try to compute the overall label for all these parts first before the for loop gets incremented
   // and throws it off by one. 
   var datelabel = getDateLabel(segmentInterval);
   
   lstring.push('<table class="partstable"><tbody><tr>');
   //add the total part labels to each segment
   if (interval != "hours")
     nextDate = parseInt(getNextDate(currentDate, interval,0));
   else
     nextDate = 0;
   for (var j = startIdx; j < nParts; j++){
     if (intervalStrings){
       lstring.push('<td id="part-' +  interval + j  + '" class="parts commontreb" style="width:' + nPartLen + 'px">' + intervalStrings[nextDate] + '</td>');
     }
     else{
       lstring.push('<td id="part-' +  interval + j  + '" class="parts commontreb" style="width:' + nPartLen + 'px">' + nextDate + '</td>'); 
     }
     if (interval != "hours"){
       nextDate = parseInt(getNextDate(currentDate, interval,1));
     }
     else
       nextDate = j + 1;
       
     if ((interval == "weeks") && (j < (nParts - 1))){
       datelabel += getDateLabel(segmentInterval);
     }
   } //for ends
   lstring.push('</tr>');
   
   //now add the overall label for these parts
   if (segmentInterval == "weeks"){
     lstring.push('<tr>');
     lstring.push(datelabel);
     lstring.push('</tr>');
   }
   else{
     lstring.push('<tr><td class="tdates commontreb" colspan = "' + nParts + 'style="width:' + nPartLen * nParts + 'px">' + datelabel + '</td></tr>');
   }
   lstring.push('</tbody></table>');
   
   //add all the segments to the content holder
   var labelstring = lstring.join('');
  
   return labelstring;
 }
 
 
 function getDateLabel(interval){
   var dlabel    = " ";
   var tmpstring = " ";
   var cdate  = currentDate.getDate();
   var cmonth = currentDate.getMonth();
   var cyear  = currentDate.getFullYear();
   
   switch(interval){
     case "life":
       dlabel = lifeSpan;
       break;
     case "years":
       dlabel = cyear;
       break;
     case "months":
       dlabel = Months[cmonth] + ", " + cyear;
       break;
   case "weeks":
       tmpstring  = Months[cmonth] + "  " + cdate + ",  " + cyear;
       dlabel     = '<td class="tdates commontreb">' + tmpstring + '</td>';
       break;
   case "days":
       dlabel = Months[cmonth] + "  " + cdate + ",  " + cyear;
       getNextDate(currentDate,"days",1);
       break;
   default:
     alert("wrong interval type to build a label from ");
   }
   
   return dlabel;
 }
/*****************************************************************************
												TIMELINE LABEL CREATION CODE */
												     
											
/* DATE AND TIME FUNCTIONS
 ***********************************************************************/
function getDateDifference(date1,date2,interval) {
    var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    switch (interval) {
        case "years": return date2.getFullYear() - date1.getFullYear();
        case "months": return (
            ( date2.getFullYear() * 12 + date2.getMonth() )
            -
            ( date1.getFullYear() * 12 + date1.getMonth() )
        );
        case "weeks"  : return Math.floor(timediff / week);
        case "days"   : return Math.floor(timediff / day); 
        case "hours"  : return Math.floor(timediff / hour); 
        case "minutes": return Math.floor(timediff / minute);
        case "seconds": return Math.floor(timediff / second);
        case "life"   : return 0;
        default: return undefined;
    }
    
}
/************************************************************************/	

function getNextDate(myDate,interval,step){
   
  switch(interval){
    case "years":
      myDate.setFullYear(myDate.getFullYear() + step);
      return myDate.getFullYear();
    case "months":
      myDate.setMonth(myDate.getMonth() + step); //months are numbered from 0-11
      return myDate.getMonth();
    case "weeks":
      myDate.setDate(myDate.getDate() + step); // there is no setDay .... aarrrgh !!
      return myDate.getDay();
    case "days":
      myDate.setDate(myDate.getDate() + step);
      return myDate.getDate();
    case "hours":
      myDate.setHours(myDate.getHours() + step);
      return myDate.getHours();
    default:
      alert("in get next date we have a wrong interval type " + interval);
      break; 
  }
}

function initializeCurrentDate(){
  currentDate.setFullYear(birthYear,0,1);
}

function initializeSliderDate(){
  sliderDate.setFullYear(birthYear,0,1);
}

function isLeapYear(year) {
    if ((year/4)   != Math.floor(year/4))   return false;
    if ((year/100) != Math.floor(year/100)) return true;
    if ((year/400) != Math.floor(year/400)) return false;
    return true;
}
/**********************************************************************
                                               DATE AND TIME FUNCTIONS*/

/* TIMELINE SLIDER CODE 
 *********************************************************************/
var maxvalue;
var mScroll;
function initializeContentSlider(partsInterval, nParts){
      maxvalue  = nParts;
  var zoomvalue = 1;
  var minvalue  = 0;
  
  if (nParts == "years") minvalue - 1;
  
  zoomvalue = setTimelineZoomPoint(partsInterval);
  slidervalue = prevslidervalue = zoomvalue;
  //alert("zoom value is " + zoomvalue);
  
  // initialize the content slider 
  $("#content-slider").slider({
    animate: true,
    min:     minvalue,
    max:     nParts,
    value:   zoomvalue,
    change:  handleSliderChange,
    slide:   handleSliderSlide
  });
 
}

/* find out the correct place that the timeline should be zoomed to once 
   the slider changes 
 ************************************************************************/
function setTimelineZoomPoint(cInterval){
  var zoomvalue = 1;
  
  //alert("in get zoom point slider date is " + sliderDate.getFullYear() + "  " + sliderDate.getMonth() + "  " + sliderDate.getDate());
  
  switch(cInterval){
    case "years":
      zoomvalue = getDateDifference(birthDate, sliderDate, "years");
      break;
    case "months":
      zoomvalue = getDateDifference(birthDate, sliderDate, "months");
      break;
    case "days":
      zoomvalue = getDateDifference(birthDate, sliderDate, "days");
      break;
    case "weeks":
      zoomvalue = getDateDifference(birthDate, sliderDate, "days");
      break;
    case "hours":
      zoomvalue = getDateDifference(birthDate, sliderDate, "hours");
      break;
    default:
      alert("trying to get the zoom point for an incorrect interval");
      break;
  }
  
  return zoomvalue;
}
/************************************************************************/

/************************************************************************/
function zoomOutTimeline(value){
  //$('.content-item').show('slide',null,'slow',null);
  /*
  $(".content-item").animate( { width:"120%" }, { duration:300 } )
                .delay(200)
  				.animate( { height:"22px", width: contentWidth, backgroundColor: timelinePalette[value] }, { duration:300 } );
  */
}
/************************************************************************/


/********************************************************************
                                               TIMELINE SLIDER CODE */


/* SLIDER HANDLERS 
*****************************************************************************/
var slidervalue     = 1;
var prevslidervalue = 1;
var sliderstep = 0;
function handleSliderChange(e, ui)
{
  slidervalue = ui.value; 
  var maxScroll = $("#content-scroll").attr("scrollWidth") - 
                  $("#content-scroll").width();
                  
  $("#content-scroll").animate({scrollLeft: ui.value * 
     (maxScroll / maxvalue) }, 1000); 
 
  sliderstep = slidervalue - prevslidervalue;
  getNextDate(sliderDate,sliderInterval,sliderstep);
  prevslidervalue = slidervalue;
}

function handleSliderSlide(e, ui)
{
  slidervalue = ui.value;
  var maxScroll = $("#content-scroll").attr("scrollWidth") - 
                  $("#content-scroll").width();
  
  $("#content-scroll").attr({scrollLeft: ui.value * (maxScroll / maxvalue) });
  
  sliderstep = slidervalue - prevslidervalue;
  getNextDate(sliderDate,sliderInterval,sliderstep);
  prevslidervalue = slidervalue;
}

function handleSliderArrowClicked(event, ui){
   //alert("arrow clicked");
   
   if ($(this).attr("id") == "prev"){
     if (slidervalue == 0) return;
     slidervalue = prevslidervalue - 1;
     sliderstep  = -1;
     getNextDate(sliderDate,sliderInterval,sliderstep);
   }
   else if ($(this).attr("id") == "next"){
     if (slidervalue == maxvalue) return;
     slidervalue = prevslidervalue + 1;
     sliderstep  = 1;
     getNextDate(sliderDate,sliderInterval,sliderstep);
   }
   else{
     alert("this slider arrow name does not exist");
   }
   
   $("#content-slider").slider( "option", "value", slidervalue);
   prevslidervalue = slidervalue;
   
   return;
}
/****************************************************************************
														   SLIDER HANDLERS*/	
														   

/* HELPER FUNCTIONS
 ****************************************************************************/
 
/* restrict text area length */
jQuery.fn.maxlength = function(){
    $("textarea[@maxlength]").keypress(function(event){
        var key = event.which;
        //all keys including return.
        if(key >= 33 || key == 13) {
            var maxLength = $(this).attr("maxlength");
            var length = this.value.length;
            if(length >= maxLength) {
                event.preventDefault();
            }
        }
    });
}
/* HELPER FUNCTIONS
 ****************************************************************************/
														   
