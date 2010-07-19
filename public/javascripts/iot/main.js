

$(function() {
  initNavigationLinks();
});

function initNavigationLinks(){
  $("#mainnav, #footnav").lavaLamp({
    fx: "backout",
    speed: 500,
    click: function(event, menuItem) {
       return true;
    }
  });
}