var eventItemBox;


/*INITIALIZE THIS ENTIRE THING !! CALLED FROM $(document).ready(function() IN TEST.JS
 **********************************************************/
function initializeEventViewer(){
  var main = $('#events');
  
  createEventView(main);
  
  initializeEventItems();
  addEventItemsToDisplay();

  createEventViewDialogs();
  
  createEventViewCarousel();
   
}
/**********************************************************/


/*EVENT ITEMS MAIN VIEW
 **********************************************************/
 function createEventView(object){
   var string = new Array();
   
   string.push('<div id="eventview-container" >');
   string.push('<table id="eventview-table"><tr>');
   string.push('<td valign="top"><div id="eventview-item-desc"></div></td>');
   string.push('<td valign="center"><div id="eventview-items" class="slideshow"></div></td>');
   string.push('<td valign="top"><div id="eventview-nav"></div></td>');
   string.push('</tr></table>');
   string.push('</div>');
   
   var writestring = string.join('');
   $(object).append(writestring);
 }
/**********************************************************/
 
/*EVENT ITEMS CLASS OBJECT 
 **********************************************************/
 var eventItems = new Array();
 function eventItem(item, itemType){
   this.item = item;
   this.itemType = itemType;
 }
 
 var images = ["/images/photos/stellabike.jpg", "/images/photos/stellabikedad.jpg", "/images/photos/anthonybike.jpg" ];
 var videos = ["http://www.youtube.com/watch?v=SHi_ULRndko&feature=related"];
 function initializeEventItems(){
   
   for (var i = 0; i < images.length; i++){
     eventItems.push(new eventItem(images[i],"image"));
   }
   
   /*
   for (var i = 0; i < videos.length; i++){
     eventItems.push(new eventItem(videos[i],"video"));
   }
   */
 }


/* EVENT VIEW MODE 
 **********************************************************/
function createEventViewDialogs(){

  $('#eventview-container').dialog({
   title: "SEE WHAT'S IN YOUR ISLE",
   modal: 'true',
   autoOpen: false,
   //show: 'bounce',
   //hide: 'blind',
   width:  910,
   height: 550,
   resizable: false,
   buttons: { Back: function() {
			  //close both dialogs here 
			  $(this).dialog('close');
			  }
			}
 });
 
}
/**********************************************************/


function createEventViewCarousel(){
  $('#eventview-items').cycle({ 
        fx:      'scrollDown',
        speed:   1500,
        timeout: 0,
        pager:   '#eventview-nav',
        easeIn:  'bounceout',
        //fit:             0,
        //before: onBefore
     });
}
/**********************************************************/

function addEventItemsToDisplay(){
  var i;
  eventItemBox = $('#eventview-items'); //eventItemBox is a GLOBAL 
  
  //now that we have the box lets add events to it
  for (i = 0; i < eventItems.length ; i++){
    //eventItemBox is a GLOBAL !!!
    appendEventItemToItemBox(eventItemBox, eventItems[i].item, eventItems[i].itemType);
  }
}
/**********************************************************/

/* Open the event description dialog. Then open the event view
   dialog with the saved images and video. Then slide down
   the back button
 */
function eventViewOpenClickHandler(event){
  $('#eventview-container').dialog('open');
}
/**********************************************************/


function removeEventItemBox(eventItemBox){
  $(eventItemBox).append(html);
}
/**********************************************************/

function appendEventItemToItemBox(eventBox, item, itemType){
   var html= "";
  
  switch(itemType){
    case "image":
      html = '<div class="slide"><img src="' + item + '" /></div>'; 
      break;
    
    case "video":
      html = '<iframe class="youtube-player" type="text/html" width="432" height="257" src="http://www.youtube.com/embed/SHi_ULRndko" frameborder="0"></iframe>';
      break;
  
    case "audio":
      break;
  
    default:
      alert("We have a wrong item type in appendEventItemToItemBox");
  }
    
  $(eventBox).append(html);
  return;
}
/**********************************************************/


function removeEventItemFromItemBox(){

}
/**********************************************************/


function appendEventDesc(eventDescObject, eventDesc){
  $(eventDescObject).text(eventDesc); 
}
/**********************************************************/


function removeEventDesc(eventDescObject, eventDesc){
  $(eventDescObject).text(); 
}
/***********************************************************
                                           EVENT VIEW MODE */
 
 
 
/* CYCLE RESIZE CODE 
 *************************************************************/
// callback fired when each slide transition begins. centers the image
// in the middle of the image framing div
/*
function onBefore(curr,next,opts) {
    var $slide = $(next);
    var w = $slide.outerWidth();
    var h = $slide.outerHeight();
    
    $slide.css({
        marginTop: (415 - h) / 2,
        marginLeft: (600 - 370 - 8) / 2
    });
};
*/
/************************************************************
                                          CYCLE RESIZE CODE */