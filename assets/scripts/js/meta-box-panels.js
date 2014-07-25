(function($) {
	var Panel, PanelContainer;

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
			if (! el) {
				return console.warn("No element supplied for PanelContainer");
			}
			this.el = el;
			this.$el = $(this.el);
			this.newPanelContainer = null;
			this.panels = [];

			if (id) {
				this.id = id;
			} else {
				this.id = this.getUniqueId();
			}

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
				axis: 'y',
				items: '> .panel-row',
				handle: '.panel-row-header'
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
				var template = target;
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

		PanelContainer.prototype.addPanel = function(el, id) {
			this.panels.push( new Panel( el, id ) );
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
					axis: 'y',
					items: '> div.panel-row',
					handle: '.panel-row-header'
				});
			}

			this.newPanelContainer.append( newRow );
			win.tb_remove();
			newRow.trigger( 'new-panel-row', [panelId, {}] );

			this.addPanel( newRow.get(0), panelId );

			this.newPanelContainer = null;
		};

		return PanelContainer;

	})();

	/**
	  * Panel View-Controller
	  *
	  * Handles interaction within any given panel and
	  * holds Field instances as children.
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
			this.$el.on( 'keyup.' + this.id, '.input-name-title input:text', this.updateTitle );
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
			this.$el.css( {backgroundColor: 'lightYellow'} );

			var _this = this;
			if ( confirm( 'Delete this panel?' ) ) { // TODO: localize
				_this.$el.fadeOut(150, function() {
					_this.$el.remove();
				});
				_this.unbindEvents();
			} else {
				this.$el.css( {backgroundColor: 'transparent'} );
			}

		};

		Panel.prototype.updateTitle = function(e) {
			var title = $( e.currentTarget ).val();
			if ( title === '' ) {
				title = 'Untitled'; // TODO: localize
			}
			this.$el.find( '.panel-row-header' ).find( '.panel-title' ).text( title );
		};

		Panel.prototype.openPanel = function(e) {
			if ( e.currentTarget === this.el && ! this.$el.hasClass("editing") ) {
				this.$el.addClass( "editing" );
			}
		};

		Panel.prototype.closePanel = function(e) {
			this.$el.removeClass( "editing" );
			this.$el.one( 'click.panel', this.openPanel );
		};

		return Panel;

	})(PanelContainer);

	/**
	 * DOM Ready handler
	 * Basically kicks everything into motion
	 */
	$(function() {
		window.tribe = window.tribe || {};
		window.tribe.panels = window.tribe.panels || {};

		window.tribe.panels.container = new PanelContainer( $(".panels").get(0) );

	});



	/**
	 *
	 * L E G A C Y
	 * B E I N G
	 * R E F A C T O R E D
	 *
	 */


	var panels_div = $('.panels');

	var ModularContent = window.ModularContent || {};
	ModularContent.panels = ModularContent.panels || [];

	(function() {

		var parents = { 0: panels_div };
		var deepest_parent = 0;

		function createPanel( index, panel ) {
			var template = wp.template('panel-'+panel.type);
			var uuid = _.uniqueId("panel_");

			var new_row = $(template({
				panel_id: uuid,
				field_name: uuid,
				panel_title: panel.data.title,
				fields: panel.data,
				depth: panel.depth
			}));

			while ( panel.depth < deepest_parent && deepest_parent > 0 ) {
				delete parents[deepest_parent];
				deepest_parent--;
			}

			var current_container = parents[deepest_parent];

			var child_container = new_row.find( '.panel-children' );
			if ( child_container.length == 1 ) {
				deepest_parent++;
				parents[deepest_parent] = child_container;
				child_container.sortable({
					axis: 'y',
					items: '> div.panel-row',
					handle: '.panel-row-header'
				});
			}

			current_container.append(new_row);
			new_row.trigger('load-panel-row', [uuid, panel.data]);
		}

		$.each( ModularContent.panels, createPanel );

	})();

})(jQuery);




/**
 * Autosave for panels
 */
(function($) {
	$(document).on('before-autosave.panel-autosave', function( e, postdata ) {
		postdata.post_content_filtered = $('#modular-content').find('input, select, textarea').serialize();
	});
})(jQuery);