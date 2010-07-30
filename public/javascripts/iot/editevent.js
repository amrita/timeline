/*GLOBAL */
var eventId; //event id that is currently being edited

/* INITIALIZE THE EVENT EDIT LAYOUT SPACE 
 **********************************************************************/
function initializeEditLayout(){
  createEditViewLayout();

  //initialize tabs
  $("#tabs").tabs();
  tabTop  = parseInt($(".ui-tabs").css("margin-top")) + 100 - 13;
  tabLeft = parseInt($(".ui-tabs").css("margin-left")) + ($(document).width()/2 - (850/2) + 65); 
  
  //create the dialogs
  createEditDialog();
  createAlertDialog();

  //add a video box
  addVideoBox();
  $("#addvid").button().click(addVideoBox);
  
  //add an image box
  addImageBox();
  $("#addimg").button().click(addImageBox);
  
  imgBoxCloseHandler();
  vidBoxCloseHandler();

}
/********************************************************************************/

function eventEditOpenClickHandler(event){
  $("#editdialog").dialog('open');
}

/* CREATING THE EDIT VIEW LAYOUT 
 ********************************************************************************/
function createEditViewLayout(){
  var string = new Array();
  
  string.push('<div id="editdialog">');
  string.push('<div id="editcanvas" class="alltext ecanvas"></div>');
  string.push('</div>');

  var writestring = string.join('');
  $('body').append(writestring);
  
  var object = $('#editcanvas');
  
  //create the event notepad to write into
  var nstring = new Array();
  nstring.push('<div id="eventtext">');
  nstring.push('<textarea id="etextarea" rows="16" cols="24" class="commontreb"></textarea>');
  nstring.push('</div>');

  var nwritestring = nstring.join('');
  
  $('#editcanvas').append(nwritestring);
  
  
  //create the tabs
  createTabs(object);
  
  //create alert box at the end
  var html = '<div id="alertdialog"><p><span class="ui-icon ui-icon-alert" style="float:left; margin: 0 7px 20px 0;"></span>Are you sure you want to delete this media item ?</p></div>';
  $(object).append(html);
  
}

function createTabs(object){
  var string = new Array();
  
  string.push('<div id="tab-area" class="tabtext">');
  string.push('<div id="tabs">');
  string.push('<ul>');
  string.push('<li><a href="#tabs-1">Your Drawbox</a></li>');
  string.push('<li><a href="#tabs-2">Upload Images, Music</a></li>');
  string.push('<li><a href="#tabs-3">Add Video Links</a></li>');
  string.push('</ul>');
  
  string.push('<div id="tabs-1">');
  string.push('<iframe id="svg-edit" src="/javascripts/svg-edit-v2.2/editor/svg-editor.html" width="500" height="360"><p>Your browser does not support iframes.</p></iframe>'); 
  string.push('</div>');
 
  string.push('<div id="tabs-2">');
  string.push('<p> Add an image by clicking the button to upload an image file </p>');
  string.push('<button id="addimg">Add another image</button>');
  string.push('<br/>');
  string.push('<div id="imagespace"></div>');  
  string.push('</div>');
 
  string.push('<div id="tabs-3">');
  string.push('<p> Add a video by typing or pasting the embed tag of an uploaded video </p>');
  string.push('<button id="addvid">Add another video</button>');
  string.push('<br/>');
  string.push('<div id="videospace"></div>');
  string.push('</div>');
  
  string.push('</div>'); //tabs ends 
  string.push('</div>'); //tab-area ends 
  
  var writestring = string.join('');
  $(object).append(writestring);

} 
/*******************************************************************************
                                                 CREATING THE EDIT VIEW LAYOUT */


/* CREATING THE EDIT DIALOG
******************************************************************************/                                            
function createEditDialog(){
  //convert the event window into a dialog ?
  $("#editdialog").dialog({
            modal: true,
            autoOpen: false,
			height: 550,
			width: 795,
			position: ['center','center'],
			title: 'ADD FUN STUFF TO YOUR ISLES',
			resizable: false,
			buttons: {
				Save: saveEditDialogInformation,
				Cancel: function() {
				    //close both dialogs here 
					$(this).dialog('close');
				}
			}
  });

}

function createAlertDialog(){
  //convert the event window into a dialog ?
  $("#alertdialog").dialog({
            autoOpen: false,
			height: 175,
			width:  250,
			resizable: false,
			position: ['center','middle'],
  });
}
/*****************************************************************************
                                                    CREATING THE EDIT DIALOG */  


/*SAVING DIALOG INFORMATION
 *****************************************************************************/
 function saveEditDialogInformation(event, ui){
   
   //lets get the notes first
   var notes  = $('#etextarea').val();
   
   //now the drawing
   //var sketch = getSvgEditImage('svg-edit','svg-edit-textarea','');
   
   //addNotesEventFormHandler(notes, sketch);
   addNotesEventFormHandler(notes);
   
   //now the videos
   $('#videospace').children().each(function() {
        var $child   = $(this);    
        var vidurlid   = $child.find("input[name='embedvidurl']");
        var vidurl     = $(vidurlid).val();
        
        var viddescid   = $child.find("input[name='viddesc']");
        var viddesc     = $(viddescid).val();
        
        updateEventVideoHandler(vidurl, viddesc)
        
   });
   
   //now the images
   $('#imagespace').children().each(function() {
        var $child     = $(this);    
        var imgfileid   = $child.find("input[name='imgfile']");
        var imgfile     = $(imgfileid).val();
        
        var imgdescid   = $child.find("input[name='imgdesc']");
        var imgdesc     = $(imgdescid).val();
        
        updateEventMediaHandler(imgfile, imgdesc);
        
   });
   
   //close edit dialog box
   $(this).dialog('close');
 }
 
 

