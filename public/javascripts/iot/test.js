/* GLOBALS
 ************************************************************************/
 var startDate;
 var endDate;
 var isTimelineDateSet = false;
 var birthYear = 2000;
 var lifeSpan  = "My Life Span";
 var sliderInterval  = "";
 var prevInterval    = 1;
 var sliderDate   = new Date(); 
 var currentDate  = new Date();
 var birthDate    = new Date();
 
 var LIFESPAN = 1;
 var YEAR     = 2;
 var MONTH    = 3;
 var WEEK     = 4;
 var DAY      = 5;
 
 var TIMELINELEN = 960; //default timeline length
 
var Months        = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var weekDays      = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

var daysofmonth   = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var daysofmonthLY = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var nMonths     = 12;
var nWeeks      = 52;
var nDaysInWeek = 7;
var nDaysInYear = 365;
var nHours      = 24;
var nIntervals  = 5; //life, year, month, week, day

var windowWidth    = TIMELINELEN; //the width of the window
var contentWidth   = TIMELINELEN; //width of the timeline
var timelinePalette  = ["#d70377", "#d70377","#fe9400","#666764", "#37bfe6","#7bd80d"];

/* ICONS
*************************************************/
//year, month, week, day
var intervalLeft   = ["","","images/icons/slider_year_L.png","images/icons/slider_month_L.png","images/icons/slider_week_L.png","images/icons/slider_day_L.png"];
var intervalRight  = ["","","images/icons/slider_year_R.png","images/icons/slider_month_R.png","images/icons/slider_week_R.png","images/icons/slider_day_R.png"];

//to display on hover
var hoverLeft  = ["","","images/icons/slider_year_L_bg.png","images/icons/slider_month_L_bg.png","images/icons/slider_week_L_bg.png","images/icons/slider_day_L_bg.png"];
var hoverRight = ["","","images/icons/slider_year_R_bg.png","images/icons/slider_month_R_bg.png","images/icons/slider_week_R_bg.png","images/icons/slider_day_R_bg.png"];

/* INITIALIZE 
 ************************************************************************************/
$(document).ready(function(){
  //resize the windows
  resizeWindows();
    
  //compute the start and end dates
  birthDate   = new Date(birthYear,0,1);
  startDate   = new Date(birthYear,0,1);
  endDate     = new Date((new Date).getFullYear(),nMonths - 1, daysofmonth[nMonths - 1]);
  
  //initialize the slider date
  initializeSliderDate();
  
  //create the timelines
  updateInterval(LIFESPAN);

  $('#clickme')
			.button()
			.click(function() {
			    alert(" current slider date is " + sliderDate.getFullYear() + "  " + sliderDate.getMonth() + "  " + sliderDate.getDate() + "  slider value is " + slidervalue);
			    alert("total elements are " + islands.length);
			});

  //create the interval icon deck
  createIntervalIconDeck();
  
  //create the islands and a drag and drop space
  createIslands();
  createIslandDropSpace();
});

function resizeWindows(){
  // set the timeline areas to the window width 
  windowWidth = $(window).width();
  var offset  = 20;
  //alert("winwidth " + winWidth);
  
  $('#main').width(windowWidth - offset);
  $('#content-scroll').width(windowWidth - offset);
  $('#islands').width(windowWidth - offset);
  $('#droppable').width(windowWidth - offset);

}

