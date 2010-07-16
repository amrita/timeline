// Javascript JQTouch code 
/*var jQT = new $.jQTouch({
  icon: 'images/icon.png',
  startupScreen: 'images/splash.png',
  addGlossToIcon: false,
  statusBar: 'default'  
});
*/

$(function() {
  //initialize tabs
  $("#tabs").tabs();
  
  //alert($(document).width()/2 - (850/2));
  
  tabTop  = parseInt($(".ui-tabs").css("margin-top")) + 100 - 13;
  tabLeft = parseInt($(".ui-tabs").css("margin-left")) + ($(document).width()/2 - (850/2) + 65); 
  
  //initialize drawbox
  /*
  $('#drawbox').drawbox({caption:'This is a caption',
                         lineWidth:3,
                         lineCap:'round',
                         lineJoin:'round',
                         colorSelector:true,
                         extraOffsetX: tabLeft,
                         extraOffsetY: tabTop
                         });
  */
  
  //set the dynamic text click stuff
  //$(".dyntext").click(addTextBox);
  
  //initialize multimedia plugin
  $("ul.multimedia-portfolio").multimedia_portfolio({width: 550, height: 750, baseDir: '.', nbelem: 2});
  
  //create the dialogs
  createEditDialog();
  createViewDialog();
  createAlertDialog();
		
  //open the edit dialog
  $('#mybutton')
			.button()
			.click(function() {
			    //alert("button was clicked");
				$("#editdialog").dialog('open');
			});

  //add a video box
  addVideoBox();
  $("#addvid").button().click(addVideoBox);
  
  //add an image box
  addImageBox();
  $("#addimg").button().click(addImageBox);
  
  //hover handlers
  $('.vidbox').live('mouseover mouseout', hoverVideoBox);
  $('.imgbox').live('mouseover mouseout', hoverImageBox);
  
  //box delete handlers
  $('.viddelclass').live('click',closeVideoBox);
  $('.imgdelclass').live('click',closeImageBox);
 
});


function createEditDialog(){
  //convert the event window into a dialog ?
  $("#editdialog").dialog({
            autoOpen: false,
			height: 615,
			width: 850,
			position: ['center','top'],
			title: 'ADD or EDIT YOUR EVENT',
			buttons: {
				Save: function() {
				  //open view dialog box. close edit dialog box
				  $(this).dialog('close');
				  $("#viewdialog").dialog('open');
				},
				Cancel: function() {
				    //close both dialogs here 
					$(this).dialog('close');
					$("#viewdialog").dialog('close');
				}
			}
  });

}


function createViewDialog(){
  $("#viewdialog").dialog({
            autoOpen: false,
			height: 615,
			width: 850,
			position: ['center','top'],
			title: 'VIEW YOUR EVENT',
			buttons: {
				Edit: function() {
				  //open view dialog box. close edit dialog box
				  $(this).dialog('close');
				  $("#editdialog").dialog('open');
				},
				Cancel: function() {
				    //close both dialogs here 
					$(this).dialog('close');
					$("#editdialog").dialog('close');
					
				}
			}
  });
}


function createAlertDialog(){
  //convert the event window into a dialog ?
  $("#alertdialog").dialog({
            autoOpen: false,
			height: 150,
			width: 240,
			position: ['center','middle'],
  });
}


/*
var eventArray = new Array();

function EventClass(){
  this.eventid        = id;
  this.eventdesc      = desc;
  this.eventtext      = text;
  this.eventimage     = image;
  this.eventvideo     = video;
  this.eventdrawing   = drawing;
  this.eventstartdate = stdate;
  this.eventenddate   = endate;
  this.eventpixels    = pixels; //distance event is at
}

var ehtml; //event html code

function createEventCanvas(){
  ehtml = '<div id="eventcanvas"></div>'; 	    
}

function addEventDescription(){
  ehtml += '<div id="eventdesc"></div>'; 
}

function addNotepadSupport(){
  ehtml += '<div id="eventtext"></div>';
}

function addDrawBoxSupport(){
  ehtml += '<div id="eventdraw"></div>';
}

function addImageSupport(){
  ehtml += '<div id="eventimg"></div>';
}

function addVideoSupport(){
  ehtml += '<div id="eventvideo"></div>';
}

function saveEvent(){

}

//add the event to the events list
function addEvent(){
}

//setup the event handlers based on what is clicked 
function eventClickHandlers(){
}
*/

