(function($) {
	var postsField = {
		selected_post_template: wp.template('field-posts-selectedPost'),
		filter_row_template: wp.template('field-posts-filter'),
		posttype_options_template: wp.template('field-posts-posttype-options'),

		taxonomy_options_template: function( taxonomy ) {
			return wp.template('field-posts-taxonomy-'+taxonomy+'-options');
		},

		update_active_tab: function( event, ui ) {
			var fieldset = $(ui.newPanel).find('fieldset');
			var type = fieldset.hasClass('manual')?'manual':'query';
			var input = fieldset.parents('.panel-input').find('input.query-type');
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
				$.each(data.post_ids, function( index, post_id ) {
					var template = postsField.selected_post_template;
					container.find('.manual .selection').append($(template({
						post_id: post_id,
						name: container.find('.posts-group-name').val(),
						title: '<span class="missing-post-title" data-post_id="'+post_id+'"></span>'
					})));
				});
				postsField.fetch_titles( container );
			} else {
				$.each(data.filters, function( index, filter ) {
					postsField.add_filter_row( container, index, filter );
				});
			}
		},

		initialize_events: function( container ) {
			container
				.on( 'change', '.select-new-filter', postsField.add_filter_row_event )
				.on( 'click', 'a.remove-filter', postsField.remove_filter_row )
				.on( 'keyup', '.search-posts', postsField.enqueue_search_results )
				.on( 'click', 'a.select-post', postsField.select_post );

			container.find( '.selection' )
				.sortable({
					axis: 'y',
					items: 'div.post-selection',
					handle: '.move'
				})
				.on( 'click', 'a.remove', postsField.deselect_post );
		},

		search_timeout: null,
		enqueue_search_results: function() {
			var input = $(this);
			if ( postsField.search_timeout != null ) {
				clearTimeout(postsField.search_timeout);
			}
			postsField.search_timeout = setTimeout(function() {
				postsField.fetch_search_results( input );
			}, 300);
		},

		fetch_search_results: function( input ) {
			var results_container = input.parents('.select-posts').find('.search-results');
			var query = input.val();
			if ( query == '' ) {
				results_container.empty();
				return;
			}

			var spinner = $('<img class="spinner" src="'+results_container.data('spinner')+'" />');
			results_container.html(spinner);
			wp.ajax.send({
				success: function(data) { postsField.display_search_results(results_container, data) },
				context: results_container,
				data: {
					action: 'posts-field-posts-search',
					s: query,
					type: input.parents('.panel-row').find('.panel-type').val()
				}
			});
		},

		display_search_results: function( container, data ) {

			container.empty();
			if ( data.posts.length < 1 ) {
				container.html('No posts found'); // TODO: translate
				return;
			}
			var output = $('<ul></ul>');
			$.each(data.posts, function( index, value ) {
				output.append($('<li><a href="#" class="select-post icon-plus" title="Add"></a> <input type="hidden" value="'+value.post_id+'" /><span class="post-title">'+value.post_title+'</span></li>'));
			});
			container.append(output);
		},

		remove_filter_row: function( e ) {
			e.preventDefault();
			$(this).parent().fadeOut( 500, function() { $(this).remove(); } );
		},

		add_filter_row_event: function( e ) {
			var select = $(this);
			var container = select.parents('.panel-input');
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
			/*if ( data.lock > 0 ) {
				new_filter.find(':checkbox').each(function() { this.checked = true; });
			}*/
		},

		select_post: function( e ) {
			e.preventDefault();

			var li = $(this).parent();
			var post_id = li.find('input').val();
			var title = li.find('.post-title').text();

			var selected_container = li.parents('fieldset').find('.selection');

			var limit = selected_container.data('limit');
			if ( selected_container.find('.post-selection').length >= limit ) {
				return; // can't add any more
			}

			var preselected = false;
			selected_container.find('input').each( function() {
				if ( $(this).val() == post_id ) {
					preselected = true;
					return false; // break out of the loop
				}
			});
			if ( preselected ) {
				return;
			}

			var field_name = selected_container.data('field_name');
			var template = postsField.selected_post_template;
			var new_item = $(template({
				name: field_name,
				post_id: post_id,
				title: title
			}));
			selected_container.append(new_item);
			postsField.mark_if_full(selected_container);
		},

		mark_if_full: function( container ) {
			var limit = container.data('limit');
			if ( container.find('.post-selection').length >= limit ) {
				container.siblings('.select-posts').addClass('full');
			} else {
				container.siblings('.select-posts').removeClass('full');
			}
		},

		fetch_titles: function( container ) {
			var missing_titles = container.find('.post-selection .missing-post-title');
			if ( missing_titles.length < 1 ) {
				return;
			}
			var post_ids = [];
			missing_titles.each(function() {
				post_ids.push($(this).data('post_id'));
			});
			wp.ajax.send({
				data: {
					action: 'posts-field-fetch-titles',
					post_ids: post_ids
				},
				success: function(data) {
					missing_titles.each( function() {
						var post_id = $(this).data('post_id');
						if ( data.post_ids[post_id] ) {
							$(this).replaceWith(data.post_ids[post_id]);
						}
					});
				}
			});
		},

		deselect_post: function(e) {
			e.preventDefault();
			$(this).parents('.post-selection').fadeOut(250, function() { $(this).remove(); });
			$(this).parents('.selection').siblings('.select-posts').removeClass('full');
		}
	};


	var panels_div = $('div.panels');
	panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid, data) {
		var row = $(this);
		var container = row.find('.panel-input-posts');
		if ( container.length < 1 ) {
			return;
		}

		var name = container.data('name');
		data = data[name];

		postsField.initialize_tabs(container);
		postsField.intialize_data(container, data);
		postsField.initialize_events(container);
	});

	// TODO: previews for queries

})(jQuery);