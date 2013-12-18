(function($){

	// Start a JS object with some of our basic data
	var Item = Backbone.Model.extend({
		defaults: {
			part1: 'hello',
			part2: 'world'
		}
	});

	// The list class is a collection of items.
	var List = Backbone.Collection.extend({
		model: Item
	});

	var ListView = Backbone.View.extend({

		// Attaches this.el (aka element) to an existing element.
		// Here, the body in your HTML. We're still using jQuery here to
		// grab the DOM element.
		el: $('body'),

		events: {
			'click button#add': 'addItem',
			'click button#minus': 'minusItem'
		},

		initialize: function(){
			// All functions that use 'this' should be in here.
			_.bindAll(this, 'render', 'addItem', 'minusItem', 'appendItem');

			// Bind this event to the collection
			this.collection = new List();
			this.collection.bind('add', this.appendItem);

			this.counter = 0;

			// This view is self rendering.
			this.render();
		},

		render: function(){
			var self = this;

			$(this.el).append("<button id='add'>Add list item</button>");
			$(this.el).append("<ul></ul>");
			// This is the "each" collection in underscore.js in action
			// For each item in the collection we run the appendItem
			// function
			_(this.collection.models).each(function(item){
				self.appendItem(item);
			}, this);
		},

		addItem: function(){
			this.counter++;
			// Get an instance of the Item object
			var item = new Item();
			item.set({
				// Add the counter to the end of the 2nd part of the data
				part2: item.get('part2') + this.counter
			});
			// Add this item onto the collection
			this.collection.add(item);

		},

		appendItem: function(item){
			$('ul', this.el).
				append("<li>" + item.get('part1') + " " +
						item.get('part2') + "</li>");
		},

		minusItem: function(){
			this.counter++;
			$('li', this.el).remove();
		}
	});

	var ListView = new ListView();

})(jQuery);
