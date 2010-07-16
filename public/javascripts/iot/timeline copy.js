///////////////////////////////  **GLOBALS** //////////////////////////////////
var sliderDisplay     = ["Lifetime","Lifetime","Year","Month", "Week","Day"];
var sliderPalette     = ["#d70377", "#d70377","#fe9400","#666764", "#37bfe6","#7bd80d"];

var prevSliderValue = 0;

var nMonths    = 12;
var nMonthDays = 31;
var nWeeks     = 52;
var nWeekdays  = 7;
var nYearDays  = 365;
var nHours     = 24;

var FullMonths   = ["January","February","March","April","May","June","July","August","September","October","November", "December"];
var Months       = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var DaysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var WeekDays     = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun","Mon","Tue","Wed","Thu","Fri","Sat"]; //doubling it to allow week to start at any day


var timelineWidth = 950; //keep track of the current timeline length. 950 is the default

//set current day, weekday, month and year
var cDate;
var cDay;
var cMonth;
var cYear;

//placeholder for birth year
var birthYear = 2000;

var LIFETIME = 1;
var YEAR     = 2;
var MONTH    = 3;
var WEEK     = 4;
var DAY      = 5;
var nLEVELS  = 5;

var totLevelSegments = [0,0,1,12,52,365];
var currentLevel     = 0; //Lifetime 0, 1   Year 2 Month 3 Week 4 Day 5
var totLevelDays     = [0,0,365,31,1,1];

//slider arrows .. year, month, week, day
var sliderLeft   = ["","","images/icons/slider_year_L.png","images/icons/slider_month_L.png","images/icons/slider_week_L.png","images/icons/slider_day_L.png"];
var sliderRight  = ["","","images/icons/slider_year_R.png","images/icons/slider_month_R.png","images/icons/slider_week_R.png","images/icons/slider_day_R.png"];

//slider arrows to display on hover
var hSliderLeft  = ["","","images/icons/slider_year_L_bg.png","images/icons/slider_month_L_bg.png","images/icons/slider_week_L_bg.png","images/icons/slider_day_L_bg.png"];
var hSliderRight = ["","","images/icons/slider_year_R_bg.png","images/icons/slider_month_R_bg.png","images/icons/slider_week_R_bg.png","images/icons/slider_day_R_bg.png"];

var timelineLeft   = ["","","images/icons/timeline_year_L.png","images/icons/timeline_month_L.png","images/icons/timeline_week_L.png","images/icons/timeline_day_L.png"];
var timelineRight  = ["","","images/icons/timeline_year_R.png","images/icons/timeline_month_R.png","images/icons/timeline_week_R.png","images/icons/timeline_day_R.png"];

var hTimelineLeft   = ["","","images/icons/timeline_year_L.png","images/icons/timeline_month_L.png","images/icons/timeline_week_L.png","images/icons/timeline_day_L.png"];
var hTimelineRight  = ["","","images/icons/timeline_year_R.png","images/icons/timeline_month_R.png","images/icons/timeline_week_R.png","images/icons/timeline_day_R.png"];


///////////////////////////////  **GLOBALS** //////////////////////////////////


/************************************************************************/
//init function 
$(function() {

  //adjust icon positions below timeline
  adjustIconPositions();
  
  //initialize current date
  cDate   = 1;
  cMonth = 1; //subtract by 1 to pass to the Date() function 
  cYear  = birthYear;
  
  currentDate = new Date(cYear,cMonth - 1, cDate);
  cDay        = currentDate.getDay();

  //initTimeLevelSlider();
  //initTimelineSlider();
  
  //populate the timeline with the default
  addLife(2000);
  
  //set hover handlers
  hoverSliderLeft();
  hoverSliderRight();
  
  //add initial slider icons
  //addSliderIcons(LIFETIME);
  initSliderIcons(LIFETIME);
  
  //set click handlers
  //$("#rightarrow").click(rightArrowClickHandler);
  //$("#leftarrow" ).click(leftArrowClickHandler);
  
  $("#timelineslider").slider({
    animate: true,
    change: handleSliderChange,
    slide: handleSliderSlide
  });
  
  //set slider icon click handler
  $(".slidericon").click(sliderIconClickHandler);
  
  /*
  $('#getvalue')
			.button()
			.click(function() {
			    alert("the current slider value is " + iTime + "  prevTime is " + prevTime);
			});
  */
 
 
  //floater();
  //initializeIslands();
  
});
/************************************************************************/

