/* GLOBALS
 ************************************************************************/
 var startDate;
 var endDate;
 var currentDate;
 var birthYear = 2000;
 var lifeSpan  = "My Life Span";
 
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

$(document).ready(function(){
  // set the timeline areas to the window width 
  var winWidth = $(window).width();
  var offset   = 20;
  //alert("winwidth " + winWidth);
  
  $('#main').width(winWidth - offset);
  $('#content-scroll').width(winWidth - offset);
  
  
  //compute the start and end dates
  startDate   = new Date(birthYear,0,1);
  endDate     = new Date((new Date).getFullYear(),nMonths - 1, daysofmonth[nMonths - 1]);
  
  addMonths();

  $('#clickme')
			.button()
			.click(function() {
			    alert("the current slider value is " + slidervalue + " max value is " + maxvalue);
			});
  
});


function initializeContentSlider(nParts){
  // initialize the content slider 
  $("#content-slider").slider({
    animate: true,
    max:     nParts,
    change:  handleSliderChange,
    slide:   handleSliderSlide
  });
}

/* TIMELINE INTERVAL SELECTION BEFORE CREATION 
 *********************************************************************/
function selectTimeInterval(interval){
  
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
  createTimeline("life", 1, "years",1, null);  
}

function addYears(){
  createTimeline("years", 1, "months",1, Months);
}

function addMonths(){
  createTimeline("months", 1, "days",1, null);
}

function addWeeks(){
  createTimeline("weeks", 1, "weeks",0, weekDays);
}

function addDays(){
  createTimeline("days", 1, "hours",0, null);
}


function clearTimeLineInterval(){

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
function createTimeline(segmentInterval, sStep, partsInterval, pStep, intervalStrings){
  var days = daysofmonth;
  
  //initialize current date
  initializeCurrentDate();

  //compute the number of segments to be added 
  var nSegments = getDateDifference(startDate,endDate, segmentInterval) + sStep;
  var string    = new Array();
  
  //compute the total width of content-holder
  var contentWidth = nSegments * TIMELINELEN;
  $('#content-holder').width(contentWidth);
  
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
  initializeContentSlider(nParts)
  
  if (segmentInterval == "months"){
    //add one segment at a time and add the total part labels to each segment
    for (var i = 0; i < nSegments; i++){
      string.push('<div class="content-item">');
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
      string.push('<div class="content-item">');
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
       lstring.push('<td id="part-' +  j  + '" class="parts" style="width:' + nPartLen + '">' + intervalStrings[nextDate] + '</td>');
     }
     else{
       lstring.push('<td id="part-' +  j  + '" class="parts" style="width:' + nPartLen + '">' + nextDate + '</td>'); 
     }
     if (interval != "hours"){
       nextDate = parseInt(getNextDate(currentDate, interval,1));
     }
     else
       nextDate = j + 1;
       
     if (interval == "weeks"){
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
     lstring.push('<tr><td class="tdates" colspan = "' + nParts + 'style="width:' + nPartLen * nParts + '">' + datelabel + '</td></tr>');
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
       dlabel     = '<td class="tdates">' + tmpstring + '</td>';
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
												     
											

/************************************************************************/
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

function getNextDate(mydate,interval,step){
  //var step = 1;
  var next;
  tmpdate   = new Date(mydate);
  
  switch(interval){
    case "years":
      currentDate.setFullYear(tmpdate.getFullYear() + step);
      return currentDate.getFullYear();
    case "months":
      currentDate.setMonth(tmpdate.getMonth() + step); //months are numbered from 0-11
      return currentDate.getMonth();
    case "weeks":
      currentDate.setDate(tmpdate.getDate() + step); // there is no setDay .... aarrrgh !!
      return currentDate.getDay();
    case "days":
      currentDate.setDate(tmpdate.getDate() + step);
      return currentDate.getDate();
    case "hours":
      currentDate.setHours(tmpdate.getHours() + step);
      return currentDate.getHours();
    default:
      alert("we have a wrong interval type ");
      break; 
  }
}

function initializeCurrentDate(){
  currentDate = new Date(birthYear,0,1);
}

function isLeapYear(year) {
    if ((year/4)   != Math.floor(year/4))   return false;
    if ((year/100) != Math.floor(year/100)) return true;
    if ((year/400) != Math.floor(year/400)) return false;
    return true;
}


/* SLIDER HANDLERS 
*****************************************************************************/
var slidervalue;
var maxvalue;
function handleSliderChange(e, ui)
{
  slidervalue = ui.value;
  maxvalue    = $('#content-slider').slider("option", "max");
  
  var maxScroll = $("#content-scroll").attr("scrollWidth") - 
                  $("#content-scroll").width();
  $("#content-scroll").animate({scrollLeft: ui.value * 
     (maxScroll / maxvalue) }, 1000);
}

function handleSliderSlide(e, ui)
{
  slidervalue = ui.value;
  var maxScroll = $("#content-scroll").attr("scrollWidth") - 
                  $("#content-scroll").width();
  $("#content-scroll").attr({scrollLeft: ui.value * (maxScroll / maxvalue) });
}
/****************************************************************************
														   SLIDER HANDLERS*/