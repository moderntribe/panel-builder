/**
 * Auto-concatenaed on 2016-02-17 based on files in assets/scripts/js/fields
 */

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
(function($) {

	var init_row = function( row, uuid ) {
		var containers = row.find('.attachment-helper-uploader');
		if ( containers.length < 1 ) {
			return;
		}
		containers.each( function() {
			var container = $(this);
			if ( container.data('initialized-uploader') != 1 ) {
				var settings_name = container.data('settings');
				settings_name = settings_name.replace( uuid, '{{data.panel_id}}' );

				if ( AttachmentHelper.settings.hasOwnProperty(settings_name) ) {
					AttachmentHelper.init( container, AttachmentHelper.settings[settings_name]);
					container.data('initialized-uploader', 1);
				}
			}
		});
	};

	var panels_div = $('div.panels');
	panels_div
		.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid) {
			if ( $(this).data( 'panel_id' ) != uuid ) {
				return;
			}
			init_row( $(this), uuid );
		})
		.on('new-panel-repeater-row', '.panel-repeater-row', function(e, uuid) {
			init_row( $(this), uuid );
		})
	;
})(jQuery);
(function($) {
	var Post_List = {

		fields: {},

		templates: {
			filter_row: wp.template('field-posts-filter'),
			p2p_options: wp.template('field-posts-p2p-options'),
			date_options: wp.template('field-posts-date-options'),
			meta_options: wp.template('field-posts-meta-options'),

			taxonomy_options: function( taxonomy ) {
				return wp.template('field-posts-taxonomy-'+taxonomy+'-options');
			},

			options: function( filter_id ) {
				var group = Post_List.get_filter_group( filter_id );

				if ( group == 'taxonomy' ) {
					return Post_List.templates.taxonomy_options( filter_id );
				} else if ( group == 'p2p' ) {
					return Post_List.templates.p2p_options;
				} else if ( group == 'meta' ) {
					return Post_List.templates.meta_options;
				} else if ( group == 'date' ) {
					return Post_List.templates.date_options;
				}
			}
		},

		get_filter_group: function( filter_id ) {
			var group = ModularContent.posts_filter_templates[filter_id];
			if ( !group ) {
				group = 'taxonomy';
			}
			return group;
		},

		get_field: function( el ) {
			var $el = $( el ).closest( '.panel-input-post-list' );
			if ( $el.length <= 0 ) {
				return console.warn( "No valid Post List field supplied" );
			}
			var id = $el.attr( 'id' );
			if ( !Post_List.fields.hasOwnProperty(id) ) {
				Post_List.fields[id] = new Post_List.Field_Container( $el[0] );
			}
			return Post_List.fields[id];
		},

		Field_Container: (function() {
			function Field_Container(el) {
				if ( ! el ) {
					return console.warn("No element supplied for Field_Container");
				}
				this.el = el;
				this.$el = $(this.el);
				this.id = this.$el.attr('id');
			}

			Field_Container.prototype.init = function( data ) {
				this.bind_events();
				this.initialize_tabs();
				this.initialize_data( data );
			};


			Field_Container.prototype.bind_events = function() {

				this.$el
					// manual input events
					.on( 'click.' + this.id, '.remove-selected-post', this.remove_selected_post.bind( this ) )
					.on( 'click.' + this.id, 'a.choose-select-post', this.post_row_choose_select.bind( this ) )
					.on( 'click.' + this.id, 'a.choose-manual-post', this.post_row_choose_manual.bind( this ) )
					.on( 'change.' + this.id, '.selected-post-field', this.preview_manual_selection.bind( this ) )
					.on( 'change.' + this.id, '.selected-post-id', this.load_manual_post_preview.bind( this ) )


					// dynamic query events
					.on( 'change.' + this.id, '.select-new-filter', this.add_filter_row_event.bind( this ) )
					.on( 'click.' + this.id, 'a.remove-filter', this.remove_filter_row.bind( this ) )
					.on( 'change.' + this.id, '.filter-options .term-select', this.hide_irrelevant_filter_options.bind( this ) )
					.on( 'change.' + this.id, '.max-results-selection', this.preview_query.bind( this ) )
					.on( 'change.' + this.id, '.filter-options .term-select', this.preview_query.bind( this ) )
					.on( 'change.' + this.id, '.filter-options .date-select', this.preview_query.bind( this ) )
				;

				this.$el.find('.selection').sortable({
					placeholder: 'panel-row-drop-placeholder',
					forcePlaceholderSize: true,
					update: function ( event, ui ) {
						Post_List.update_selected_post_previews( this.$el );
					}.bind( this )
				});

				Post_List.set_preview_queue_timeout();
			};

			Field_Container.prototype.initialize_tabs = function () {
				if( this.$el.is('.tabs-initialized')){
					return;
				}
				var fieldsets = this.$el.children('fieldset');
				if ( fieldsets.length < 2 ) {
					return; // no tabs if there's only one fieldset
				}
				var navigation = $('<ul></ul>');
				var type = this.$el.find('input.query-type').val();
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
				this.$el.addClass('tabs-initialized').prepend(navigation).tabs({
					activate: this.update_active_tab.bind( this ),
					active: active_tab_index
				});
			};

			Field_Container.prototype.initialize_data = function ( data ) {
				data = $.extend({type: 'manual', posts: [], filters: {}, max: 0}, data);

				var post_type_options = this.$el.find('select.post-type-select');
				if ( ! post_type_options.length ) {
					return;
				}

				post_type_options.select2({width: 'element'});

				$.each(data.filters, function( index, filter ) {
					if ( index == 'post_type' ) {
						post_type_options.val(filter.selection).trigger('change');
					}
				});

				if ( data.max < this.$el.data('min') ) {
					data.max = this.$el.data('max');
				}
				this.$el.find( '.max-results-selection' ).val( data.max );

				this.initialize_post_type_select();

				this.$el.find('.manual .post-picker .selected-post-field').select2({
					allowClear: true,
					ajax: {
						url: ajaxurl,
						dataType: 'json',
						quietMillis: 200,
						data: this.manual_search_query_params,
						initSelection: function( element, callback ) {
							callback({id: 0, text:''});
						},
						results: function( data, page, query ) {
							var selected = {};
							var posts = [];
							this.$el.find('.selected-post-id').each( function() {
								if ( $(this).val() ) {
									selected[$(this).val()] = true;
								}
							});
							$.each(data.posts, function(index, post) {
								if ( !selected.hasOwnProperty( post.id ) ) {
									post.text = $('<div />').html( post.text ).text(); // hack to render html entities
									posts.push(post);
								}
							});
							return { results: posts, more: data.more };
						}.bind(this)
					}
				});

				if ( data.type == 'query' ) {
					$.each(data.filters, function( index, filter ) {
						if ( index != 'post_type' ) {
							this.add_filter_row( index, filter );
						}
					}.bind( this ) );
					this.preview_query();
				} else {
					$.each(data.posts, function( index, post_data ) {
						post_data = $.extend({id: '', method: '', post_content: '', post_title: '', url: '', thumbnail_id: ''}, post_data);
						var post_container = this.$el.find('.selected-post' ).eq(index);
						if ( !post_data.method || post_container.length < 1 ) {
							return;
						}
						post_container.find('.selected-post-method' ).val( post_data.method );
						if ( post_data.method == 'select' ) {
							post_container.find('.selected-post-id' ).val( post_data.id ).trigger('change');
							return;
						}
						if ( post_data.method == 'manual' ) {
							post_container.find('.post-title' ).val( post_data.post_title );
							post_container.find('.post-excerpt' ).val( post_data.post_content );
							post_container.find('.post-url' ).val( post_data.url );
							post_container.find('.attachment_helper_value' ).val( post_data.thumbnail_id ).trigger( 'change' );
							return;
						}
					}.bind( this ) );
				}

				Post_List.update_selected_post_previews(this.$el);
			};

			Field_Container.prototype.manual_search_query_params = function( term, page ) {
				// `this` is the select box that triggered the search
				var row = this.closest( '.selected-post' );
				var field = row.closest( '.panel-input-post-list' );
				var panel = field.closest( '.panel-row' );
				return {
					action: 'posts-field-posts-search',
					s: term,
					type: panel.data('type'),
					paged: page,
					post_type: row.find('select.post-type').val(),
					field_name: field.data('name')
				};
			};

			Field_Container.prototype.initialize_post_type_select = function() {
				var select = this.$el.find('select.post-type-select');
				select.select2('destroy');
				select.select2({width: 'element', maximumSelectionSize: 0});
				this.hide_irrelevant_filter_options();
			};

			Field_Container.prototype.update_active_tab = function( event, ui ) {
				var fieldset = ui.newPanel;
				var type = fieldset.data('type');
				var input = this.$el.find('input.query-type');
				input.val(type);
			};

			Field_Container.prototype.add_filter_row_event = function( e ) {
				e.preventDefault();
				var select = this.$el.find( '.select-new-filter' );
				var id = select.val();
				var option = select.find(':selected');
				var group = option.data('filter-group');
				if ( !group ) {
					group = 'taxonomy';
				}
				if ( !id ) {
					return;
				}
				this.add_filter_row( id, {} );
				select.val('');
			};

			Field_Container.prototype.add_filter_row = function( filter_id, data ) {
				data = $.extend({ selection: [], lock: 1 }, data);

				// if we already have that filter, just highlight it for a moment
				var exists = this.$el.find('.filter-'+filter_id);
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
				options_template = Post_List.templates.options( filter_id );
				options = $(options_template({
					type: filter_id,
					name: this.$el.find('.posts-group-name').val()
				}));

				var selected_filter_type_option = this.$el.find('.select-new-filter').find('option[value=' + filter_id + ']');

				var template = Post_List.templates.filter_row;
				var new_filter = $(template({
					type: filter_id,
					name: this.$el.find('.posts-group-name').val(),
					label: selected_filter_type_option.text()
				}));
				this.$el.find('.query .query-filters').append(new_filter);
				new_filter.find('.filter-options').append(options);

				var select2_args = {width: 'element'};
				var filter_group = Post_List.get_filter_group( filter_id );
				new_filter.addClass( 'filter-type-group-'+filter_group );

				if ( filter_group == 'p2p' ) {
					// add a drop-down to filter search results by post type
					var possible_post_types = selected_filter_type_option.data('filter-post-type-labels');
					var post_type_filters_select = $('<select class="p2p-search-post-type-filter" />');
					post_type_filters_select.append(
						'<option value="any">' + selected_filter_type_option.data('any-post-type-label') + '</option>'
					);
					$.each( possible_post_types, function ( index, label ) {
						var option = $('<option />');
						option.attr('value', index);
						option.text( label );
						post_type_filters_select.append( option );
					});
					options.before(post_type_filters_select);


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
								paged: page,
								post_type: post_type_filters_select.val()
							};
						},
						results: function( data, page, query ) {
							return { results: data.posts, more: data.more };
						}
					};
					select2_args.initSelection =function( element, callback ) {
						var data = [];
						$(element.val().split(',')).each( function() {
							var id = this;
							if ( ModularContent.cache.posts.hasOwnProperty( id ) ) {
								data.push({
									id: id,
									// meta box should have put the post into the cache
									text: '[' + ModularContent.cache.posts[id].post_type_label + '] ' + ModularContent.cache.posts[id].post_title
								});
							}
						});
						callback(data);
					};
					options.select2(select2_args);
					options.val(data.selection).trigger('change');
				} else if ( filter_group == 'meta' ) {
					select2_args.tags = true;
					select2_args.multiple = true;
					options.select2(select2_args);
					options.val(data.selection).trigger('change');
				} else if ( filter_group == 'date' ) {
					data.selection = $.extend({ start: '', end: '' }, data.selection);
					options.find( '.date-start' ).val( data.selection.start );
					options.find( '.date-end' ).val( data.selection.end );
					options.find( '.date-select' ).datepicker(
						{
							dateFormat: 'yy-mm-dd'
						}
					);
				} else {
					options.select2(select2_args);
					options.val(data.selection).trigger('change');
				}

			};

			Field_Container.prototype.preview_manual_selection = function( e ) {
				e.preventDefault();
				var post_container = $( e.target ).closest( '.selected-post' );
				var selector = post_container.find( '.post-picker > input:hidden' );
				var id_field = post_container.find( '.selected-post-id' );

				id_field.val( selector.val() );
				id_field.trigger( 'change' );

				Post_List.update_selected_post_previews(this.$el);
			};

			Field_Container.prototype.add_selected_post = function( e ) {
				e.preventDefault();
				var button = this.$el.find( '.search-controls .button' );
				var selector = this.$el.find('.post-picker > input:hidden');
				var post_id = selector.val();
				if ( !post_id ) {
					return;
				}
				var preview_slot = this.find_open_preview_slot();
				if ( !preview_slot ) {
					return;
				}
				preview_slot.val( post_id );
				preview_slot.trigger('change');
				selector.select2('val', '');
				Post_List.update_selected_post_previews(this.$el);
			};

			Field_Container.prototype.find_open_preview_slot = function () {
				var open = null;
				this.$el.find('.selected-post input.selected-post-id').each( function() {
					if ( !( $(this).val() ) ) {
						open = $(this);
						return false; // break the loop
					}
				});
				return open;
			};

			Field_Container.prototype.remove_selected_post = function( e ) {
				e.preventDefault();
				var post_container = $( e.target ).closest( '.selected-post' );
				post_container.find( '.selected-post-id' ).val( '' ).trigger( 'change' );
				post_container.find( '.selected-post-method' ).val( '' );
				post_container.find( '.post-title' ).val('');
				post_container.find( '.post-content' ).val('');
				post_container.find( '.post-url' ).val('');
				Post_List.update_selected_post_previews( this.$el );
			};

			Field_Container.prototype.post_row_choose_select = function( e ) {
				e.preventDefault();
				var post_container = $( e.target ).closest( '.selected-post' );
				post_container.find( 'input.selected-post-id' ).val( '' ).trigger( 'change' );
				post_container.find( 'input.selected-post-method' ).val( 'select' );
				Post_List.update_selected_post_previews( this.$el );
			};

			Field_Container.prototype.post_row_choose_manual = function( e ) {
				e.preventDefault();
				var post_container = $( e.target ).closest( '.selected-post' );
				post_container.find( 'input.selected-post-id' ).val( '' ).trigger( 'change' );
				post_container.find( 'input.selected-post-method' ).val( 'manual' );
				Post_List.update_selected_post_previews( this.$el );
			};

			Field_Container.prototype.remove_filter_row = function( e ) {
				e.preventDefault();
				var row = $( e.target ).closest( '.panel-filter-row' );
				row.fadeOut( 500, function() { $(this).remove(); } );
				this.preview_query();
			};

			Field_Container.prototype.hide_irrelevant_filter_options = function() {
				var post_type_select = this.$el.find('select.post-type-select');
				var post_types = post_type_select.val();
				var filter_options = this.$el.find('select.select-new-filter').find('option');
				if ( !post_types || post_types.length < 1 ) {
					filter_options.show();
					return;
				}

				filter_options.each( function() {
					var option = $(this);
					if ( !option.val() ) {
						return; // skip placeholders
					}
					var supported_post_types = option.data('filter-post-types');
					if ( !supported_post_types ) {
						return; // skip ambiguous filters
					}
					var intersection = _.intersection( supported_post_types, post_types );
					if ( intersection.length < 1 ) {
						option.hide();
					} else {
						option.show();
					}
				} );
			};

			Field_Container.prototype.preview_query = function() {
				var container = this.$el;
				var filters = {};
				this.$el.find('.panel-filter-row').each( function() {
					var select = $(this).find(':input.term-select');
					var date = $(this).find('.date-range-input');
					if ( select.length > 0 ) {
						var val = select.val();
						if ( val && val.length > 0 ) {
							filters[ select.data( 'filter_type' ) ] = {
								selection: select.val(),
								lock: true
							};
						}
					} else if ( date.length > 0 ) {
						var start = date.find( '.date-start' ).val();
						var end   = date.find( '.date-end' ).val();
						filters[ date.data( 'filter_type' ) ] = {
							selection: { start: start, end: end },
							lock: true
						};
					}
				});
				if ( filters.length < 1 ) {
					this.$el.find('.query-preview').empty();
					return;
				}

				var max = this.$el.find( '.max-results-selection' ).val();
				if ( max < this.$el.data('min') || max > this.$el.data('max') ) {
					max = this.$el.data('max');
				}


				wp.ajax.send({
					data: {
						action: 'posts-field-fetch-preview',
						filters: filters,
						max: max,
						context: $('input#post_ID').val()
					},
					success: function(data) {
						var preview_div = this.$el.find('.query-preview');
						preview_div.empty();
						$.each( data.post_ids, function ( index, post_id ) {
							var post_data = data.posts[post_id];
							var post_title_link = $('<a />' ).attr( 'href', post_data.permalink ).attr( 'target', '_blank' );
							post_title_link.html( post_data.post_title );
							var title = $( '<div class="post-title"/>' ).append( post_title_link );
							var content = $( '<div class="post-excerpt"/>' ).html( post_data.post_excerpt );
							var thumbnail = $( '<div class="post-thumbnail">'+post_data.thumbnail_html+'</div>' );
							var preview = $( '<div class="post-preview"></div>' );
							preview.append(title).append(thumbnail).append(content);
							preview_div.append(preview);
						});
					}.bind( this )
				});
			};

			Field_Container.prototype.load_manual_post_preview = function( e ) {
				e.preventDefault();
				var field = $( e.target );
				var wrapper = field.closest('.selected-post');
				var post_id = field.val();
				if ( !post_id ) {
					wrapper.find('.selected-post-preview').find('.post-title, .post-thumbnail').empty();
					wrapper.find('.selected-post-preview').find('.post-excerpt').html("<div class='text-line'/><div class='text-line'/>");
					return;
				}

				wrapper.find('.selected-post-preview').find('.post-title' ).text( ModularContent.localization.loading );
				if ( ! Post_List.previews_to_fetch.hasOwnProperty( post_id ) ) {
					Post_List.previews_to_fetch[ post_id ] = [];
				}
				Post_List.previews_to_fetch[ post_id ].push( wrapper );
			};

			return Field_Container;
		})(),

		previews_to_fetch: {},

		preview_queue_timeout: null,

		set_preview_queue_timeout: function() {
			if ( typeof Post_List.preview_queue_timeout == 'number' ) {
				clearTimeout(Post_List.preview_queue_timeout);
			}
			Post_List.preview_queue_timeout = setTimeout(Post_List.fetch_queued_previews, 1000);
		},

		fetch_queued_previews: function() {
			var post_ids_to_fetch = [];
			var post_ids_already_fetched = [];
			for ( var post_id in Post_List.previews_to_fetch ) {
				if ( Post_List.previews_to_fetch.hasOwnProperty(post_id) ) {
					if ( ModularContent.cache.posts.hasOwnProperty(post_id) ) {
						post_ids_already_fetched.push(post_id);
					} else {
						post_ids_to_fetch.push(post_id);
					}
				}
			}
			if ( post_ids_to_fetch.length > 0 ) {
				wp.ajax.send({
					data: {
						action: 'posts-field-fetch-preview',
						post_ids: post_ids_to_fetch
					},
					success: function(data) {
						$.each( data.posts, function ( returned_id, post_data ) {
							ModularContent.cache.posts[ returned_id ] = post_data;
							Post_List.display_post_preview( returned_id );
						});
						Post_List.set_preview_queue_timeout();
					}
				});
			} else {
				Post_List.set_preview_queue_timeout();
			}
			$.each( post_ids_already_fetched, function( index, post_id ) {
				Post_List.display_post_preview( post_id );
			});
		},

		display_post_preview: function( post_id ) {
			if ( !ModularContent.cache.posts.hasOwnProperty(post_id) ) {
				return false;
			}
			if ( !Post_List.previews_to_fetch.hasOwnProperty(post_id) ) {
				return false;
			}
			var post_data = ModularContent.cache.posts[post_id];
			var post_title_link = $('<a />' ).attr('href', post_data.permalink ).attr('target', '_blank');
			post_title_link.html(post_data.post_title);
			$.each( Post_List.previews_to_fetch[post_id], function( index, wrapper ) {
				wrapper.find('.post-title' ).empty().append(post_title_link);
				wrapper.find('.post-excerpt').html(post_data.post_excerpt);
				wrapper.find('.post-thumbnail').html(post_data.thumbnail_html);
				wrapper.find('.post-type' ).val('');
				wrapper.find('.selected-post-field' ).select2('val', '');
			});
			delete Post_List.previews_to_fetch[post_id];
		},

		update_selected_post_previews: function( container ) {
			var max = container.data('max');
			var min = container.data('min');
			var suggested = container.data('suggested');
			if ( !suggested ) {
				suggested = 1;
			}
			var visible = [];
			var hidden = [];
			container.find('.selected-post').each( function() {
				var method = $( this ).find('input.selected-post-method' ).val();
				var has_post = !!$( this ).find('input.selected-post-id').val();
				$(this ).removeClass( 'manual select empty visible hidden has-post no-post' );
				if ( has_post || method ) {
					$(this).addClass( 'visible' ).addClass( method ).addClass('has-method');
					if ( has_post ) {
						$(this).addClass('has-post');
					} else {
						$(this).addClass('no-post');
					}
					visible.push($(this));
				} else {
					$(this).addClass('hidden empty');
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

			// ensure that at least one empty row is visible (if we have any more)
			if ( hidden.length > 0 && container.find('.selected-post.empty.visible' ).length < 1 ) {
				visible.push( hidden.shift().addClass('visible').removeClass('hidden') );
			}

			// sort: not empty, empty but visible, hidden
			container.find('.selected-post.empty').appendTo( container.find('.selection') );
			container.find('.selected-post.hidden').appendTo( container.find('.selection') );
		},

		search_timeout: null,

		initialize_row: function( row, uuid, data ) {
			var containers = row.find('.panel-input-post-list');
			if ( ! containers.length ) {
				return;
			}

			containers.each( function() {
				var element = this;
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

				var field = Post_List.get_field( element );
				field.init( local_data );
			});
		}
	};

	$(function() {
		var panels_div = $('div.panels');
		panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid, data) {
			if ( $(this).data('panel_id') == uuid ) {
				Post_List.initialize_row( $(this), uuid, data );
			}
		});
		panels_div.on('new-panel-repeater-row', '.panel-repeater-row', function(e, uuid, data) {
			Post_List.initialize_row( $(this), uuid, data );
		});
		$( '#post' ).submit( function () {
			// the post type field might be disabled if there is one post type only
			// re-enable it to have it sent along in submitted data
			$( 'select[data-filter_type="post_type"]' ).prop( 'disabled', false );
		} );
	});

})(jQuery);
(function($) {
	var postsField = {
		filter_row_template: wp.template('field-posts-filter'),
		p2p_options_template: wp.template('field-posts-p2p-options'),
		date_options_template: wp.template('field-posts-date-options'),
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
			} else if ( group == 'date' ) {
				return postsField.date_options_template;
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
			postsField.hide_irrelevant_filter_options.call(container);
		},

		initialize_tabs: function ( container ) {
			if( container.is('.tabs-initialized')){
				return;
			}
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
			container.addClass('tabs-initialized').prepend(navigation).tabs({
				activate: postsField.update_active_tab,
				active: active_tab_index
			});
		},

		intialize_data: function ( container, data ) {
			data = $.extend({type: 'manual', post_ids: [], filters: {}, max: 0}, data);

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

			if ( data.max < container.data('min') ) {
				data.max = container.data('max');
			}
			container.find( '.max-results-selection' ).val( data.max );

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
								post.text = $('<div />').html( post.text ).text(); // hack to render html entities
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
			var post_ids_to_fetch = [];
			var post_ids_already_fetched = [];
			for ( var post_id in postsField.previews_to_fetch ) {
				if ( postsField.previews_to_fetch.hasOwnProperty(post_id) ) {
					if ( ModularContent.cache.posts.hasOwnProperty(post_id) ) {
						post_ids_already_fetched.push(post_id);
					} else {
						post_ids_to_fetch.push(post_id);
					}
				}
			}
			if ( post_ids_to_fetch.length > 0 ) {
				wp.ajax.send({
					data: {
						action: 'posts-field-fetch-preview',
						post_ids: post_ids_to_fetch
					},
					success: function(data) {
						$.each( data.posts, function ( returned_id, post_data ) {
							ModularContent.cache.posts[ returned_id ] = post_data;
							postsField.display_post_preview( returned_id );
						});
						postsField.set_preview_queue_timeout();
					}
				});
			} else {
				postsField.set_preview_queue_timeout();
			}
			$.each( post_ids_already_fetched, function( index, post_id ) {
				postsField.display_post_preview( post_id );
			});
		},

		display_post_preview: function( post_id ) {
			if ( !ModularContent.cache.posts.hasOwnProperty(post_id) ) {
				return false;
			}
			if ( !postsField.previews_to_fetch.hasOwnProperty(post_id) ) {
				return false;
			}
			var post_data = ModularContent.cache.posts[post_id];
			var wrapper = postsField.previews_to_fetch[post_id];
			wrapper.find('.post-title').html(post_data.post_title);
			wrapper.find('.post-excerpt').html(post_data.post_excerpt);
			wrapper.find('.post-thumbnail').html(post_data.thumbnail_html);
			delete postsField.previews_to_fetch[post_id];
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
			if ( !post_id ) {
				return;
			}
			var preview_slot = postsField.find_open_preview_slot( container );
			if ( !preview_slot ) {
				return;
			}
			preview_slot.val( post_id );
			preview_slot.trigger('change');
			selector.select2('val', '');
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

		initialize_events: function( container ) {
			container
				.on( 'change', '.selected-post input', postsField.load_manual_post_preview )
				.on( 'click', '.search-controls .button', postsField.add_selected_post )
				.on( 'click', '.remove-selected-post', postsField.remove_selected_post )
				.on( 'change', '.select-new-filter', postsField.add_filter_row_event )
				.on( 'click', 'a.remove-filter', postsField.remove_filter_row )
				.on( 'change', '.filter-options .term-select', postsField.hide_irrelevant_filter_options )
				.on( 'change', '.max-results-selection', postsField.preview_query )
				.on( 'change', '.filter-options .term-select', postsField.preview_query )
				.on( 'change', '.filter-options .date-select', postsField.preview_query );

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
			var container = $(this).closest('.panel-input-posts');
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

			var selected_filter_type_option = container.find('.select-new-filter').find('option[value=' + filter_id + ']');

			var template = postsField.filter_row_template;
			var new_filter = $(template({
				type: filter_id,
				name: container.find('.posts-group-name').val(),
				label: selected_filter_type_option.text()
			}));
			container.find('.query .query-filters').append(new_filter);
			new_filter.find('.filter-options').append(options);

			var select2_args = {width: 'element'};
			var filter_group = postsField.get_filter_group( filter_id );
			new_filter.addClass( 'filter-type-group-'+filter_group );

			if ( filter_group == 'p2p' ) {
				// add a drop-down to filter search results by post type
				var possible_post_types = selected_filter_type_option.data('filter-post-type-labels');
				var post_type_filters_select = $('<select class="p2p-search-post-type-filter" />');
				post_type_filters_select.append(
					'<option value="any">' + selected_filter_type_option.data('any-post-type-label') + '</option>'
				);
				$.each( possible_post_types, function ( index, label ) {
					var option = $('<option />');
					option.attr('value', index);
					option.text( label );
					post_type_filters_select.append( option );
				});
				options.before(post_type_filters_select);


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
							paged: page,
							post_type: post_type_filters_select.val()
						};
					},
					results: function( data, page, query ) {
						return { results: data.posts, more: data.more };
					}
				};
				select2_args.initSelection =function( element, callback ) {
					var data = [];
					$(element.val().split(',')).each( function() {
						var id = this;
						if ( ModularContent.cache.posts.hasOwnProperty( id ) ) {
							data.push({
								id: id,
								// meta box should have put the post into the cache
								text: '[' + ModularContent.cache.posts[id].post_type_label + '] ' + ModularContent.cache.posts[id].post_title
							});
						}
					});
					callback(data);
				};
				options.select2(select2_args);
				options.val(data.selection).trigger('change');
			} else if ( filter_group == 'meta' ) {
				select2_args.tags = true;
				select2_args.multiple = true;
				options.select2(select2_args);
				options.val(data.selection).trigger('change');
			} else if ( filter_group == 'date' ) {
				data.selection = $.extend({ start: '', end: '' }, data.selection);
				options.find( '.date-start' ).val( data.selection.start );
				options.find( '.date-end' ).val( data.selection.end );
				options.find( '.date-select' ).datepicker(
					{
						dateFormat: 'yy-mm-dd'
					}
				);
			} else {
				options.select2(select2_args);
				options.val(data.selection).trigger('change');
			}

		},

		hide_irrelevant_filter_options: function() {
			var container = $(this).closest( '.panel-input-posts' );
			var post_type_select = container.find('select.post-type-select');
			var post_types = post_type_select.val();
			var filter_options = container.find('select.select-new-filter').find('option');
			if ( !post_types || post_types.length < 1 ) {
				filter_options.show();
				return;
			}

			filter_options.each( function() {
				var option = $(this);
				if ( !option.val() ) {
					return; // skip placeholders
				}
				var supported_post_types = option.data('filter-post-types');
				if ( !supported_post_types ) {
					return; // skip ambiguous filters
				}
				var intersection = _.intersection( supported_post_types, post_types );
				if ( intersection.length < 1 ) {
					option.hide();
				} else {
					option.show();
				}
			} );
		},

		preview_query: function() {
			var container = $(this).closest('.panel-input-posts');
			var filters = {};
			container.find('.panel-filter-row').each( function() {
				var select = $(this).find(':input.term-select');
				var date = $(this).find('.date-range-input');
				if ( select.length > 0 ) {
					var val = select.val();
					if ( val && val.length > 0 ) {
						filters[ select.data( 'filter_type' ) ] = {
							selection: select.val(),
							lock: true
						};
					}
				} else if ( date.length > 0 ) {
					var start = date.find( '.date-start' ).val();
					var end   = date.find( '.date-end' ).val();
					filters[ date.data( 'filter_type' ) ] = {
						selection: { start: start, end: end },
						lock: true
					};
				}
			});
			if ( filters.length < 1 ) {
				container.find('.query-preview').empty();
				return;
			}

			var max = container.find( '.max-results-selection' ).val();
			if ( max < container.data('min') || max > container.data('max') ) {
				max = container.data('max');
			}


			wp.ajax.send({
				data: {
					action: 'posts-field-fetch-preview',
					filters: filters,
					max: max,
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
(function($) {
	function handle_preview_response( data ) {
		if ( data.preview !== '' ) {
			var preview = $('<span class="panel-input-preview video-preview">'+data.preview+'</span>');
			preview.hide();
			this.append(preview);
			preview.fadeIn();
		}
	}

	function preview_video( field ) {
		var url = field.val();
		var container = field.closest('.panel-input');
		container.find('.panel-input-preview').remove();

		if ( url === '' ) {
			return;
		}

		wp.ajax.send({
			success: handle_preview_response,
			context: container,
			data: {
				action: 'panel-video-preview',
				url: url
			}
		});

	}

	var panels_div = $('div.panels');
	panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid) {
		var row = $(this);
		if ( row.data( 'panel_id' ) != uuid ) {
			return;
		}
		var video_fields = row.find('input.video-url');
		if ( video_fields.length < 1 ) {
			return;
		}
		video_fields.each( function() {
			preview_video($(this));
		});
	});
	panels_div.on('change', 'input.video-url', function() {
		preview_video($(this));
	});
})(jQuery);
(function($) {
	var wysiwyg_field = {
		counter: 0,
		settings: {},

		init_editor: function( wysiwyg ) {
			if ( wysiwyg.hasClass('wp-editor-initialized') ) {
				return;
			}
			var wysiwyg_container = wysiwyg.parents( '.wp-editor-container' );
			var wysiwyg_id = 'panels-wysiwyg-'+wysiwyg_field.counter;
			wysiwyg_field.counter++;
			wysiwyg.attr('id', wysiwyg_id);
			wysiwyg_container.attr('id', 'wp-'+wysiwyg_id+'-editor-container');
			wysiwyg.parents( '.panel-input.input-type-textarea' ).find( '.add_media' ).data( 'editor', wysiwyg_id );

			var wrap = wysiwyg.parents('.wp-editor-wrap');

			wrap.attr('id', 'wp-'+wysiwyg_id+'-wrap');

			// pre 4.3 onclick handlers refer to the current tinymce instance on these buttons using switchEditors
			// 4.3 onwards the onclick is removed and a new attribute of data-wp-editor-id is used to target the instance of tinymce
			wrap.find('.wp-switch-editor.switch-html').attr('id', wysiwyg_id+'-html').attr('data-wp-editor-id', wysiwyg_id);
			wrap.find('.wp-switch-editor.switch-tmce').attr('id', wysiwyg_id+'-tmce').attr('data-wp-editor-id', wysiwyg_id);

			var settings_id = wysiwyg_container.data('settings_id');
			var settings = $.extend({}, wysiwyg_field.settings[settings_id] || {});
			settings.body_class = wysiwyg_id;
			settings.selector = '#'+wysiwyg_id;

			var qt_settings = {id:wysiwyg_id,buttons:"strong,em,link,block,del,ins,img,ul,ol,li,code,more,close"};

			try {
				settings = tinymce.extend( {}, tinyMCEPreInit.ref, settings );
				tinyMCEPreInit.mceInit[wysiwyg_id] = settings;
				tinyMCEPreInit.qtInit[wysiwyg_id] = qt_settings;
				quicktags( tinyMCEPreInit.qtInit[wysiwyg_id] ); // sets up the quick tags toolbar
				QTags._buttonsInit(); // adds buttons to the new quick tags toolbar

				if ( wrap.hasClass('tmce-active') ) {
					switchEditors.go( wysiwyg_id, 'tmce' );
				}

				if ( ! window.wpActiveEditor ) {
					window.wpActiveEditor = wysiwyg_id;
				}

				document.getElementById( 'wp-' + wysiwyg_id + '-wrap' ).onclick = function() {
					window.wpActiveEditor = this.id.slice( 3, -5 );
				};

				wysiwyg.addClass('wp-editor-initialized');
			} catch(e){}
		},

		setup_editor_template: function( generic_id ) {

			if ( tinyMCEPreInit.mceInit.hasOwnProperty(generic_id) ) {
				delete tinyMCEPreInit.mceInit[generic_id];
			}
			if ( tinyMCEPreInit.qtInit.hasOwnProperty(generic_id) ) {
				delete tinyMCEPreInit.qtInit[generic_id];
			}

			var panels_div = $('div.panels');
			panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid) {
				var row = $(this);
				if ( row.data('panel_id') != uuid ) {
					return;
				}
				var wysiwyg = row.find('textarea.wysiwyg-'+generic_id);
				wysiwyg.each( function() {
					wysiwyg_field.init_editor( $(this) );
				});
			});
			panels_div.on('new-panel-repeater-row', '.panel-repeater-row', function(e, uuid) {
				var row = $(this);
				var wysiwyg = row.find('textarea.wysiwyg-'+generic_id);
				wysiwyg.each( function() {
					wysiwyg_field.init_editor( $(this) );
				});
			});
		},

		remove_editor: function ( wysiwyg ) {
			var wysiwyg_id = wysiwyg.attr('id');
			wysiwyg.removeClass('wp-editor-initialized');
			tinymce.remove('#' + wysiwyg_id);

			delete tinyMCEPreInit.mceInit[wysiwyg_id];
			delete tinyMCEPreInit.qtInit[wysiwyg_id];
			wysiwyg.siblings('.quicktags-toolbar').remove();
		},

		handle_sort_start: function( event ) {
			var wysiwyg = $(this).find( 'textarea.wp-editor-initialized' );
			wysiwyg.each( function() {
				wysiwyg_field.remove_editor( $(this) );
			});
		},

		handle_sort_stop: function( event ) {
			var wysiwyg = $(this).find( 'textarea.wp-editor-area' );
			wysiwyg.each( function() {
				wysiwyg_field.init_editor( $(this) );
			} );
		}

	};

	window.tribe = window.tribe || {};
	window.tribe.panels = window.tribe.panels || {};
	window.tribe.panels.wysywig_field = wysiwyg_field;

	$(document).on( 'tribe-panels.start-repeater-drag-sort tribe-panels.start-panel-drag-sort', wysiwyg_field.handle_sort_start );
	$(document).on( 'tribe-panels.stop-repeater-drag-sort tribe-panels.stop-panel-drag-sort', wysiwyg_field.handle_sort_stop );

})(jQuery);