/************************************************************************/
function initTimelineSlider(){
  $("#timelineslider").slider({
    orientation: 'horizontal',
	range: "min",
	max: 0,
	value: 1,
	slide: refreshSwatch,
	change: refreshSwatch
  });
  
  $("#timelineslider").slider("value", 1);
}
/************************************************************************/


/* UPDATE THE TIMELINE SLIDER WHEN YOU MOVE TO A DIFFERENT LEVEL OF
   GRANULARITY. E.G. LIFETIME, DAY, MONTH, YEAR
***********************************************************************/
function updateTimelineSlider(){
  var startdate   = new Date(birthYear,0,1);
  var enddate     = new Date((new Date).getFullYear(),11,31);
  
  switch(currentLevel){
    case 2:
      maxvalue = getDateDifference(startdate,enddate, "years");
      break;
    case 3:
      maxvalue = getDateDifference(startdate,enddate, "months");
      break;
    case 4:
      maxvalue = getDateDifference(startdate,enddate, "weeks");
      break;
    case 5:
      maxvalue = getDateDifference(startdate,enddate, "days");
      break;
    default:
     maxvalue = 10;
     break; 
  }
  
  var zoompt = getTimelineZoomPt();
  
  //reset items when slider is updated
  prevTime = 0;
  cDate    = 1;
  cMonth   = 1;
  cYear    = birthYear;
  
  alert("max value is " + maxvalue + " zoompt is " + zoompt);
  //alert("in update timeline slider zoom to " + zoompt + " current date is " + cYear + " " + cMonth + " " + cDate);
  $("#timelineslider").slider( "option" , "max" , maxvalue );
  $("#timelineslider").slider("value", zoompt); //change this to set to the currentspace
}
/************************************************************************/


/************************************************************************/
var prevTime = 0;
var iTime; 
function refreshSwatch() {
      iTime = $("#timelineslider").slider("value");
  var step;
  
  if (iTime > prevTime){
    step = iTime - prevTime;
    //alert("before getNextDate next " + cYear + " " + cMonth + " " + cDate );
    getNextDate("next", step);
    //alert("after geNextDate before printdates from refresh swatch " + cYear + " " + cMonth + " " + cDate );
    printDates();
    printDaysinMonth(); //if we have a month update the timeline
  }
  else if (iTime < prevTime){
    step = prevTime - iTime;
    //alert("before getNextDate prev " + cYear + " " + cMonth + " " + cDate );
    getNextDate("prev", step);
    //alert("after geNextDate before printdates from refresh swatch " + cYear + " " + cMonth + " " + cDate );
    printDates();
    printDaysinMonth(); // if we have a month update the timeline
  }
  else{ //if its the same place do nothing
  }
  
  prevTime = iTime; //update previous time
}
/************************************************************************/	

/************************************************************************/
//zoom slider function
function initTimeLevelSlider(){
  $("#timeslider").slider({
    animate: true,
    step: 1,
    min: 1,
    orientation: 'horizontal',
    max: 5,
    start: function(event, ui){
	  $('#timeslidervalue').empty();
	  slide_int = setInterval(updateSlider, 10);	
	},
	slide: function(event, ui){
	  setTimeout(updateSlider, 10);  
	},
	stop: stopSlider
  });
}	
/************************************************************************/

/************************************************************************/
function stopSlider (event, ui){
  var offset   = $('.ui-slider-handle').offset();
  value        = $('#timeslider').slider('option', 'value');
  currentLevel = value;
  
  //update the timeline slider
  //populate the timeline level with ticks and values
  //we need the location to figure out the correct place that it should be 
  //zoomed into
  updateTimelineSlider();
  createExistingLevel(value);
  addSliderArrows(value);
  addSliderIcons(value);
  //initSliderIcons(value);
  
   if (value < prevSliderValue)
    zoomOutAnimateSlider(value);
  else
    zoomInAnimateSlider(value);
  
  clearInterval(slide_int);
  slide_int = null;
  
  prevSliderValue = value; //set new prev slider value 
}
/************************************************************************/

/************************************************************************/
function updateSlider(){
  var offset = $('.ui-slider-handle').offset();
  value = $('#timeslider').slider('option', 'value');
 
  $('#timeslidervalue').text(sliderDisplay[value]).css({top:offset.top });
  $('#timeslidervalue').fadeIn();
}
/************************************************************************/

