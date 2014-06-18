(function($) {
	var repeaterField = {
		counter: 0,

		intialize_data: function ( container, rows ) {
			for ( var i in rows ) {
				repeaterField.load_row( container, rows[i] );
			}
		},

		load_row: function ( container, fields ) {
			var uuid = container.data('uuid');
			var name = container.data('name');
			var template = wp.template('repeater-'+name);
			var data = {
				panel_id: uuid+'['+name+']['+repeaterField.counter+']',
				fields: fields
			};
			container.find('.repeater-field-container').append($(template(data)));
			repeaterField.counter++;
		},

		initialize_events: function( container ) {
			container
				.on( 'click', 'a.panel-repeater-new-row', repeaterField.add_row )
				.on( 'click', 'a.delete', repeaterField.remove_row );
		},

		add_row: function( e ) {
			e.preventDefault();
			var container = $(this).closest('fieldset.panel-input');
			repeaterField.load_row( container, {} );
		},

		remove_row: function ( e ) {
			e.preventDefault();
			$(this).closest('.panel-repeater-row').remove();
		}

	};


	var panels_div = $('div.panels');
	panels_div.on('new-panel-row load-panel-row', '.panel-type-repeater', function(e, uuid, data) {
		var row = $(this);
		var container = row.find('fieldset.panel-input');
		if ( container.length < 1 ) {
			return;
		}

		container.data('uuid', uuid);
		var name = container.data('name');
		data = data[name];

		repeaterField.intialize_data(container, data);
		repeaterField.initialize_events(container);
	});

})(jQuery);