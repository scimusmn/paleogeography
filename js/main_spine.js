(function($){

	/**
	 * Static Paleogeography images
	 *
	 * Maybe these should be broken out in another file?
	 */
    var eras = [
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
})(jQuery);
