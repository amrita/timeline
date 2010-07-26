
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
  
  itemBoxCloseHandler();

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
  nstring.push('<textarea id="etextarea" rows="16" cols="25"></textarea>');
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
  string.push('<object id="svg-edit" type="text/html" data="/javascripts/svg-edit-v2.2/editor/svg-editor.html" width="500" height="360">'); 
  string.push('<p>Your browser does not support svg-edit...</p>'); 
  string.push('</object>'); 
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
				Save: function() {
				  //open view dialog box. close edit dialog box
				  $(this).dialog('close');
				},
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


/* CREATING THE IMAGE AND VIDEO BOXES
******************************************************************************/  
var openCounters = new Array();
var textCounter = 1;

var vidcounter = 0;
function addVideoBox(){
  var html = "";
  
  html  = "<div id='vidtextboxes-" + vidcounter + "' class='vidbox'>";
  html += '<a href = "link/to/trash/script/when/we/have/js/off" title="Delete Media" class="ui-icon ui-icon-close" style="float:right;">Delete Media</a>';
  html += "&nbsp Embed Video <input type='text' class='vidtext'/><br/>";
  html += "&nbsp Description &nbsp <input type='text' class='vidtext'/>";
  html += "</div>";
  
  $("#videospace").append(html);
  vidcounter++;
}

var imgcounter = 0;
function addImageBox(){
  var html = "";
  
  html  = "<div id='imgtextboxes-" + imgcounter + "' class='imgbox'>";
  html += '<a href = "link/to/trash/script/when/we/have/js/off" title="Delete Media" class="ui-icon ui-icon-close" style="float:right;">Delete Media</a>';
  html += "&nbsp Choose File <input type='file' class='imgfilebox'/><br/>";
  html += "&nbsp Description <input type='text' id='imgtext-" + imgcounter + "' class='imgtext'/>";
  html += "</div>";
  
  $("#imagespace").append(html);
  imgcounter++;
}

function itemBoxCloseHandler(){
  $('.imgbox, .vidbox').live ('click', function(ev) {
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
