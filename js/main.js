$( document ).ready(function() {
    console.log("Ready");
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
        { file: "075.png", description: "Later Cretaceous" },
        { file: "090.png", description: "Late Cretaceous" },
        { file: "105.png", description: "Early Cretaceous" },
        { file: "120.png", description: "Earlier Cretaceous" },
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
        { file: "600.png", description: "Later Protoerozoic" },
    ];

	var totalWidth = 0;

    for (var key in paleoImages) {;

		var periods = paleoImages.length - 1;
		if (parseInt(key) != periods) {
			currentFile = parseInt(paleoImages[key].file.substring(0,3));
			nextFile = parseInt(paleoImages[parseInt(key) + 1].file.substring(0,3));
			myr = nextFile - currentFile;
			//console.log("In key:" + key + "; myr: " + myr);

			var eraClass = paleoImages[key].description.toLowerCase();
			eraClass = eraClass.replace(" ", "-");
			paleoImages[key].eraClass = eraClass;
			//console.log("Time: " + currentFile +
					//"; Millions of Years long: " + myr + "; " +
					//"; Era Class: " + eraClass);
			// Length of the timeline in years.
			var fullLength = 640;

			// Pixel width of the current era.

			eraWidth = ((myr / fullLength) * 100).toPrecision(2);

			// Set the era width
			$('.' + eraClass).attr("style", "width: " + eraWidth + "%;");
			//console.log(eraWidth);

			paleoImages[key].myr = '30';
			var obj = paleoImages[key];
			totalWidth = totalWidth + parseFloat(eraWidth);
		}
    }

	totalWidth = totalWidth.toPrecision(2);
	//console.log("Total width: " + totalWidth);
	// Removing a small fudge factor to get the % floating to work.
	// This is purely the result of trial and error and is a hack right now.
	lastWidth = 100 - totalWidth - 0.5;
	$('.era-last').attr("style", "display: inline-block;");
	$('.era-last').attr("style", "width: " + lastWidth + "%;");

	var currentInterval = 0;
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
			var interval = parseInt((xPcent / 100) * paleoImages.length);

			$("#position-label").attr("style", "left: " + xPos + "px;");
			$("#position-label").html(paleoImages[interval].description);

			//var pageCoords = "( " + xPos + ", " + yPos + " )";
			var pageCoords = "( " + xPcent.toPrecision(3) + "%, " +
				yPcent.toPrecision(3) + "% )";

			$( "span:first" ).text( "( x,y ) : " + pageCoords );

			var timeImage = '';

			if (interval != currentInterval) {
				timeImage = paleoImages[interval].file;

				//previousClass = paleoImages[currentInterval].file;
				//console.log("Previous clas" + previousClass);
				eraClass = paleoImages[interval].eraClass;

				$(".era").removeClass("era-active");
				$("." + eraClass).addClass("era-active");

				// It's probably faster to move the image rather than changing the src
				// But I wonder how large of an image can we load into memory
				$("#map").attr("src", "img/blakey/" + timeImage);
				currentInterval = interval;
			} else {
			}
        }
    });
});




