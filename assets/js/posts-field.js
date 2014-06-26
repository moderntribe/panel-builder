(function($) {
	var postsField = {
		filter_row_template: wp.template('field-posts-filter'),
		posttype_options_template: wp.template('field-posts-posttype-options'),

		taxonomy_options_template: function( taxonomy ) {
			return wp.template('field-posts-taxonomy-'+taxonomy+'-options');
		},

		update_active_tab: function( event, ui ) {
			var fieldset = $(ui.newPanel).find('fieldset');
			var type = fieldset.hasClass('manual')?'manual':'query';
			var input = fieldset.closest('.panel-input').find('input.query-type');
			input.val(type);
		},

		initialize_tabs: function ( container ) {
			var fieldsets = container.find('fieldset');
			var navigation = $('<ul></ul>');
			var type = container.find('input.query-type').val();
			var active_tab_index = 0;
			fieldsets.each( function(index) {
				var id = $(this).attr('id')+'-wrapper';
				var legend = $(this).find('legend');
				if ( $(this).hasClass(type) ) {
					active_tab_index = index;
				}
				$(this).wrap('<div id="'+id+'" />');
				navigation.append('<li><a href="#'+id+'">'+legend.html()+'</a></li>');
				legend.hide();
			});
			container.prepend(navigation).tabs({
				activate: postsField.update_active_tab,
				active: active_tab_index
			});
		},

		intialize_data: function ( container, data ) {
			data = $.extend({type: 'manual', post_ids: [], filters: {}}, data);
			if ( data.type == 'manual' ) {
				container.find('.manual .selection input').each( function( index ) {
					var input = $(this);
					if ( data.post_ids[index] !== undefined ) {
						input.val(data.post_ids[index]);
					}
				});
			} else {
				$.each(data.filters, function( index, filter ) {
					postsField.add_filter_row( container, index, filter );
				});
				postsField.preview_query.call(container);
			}

			container.find('.manual .selection input').select2({
				minimumInputLength: 2,
				allowClear: true,
				ajax: {
					url: ajaxurl,
					dataType: 'json',
					quiteMillis: 200,
					data: postsField.manualSearchQueryParams,
					results: postsField.manualSearchResults
				},
				initSelection: postsField.initTitle
			});
			// repeat this loop to allow previews to load after titles
			container.find('.manual .selection input').each( function( index ) {
				if ( data.post_ids[index] !== undefined ) {
					postsField.load_manual_post_preview.call(this);
				}
			});
		},

		manualSearchQueryParams: function( term, page ) {
			var row = this.closest('.panel-row');
			return {
				action: 'posts-field-posts-search',
				s: term,
				type: row.find('.panel-type:input').val(),
				paged: page
			};
		},

		manualSearchResults: function( data, page, query ) {
			return { results: data.posts, more: data.more };
		},

		initTitle: function( element, callback ) {
			var post_id = element.val();
			if ( !post_id ) {
				callback({id: '', text: ''});
				return;
			}
			postsField.titles_to_fetch[post_id] = callback;
		},

		titles_to_fetch: {},

		title_queue_timeout: null,

		set_title_queue_timeout: function() {
			if ( typeof postsField.title_queue_timeout == 'number' ) {
				clearTimeout(postsField.title_queue_timeout);
			}
			postsField.title_queue_timeout = setTimeout(postsField.fetch_queued_post_titles, 1000);
		},

		fetch_queued_post_titles: function() {
			var post_ids = [];
			for ( var post_id in postsField.titles_to_fetch ) {
				if ( postsField.titles_to_fetch.hasOwnProperty(post_id) ) {
					post_ids.push(post_id);
				}
			}
			if ( post_ids.length > 0 ) {
				wp.ajax.send({
					data: {
						action: 'posts-field-fetch-titles',
						post_ids: post_ids
					},
					success: function(data) {
						$.each( data.post_ids, function ( returned_id, title ) {
							if ( postsField.titles_to_fetch.hasOwnProperty(returned_id) ) {
								var callback = postsField.titles_to_fetch[returned_id];
								callback( { id: returned_id, text: title } );
								delete postsField.titles_to_fetch[returned_id];
							}
						});
						postsField.set_title_queue_timeout();
					}
				});
			} else {
				postsField.set_title_queue_timeout();
			}
		},

		previews_to_fetch: {},

		preview_queue_timeout: null,

		set_preview_queue_timeout: function() {
			if ( typeof postsField.preview_queue_timeout == 'number' ) {
				clearTimeout(postsField.preview_queue_timeout);
			}
			postsField.preview_queue_timeout = setTimeout(postsField.fetch_queued_previews, 1000);
		},

		fetch_queued_previews: function() {
			var post_ids = [];
			for ( var post_id in postsField.previews_to_fetch ) {
				if ( postsField.previews_to_fetch.hasOwnProperty(post_id) ) {
					post_ids.push(post_id);
				}
			}
			if ( post_ids.length > 0 ) {
				wp.ajax.send({
					data: {
						action: 'posts-field-fetch-preview',
						post_ids: post_ids
					},
					success: function(data) {
						$.each( data.posts, function ( returned_id, post_data ) {
							if ( postsField.previews_to_fetch.hasOwnProperty(returned_id) ) {
								var wrapper = postsField.previews_to_fetch[returned_id];
								var content = $('<div class="post-excerpt">'+post_data.post_excerpt+'</div>');
								var thumbnail = $('<div class="post-thumbnail">'+post_data.thumbnail_html+'</div>');
								wrapper.find('.selected-post-preview').append(thumbnail).append(content);
								delete postsField.previews_to_fetch[returned_id];
							}
						});
						postsField.set_preview_queue_timeout();
					}
				});
			} else {
				postsField.set_preview_queue_timeout();
			}
		},

		load_manual_post_preview: function() {
			var field = $(this);
			var wrapper = field.closest('.selected-post');
			if ( !field.val() ) {
				wrapper.find('.selected-post-preview').empty();
				return;
			}

			postsField.previews_to_fetch[field.val()] = wrapper;
		},

		initialize_events: function( container ) {
			container
				.on( 'change', '.selected-post input', postsField.load_manual_post_preview )
				.on( 'change', '.select-new-filter', postsField.add_filter_row_event )
				.on( 'click', 'a.remove-filter', postsField.remove_filter_row )
				.on( 'change', '.filter-options select', postsField.preview_query );

			postsField.set_title_queue_timeout();
			postsField.set_preview_queue_timeout();
		},

		search_timeout: null,

		remove_filter_row: function( e ) {
			e.preventDefault();
			var container = $(this).closest('.panel-row');
			$(this).parent().fadeOut( 500, function() { $(this).remove(); } );
			postsField.preview_query.call(container);
		},

		add_filter_row_event: function( e ) {
			var select = $(this);
			var container = select.closest('.panel-input');
			var type = select.val();
			if ( !type ) {
				return;
			}
			postsField.add_filter_row( container, type, {} );
			select.val('');
		},

		add_filter_row: function( container, type, data ) {
			data = $.extend({ selection: [], lock: 1 }, data);


			// if we already have that filter, just highlight it for a moment
			var exists = container.find('.filter-'+type);
			if ( exists.length > 0 ) {
				exists.stop(true).css({backgroundColor: 'lightYellow'}).animate({backgroundColor: 'white'}, {
					duration: 1500,
					complete: function() {
						exists.css({backgroundColor: 'transparent'});
					}
				});
				return;
			}

			var options, options_template;
			if ( type == 'post_type' ) {
				options_template = postsField.posttype_options_template;
			} else {
				options_template = postsField.taxonomy_options_template(type);
			}
			options = $(options_template({
				type: type,
				name: container.find('.posts-group-name').val()
			}));
			var template = postsField.filter_row_template;
			var new_filter = $(template({
				type: type,
				name: container.find('.posts-group-name').val(),
				label: container.find('.select-new-filter').find('option[value='+type+']').text()
			}));
			container.find('.query .query-filters').append(new_filter);
			new_filter.find('.filter-options').append(options);

			options.select2({width: 'element'});

			options.val(data.selection).trigger('change');
		},

		preview_query: function() {
			var container = $(this).closest('.panel-row');
			var filters = {};
			container.find('.panel-filter-row').each( function() {
				var select = $(this).find('select');
				var val = select.val();
				if ( val && val.length > 0 ) {
					filters[select.data('filter_type')] = {
						selection: select.val(),
						lock: true
					};
				}
			});
			if ( filters.length < 1 ) {
				container.find('.query-preview').empty();
				return;
			}


			wp.ajax.send({
				data: {
					action: 'posts-field-fetch-preview',
					filters: filters,
					limit: container.find('.selection').data('limit')
				},
				success: function(data) {
					var preview_div = container.find('.query-preview');
					preview_div.empty();
					$.each( data.posts, function ( returned_id, post_data ) {
						var title = $('<div class="post-title">'+post_data.post_title+'</div>');
						var content = $('<div class="post-excerpt">'+post_data.post_excerpt+'</div>');
						var thumbnail = $('<div class="post-thumbnail">'+post_data.thumbnail_html+'</div>');
						var preview = $('<div class="post-preview"></div>');
						preview.append(title).append(thumbnail).append(content);
						preview_div.append(preview);
					});
				}
			});
		},

		initialize_row: function( row, uuid, data ) {
			var container = row.find('.panel-input-posts');
			if ( container.length < 1 ) {
				return;
			}

			container.each( function() {
				var container = $(this);
				var name = container.data('name');
				data = data[name];

				postsField.initialize_tabs(container);
				postsField.intialize_data(container, data);
				postsField.initialize_events(container);
			});
		}
	};


	var panels_div = $('div.panels');
	panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid, data) {
		postsField.initialize_row( $(this), uuid, data );
	});
	panels_div.on('new-panel-repeater-row', '.panel-repeater-row', function(e, uuid, data) {
		postsField.initialize_row( $(this), uuid, data );
	});

	// TODO: previews for queries

})(jQuery);