//update island and droppable window sizes to match the context width
function updateWindowSize(contentWidth){
  $('#islands').width(contentWidth);
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
function createTimeInterval(interval){
  
  switch(interval){
    case LIFESPAN:
      addLife();
      break;
    case YEAR:
      addYears();
      break;
    case MONTH:
      addMonths();
      break;
    case WEEK:
      addWeeks();
      break;
    case DAY:
      addDays();
      break;
  }
}

function addLife(){
  sliderInterval = "years";
  createTimeline(LIFESPAN, "life", 1, "years",1, null);  
}

function addYears(){
  sliderInterval = "months";
  createTimeline(YEAR, "years", 1, "months",1, Months);
}

function addMonths(){
  sliderInterval = "days";
  createTimeline(MONTH, "months", 1, "days",1, null);
}

function addWeeks(){
  sliderInterval = "weeks";
  createTimeline(WEEK, "weeks", 1, "weeks",0, weekDays);
}

function addDays(){
  sliderInterval = "hours";
  createTimeline(DAY, "days", 1, "hours",0, null);
}

function updateInterval(cInterval){
  //remove the existing interval
  clearTimeInterval();
  
  //create a new content holder
  $('#content-scroll').append('<div id="content-holder"></div>');
  
  //create a new time interval and add to this new content holder
  createTimeInterval(cInterval);
  
  prevInterval = cInterval; // save the previous interval .. is this going to work ?
}

function clearTimeInterval(){
  var element = document.getElementById('content-holder');
  removeElement(element);
}

function removeElement(el){
  var nextSibling = el.nextSibling;
  var parent = el.parentNode;
  parent.removeChild(el);
} 
/********************************************************************
                        TIMELINE INTERVAL SELECTION BEFORE CREATION */


/* TIMELINE CREATION CODE
 *********************************************************************/
function createTimeline(sInterval, segmentInterval, sStep, partsInterval, pStep, intervalStrings){
  var days = daysofmonth;
  
  //initialize current date
  initializeCurrentDate();

  //compute the number of segments to be added 
  var nSegments = getDateDifference(startDate,endDate, segmentInterval) + sStep;
  var string    = new Array();
  
  //compute the total width of content-holder
  contentWidth = windowWidth * nSegments;
  $('#content-holder').width(contentWidth);
  
  //update the other window sizes also
  updateWindowSize(contentWidth);
  
  //compute the number of parts the segments should be divided into
  if (partsInterval == "weeks"){
    var nParts = nSegments * nDaysInWeek;
  }
  else{
    var nParts = getDateDifference(startDate,endDate, partsInterval) + pStep;
  }
  var nPartLen = parseInt(contentWidth / nParts);
  
  //compute parts per segment
  nPartsPerSegment = Math.ceil(nParts/nSegments);
  
  //initialize the slider
  initializeContentSlider(partsInterval, nParts);
 
  if (segmentInterval == "months"){ 
    //add one segment at a time and add the total part labels to each segment
    for (var i = 0; i < nSegments; i++){
      string.push('<div class="content-item" style="width:' + windowWidth + '">');
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
      string.push('<div class="content-item" style="width:' + windowWidth + '">');
      //find a way to add the part labels here 
      labelstring = createLabels(0, nPartsPerSegment, nPartLen, partsInterval, intervalStrings, segmentInterval);
      string.push(labelstring);
      string.push('</div>');
    }
  }
  
  //add all the segments to the content holder
  var writestring = string.join('');
  var element     = document.getElementById('content-holder');
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
       lstring.push('<td id="part-' +  j  + '" class="parts commonmono" style="width:' + nPartLen + '">' + intervalStrings[nextDate] + '</td>');
     }
     else{
       lstring.push('<td id="part-' +  j  + '" class="parts commonmono" style="width:' + nPartLen + '">' + nextDate + '</td>'); 
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
     lstring.push('<tr><td class="tdates commonmono" colspan = "' + nParts + 'style="width:' + nPartLen * nParts + '">' + datelabel + '</td></tr>');
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
       dlabel     = '<td class="tdates commonmono">' + tmpstring + '</td>';
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
      alert("in get next date we have a wrong interval type ");
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
/****************************************************************************
														   SLIDER HANDLERS*/
														   
														   
														   

/* ISLANDS CODE 
*****************************************************************************/
/*
function createIslandDropSpace(){
  $("#droppable").droppable({
    activeClass: 'ui-state-hover',
	hoverClass:  'ui-state-active',
	drop: function(event, ui) {
		    $(this).addClass('ui-state-highlight').find('p').html('Dropped!');
		    alert("bubble dropped ");
	      }
  });
}

function createIslands(){

}

function attachDraggable(){
  $("#bubble").draggable({ 
       revert: 'invalid',
       stop: function(event, ui) {
         alert("top position after stopping is " + $(this).position().top + " left position after stopping is " + $(this).position().left);
        // alert("scroll top position after stopping is " + $(this).scrollTop() + " left position after stopping is " + $(this).scrollLeft();
       }
  });
}
*/
/****************************************************************************
                                                               ISLANDS CODE */
