(function($) {
	var repeaterField = {
		counter: 0,

		intialize_data: function ( container, rows ) {
			var min = container.data( 'min' ), i;
			rows = rows || [{}];
			if ( min && rows.length < min ) {
				var offset = min - rows.length;
				for ( i in rows ) {
					rows.push({});
				}
			}
			for ( i in rows ) {
				repeaterField.load_row( container, rows[ i ] );
			}
		},

		load_row: function ( container, fields ) {
			if ( repeaterField.is_full( container ) ) {
				return;
			}
			var uuid = container.data('uuid');
			var name = container.data('name');
			var template = wp.template('repeater-'+name);
			var data = {
				panel_id: uuid,
				field_name: uuid+'['+name+']['+repeaterField.counter+']',
				fields: fields
			};
			var new_row = $(template(data));
			container.find('.repeater-field-container').append(new_row);
			repeaterField.counter++;
			new_row.trigger('new-panel-repeater-row', [uuid, data.fields]);

			repeaterField.toggle_new_row_button_visibility( container );
			$( document ).trigger( 'tribe-panels.repeater-row-added', [ container, new_row ] );
		},

		toggle_new_row_button_visibility: function( container ) {
			if ( repeaterField.is_full( container ) ) {
				container.children( '.panel-repeater-new-row').hide();
			} else {
				container.children( '.panel-repeater-new-row').show();
			}
		},

		is_full: function( container ) {
			var max = container.data('max');
			if ( max < 1 ) {
				return false;
			}
			var children = container.children('.repeater-field-container').children('.panel-repeater-row');
			if ( children.length >= max ) {
				return true;
			}
			return false;
		},

		initialize_events: function( container ) {
			container
				.on( 'click', 'a.panel-repeater-new-row', repeaterField.add_row )
				.on( 'click', 'a.delete', repeaterField.remove_row );

			if ( ! container.hasClass('ui-sortable') ) {
				container.sortable({
					items: '.panel-repeater-row',
					handle: '.move',
					axis: 'y',
					start: function( e, ui ) {
						$(ui.item).trigger('tribe-panels.start-repeater-drag-sort');
					},
					stop: function( e, ui ) {
						$(ui.item).trigger('tribe-panels.stop-repeater-drag-sort');
					}
				});
			}
		},

		add_row: function( e ) {
			e.preventDefault();
			var container = $(this).closest('fieldset.panel-input-repeater');
			repeaterField.load_row( container, {} );
		},

		remove_row: function ( e ) {
			e.preventDefault();
			var container = $(this).closest('fieldset.panel-input-repeater');
			$(this).closest('.panel-repeater-row').remove();

			repeaterField.toggle_new_row_button_visibility( container );
			$( document ).trigger( 'tribe-panels.repeater-row-removed', [ container ] );
		}

	};


	var panels_div = $('div.panels');
	panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid, data) {
		var row = $(this);
		if ( row.data( 'panel_id' ) != uuid ) {
			return;
		}
		var container = row.find('fieldset.panel-input-repeater');
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