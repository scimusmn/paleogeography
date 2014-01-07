(function ($) {

    // Prevent image dragging
    //
    // Since this is a touch screen experience, we don't want users to be able
    // to touch and drag the main map image around. This prevents dragging.
    //
    // TODO - Build this into Backbone
    document.getElementById('map').ondragstart = function () {
        return false;
    };

    /**
     * Static Paleogeography images
     *
     * Maybe these should be broken out in another file?
     */
    var eras = [
        { mya: 600, description: 'Neo-protoerozoic', c: '#FED67B'},
        { mya: 560, description: 'Late Protoerozoic', c: '#FED67B'},
        { mya: 540, description: 'Early Cambrian', c: '#8AB584'},
        { mya: 500, description: 'Late Cambrian', c: '#A1CF9B'},
        { mya: 470, description: 'Middle Ordovician', c: '#00BD97'},
        { mya: 450, description: 'Late Ordovician', c: '#5ECCA9'},
        { mya: 440, description: 'Early Silurian', c: '#7ED7C6'},
        { mya: 430, description: 'Middle Silurian', c: '#B4E5DB'},
        { mya: 420, description: 'Late Silurian', c: '#E4F2E6'},
        { mya: 400, description: 'Early Devonian', c: '#EFB063'},
        { mya: 370, description: 'Late Devonian', c: '#F4E0A9'},
        { mya: 340, description: 'Middle Mississippian', c: '#619D7E'},
        { mya: 300, description: 'Late Pennsylvanian', c: '#8AC6C3'},
        { mya: 280, description: 'Early Permian', c: '#F76E54'},
        { mya: 260, description: 'Late Permian', c: '#FEAF97'},
        { mya: 240, description: 'Middle Triasic', c: '#BF7CB1'},
        { mya: 220, description: 'Late Triasic', c: '#C698C2'},
        { mya: 200, description: 'Early Jurrasic', c: '#00B7EA'},
        { mya: 170, description: 'Middle Jurassic', c: '#34D1EB'},
        { mya: 150, description: 'Late Jurassic', c: '#97E3FA'},
        { mya: 120, description: 'Early Cretaceous - Aptian', c: '#BFE19F'},
        { mya: 105, description: 'Early Cretaceous - Albian', c: '#8ccd57'},
        { mya: 90, description: 'Late Cretaceous - Turonian', c: '#bfe35d'},
        { mya: 75, description: 'Late Cretaceous - Campanian', c: '#e6f47f'},
        { mya: 65, description: 'KT Boundary - Maastrichtian', c: '#f2fa8c'},
        { mya: 50, description: 'Eocene', c: '#fca773'},
        { mya: 35, description: 'Late Eocene', c: '#fdcda1'},
        { mya: 20, description: 'Miocene', c: '#FFFF00'},
        { mya: 12, description: 'Holocene', c: '#FEF2E0'},
        { mya: 5, description: 'Pleistocene', c: '#FFF2C7'},
        { mya: 0, description: 'Present day', c: '#fef2e0'},
        { mya: -3, description: '3 million years in the future', c: '#ccc' },
        { mya: -50, description: '50 million years in the future', c: '#bbb'},
        { mya: -100, description: '100 million years in the future', c: '#b2b2b2'},
        { mya: -150, description: '150 million years in the future', c: '#aaa' },
        { mya: -200, description: '200 million years in the future', c: '#a1a1a1' },
        { mya: -250, description: '250 million years in the future', c: '#999' }
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
        }
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
            'mousemove': 'mousemove'
        },

        initialize: function () {

            _.bindAll(this, 'render', 'cycleImage');

            // Add the collection to the this object.
            this.collection = new History(eras);

            // Get the map position on the page.
            this.mapPos = $("#map").position();

            // Run the render function.
            // I think this is part of the pattern convention.
            this.render();
        },

        // Render the initial state of the map.
        render: function () {

            /**
             * Build the timeline
             */

            // Number of eras in our collection
            var numEras = this.collection.models.length;

            // Full duration of the time series
            var startMya = _.first(this.collection.models).get('mya');
            var endMya = _.last(this.collection.models).get('mya');
            // Make the future last for 50 extra years.
            var finalPeriodDuration = 50;
            var fullDuration = finalPeriodDuration + Math.abs(startMya) +
                Math.abs(endMya);
            var fullWidth = 1860;
            // General fudge factor for how long we'd like the final period
            // last. We have to define this since there isn't a final bound
            // to calculate this from.
            var finalDuration = 50;

            // Loop through the collection and build the timeline from the eras
            _.each(this.collection.models, function (model, i, list) {

                // Make the divs for the timeline
                var eraClass = 'era-' + i;
                var newDiv = $("<div/>")
                    .addClass('era')
                    .addClass(eraClass)
                    .html('&nbsp;');
                $('#timeline').append(newDiv);

                // Find the length of each era
                // Treat the last one as an arbitrary length
                var nextMya = '';
                if (i !== (numEras - 1)) {
                    nextMya = list[i + 1].get('mya');
                    // Add the duration value to the model
                    model.attributes.eraDuration = model.get('mya') - nextMya;
                } else {
                    // TODO Put this in as a constant up top
                    model.attributes.eraDuration = finalDuration;
                }

                // Calculate the right boundaries based on the durations
                var eraWidth = (
                    (model.attributes.eraDuration / fullDuration) * fullWidth
                );

                if (i === 0) {
                    // First
                    model.attributes.rightBoundary = eraWidth;
                } else if (i !== (numEras - 1)) {
                    // All but last
                    model.attributes.rightBoundary =
                        list[i - 1].attributes.rightBoundary + eraWidth;
                } else {
                    // Last era
                    model.attributes.rightBoundary = fullWidth;
                }

                //console.log('ID = ' + model.cid +
                            ////', description = ' + model.get('description') +
                            //', Mya = ' + model.get('mya') +
                            //', width = ' + eraWidth +
                            //', rightBoundary = ' + model.get('rightBoundary'));

                // Store the interval in the model so that we can reference
                // different eras in events
                model.attributes.interval = i;

                // Add width
                // Only works in Chrome and Safari
                // TODO - make this cross browser
                $('.' + eraClass).css('width', eraWidth + 'px');

                // Add color
                $('.' + eraClass).css("background", model.get('c'));

            });

            // Debug check
            //_.each(this.collection.models, function (model, i, list){
                //console.log('Mya: ' + model.get('mya') +
                            ////'Desc.: ' + model.get('description') +
                            //', Right bound: ' + model.get('rightBoundary'));
            //});

        },

        // TODO - In the future, do click checking
        cycleImage: function () {
            //console.log('Click');
        },

        mousemove: function (e) {

            // Get mouse position
            var xPos = event.pageX - this.mapPos.left;
            var yPos = event.pageX - this.mapPos.top;
            //console.log("Mouse coordinates", xPos + ", " + yPos);

            // For debugging
            var mousePos = xPos.toFixed(2) + 'px, ' + yPos.toFixed(2) + 'px';
            //console.log('Mouse pos', mousePos);

            // Get the model for the era that we are hovering over.
            var currentEra = _.first(
                this.collection.filter(function (model) {
                    if (xPos <= model.get('rightBoundary')) {
                        return true;
                    }
                })
            );

            // Move the background image "interval" numbers of times
            // TODO var the pixel width
            var interval = currentEra.get('interval');
            var intervalMultiplier = 0;
            if (interval !== 0) {
                intervalMultiplier = interval * -1860;
            }

            // Set the current image based on the mouse position interval
            var currentMya = currentEra.get('mya');
            var currentPeriod = currentEra.get('description');

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
        }

    });

    var mapView = new MapView();

})(jQuery);
