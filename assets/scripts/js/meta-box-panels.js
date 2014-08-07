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

			var target = $(e.currentTarget);
			var container = _this.getChildContainer();
			var max = container.data('max_children');
			if ( typeof max == 'number' ) {
				if ( container.children('.panel-row').length >= max ) {
					return false; // the panel selector should not work
				}
			}

			var depth = container.data('depth');

			var newPanelList = $( '#new-panel' ).find( '.panel-template' );
			newPanelList.each( function() {
				var template = $(this);
				var template_max_depth = template.data( 'max_depth' );
				if ( typeof template_max_depth == 'number' && template_max_depth < depth ) {
					template.parent().hide();
				} else {
					template.parent().show();
				}
			});

			_this.newPanelContainer = container;
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

			$(el).trigger( 'new-panel-row', [id, {}] );

			if (autoExpand) {
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
				panel_title: 'Untitled', // TODO: localize
				fields: { title: '' },
				depth: this.newPanelContainer.data( 'depth' )
			}));

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

			this.newPanelContainer = null;
		};

		return PanelContainer;

	})();

	/**
	  * Panel View-Controller
	  *
	  * Handles interaction within any given panel and can
	  * hold other Panel instances as children in the case of Tabs and
	  * other repeater-type behavior.
	  *
	  * Extends PanelContainer since it can contain children too
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
			_.bindAll( this, 'remove', 'updateTitle', 'openPanel', 'closePanel' );

			this.$el.on( 'click.' + this.id, '> .panel-row-editor > .delete-panel', this.remove );
			this.$el.on( 'keyup.' + this.id, '> .panel-row-editor > .input-name-title input:text', this.updateTitle );
			this.$el.one( 'click.' + this.id, this.openPanel );
			this.$el.on( 'click.' + this.id, '> .close-panel', this.closePanel );

			$('#modular-content').on( 'click.' + this.id, '#create-child-for-' + this.id, {self:this}, this.spawnPanelPicker );
			$("body").on( 'click.' + this.id, '.new-panel-option .thumbnail', {self:this}, this.pickPanelType );
		};

		Panel.prototype.unbindEvents = function() {
			this.$el.off("." + this.id);
		};

		Panel.prototype.initExistingPanels = function() {
			var panels = $("#" + this.el.getAttribute("data-id") + "-children").find("> .panel-row");
			_.each(panels, function(el) {
				this.addPanel( el, el.getAttribute("data-id") );
			}, this);
		};

		Panel.prototype.getChildContainer = function() {
			return this.$el.find(".panel-children");
		};

		Panel.prototype.remove = function() {
			this.$el.addClass( "panel-warning" );

			var _this = this;
			if ( confirm( 'Delete this panel?' ) ) { // TODO: localize
				_this.$el.fadeOut(150, function() {
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
				title = 'Untitled'; // TODO: localize
			}
			this.$el.find( '> .panel-row-header' ).find( '.panel-title' ).text( title );
		};

		Panel.prototype.openPanel = function(e) {
			if ( !e || ( e.currentTarget === this.el && ! this.$el.hasClass("editing") ) ) {
				this.$el.addClass( "editing" );
				this.$el.find("input:text").first().focus();
			}
		};

		Panel.prototype.closePanel = function(e) {
			this.$el.removeClass( "editing" );
			this.$el.one( 'click.panel', this.openPanel );
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
				return console.warn( "No panels found on window.ModularContent: ", window.ModularContent );
			}

			_.each( panels, this.createPanel, this );
		};

		PanelCreator.prototype.createPanel = function(panel) {
			var template = wp.template( 'panel-' + panel.type );
			var uuid = _.uniqueId( "panel_" );

			var newRow = $(template({
				panel_id: uuid,
				field_name: uuid,
				panel_title: panel.data.title,
				fields: panel.data,
				depth: panel.depth
			}));

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

			currentContainer.append( newRow );
			newRow.trigger( 'load-panel-row', [uuid, panel.data] );
		};

		return PanelCreator;
	})();


	/**
	 * DOM Ready handler
	 * Kicks everything into motion
	 */
	$(function() {
		window.tribe = window.tribe || {};
		window.tribe.panels = window.tribe.panels || {};

		var panels = $('.panels');
		window.tribe.panels.container = new PanelContainer( panels.get(0) );


		// Instantiates panels from server-side rendered markup.
		// Wait untill window.load so we know all deps are loaded first.
		$(window).load(function() {
			new PanelCreator( panels );
			window.tribe.panels.container.initExistingPanels();
		});
	});

})(jQuery);




/**
 * Autosave for panels
 */
(function($) {
	$(document).on('before-autosave.panel-autosave', function( e, postdata ) {
		postdata.post_content_filtered = $('#modular-content').find('input, select, textarea').serialize();
	});
})(jQuery);