

$(function() {
  initNavigationLinks();
});

function initNavigationLinks(){
  $("#mainnav, #footnav").lavaLamp({
    fx: "backout",
    speed: 700,
    click: function(event, menuItem) {
             return false;
           }
  });
}