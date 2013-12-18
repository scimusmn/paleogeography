(function($){
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
			_.bindAll(this, 'render', 'addItem');

			this.counter = 0;

			// This view is self rendering.
			this.render();
		},

		render: function(){
			$(this.el).append("<button id='add'>Add list item</button>");
			$(this.el).append("<button id='minus'>Delete list item</button>");
			$(this.el).append("<ul><li>Hello World</li></ul>");
		},

		addItem: function(){
			this.counter++;
			$('ul', this.el).append("<li>Hello World" + this.counter + "</li>");
		},
		minusItem: function(){
			this.counter++;
			$('li', this.el).remove();
		}
	});

	var ListView = new ListView();

})(jQuery);