var openCounters = new Array();
var textCounter = 1;

function addTextBox(){
  
  if (textCounter < 9){
    var html  = "<input type='text' id='vidpath-" +  textCounter + "' class='dyntext' onclick='addTextBox()' />"; 
        html += "<div id='delete-'" + textCounter + "' class='delclass'></div>";
        
    $("#vidtextboxes").append(html);
    textCounter++;
  }
}

var vidcounter = 0;
function addVideoBox(){
  var html = "";
  
  html  = "<div id='vidtextboxes-" + vidcounter + "' class='vidbox'>";
  html += "<div id='del-" + vidcounter + "' class='viddelclass'><span class='ui-state-highlight ui-icon ui-icon-closethick' style='float:right; margin: 0 0px 20px 40px; background-position: -96px -128px;'></span></div>";
  html += "&nbsp Embed Video <input type='text' class='vidtext'/><br/>";
  html += "&nbsp Description &nbsp <input type='text' class='vidtext'/>";
  html += "</div>";
  
  $("#videospace").append(html);
  vidcounter++;
}


function hoverVideoBox(event){ 
  if (event.type == 'mouseover') {
    // do something on mouseover
     $(this).addClass("over");
     var id  = $(this).attr('id').replace(/\D/g,'');
     $('#del-' + id).css("visibility","visible");
  } else {
    // do something on mouseout
     $(this).removeClass("over");
     var id  = $(this).attr('id').replace(/\D/g,'');
     $('#del-' + id).css("visibility","hidden");
  } 
}

function closeVideoBox(event){
  //$("#alertdialog").text("Are you sure you want to delete this video ?");

  var object = $(this).parent(); 
  $("#alertdialog").dialog("option", "buttons", { "Ok": function() { object.remove(); $(this).dialog('close'); }, 
                                                  "Cancel": function() { $(this).dialog('close'); } } );
  $("#alertdialog").dialog('open');
}

var imgcounter = 0;
function addImageBox(){
  var html = "";
  
  html  = "<div id='imgtextboxes-" + imgcounter + "' class='imgbox'>";
  html += "<div id='imgdel-" + imgcounter + "' class='imgdelclass'><span class='ui-state-highlight ui-icon ui-icon-closethick' style='float:right; margin: 0 0px 20px 20px; background-position: -96px -128px;'></span></div>";
  html += "&nbsp Choose File <input type='file' class='imgfilebox'/><br/>";
  html += "&nbsp Description <input type='text' id='imgtext-" + imgcounter + "' class='imgtext'/>";
  html += "</div>";
  
  $("#imagespace").append(html);
  imgcounter++;
}

function hoverImageBox(event){
  if (event.type == 'mouseover') {
    // do something on mouseover
     $(this).addClass("over");
     var id  = $(this).attr('id').replace(/\D/g,'');
     $('#imgdel-' + id).css("visibility","visible");
  } else {
    // do something on mouseout
     $(this).removeClass("over");
     var id  = $(this).attr('id').replace(/\D/g,'');
     $('#imgdel-' + id).css("visibility","hidden");
  } 
}

function closeImageBox(event){
  //$("#alertdialog").text("Are you sure you want to delete this image ?");

  var object = $(this).parent(); 
  $("#alertdialog").dialog("option", "buttons", { "Ok": function() { object.remove(); $(this).dialog('close'); }, 
                                                  "Cancel": function() { $(this).dialog('close'); } } );
  $("#alertdialog").dialog('open');
}