/************************************************************************/
function zoomOutAnimateSlider(value){
  $("#timeline, #timelinebase").animate( { height:"7%", width:"100%", marginLeft:"-145px" }, { duration:300 } )
                .delay(200)
  				.animate( { height:"20px", width: timelineWidth, marginLeft:"5px", backgroundColor: sliderPalette[value] }, { duration:300 } );
}
/************************************************************************/

/************************************************************************/
function zoomInAnimateSlider(value){
  $("#timeline, #timelinebase").animate( { height:"8%", width:"50%", marginLeft:"200px"}, { duration:300 } )
  				.delay(200)
                .animate( { height:"20px", width: timelineWidth, marginLeft:"5px", backgroundColor: sliderPalette[value] }, { duration:300 } );
}
/************************************************************************/

/************************************************************************/
function addSliderArrows(value){
  
  var newLBg = "url('" + timelineLeft[value] + "')";
  var newRBg = "url('" + timelineRight[value] + "')"
  
  var newLHoverBg = "url('" + hTimelineLeft[value] + "')";
  var newRHoverBg = "url('" + hTimelineRight[value] + "')";
  
  //add normal arrows
  $('#leftarrow').css("background",newLBg);
  $('#rightarrow').css("background",newRBg);
  
  //add hover arrows to be displayed during hover
  $('#bgleftarrow').css("background",newLHoverBg);
  $('#bgrightarrow').css("background",newRHoverBg);
}
/************************************************************************/

/************************************************************************/
function hoverSliderLeft(){
  $('#leftarrow, .slidericon').hover(
   function() {
     $(this).animate({"opacity": "0"}, "slow");
   },
   function() {
     $(this).animate({"opacity": "1"}, "slow");
   });
}
/************************************************************************/

/************************************************************************/
function hoverSliderRight(){
  $('#rightarrow, .slidericon').hover(
   function() {
     $(this).animate({"opacity": "0"}, "slow");
   },
   function() {
     $(this).animate({"opacity": "1"}, "slow");
   });
}
/************************************************************************/

/************************************************************************/
function addSliderIcons(value){
  
  var newLIcon = "url('" + sliderLeft[value - 1] + "')";
  var newRIcon = "url('" + sliderRight[value + 1] + "')";
  
  //add the icons
  $('#prevlevelicon').css("background",newLIcon);
  $('#nextlevelicon').css("background",newRIcon);

}
/************************************************************************/

function initSliderIcons(value){
  for (var i = 1; i < value ; i++){
    var newLIcon    = "url('" + sliderLeft[i] + "')";
    var newLHoverBg = "url('" + hSliderLeft[i] + "')";
    $('#level-' + i).css("background",newLIcon);
    $('#levelbg-' + i).css("background",newLHoverBg);
  }
 
  for (var i = value; i <= nLEVELS ; i++){
    var newRIcon    = "url('" + sliderRight[i] + "')";
    var newRHoverBg = "url('" + hSliderRight[i] + "')";
    $('#level-' + i).css("background",newRIcon);
    $('#levelbg-' + i).css("background",newRHoverBg);
  }
}

function sliderIconClickHandler(event){
  var value        =  parseInt($(this).attr('id').replace(/\D/g,''));
  currentLevel = value;
  
  /* update the timeline slider. populate the timeline level with 
     ticks and values. find the right place the slider should be 
     zoomed to  
   */
  //updateTimelineSlider();
  createExistingLevel(value);
  addSliderArrows(value);
  initSliderIcons(value);
  
   if (value < prevSliderValue)
    zoomOutAnimateSlider(value);
  else
    zoomInAnimateSlider(value);
  
  $(this).css("opacity", "0"); //not working
}

/************************************************************************/
/* when we move from years to months to days etc .. clear any existing
   ticks and labels */
function clearExistingLevel(){
  var element = document.getElementById('timelabels');
  if (element)
    removeElement(element);
}

/************************************************************************/

/************************************************************************/
function createExistingLevel(value){
  $("#timeline, #timelinebase").css("width", 950); //reset timeline width to original
  
  //alert("calling printdate from create existing level " + cYear + " " + cMonth + " " + cDate);
  /* the constants should be replaced by computed variables */
  switch(value){
    case 0:
    case 1:
      addLife(); //pass the birth year
      break;  
    case 2:
      addYears(); //pass in current year
      break;
    case 3:
      addMonths(); //pass in current month and year
      break;
    case 4:
      addWeeks(); //pass in start weekday, date, month and year
      break;
    case 5:
      addDays(); //date, month and year
      break;
    default:
      addLife(birthYear);
      break;
  }
}
/************************************************************************/

