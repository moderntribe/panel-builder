(function($) {
	var postsField = {
		filter_row_template: wp.template('field-posts-filter'),
		p2p_options_template: wp.template('field-posts-p2p-options'),
		meta_options_template: wp.template('field-posts-meta-options'),

		taxonomy_options_template: function( taxonomy ) {
			return wp.template('field-posts-taxonomy-'+taxonomy+'-options');
		},

		options_template: function( filter_id ) {
			var group = postsField.get_filter_group( filter_id );
			if ( group == 'taxonomy' ) {
				return postsField.taxonomy_options_template( filter_id );
			} else if ( group == 'p2p' ) {
				return postsField.p2p_options_template;
			} else if ( group == 'meta' ) {
				return postsField.meta_options_template;
			}
		},

		get_filter_group: function( filter_id ) {
			var group = ModularContent.posts_filter_templates[filter_id];
			if ( !group ) {
				group = 'taxonomy';
			}
			return group;
		},

		update_active_tab: function( event, ui ) {
			var fieldset = ui.newPanel;
			var container = fieldset.closest('.panel-input-posts');
			var type = fieldset.data('type');
			var input = container.find('input.query-type');
			input.val(type);
			postsField.update_post_type_select( container );
		},

		update_post_type_select: function( container ) {
			var input = container.find('input.query-type');
			var type = input.val();
			if ( type === '' ) {
				type = 'manual';
			}
			var select = container.find('select.post-type-select');
			container.find('.'+type+' .filter-post_type-container').append(container.find('.filter-post_type'));
			select.select2('destroy');
			if ( type == 'manual' ) {
				select.select2({width: 'element', maximumSelectionSize: 1});
				if ( select.select2('val').length > 1 ) {
					select.select2('val', select.select2('val').shift());
				}
			} else {
				select.select2({width: 'element', maximumSelectionSize: 0});
			}
		},

		initialize_tabs: function ( container ) {
			var fieldsets = container.children('fieldset');
			if ( fieldsets.length < 2 ) {
				return; // no tabs if there's only one fieldset
			}
			var navigation = $('<ul></ul>');
			var type = container.find('input.query-type').val();
			var active_tab_index = 0;
			fieldsets.each( function(index) {
				var id = $(this).attr('id');
				var legend = $(this).children('legend');
				if ( $(this).hasClass(type) ) {
					active_tab_index = index;
				}
				navigation.append('<li><a href="#'+id+'">'+legend.html()+'</a></li>');
				legend.hide();
			});
			container.prepend(navigation).tabs({
				activate: postsField.update_active_tab,
				active: active_tab_index
			});


			var post_selector = container.find('.post-selector');
			var external_links_fields = container.find('.external-links-fields');
			post_selector.show();
			external_links_fields.hide();
		},

		intialize_data: function ( container, data ) {
			data = $.extend({type: 'manual', post_ids: [], filters: {}}, data);

			var post_type_options = container.find('select.post-type-select');
			if ( ! post_type_options.length ) {
				return;
			}

			post_type_options.select2({width: 'element'});

			$.each(data.filters, function( index, filter ) {
				if ( index == 'post_type' ) {
					post_type_options.val(filter.selection).trigger('change');
				}
			});

			postsField.update_post_type_select( container );

			if ( data.type == 'manual' ) {
				container.find('.manual .selection input').each( function( index ) {
					var input = $(this);
					if ( data.post_ids[index] !== undefined ) {
						input.val(data.post_ids[index]);
					}
				});
			} else {
				$.each(data.filters, function( index, filter ) {
					if ( index != 'post_type' ) {
						postsField.add_filter_row( container, index, filter );
					}
				});
				postsField.preview_query.call(container);
			}

			container.find('.manual .selected-post-input input').select2({
				allowClear: true,
				ajax: {
					url: ajaxurl,
					dataType: 'json',
					quietMillis: 200,
					data: postsField.manualSearchQueryParams,
					initSelection: function( element, callback ) {
						callback({id: 0, text:''});
					},
					results: function( data, page, query ) {
						var selected = {};
						var posts = [];
						container.find('.selected-post-id').each( function() {
							if ( $(this).val() ) {
								selected[$(this).val()] = true;
							}
						});
						$.each(data.posts, function(index, post) {
							if ( !selected.hasOwnProperty( post.id ) ) {
								posts.push(post);
							}
						});
						return { results: posts, more: data.more };
					}
				}
			});

			container.find('.manual .selection input').each( function( index ) {
				if ( data.post_ids[index] !== undefined ) {
					postsField.load_manual_post_preview.call(this);
				}
			});

			postsField.update_selected_post_previews(container);
		},

		manualSearchQueryParams: function( term, page ) {
			var row = this.closest('.panel-input-posts');
			return {
				action: 'posts-field-posts-search',
				s: term,
				type: row.find('.panel-type:input').val(),
				paged: page,
				post_type: row.find('select.post-type-select').val()
			};
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
								wrapper.find('.post-title').text(post_data.post_title);
								wrapper.find('.post-excerpt').text(post_data.post_excerpt);
								wrapper.find('.post-thumbnail').html(post_data.thumbnail_html);
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
				wrapper.find('.selected-post-preview').find('.post-title, .post-thumbnail').empty();
				wrapper.find('.selected-post-preview').find('.post-excerpt').html("<div class='text-line'/><div class='text-line'/>");
				return;
			}

			postsField.previews_to_fetch[field.val()] = wrapper;
		},


		add_selected_post: function( e ) {
			e.preventDefault();
			var button = $(this);
			var container = button.closest('.panel-input-posts');
			var selector = container.find('.selected-post-input > input:hidden');
			var post_id = selector.val();

			var external_title_input = container.find('.external-title');
			var external_link_input = container.find('.external-url');
			var external_title = external_title_input.val();
			var external_link = external_link_input.val();

			if ( !post_id && ( external_title == undefined || external_title == '' ) ) {
				return;
			}

			var preview_slot = postsField.find_open_preview_slot( container );
			if ( !preview_slot ) {
				return;
			}

			if ( post_id ) {
				preview_slot.val(post_id);
			} else {
				preview_slot.val(external_title + "|" + external_link);
			}

			preview_slot.trigger('change');
			selector.select2('val', '');
			external_title_input.val('');
			external_link_input.val('');
			postsField.update_selected_post_previews(container);
		},

		find_open_preview_slot: function (container ) {
			var open = null;
			container.find('.selected-post input.selected-post-id').each( function() {
				if ( !( $(this).val() ) ) {
					open = $(this);
					return false; // break the loop
				}
			});
			return open;
		},

		remove_selected_post: function( e ) {
			e.preventDefault();
			var button = $(this);
			var post_container = button.closest('.selected-post');
			var panel_container = button.closest('.panel-input-posts');
			post_container.find('input.selected-post-id').val('').trigger('change');
			postsField.update_selected_post_previews(panel_container);
		},

		update_selected_post_previews: function( container ) {
			var max = container.data('max');
			var min = container.data('min');
			var suggested = container.data('suggested');
			var visible = [];
			var hidden = [];
			container.find('.selected-post').each( function() {
				var has_post = !!$(this).find('input.selected-post-id').val();
				if ( has_post ) {
					$(this).addClass('visible').removeClass('hidden empty');
					visible.push($(this));
				} else {
					$(this).removeClass('visible').addClass('hidden empty')	;
					hidden.push($(this));
				}
			});

			var needed = 0;
			if ( visible.length < min ) {
				needed = min - visible.length;
			}
			if ( needed > 0 && visible.length > 0 ) {
				container.find('.selection-notices').fadeIn(200).find('.count').text(needed);
			} else {
				container.find('.selection-notices').hide();
			}

			// make sure we have enough rows visible
			while ( visible.length < suggested ) {
				visible.push( hidden.shift().addClass('visible').removeClass('hidden') );
			}

			// sort: not empty, empty but visible, hidden
			container.find('.selected-post.empty').appendTo( container.find('.selection') );
			container.find('.selected-post.hidden').appendTo( container.find('.selection') );

			if ( container.find('.selected-post.empty').length < 1 ) {
				container.find('.search-controls .button').attr('disabled', 'disabled');
			} else {
				container.find('.search-controls .button').removeAttr('disabled');
			}
		},

		show_hide_manual_inputs: function( e ) {
			e.preventDefault();
			var radio_input = $(this);

			if ( radio_input === undefined ) {
				return;
			}

			var container = radio_input.closest('.panel-input-posts');
			var post_selector = container.find('.post-selector');
			var external_links_fields = container.find('.external-links-fields');

			post_selector.hide();
			external_links_fields.hide();

			if ( radio_input.val() == 'internal' ) {
				post_selector.show();
			} else {
				external_links_fields.show();
			}
		},

		initialize_events: function( container ) {
			container
				.on( 'change', '.selected-post input', postsField.load_manual_post_preview )
				.on( 'click', '.search-controls .button', postsField.add_selected_post )
				.on( 'click', '.remove-selected-post', postsField.remove_selected_post )
				.on( 'change', '.select-new-filter', postsField.add_filter_row_event )
				.on( 'click', 'a.remove-filter', postsField.remove_filter_row )
				.on( 'change', '.filter-options .term-select', postsField.preview_query )
				.on( 'change', '.radio-option input', postsField.show_hide_manual_inputs );

			container.find('.selection').sortable({
				placeholder: 'panel-row-drop-placeholder',
				forcePlaceholderSize: true,
				update: function ( event, ui ) {
					var container = $(ui.item).closest('.panel-input-posts');
					postsField.update_selected_post_previews(container);
				}
			});

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
			var id = select.val();
			var option = select.find(':selected');
			var group = option.data('filter-group');
			if ( !group ) {
				group = 'taxonomy';
			}
			if ( !id ) {
				return;
			}
			postsField.add_filter_row( container, id, {} );
			select.val('');
		},

		add_filter_row: function( container, filter_id, data ) {
			data = $.extend({ selection: [], lock: 1 }, data);

			// if we already have that filter, just highlight it for a moment
			var exists = container.find('.filter-'+filter_id);
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
			options_template = postsField.options_template( filter_id );
			options = $(options_template({
				type: filter_id,
				name: container.find('.posts-group-name').val()
			}));

			var template = postsField.filter_row_template;
			var new_filter = $(template({
				type: filter_id,
				name: container.find('.posts-group-name').val(),
				label: container.find('.select-new-filter').find('option[value=' + filter_id + ']').text()
			}));
			container.find('.query .query-filters').append(new_filter);
			new_filter.find('.filter-options').append(options);

			var select2_args = {width: 'element'};
			var filter_group = postsField.get_filter_group( filter_id );

			if ( filter_group == 'p2p' ) {
				if ( $.isArray(data.selection) ) {
					options.val(data.selection.join(','));
				} else {
					options.val(data.selection);
				}
				select2_args.multiple = true;
				select2_args.ajax = {
					url: ajaxurl,
					dataType: 'json',
					quietMillis: 200,
					data: function ( term, page ) {
						return {
							action: 'posts-field-p2p-options-search',
							s: term,
							type: filter_id,
							paged: page
						};
					},
					results: function( data, page, query ) {
						return { results: data.posts, more: data.more };
					}
				};
				select2_args.initSelection =function( element, callback ) {
					var data = [];
					$(element.val().split(',')).each( function() {
						data.push({
							id: this,
							// meta box should have put the post into the cache
							text: ModularContent.cache.posts[this].post_title
						})
					});
					callback(data);
				};
			} else if ( filter_group == 'meta' ) {
				select2_args.tags = true;
				select2_args.multiple = true;
			}

			options.select2(select2_args);
			options.val(data.selection).trigger('change');
		},

		preview_query: function() {
			var container = $(this).closest('.panel-row');
			var filters = {};
			container.find('.panel-filter-row').each( function() {
				var select = $(this).find(':input.term-select');
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
					max: container.find('.panel-input-group').data('max'),
					context: $('input#post_ID').val()
				},
				success: function(data) {
					var preview_div = container.find('.query-preview');
					preview_div.empty();
					$.each( data.post_ids, function ( index, post_id ) {
						var post_data = data.posts[post_id];
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
			var containers = row.find('.panel-input-posts');
			if ( ! containers.length ) {
				return;
			}

			containers.each( function() {
				var container = $(this);
				var name = container.data('name').split('.');
				var local_data = data;
				$.each( name, function( index, namepart ) {
					if ( local_data.hasOwnProperty(namepart) ) {
						local_data = local_data[namepart];
					} else {
						local_data = {};
					}
				});

				postsField.initialize_tabs(container);
				postsField.intialize_data(container, local_data);
				postsField.initialize_events(container);
			});
		}
	};

	$(function() {
		var panels_div = $('div.panels');
		panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid, data) {
			if ( $(this).data('panel_id') == uuid ) {
				postsField.initialize_row( $(this), uuid, data );
			}
		});
		panels_div.on('new-panel-repeater-row', '.panel-repeater-row', function(e, uuid, data) {
			postsField.initialize_row( $(this), uuid, data );
		});
	});

})(jQuery);