/* CREATING THE IMAGE AND VIDEO BOXES
******************************************************************************/  
var openCounters = new Array();
var textCounter = 1;

var vidcounter = 0;
function addVideoBox(){
  var html = "";
  
  html  = "<div id='vidtextboxes-" + vidcounter + "' class='vidbox'>";
  html += '<a href = "link/to/trash/script/when/we/have/js/off" title="Delete Media" class="ui-icon ui-icon-close" style="float:right;">Delete Media</a>';
  html += "&nbsp Embed Video <input type='text' class='vidtext' name='embedvidurl' /><br/>";
  html += "&nbsp Description &nbsp <input type='text' class='vidtext' name='viddesc' />";
  html += "</div>";
  
  $("#videospace").append(html);
  vidcounter++;
}

var imgcounter = 0;
function addImageBox(){
  var html = "";
 
  html  = "<div id='imgtextboxes-" + imgcounter + "' class='imgbox'>";
  html += '<a href = "#" title="Delete Media" class="ui-icon ui-icon-close closeimgbox" style="float:right;">Delete Media</a>';
  html += "&nbsp Choose File <input type='file' class='imgfilebox' name='imgfile'/><br/>";
  html += "&nbsp Description <input type='text' id='imgtext-" + imgcounter + "' class='imgtext' name = 'imgdesc'/>";
  html += "</div>";
  
  $("#imagespace").append(html);
  imgcounter++;
}

function imgBoxCloseHandler(){
 $('a.closeimgbox').live ('click', function(ev) {

   //alert("parent is " + $(this).parent().attr("id"));
   var $item   = $(this).parent();
   var $target = $(ev.target);
   
   //try to remove the parent
   if ($target.is('a.ui-icon-close')){  //close box
      deleteBox($item); 
    }
  
  });
}

function vidBoxCloseHandler(){
 $('.vidbox').live ('click', function(ev) {
    var $item   = $(this);
    var $target = $(ev.target);
  
    //alert("trying to close image box");
    
    if ($target.is('a.ui-icon-close')){  //close box
      //alert ("trying to delete the item ");
      deleteBox($item); 
    }
  
    return false;
  });
}

function deleteBox($item){
   $("#alertdialog").dialog("option", "buttons", { 
                         "Ok": function() { $item.fadeOut(function(){$item.find('a.ui-icon-close').remove();});  $(this).dialog('close'); }, 
                         "Cancel": function() { $(this).dialog('close'); } } );
   $("#alertdialog").dialog('open');
}
/*******************************************************************************/ 


/*IFRAME STUFF
 ****************************************************************************/ 
function getSvgEditImage(iframeid,iframefield,target){
  var mmspobj = document.getElementById(iframeid);
  if (mmspobj.tagName=='IFRAME'){
   
    var savebutton = window.frames[iframeid].document.getElementById('tool_save');
    //alert(savebutton);
    
    if (savebutton == null) alert("we screwed up");
    //alert("trying to click");
    //savebutton.onclick();
   // alert(window.frames[iframeid]);
    
 //   alert(window.frames[iframeid].document.getElementById(iframefield).value);
    //window.frames[iframeid].document.saveMe();
    //window.frames[iframeid].document.getElementById(iframefield).click();
    //alert("after clicking");
    
    var myval      = window.frames[iframeid].document.getElementById(iframefield).value;
  }
  //for our purposes leave the target div empty
  //document.getElementById(target).value=myval;
  //alert("we have the value " + myval);
  
  //write the value to the form element
  return myval;
}


/*FORM STUFF 
 ****************************************************************************/
function  addNotesEventFormHandler(desc,sketch){
  $('#event_eventnotes_eventid').val(eventId);
  $('#event_eventnotes').val(desc);
  //$('#event_eventsketch').val(sketch);
  
  //call the form submit
  $("#update_event_notes_sketch").submit();
}

function updateEventVideoHandler(videourl, desc){
   
   //lets update the form from here
   $('#event_eventvideo_eventid').val(eventId);
   $('#event_eventvideo').val(videourl);
   $('#event_eventvideodesc').val(desc);
   
   //call the form submit
   $("#update_video_details").submit();
}
 
function updateEventMediaHandler(imgfile, imgdesc){
  //lets update the form from here
   $('#event_eventmedia_eventid').val(eventId);
   $('#event_eventmedia').val(imgfile);
   $('#event_eventmediadesc').val(imgdesc);
   
   //call the form submit
   //$("#upload_media_details").submit();
}

function getEventMediaContent(){
  
  //alert("in get event media content called from view handler");
  
  //lets update the form from here
  $('#event_get_eventid').val(eventId);
  $('#get_eventcontent_rows').submit();
}
/***************************************************************************
																FORM STUFF */
