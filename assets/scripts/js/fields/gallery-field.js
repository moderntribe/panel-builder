(function($, window) {
	var panels_div = $('div.panels');

	var build_selection = function( attachment_ids ) {

		if ( attachment_ids.length < 1 ) {
			return false;
		}

		var shortcode = new wp.shortcode({
			tag:    "gallery",
			attrs:   { ids: attachment_ids.join(',') },
			type:   "single"
		});
		var attachments = wp.media.gallery.attachments( shortcode );
		var selection = new wp.media.model.Selection( attachments.models, {
			props:    attachments.props.toJSON(),
			multiple: true
		});
		selection.gallery = attachments.gallery;
		// Fetch the query"s attachments, and then break ties from the
		// query to allow for sorting.
		selection.more().done( function() {
			// Break ties with the query.
			selection.props.set({ query: false });
			selection.unmirror();
			selection.props.unset("orderby");
		});

		return selection;
	};

	panels_div.on( 'click', '.button.edit-gallery-field', function() {
		var container = $(this).closest('.panel-input-gallery');
		var field = container.find('input.gallery-ids');
		var preview = container.find('.gallery-field-preview');

		var ids = [];
		container.find('.gallery-field-attachment-id').each( function() {
			ids.push( $(this).val() );
		});

		// Set frame object:
		var frame = wp.media({
			frame:     'post',
			state:     'gallery-edit',
			title:     container.data('label'),
			editing:   true,
			multiple:  true,
			selection: build_selection( ids )
		});

		// Override insert button
		var overrideGalleryInsert = function() {
			frame.toolbar.get('view').set({
				insert: {
					style: 'primary',
					text: ModularContent.localization.save_gallery,
					click: function() {
						var models = frame.state().get('library');

						var attachments = models.map( function( attachment ) {
							var att = attachment.toJSON();
							var thumbnail = '';
							if ( att.sizes.hasOwnProperty('thumbnail') ) {
								thumbnail = att.sizes.thumbnail.url;
							} else {
								// If it doesn't have a thumbnail, that's because it was
								// too small for WP to create one. Use the full size image.
								thumbnail = att.sizes.full.url;
							}
							return {
								id: att.id,
								thumbnail: thumbnail
							};
						} );

						show_preview( container, attachments );
						frame.close();
					}
				}

			});
		};

		frame.open();

		var GallerySidebarHider = {};
		_.extend(GallerySidebarHider, Backbone.Events);
		GallerySidebarHider.hideGallerySidebar = function(  ) {
			frame.content.get('view').sidebar.unset('gallery'); // Hide Gallery Settings in sidebar
		};
		GallerySidebarHider.listenTo(frame.state('gallery-edit'), 'activate', GallerySidebarHider.hideGallerySidebar);
		GallerySidebarHider.hideGallerySidebar();

		frame.on( 'toolbar:render:gallery-edit', overrideGalleryInsert);

		overrideGalleryInsert();

	});

	var show_preview = function( container, data ) {
		var panel_id = container.find( '.gallery-field-name' ).val();
		var selection_row = container.find( '.gallery-field-selection' );
		var default_attachment = { id: 0, thumbnail: '' };
		if ( !Array.isArray( data ) ) {
			data = [];
		}
		selection_row.empty();
		$.each( data, function ( index, attachment ) {
			attachment = _.extend( {}, default_attachment, attachment );
			if ( attachment.id && attachment.thumbnail ) {
				var item = $('<div class="gallery-field-item"></div>');
				item.append( '<input type="hidden" class="gallery-field-attachment-id" name="'+panel_id+'['+index+'][id]" value="'+attachment.id+'" />');
				item.append( '<input type="hidden" class="gallery-field-attachment-thumbnail" name="'+panel_id+'['+index+'][thumbnail]" value="'+attachment.thumbnail+'" />');
				item.append( '<img src="'+attachment.thumbnail+'" width="75" height="75" />' );
				selection_row.append( item );
			}
		});
	};

	var initialize_row = function( container, data ) {
		var name = container.data('name').split('.');
		var local_data = data;
		$.each( name, function( index, namepart ) {
			if ( local_data.hasOwnProperty(namepart) ) {
				local_data = local_data[namepart];
			} else {
				local_data = [];
			}
		});
		show_preview( container, local_data );
	};

	panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid, data) {
		if ( $(this).data('panel_id') == uuid && $(this).find('.panel-input-gallery').length > 0 ) {
			initialize_row( $(this).find('.panel-input-gallery'), data );
		}
	});
	panels_div.on('new-panel-repeater-row', '.panel-repeater-row', function(e, uuid, data) {
		if ( $(this).find('.panel-input-gallery').length > 0 ) {
			initialize_row( $(this).find('.panel-input-gallery'), data );
		}
	});
})(jQuery, window);