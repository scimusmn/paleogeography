// Prevent image dragging
//
// Since this is a touch screen experience, we don't want users to be able
// to touch and drag the main map image around. This prevents dragging.
document.getElementById('map').ondragstart = function() { return false; };







$("#map").mousemove(function( event ) {
  var map = $("#map");
  map.css("opacity", .3);

  var mapPos = map.position();

  var mapWidth = map.width();
  var mapHeight = map.height();

  var xPos = event.pageX - mapPos.left;
  var xPcent = ((xPos / mapWidth) * 100);
  var yPos = event.pageY - mapPos.top;
  var yPcent = ((yPos / mapWidth) * 100);

  //var pageCoords = "( " + xPos + ", " + yPos + " )";
  var pageCoords = "( " + xPcent.toPrecision(3) + "%, " +
    yPcent.toPrecision(3) + "% )";

  $( "span:first" ).text( "( x,y ) : " + pageCoords );

  $("#map").css("opacity", xPcent / 100);

});
