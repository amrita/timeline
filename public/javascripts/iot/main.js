

$(function() {
  initNavigationLinks();
});

function initNavigationLinks(){

  //$(‘.lavalamp [href='+window.location.pathname+']‘).parent().addClass(“current”);
  $("#mainnav, #footnav").lavaLamp({
    fx: "backout",
    speed: 150,
    click: function(event, menuItem) {
             return true;
           }
  });
}