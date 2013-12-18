(function($){
	var ListView = Backbone.View.extend({
		// Attaches this.el (aka element) to an existing element.
		// Here, the body in your HTML.
		el: $('body'),
		initialize: function(){
			// Retain context for this within methods
			_.bindAll(this, 'render');

			// This view is self rendering.
			this.render();
		},
		render: function(){
			$(this.el).append("<ul><li>Hello World</li></ul>");
		}
	});

	var ListView = new ListView();

})(jQuery);
