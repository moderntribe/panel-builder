(function($) {
	var Panel, PanelContainer, PanelCreator;

	var __hasProp = {}.hasOwnProperty;

	// Utility for extending classes
	var __extends = function(child, parent) {
		for (var key in parent) {
			if (__hasProp.call(parent, key)) {
				child[key] = parent[key];
			}
		}

		function Ctor() {
			this.constructor = child;
		}

		Ctor.prototype = parent.prototype;
		child.prototype = new Ctor();
		child.__super__ = parent.prototype;
		return child;
	};

	var win = window.dialogArguments || opener || parent || top;

	/**
	 * PanelContainer View-Controller
	 *
	 * Handles interaction for the whole panel container element and
	 * holds Panel instances as children
	 */
	PanelContainer = (function() {
		function PanelContainer(el, id) {
			if ( ! el ) {
				return console.warn("No element supplied for PanelContainer");
			}
			this.el = el;
			this.$el = $(this.el);
			this.newPanelContainer = null;
			this.panels = [];

			this.id = id || this.getUniqueId();

			this.init();
		}

		PanelContainer.prototype.getUniqueId = function() {
			return _.uniqueId("panel_container_");
		};

		PanelContainer.prototype.init = function() {
			this.bindEvents();
			this.initExistingPanels();
			this.enableDragDrop();
		};

		PanelContainer.prototype.bindEvents = function() {
			// Context has to be passed dynamically via event data obj, so that
			// new panels are added to the correct parent. Otherwise they'd all get added to the PanelContainer instance element
			$('#modular-content').on( 'click.' + this.id, '.create-new-panel', {self:this}, this.spawnPanelPicker );
			$('body').on( 'click.' + this.id, '.new-panel-option .thumbnail', {self: this}, this.pickPanelType );
		};

		PanelContainer.prototype.unbindEvents = function() {
			$("#modular-content").off("." + this.id);
			$("body").off("." + this.id);
		};

		PanelContainer.prototype.enableDragDrop = function() {
			this.$el.sortable({
				items: '> .panel-row',
				handle: '.panel-row-header',
				placeholder: 'panel-row-drop-placeholder',
				forcePlaceholderSize: true
			});
		};

		PanelContainer.prototype.initExistingPanels = function() {
			_.each(this.$el.find( "> .panel-row" ), function(el) {
				this.addPanel( el, el.getAttribute("data-id") );
			}, this);
		};


		PanelContainer.prototype.getChildContainer = function(e) {
			return this.$el;
		};

		PanelContainer.prototype.spawnPanelPicker = function(e) {
			e.preventDefault();
			var _this = e.data.self;

			var container = _this.getChildContainer();
			var max = container.data('max_children');
			if ( typeof max == 'number' ) {
				if ( container.children('.panel-row').length >= max ) {
					return false; // the panel selector should not work
				}
			}

			var depth = container.data('depth');
			var container_type = container.closest('.panel-row').data('type');

			var title = $(e.target).data('title');
			$( '#new-panel' ).find( 'h2.new-panel-list-title ').text( title );

			var newPanelList = $( '#new-panel' ).find( '.panel-template' );
			newPanelList.each( function() {
				var template = $(this);
				var template_max_depth = template.data( 'max_depth' );
				var template_contexts = [];
				var template_context_mode = template.data( 'panel-context-mode' );
				if ( typeof template_max_depth == 'number' && template_max_depth < depth ) {
					template.parent().hide();
				} else if ( template_context_mode == 'allow' && depth === 0 ) {
					template.parent().hide(); // the panel requires a parent context
				} else if ( template_context_mode == 'allow' ) {
					template_contexts = template.data( 'panel-contexts' );
					if ( $.inArray( container_type, template_contexts ) >= 0 ) {
						template.parent().show();
					} else {
						template.parent().hide();
					}
				} else if ( template_context_mode == 'deny' ) {
					template_contexts = template.data( 'panel-contexts' );
					if ( $.inArray( container_type, template_contexts ) < 0 ) {
						template.parent().show();
					} else {
						template.parent().hide();
					}
				} else {
					template.parent().show();
				}
			});

			_this.newPanelContainer = container;

			$( document ).trigger( 'tribe-panels.picker-loaded', newPanelList.closest( '.panel-selection-list' ) );
		};

		PanelContainer.prototype.pickPanelType = function(e) {
			e.preventDefault();
			var _this = e.data.self;
			if ( _this.newPanelContainer === null ) {
				return;
			}

			_this.createPanel( $( e.currentTarget ).closest( '.panel-template' ) );
		};

		PanelContainer.prototype.addPanel = function(el, id, autoExpand) {
			var panel = new Panel( el, id );
			this.panels.push( panel );

			if ( autoExpand ) {
				panel.openPanel();
			}
		};

		PanelContainer.prototype.createPanel = function(wrapper) {
			if ( ! this.newPanelContainer ) {
				return;
			}

			var panelType = wrapper.data( 'panel-type' );
			var template = wp.template( 'panel-' + panelType );

			var panelId = _.uniqueId("panel_");

			var newRow = $(template({
				panel_id: panelId,
				field_name: panelId,
				panel_title: ModularContent.localization.untitled,
				fields: { title: '' },
				depth: this.newPanelContainer.data( 'depth' )
			}));

			newRow.data( 'panel_id', panelId );

			var delete_child_label = this.newPanelContainer.data( 'delete-child' );
			if ( delete_child_label ) {
				newRow.find('.delete-panel').text( delete_child_label );
			}

			var childContainer = newRow.find('.panel-children');

			if ( childContainer.length == 1 ) {
				childContainer.sortable({
					items: '> div.panel-row',
					handle: '.panel-row-header',
					placeholder: 'panel-row-drop-placeholder',
					forcePlaceholderSize: true
				});
			}

			this.newPanelContainer.append( newRow );
			win.tb_remove();

			this.addPanel( newRow.get(0), panelId, true );
			this.handleNewPanelAdded( newRow.get(0), panelId );

			this.newPanelContainer = null;
		};

		PanelContainer.prototype.handleNewPanelAdded = function(el, id) {
			$(el).trigger( 'new-panel-row', [id, {}] );
			$( document ).trigger( 'tribe-panels.added-one', [el, id] );
		};

		return PanelContainer;

	})();

	/**
	 * Panel View-Controller
	 *
	 * Handles interaction within any given panel and can
	 * hold other Panel instances as children in the case of Tabs and
	 * other repeater-type panels.
	 *
	 * Extends PanelContainer since we can re-use all the logic for handling
	 * children in that.
	 */
	Panel = (function(_super) {
		/* jshint ignore:start */
		__extends(Panel, _super);

		function Panel() {
			Panel.__super__.constructor.apply( this, arguments );
		}
		/* jshint ignore:end */

		Panel.prototype.getUniqueId = function() {
			return _.uniqueId("panel_");
		};

		Panel.prototype.bindEvents = function() {
			_.bindAll( this, 'remove', 'updateTitle', 'openPanel', 'closePanel', 'emitImageSelectEvent' );

			this.$el.on( 'click.' + this.id, '> .panel-row-editor > .delete-panel', this.remove );
			this.$el.on( 'keyup.' + this.id, '> .panel-row-editor > .input-name-title input:text', this.updateTitle );
			this.$el.one( 'click.' + this.id, this.openPanel );
			this.$el.on( 'click.' + this.id, '> .close-panel', this.closePanel );
			this.$el.on( 'click.' + this.id, '.add-new-child-panel', this.checkChildLimit );
			this.$el.on( 'change.' + this.id, 'label.image-option input[type=radio]', this.emitImageSelectEvent );

			$('#modular-content').on( 'click.' + this.id, '#create-child-for-' + this.id, {self:this}, this.spawnPanelPicker );
			$("body").on( 'click.' + this.id, '.new-panel-option .thumbnail', {self:this}, this.pickPanelType );
		};

		Panel.prototype.unbindEvents = function() {
			this.$el.off("." + this.id);
		};

		Panel.prototype.emitImageSelectEvent = function( e ){
			e.stopPropagation();
			$( document ).trigger( 'tribe-panels.image-select-changed', [ this.$el, e.target.value ] );
		};

		Panel.prototype.initExistingPanels = function() {
			var panels = $("#" + this.el.getAttribute("data-id") + "-children").find("> .panel-row");
			_.each(panels, function(el) {
				this.addPanel( el, el.getAttribute("data-id") );
			}, this);
		};

		Panel.prototype.checkChildLimit = function(e) {
			var childContainer = $(this).siblings( ".panel-children" );
			var limit = parseInt( childContainer.attr( "data-max_children" ), 10 );

			if ( childContainer.children().length >= limit ) {
				alert( "This panel holds no more than " + limit + " items." );
			}
		};

		Panel.prototype.getChildContainer = function() {
			return this.$el.find(".panel-children");
		};

		Panel.prototype.remove = function() {
			this.$el.addClass( "panel-warning" );

			var _this = this;
			if ( confirm( ModularContent.localization.delete_this_panel ) ) {
				_this.$el.fadeOut(150, function() {
					$( document ).trigger( 'tribe-panels.removed-one', [ _this.$el, _this.$el.attr( 'data-id' ) ] );
					_this.$el.remove();
				});
				_this.unbindEvents();
			} else {
				this.$el.removeClass( "panel-warning" );
			}

		};

		Panel.prototype.updateTitle = function(e) {
			var title = $( e.currentTarget ).val();
			if ( title === '' ) {
				title = ModularContent.localization.untitled;
			}
			this.$el.find( '> .panel-row-header' ).find( '.panel-title' ).text( title );
		};

		Panel.prototype.openPanel = function(e) {
			if ( !e || ( e.currentTarget === this.el && ! this.$el.hasClass("editing") ) ) {
				this.$el.addClass( "editing" );
				this.$el.find(".panel-row-header").first().addClass("panel-builder-bg-color");
				this.$el.addClass("panel-builder-border-color");
				this.$el.find("input:text").first().focus();
				this.setThumbnail( "data-alt" );
				$( document ).trigger( 'tribe-panels.opened-one', [ this.$el, this.$el.attr( 'data-id' ) ] );
			}
		};

		Panel.prototype.closePanel = function(e) {
			this.$el.removeClass( "editing" );
			this.$el.find(".panel-row-header").first().removeClass("panel-builder-bg-color");
			this.$el.removeClass("panel-builder-border-color");
			this.$el.one( 'click.panel', this.openPanel );
			this.setThumbnail( "data-default" );
			$( document ).trigger( 'tribe-panels.closed-one', [ this.$el, this.$el.attr( 'data-id' ) ] );
		};

		Panel.prototype.setThumbnail = function( imageSrc ) {
			var image = this.$el.find("> .panel-row-header").find(".media-object");
			image.attr( "src", image.attr( imageSrc ) );
		};


		return Panel;

	})(PanelContainer);


	/**
	 * PanelCreator
	 *
	 * The PanelCreator is a controller-type helper that instantiates new
	 * PanelContainers for the markup rendered by the server
	 *
	 */
	PanelCreator = (function() {
		function PanelCreator(elements) {
			this.parents = { 0: elements };
			this.deepestParent = 0;

			this.init();
		}

		PanelCreator.prototype.init = function() {
			var panels = window.ModularContent ? window.ModularContent.panels : null;

			if ( ! ( panels && panels.length ) ) {
				return;
			}

			_.each( panels, this.createPanel, this );
		};

		PanelCreator.prototype.createPanel = function(panel) {
			var template = wp.template( 'panel-' + panel.type );
			var panelId = _.uniqueId( "panel_" );

			var newRow = $(template({
				panel_id: panelId,
				field_name: panelId,
				panel_title: panel.data.title,
				fields: panel.data,
				depth: panel.depth
			}));

			newRow.data( 'panel_id', panelId );

			while ( panel.depth < this.deepestParent && this.deepestParent > 0 ) {
				delete this.parents[this.deepestParent];
				this.deepestParent--;
			}

			var currentContainer = this.parents[this.deepestParent];

			var childContainer = newRow.find( '.panel-children' );
			if ( childContainer.length == 1 ) {
				this.deepestParent++;
				this.parents[this.deepestParent] = childContainer;
				childContainer.sortable({
					items: '> div.panel-row',
					handle: '.panel-row-header',
					placeholder: 'panel-row-drop-placeholder',
					forcePlaceholderSize: true
				});
			}

			var delete_child_label = currentContainer.data( 'delete-child' );
			if ( delete_child_label ) {
				newRow.find('.delete-panel').text( delete_child_label );
			}

			currentContainer.append( newRow );
			newRow.trigger( 'load-panel-row', [panelId, panel.data] );
		};

		return PanelCreator;
	})();


	/**
	 * DOM Ready handler
	 * Kicks everything into motion
	 */
	var submitButtons = $('#submitpost').find( ':button, :submit, a.submitdelete, #post-preview' );
	submitButtons.addClass( 'disabled' );
	$(function() {

		window.tribe = window.tribe || {};
		window.tribe.panels = window.tribe.panels || {};

		var panels = $('.panels');
		window.tribe.panels.container = new PanelContainer( panels.get(0) );

		// Instantiates panels from server-side rendered markup.
		// Wait untill window.load so we know all deps are loaded first.
		$(window).load(function() {
			window.tribe.panels.creator = new PanelCreator( panels );
			window.tribe.panels.container.initExistingPanels();
			submitButtons.removeClass( 'disabled' );
			$( document ).trigger( 'tribe-panels.loaded', window.tribe.panels.container.$el );
		});
	});

})(jQuery);




/**
 * Autosave for panels
 */
(function($) {
	function cleanup_wysiwygs() {
		if ( typeof tinymce !== 'undefined' ) {
			$('#modular-content').find('textarea.wp-editor-area').each(function () {
				var editor = tinymce.get($(this).attr('id'));
				if ( editor && editor.isDirty() ) {
					editor.save();
				}
			});
		}
	}

	$(document).on('before-autosave.panel-autosave', function( e, postdata ) {
		cleanup_wysiwygs();
		postdata.post_content_filtered = $('#modular-content').find('input, select, textarea').serialize();
	});
})(jQuery);