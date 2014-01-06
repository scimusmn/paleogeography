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
		{ mya: -250, description: '250 million years in the future' },
        { mya: -200, description: '200 million years in the future' },
        { mya: -150, description: '150 million years in the future' },
        { mya: -100, description: '100 million years in the future' },
        { mya: -50, description: '50 million years in the future' },
        { mya: -3, description: '3 million years in the future' },
        { mya: 0, description: 'Present day' },
        { mya: 5, description: 'Pleistocene' },
        { mya: 12, description: 'Holocene' },
        { mya: 20, description: 'Miocene' },
        { mya: 35, description: 'Late Eocene' },
        { mya: 50, description: 'Eocene' },
        { mya: 65, description: 'KT Boundary' },
        { mya: 75, description: 'Later Cretaceous' },
        { mya: 090, description: 'Late Cretaceous' },
        { mya: 105, description: 'Early Cretaceous' },
        { mya: 120, description: 'Earlier Cretaceous' },
        { mya: 150, description: 'Late Jurassic' },
        { mya: 170, description: 'Middle Triasic' },
        { mya: 200, description: 'Late Triasic' },
        { mya: 220, description: 'Late Triasic' },
        { mya: 240, description: 'Middle Triasic' },
        { mya: 260, description: 'Late Permian' },
        { mya: 280, description: 'Early Permian' },
        { mya: 300, description: 'Late Pennsylvanian' },
        { mya: 340, description: 'Middle Mississippian' },
        { mya: 370, description: 'Late Devonian' },
        { mya: 400, description: 'Early Devonian' },
        { mya: 420, description: 'Late Silurian' },
        { mya: 430, description: 'Middle Silurian' },
        { mya: 440, description: 'Early Silurian' },
        { mya: 450, description: 'Late Ordovician' },
        { mya: 470, description: 'Middle Ordovician' },
        { mya: 500, description: 'Late Cambrian' },
        { mya: 540, description: 'Early Cambrian' },
        { mya: 560, description: 'Late Protoerozoic' },
        { mya: 600, description: 'Later Protoerozoic' },
    ];

	/**
	 * Models
	 *
	 * A single element in the data is an Era.
	 */
	var Era = Backbone.Model.extend({
		defaults: {
			mya: '',
			description: '',
			eraDuration: '',
			rightBoundary: ''
		},
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
			//console.log('Map Position', this.mapPos);
			this.mapWidth = $("#map").innerWidth();
			this.mapHeight = $("#map").innerHeight();

			// Run the render function. I think this is part of the pattern
			// convention.
			this.render();
		},

		// Render the initial state of the map.
		render: function(){

			/**
			 * Build the timeline
			 */

			// Initialize a Color object from the color.js library.
			// This will be the base color for the timeline.
			var baseColor = Color("#300006");

			// Number of eras in our collection
			var numEras = this.collection.models.length;

			// Full duration of the time series
			var startMya = _.first(this.collection.models).attributes.mya;
			var endMya = _.last(this.collection.models).attributes.mya;
			// The final period *starts* in the year that it identifies.
			// Since we want to display it as having a duration itself We
			// apply a arbitrary duration. This is just a visual display since
			// technically this period last back all the way into the Cambrian
			var finalPeriodDuration = 30;
			var fullDuration = Math.abs(startMya) + endMya +
				finalPeriodDuration;
			var fullWidth = 1860;
			//console.log('Full duration', fullDuration);

			// Build the timeline from the eras in our collection
			_.each(this.collection.models, function(model, i, list){

				// Append divs for the timeline
				eraClass = 'era-' + i;
				var $newDiv = $("<div/>")
					.addClass('era')
					.addClass(eraClass)
					.html('&nbsp;');
				$('#timeline').append($newDiv);

				// Find the length of each era.
				// Treat the last one as an arbitrary length.
				currentMya = model.get('mya');
				if (i != (numEras - 1)) {
					nextMya = list[i + 1].get('mya');
					// Add the duration value to the model
					model.attributes.eraDuration = nextMya - currentMya;
				}
				else {
					// TODO Put this in as a constant up top
					model.attributes.eraDuration = 10;
				}

				// Calculate the right boundaries based on the durations
				eraWidth = Math.round((
					model.attributes.eraDuration / fullDuration) * fullWidth);
				//console.log('ID = ' + model.cid +
							//', description = ' + model.get('description') +
							//', width = ' + eraWidth);

				if (i === 0) {
					model.attributes.rightBoundary = eraWidth;
				}
				else if (i!= (numEras - 1)) {
					model.attributes.rightBoundary =
						list[i - 1].attributes.rightBoundary + eraWidth;
				}
				// JS and CSS math is terrible
				// We just have to tell it that the end is here
				else {
					model.attributes.rightBoundary = 1860;
				}

				// Store the interval in the model so that we can reference
				// different eras in events
				model.attributes.interval = i;

				// Add width
				// Length of the timeline in years.
				var fullLength = 640;
				eraWidth = ((eraDuration / fullLength) * 100);
				//console.log(eraWidth);
				$('.' + eraClass).css('width', eraWidth + '%');

				// Add color
				colorModifier = (1 / (i + 1)) * 10;
				periodColor = baseColor.lighten( 0.07 );
				baseColor = Color(periodColor.hexString());
				$('.' + eraClass).css("background", periodColor.hexString());

			});
		},

		// TODO - In the future, do click checking
		cycleImage: function () {
			console.log('Click');
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

			if (interval !== 0) {
				intervalMultiplier = interval * -1860;
			}
			else {
				intervalMultiplier = 0;
			}

			// Set the current image based on the mouse position interval
			currentMya = this.collection.models[interval].attributes.mya;
			currentPeriod = this.collection.models[interval].attributes.description;
			// We use css to change the image since it's lots faster than
			// doing this with file replacement. Even locally.
			$('#map').css('background-position', intervalMultiplier);

			// Indicate our current frame in the timeline
			$(".era").removeClass("era-active");
			$('.era-' + interval).addClass('era-active');

			// Display debug information
			$('#info').html(' - Mouse: ' + mousePos +
							', Interval: ' + interval +
							', Mya: ' + currentMya +
							', Period: ' + currentPeriod +
							', intervalMultiplier: ' + intervalMultiplier);

			//$('#map').attr('src', 'img/blakey/' + currentImg);

		}

	});

	var mapView = new MapView();

})(jQuery);
