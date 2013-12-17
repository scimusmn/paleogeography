// Prevent image dragging
//
// Since this is a touch screen experience, we don't want users to be able
// to touch and drag the main map image around. This prevents dragging.
document.getElementById('map').ondragstart = function() { return false; };

// Define image array
//
// List of image files and their descriptions
var paleoImages = [
    { file: "000.png", description: "Present day" },
    { file: "005.png", description: "Pleistocene" },
    { file: "012.png", description: "Holocene" },
    { file: "020.png", description: "Miocene" },
    { file: "035.png", description: "Late Eocene" },
    { file: "050.png", description: "Eocene" },
    { file: "065.png", description: "KT Boundary" },
    { file: "075.png", description: "Late Cretaceous" },
    { file: "090.png", description: "Late Cretaceous" },
    { file: "105.png", description: "Early Cretaceous" },
    { file: "120.png", description: "Early Cretaceous" },
    { file: "150.png", description: "Late Jurassic" },
    { file: "170.png", description: "Middle Triasic" },
    { file: "200.png", description: "Late Triasic" },
    { file: "220.png", description: "Late Triasic" },
    { file: "240.png", description: "Middle Triasic" },
    { file: "260.png", description: "Late Permian" },
    { file: "280.png", description: "Early Permian" },
    { file: "300.png", description: "Late Pennsylvanian" },
    { file: "340.png", description: "Middle Mississippian" },
    { file: "370.png", description: "Late Devonian" },
    { file: "400.png", description: "Early Devonian" },
    { file: "420.png", description: "Late Silurian" },
    { file: "430.png", description: "Middle Silurian" },
    { file: "440.png", description: "Early Silurian" },
    { file: "450.png", description: "Late Ordovician" },
    { file: "470.png", description: "Middle Ordovician" },
    { file: "500.png", description: "Late Cambrian" },
    { file: "540.png", description: "Early Cambrian" },
    { file: "560.png", description: "Late Protoerozoic" },
    { file: "600.png", description: "Late Protoerozoic" },
];

$("#map").mousemove(function( event ) {
  if(event.which==1) {
    var map = $("#map");

    // Get details about the map image
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

    var timeImage = '';
    //console.log(paleoImages.length);
    //console.log(paleoImages[1].file);

    var interval = parseInt((xPcent / 100) * paleoImages.length);
    //console.log(interval);

    timeImage = paleoImages[interval].file;
    console.log(timeImage);

    //if (xPcent >= 50)
      //timeImage = paleoImages[interval].file;
    //else
      //timeImage = paleoImages[].file;

    $("#map").attr("src", "img/blakey/" + timeImage);

  }
});

// Debug console info
