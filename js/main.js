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
     */
    var eras = [
        { mya: 600, description: 'Neo-proterozoic', c: '#FED67B'},
        { mya: 560, description: 'Late Proterozoic', c: '#FED67B'},
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
        { mya: 240, description: 'Middle Triassic', c: '#BF7CB1'},
        { mya: 220, description: 'Late Triassic', c: '#C698C2'},
        { mya: 200, description: 'Early Jurassic', c: '#00B7EA'},
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
        { mya: .4, description: 'Pleistocene', c: '#FFF579'},
        { mya: .050, description: 'Pleistocene', c: '#FFEBA7'},
        { mya: .012, description: 'Holocene', c: '#FFEDD8'},
        { mya: 0, description: 'Present day', c: '#fef2e0'},
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
            'click .switch-to-french': 'switchToFrench',
            'click .switch-to-english': 'switchToEnglish',
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
            var fullWidth = 1838;
            // General fudge factor for how long we'd like the final period
            // last. We have to define this since there isn't a final bound
            // to calculate this from.
            var finalDuration = 54;

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
                //console.log(nextMya, eraWidth);
                /**
                 * Make very small eras visible
                 */
                if ( eraWidth < 1 ) {
                    eraWidth = 5;
                }

                if (i === 0) {
                    // First
                    model.attributes.rightBoundary = eraWidth;
                    $('.' + eraClass).addClass('era-first');
                } else if (i !== (numEras - 1)) {
                    // All but last
                    model.attributes.rightBoundary =
                        list[i - 1].attributes.rightBoundary + eraWidth;
                } else {
                    // Last era
                    model.attributes.rightBoundary = fullWidth;
                    // Remove an extra pixel to handle CSS' impercision with
                    // the decimal points.
                    eraWidth = eraWidth - 1;
                    $('.' + eraClass).addClass('era-last');
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
            //$('.timeline-pointer').css(
                //'left', ($('#timeline-indicator').width() / 2) - 15);
            $('#timeline-label').html('Present day');
            $('#timeline-indicator').css('left', '1225px');
            $('#map').css('background-position', 30 * -1860);

        },

        // TODO - In the future, do click checking
        cycleImage: function () {
            //console.log('Click');
        },

        switchToFrench: function (e) {
            $('#sidebar-english').hide();
            $('#sidebar-french').show();
        },

        switchToEnglish: function (e) {
            $('#sidebar-french').hide();
            $('#sidebar-english').show();
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
            //$('#info').html(' - Mouse: ' + mousePos +
                            //', Interval: ' + interval +
                            //', Mya: ' + currentMya +
                            //', Period: ' + currentPeriod +
                            //', intervalMultiplier: ' + intervalMultiplier);

            // Timeline label
            $('.timeline-pointer').css(
                'left', ($('#timeline-indicator').width() / 2) - 15);
            var timelineLabel = '';
            //console.log("Current MYA", currentMya);
            if (currentMya > 1) {
                timelineLabel = '<span class="mya">' +
                    currentMya + ' million years ago' + '</span>' +
                    '<br />' + currentPeriod;
            } else if (currentMya > 0 && currentMya < 1) {
                timelineLabel = '<span class="mya">' + (currentMya * 1000) +
                    ' thousand years ago</span><br />' + currentPeriod;
            } else if (currentMya  == 0) {
                timelineLabel = currentPeriod
            } else {
                timelineLabel = '<span class="mya">' +
                    -currentMya + ' million years <br />in the future</span>';
            }
            $('#timeline-label').html(timelineLabel);
            $('#timeline-indicator').css(
                'left', event.pageX - ($('#timeline-indicator').width() / 2));
        }

    });

    var mapView = new MapView();

})(jQuery);