/************************************************************************/
/* Add year from birthyear to current year, pass in birth year as a variable */
function addLife(){
  //clear any existing levels
  clearExistingLevel();
  
  //this is the total number of years 
  var startdate   = new Date(birthYear,0,1);
  var enddate     = new Date((new Date).getFullYear(),11,31);
  maxvalue        = getDateDifference(startdate,enddate, "years");
  
  /* compute the total number of new segments */
  var nSegments = maxvalue + 1;
  timelineWidth  = parseInt($('#timeline').width());
  
  //compute the segments
  var timelineSegLen = parseInt(timelineWidth / nSegments);
  
  //create the labels 
  createMonthTimeLabels(1, nSegments, timelineSegLen, null, "years");
  printDates();
}
/************************************************************************/


/************************************************************************/
/* Add year from birthyear to current year, pass in birth year as a variable */
function addYears(){ 
  //clear any existing levels
  clearExistingLevel();
  
  //get some basics we need for computational purposes 
  var startdate   = new Date(birthYear,0,1);
  var enddate     = new Date((new Date).getFullYear(),11,31);
  var nTimelines  = getDateDifference(startdate,enddate, "years");
  var nSegments   = getDateDifference(startdate,enddate, "months") + 1;
  
  //first extend the timeline segment to accomodate the total years 
  var currentwidth  = parseInt($('#timeline').width());
      timelineWidth = currentwidth * (nTimelines + 1);
  $('#timeline').width(timelineWidth);

  //compute the segments
  var timelineSegLen = parseInt(timelineWidth / nSegments);
  
  //create the labels 
  createMonthTimeLabels(1, nSegments, timelineSegLen, Months,"months");
  
  //print the dates 
  //printDates();
}
/************************************************************************/

/************************************************************************/
/* Add year from birthyear to current year, pass in birth year as a variable */
function addMonths(){
  
  //clear any existing levels
  clearExistingLevel();
  
  //get some basics we need for computational purposes 
  var startdate   = new Date(birthYear,0,1);
  var enddate     = new Date((new Date).getFullYear(),11,31);
  var nTimelines  = getDateDifference(startdate,enddate, "months");
  var nSegments   = getDateDifference(startdate,enddate, "days") + 1;
  
  //first extend the timeline segment to accomodate the total years 
  var currentwidth  = parseInt($('#timeline').width());
      timelineWidth = currentwidth * (nTimelines + 1);
  $('#timeline').width(timelineWidth);
 
  //compute the segments
  var timelineSegLen = parseInt(timelineWidth / nSegments);
  
  //create the labels 
  createMonthTimeLabels(1, nSegments, timelineSegLen, null, "days");
  
  //print the dates
  //printDates();
}
/************************************************************************/


/************************************************************************/
function addWeeks(){
  
  //clear any existing levels
  clearExistingLevel();
  
  //get some basics we need for computational purposes 
  var startdate   = new Date(birthYear,0,1);
  var enddate     = new Date((new Date).getFullYear(),11,31);
  var nTimelines  = getDateDifference(startdate,enddate, "weeks");
  var nSegments   = nTimelines * 7;
  
  //first extend the timeline segment to accomodate the total years 
  var currentwidth  = parseInt($('#timeline').width());
      timelineWidth = currentwidth * (nTimelines + 1);
  $('#timeline').width(timelineWidth);
  
  //compute the segments
  var timelineSegLen = parseInt(timelineWidth / nSegments);
  
  //create the labels 
  createMonthTimeLabels(1, nSegments, timelineSegLen, WeekDays, "weeks");
  
  //print the dates
  //printDates();
}
/************************************************************************/

/************************************************************************/
function addDays(){
 
  //clear any existing levels
  clearExistingLevel();
  
  //get some basics we need for computational purposes 
  var startdate   = new Date(birthYear,0,1);
  var enddate     = new Date((new Date).getFullYear(),11,31);
  var nTimelines  = getDateDifference(startdate,enddate, "days");
  var nSegments   = getDateDifference(startdate,enddate, "hours");
  
  //first extend the timeline segment to accomodate the total years 
  var currentwidth  = parseInt($('#timeline').width());
      timelineWidth = currentwidth * (nTimelines + 1);
  $('#timeline').width(timelineWidth);
  
  //compute the segments
  var timelineSegLen = parseInt(timelineWidth / nSegments);
  
  createHourTimeLabels(0, 23, nSegments, timelineSegLen, null, "hours");

  //print the dates
  //printDates();
}
/************************************************************************/

