(function($){

    // Prevent image dragging
    //
    // Since this is a touch screen experience, we don't want users to be able
    // to touch and drag the main map image around. This prevents dragging.
	//
	// TODO - Build this into Backbone
	document.getElementById('map').ondragstart = function() { return false; };

	/**
	 * Static Paleogeography images
	 *
	 * Maybe these should be broken out in another file?
	 */
    var eras = [
        { mya: '-250', description: '250 million years in the future' },
        { mya: '-200', description: '200 million years in the future' },
        { mya: '-150', description: '150 million years in the future' },
        { mya: '-100', description: '100 million years in the future' },
        { mya: '-050', description: '50 million years in the future' },
        { mya: '-003', description: '3 million years in the future' },
        { mya: '000', description: 'Present day' },
        { mya: '005', description: 'Pleistocene' },
        { mya: '012', description: 'Holocene' },
        { mya: '020', description: 'Miocene' },
        { mya: '035', description: 'Late Eocene' },
        { mya: '050', description: 'Eocene' },
        { mya: '065', description: 'KT Boundary' },
        { mya: '075', description: 'Later Cretaceous' },
        { mya: '090', description: 'Late Cretaceous' },
        { mya: '105', description: 'Early Cretaceous' },
        { mya: '120', description: 'Earlier Cretaceous' },
        { mya: '150', description: 'Late Jurassic' },
        { mya: '170', description: 'Middle Triasic' },
        { mya: '200', description: 'Late Triasic' },
        { mya: '220', description: 'Late Triasic' },
        { mya: '240', description: 'Middle Triasic' },
        { mya: '260', description: 'Late Permian' },
        { mya: '280', description: 'Early Permian' },
        { mya: '300', description: 'Late Pennsylvanian' },
        { mya: '340', description: 'Middle Mississippian' },
        { mya: '370', description: 'Late Devonian' },
        { mya: '400', description: 'Early Devonian' },
        { mya: '420', description: 'Late Silurian' },
        { mya: '430', description: 'Middle Silurian' },
        { mya: '440', description: 'Early Silurian' },
        { mya: '450', description: 'Late Ordovician' },
        { mya: '470', description: 'Middle Ordovician' },
        { mya: '500', description: 'Late Cambrian' },
        { mya: '540', description: 'Early Cambrian' },
        { mya: '560', description: 'Late Protoerozoic' },
        { mya: '600', description: 'Later Protoerozoic' },
    ];

	/**
	 * Models
	 *
	 * A single element in the data is an Era.
	 */
	var Era = Backbone.Model.extend({
		defaults: {
			file: '',
			description: ''
		},
		//initialize: function(){
            //console.log('Is there any ulitity to defining this here?');
        //}
	});

	/**
	 * Collections
	 *
	 * A grouping of all the Eras represents History
	 */
	var History = Backbone.Collection.extend({
		model: Era
	});

	/**
	 * Views
	 *
	 * Our primary view is just for looking at the map initially.
	 */
	var MapView = Backbone.View.extend({
        el: $('body'),

		// Run the cycleImage function when the main image is clicked.
		// Eventually we'll add a click and drag event.
		events: {
			'click #map': 'cycleImage',
			'mousemove': 'mousemove',
		},

		initialize: function() {

			_.bindAll(this, 'render', 'cycleImage');

			// Add the collection to the this object.
			this.collection = new History(eras);

			// Get some details about the map that we only need to get once.
			this.map = $("#map");
			this.mapPos = this.map.position();
			console.log('Map Position', this.mapPos);
			this.mapWidth = $("#map").innerWidth();
			this.mapHeight = $("#map").innerHeight();

			// Run the render function. I think this is part of the pattern
			// convention.
			this.render();
		},

		// Render the initial state of the map.
		render: function(){
			$('#map').attr('src', 'img/blakey/' +
							_.first(this.collection.models).attributes.file);
		},

		// Cycle the map
		//
		// Right now this one just changes the image to the last image.
		// Up next it will cycle through the images.
		cycleImage: function () {
			//console.log('Click');
			$('#map').attr('src', 'img/blakey/' +
							_.last(this.collection.models).attributes.file);
		},

		mousemove: function(e) {
			// Get mouse position
			xPos = event.pageX - this.mapPos.left;
			yPos = event.pageX - this.mapPos.top;
			//console.log("Mouse coordinates", xPos + ", " + yPos);

			// Turn it into a percentage of the map width
			xPcent = ((xPos / this.mapWidth) * 100);
			yPcent = ((yPos / this.mapHeight) * 100);
			mousePos = xPcent.toFixed(2) + '%, ' + yPcent.toFixed(2) + '%';
			//console.log('Mouse pos', mousePos);

			// Turn mouse position into a interval of the count of the
			// paleoImages array length.
			var interval = parseInt((xPcent / 100) *
									this.collection.models.length);

			// Set the current image based on the mouse position interval
			currentImg = this.collection.models[interval].attributes.file;
			$('#info').html(' - Mouse: ' + mousePos +
							', Interval: ' + interval +
							', currentImg: ' + currentImg);
			$('#map').attr('src', 'img/blakey/' + currentImg);

		}

	});

	var mapView = new MapView();

})(jQuery);
