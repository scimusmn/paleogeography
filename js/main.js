$("#map").mousemove(function( event ) {
  var map = $("#map");

  var mapPos = map.position();

  var mapWidth = map.width();
  var mapHeight = map.height();

  var xPos = event.pageX - mapPos.left;
  var xPcent = ((xPos / mapWidth) * 100).toPrecision(3);
  var yPos = event.pageY - mapPos.top;
  var yPcent = ((yPos / mapWidth) * 100).toPrecision(3);

  //var pageCoords = "( " + xPos + ", " + yPos + " )";
  var pageCoords = "( " + xPcent + "%, " + yPcent + "% )";
  $( "span:first" ).text( "( x,y ) : " + pageCoords );
});