/************************************************************************/
function createMonthTimeLabels(startIdx, nSegments, timelineSegLen, tArray, interval){
  var html      = "";
  var next, width, lPos;
  
  initializeCurrentDate();
  //add the table
  $('#timeline').append('<table id="timelabels"></table>');
  
  var string = new Array();
  string.push('<tbody><tr>');
  next = parseInt(getNextDate(currentDate, interval,0));
  for (i = startIdx; i <= nSegments; i++){
    if (tArray)
      string.push('<td id ="tlabel-' + i + '" class="tlabels" style="width:' + timelineSegLen + '">' + tArray[next] + '</td>');
    else
      string.push('<td id ="tlabel-' + i + '" class="tlabels" style="width:' + timelineSegLen + '">' + next + '</td>');        
    next = getNextDate(currentDate, interval,1);
  }
  string.push('</tr></tbody>');
  
  //append html
  var writestring = string.join('');
  var element = document.getElementById('timelabels');
  //element.innerHTML = writestring;
  
  withRemove(element,writestring);

  return;
}
/************************************************************************/


/************************************************************************/
function createHourTimeLabels(startIdx, endIdx, nSegments, timelineSegLen, tArray, interval){
  var html      = "";
  var next, width, lPos;
  
  //add the table
  $('#timeline').append('<table id="timelabels"></table>');
  
  //alert("timeline length is " + timelineLen + "timeline segment length is " + timelineSegLen + "timeline segments are " + nSegments);
  var time1  = new Date().getTime();
  var string = new Array();
  string.push('<tbody><tr>');
  for (i = startIdx; i <= nSegments;){
    for (j = startIdx; j <= endIdx; j++, i++){
        string.push('<td id ="tlabel-' + i + '" class="hourlabels">' + j + '</td>');
    }
  }
  string.push('</tr></tbody>');
  
  //append html
  var writestring = string.join('');
  var element = document.getElementById('timelabels');
  //element.innerHTML = writestring;
  
  withRemove(element,writestring);
  var time2 = new Date().getTime();
  
  var diff = time2 - time1;
  alert(" time taken " + diff);
  
  return;
}
/************************************************************************/

/************************************************************************/
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
/************************************************************************/

/************************************************************************/
function removeElement(el){
  var nextSibling = el.nextSibling;
  var parent = el.parentNode;
  parent.removeChild(el);
} 
/************************************************************************/


/************************************************************************/
/* Compute the next date based on the level and the current date values */
function printDates(){
  var wkMonDate = new Array();
  var wkYear    = new Array();
  var j = 0, k = 0;
  
  //alert("entering printdates date is " + cYear + " " + cMonth + " " + cDate );
  switch(currentLevel){
    case 0: //Lifetime 
    case 1:
      $("#currentdate").text("My Life Span");
      break;
    case 2: //Year
      $("#currentdate").text(cYear);
      break;
    case 3: //Month
      $("#currentdate").text(Months[cMonth] + ", " + cYear);
      break;
    case 4:  
      $("#weekdaylabels").remove();
      createWeekDayLabels();  
      break;
    case 5:
      $("#currentdate").text(Months[cMonth] + " " + cDate + ", " + cYear);
      break;
    default:
       $("#currentdate").text("My Life Span");
  }
  
  return;
}
/************************************************************************/

/************************************************************************/
function createWeekDayLabels(){
  var startIdx = cDay;
  var endIdx   = nWeekdays + (cDay - 1); 
  var html     = "<table id='weekdaylabels'><tr>";
  var nextDate = new Date(cYear,cMonth - 1, cDate);
    for (var i = cDay; i <= endIdx; ++i){  
      html +=  "<td><div id ='tMonDate-" + i + "' class='weeklabels'>" + Months[cMonth] + '  ' + cDate + '  ' + cYear + "</div></td>";
      if (i == endIdx) break;
        nextDate.setDate(nextDate.getDate() + 1);
        
        cYear  = nextDate.getFullYear();
  		cMonth = nextDate.getMonth() + 1;
  		cDate  = nextDate.getDate();
  		cDay   = nextDate.getDay();
    }
    html += "</tr></table>";
       
    $("#currentdate").text('');
    $("#currentdate").append(html);
    
  return;
}
/************************************************************************/

/* find out the correct place that the timeline should be zoomed to once 
   the slider changes 
 */
function getTimelineZoomPt(){
  var zoomvalue = 1;

  var curDate   = new Date(cYear,cMonth - 1, cDate);
  var birthDate = new Date(birthYear,0,1);
  
  switch(currentLevel){
    case 0:
    case 1:
      break;
    case 2:
      zoomvalue = getDateDifference(birthDate, curDate, "years");
      break;
    case 3:
      zoomvalue = getDateDifference(birthDate, curDate, "months");
      break;
    case 4:
      zoomvalue = getDateDifference(birthDate, curDate, "weeks");
      break;
    case 5:
      zoomvalue = getDateDifference(birthDate, curDate, "days");
      break;
    default:
      break;
  }
  
  return zoomvalue;
}
/************************************************************************/

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
        default: return undefined;
    }
    
}
/************************************************************************/

var currentDate;
function initializeCurrentDate(){
  currentDate = new Date(birthYear,0,1);
}

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




/************************************************************************/
function rightArrowClickHandler(event){
  //try to slide timeline 
  //$("#timeline").slideRightShow();
  //$("#timelinebase").slideLeftHide(); 
  
  /*$('#timeline').animate({ width: 'hide' }); */
  
  /*
  //try to slide the labels
  $('.tlabels').each(function(index) {
    $(this).slideRightShow();
  });
  */
  
  
  //Update the current date 
  /*getNextDate("next", 1);
  printDates();
  printDaysinMonth(); //if we have a month update the timeline
  */
  
  //update the slider also
  $("#timelineslider").slider("value", ++iTime);
  prevTime = iTime;
  
  //try to slide the current date
  //$('#currentdate').slideRightShow();
}
/************************************************************************/

/************************************************************************/
function leftArrowClickHandler(event){	
 //try to slide timeline 
  //$("#timeline").slideLeftShow();
  //$("#timelinebase").slideRightHide();
  
  //$('#timeline').animate({ width: 'show' });
  
  /*
  //try to slide the labels
  $('.tlabels').each(function(index) {
    $(this).slideLeftShow();
  });
  */
  
  //Update the current date 
  /*getNextDate("prev", 1);
  printDates();
  printDaysinMonth(); // if we have a month update the timeline
  */
  
  //update the slider also
  $("#timelineslider").slider("value", --iTime);
  prevTime = iTime;
  
  //try to slide the current date
  //$('#currentdate').slideLeftShow();
}
/************************************************************************/

function adjustIconPositions(){
  var width = parseInt($('.slidericon').width());
  var start = 280;
  
  for(var i = 1; i <= nLEVELS; i++){
    $('#level-' + i).css("margin-left",start);
    $('#level-' + i).css("z-index",10);
    $('#levelbg-' + i).css("margin-left",start);
    start += 85;
  }

}

/************************************************************************/
jQuery.fn.extend({
  slideRightShow: function() {
    return this.each(function() {
        $(this).show('slide', {direction: 'right'}, 1000);
    });
  },
  slideLeftHide: function() {
    return this.each(function() {
      $(this).hide('slide', {direction: 'left'}, 990);
    });
  },
  slideRightHide: function() {
    return this.each(function() {
      $(this).hide('slide', {direction: 'right'}, 990);
    });
  },
  slideLeftShow: function() {
    return this.each(function() {
      $(this).show('slide', {direction: 'left'}, 1000);
    });
  }
});
/************************************************************************/

/************************************************************************/
$.fn.delay = function(time, callback){
    // Empty function:
    jQuery.fx.step.delay = function(){};
    // Return meaningless animation, (will be added to queue)
    return this.animate({delay:1}, time, callback);
}
/************************************************************************/

/************************************************************************/
function handleSliderChange(e, ui){
  var maxScroll = $("#content-scroll").attr("scrollWidth") - 
                  $("#content-scroll").width();
  $("#content-scroll").animate({scrollLeft: ui.value * 
     (maxScroll / 100) }, 1000);
}
/************************************************************************/

/************************************************************************/
function handleSliderSlide(e, ui){
  var maxScroll = $("#content-scroll").attr("scrollWidth") - 
                  $("#content-scroll").width();
  $("#content-scroll").attr({scrollLeft: ui.value * (maxScroll / 100) });
}
/************************************************************************/