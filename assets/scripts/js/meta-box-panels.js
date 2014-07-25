(function($) {

	var win = window.dialogArguments || opener || parent || top;

	/**
	  * Panel View-Controller
	  *
	  * Handles interaction within any given panel and
	  * holds Field instances as children.
	  */
	var Panel = (function() {
		function Panel(el) {
			this.el = el;
			this.$el = $(this.el);
			this.init();
		}

		Panel.prototype.init = function() {
			this.bindEvents();
		};

		Panel.prototype.bindEvents = function() {
			_.bindAll( this, 'remove', 'updateTitle', 'toggle' );

			this.$el.on( 'click.panel', '.delete-panel', this.remove );
			this.$el.on( 'keyup.panel', '.input-name-title input:text', this.updateTitle );
			this.$el.on( 'click.panel', '.edit-panel', this.toggle );
		};

		Panel.prototype.unbindEvents = function() {
			this.$el.off(".panel");
		};

		// Event handlers
		Panel.prototype.remove = function(e) {
			e.preventDefault();
			var row = $( e.currentTarget ).closest( '.panel-row' );
			row.css( {backgroundColor: 'lightYellow'} );
			if ( confirm( 'Delete this panel?' ) ) { // TODO: localize
				row.fadeOut( 150, row.remove );
			} else {
				row.css({backgroundColor: 'transparent'});
			}

			this.unbindEvents();
		};

		Panel.prototype.updateTitle = function(e) {
			var title = $( e.currentTarget ).val();
			if ( title === '' ) {
				title = 'Untitled'; // TODO: localize
			}
			this.$el.find( '.panel-row-header' ).find( '.panel-title' ).text( title );
		};

		Panel.prototype.toggle = function(e) {
			console.log("toggle panel");
			e.preventDefault();
			this.$el.find( '.panel-row-editor' ).toggle();
		};

		return Panel;

	})();

	/**
	 * PanelContainer View-Controller
	 *
	 * Handles interaction for the whole panel container element and
	 * holds Panel instances as children
	 */
	var PanelContainer = (function() {
		function PanelContainer(el) {
			if (! el) {
				return console.warn("No element supplied for PanelContainer");
			}

			this.el = el;
			this.$el = $(this.el);
			this.newPanelContainer = null;
			this.panels = [];

			this.init();
		}

		PanelContainer.prototype.init = function() {
			this.bindEvents();
			this.enableDragDrop();
			this.initExistingPanels();
		};

		PanelContainer.prototype.bindEvents = function() {
			_.bindAll( this, "createNewPanel", "pickPanelType" );

			$('#modular-content').on( 'click', '.create-new-panel', this.createNewPanel );
			$("body").on( 'click', '.new-panel-option .thumbnail', this.pickPanelType );
		};

		PanelContainer.prototype.enableDragDrop = function() {
			this.$el.sortable({
				axis: 'y',
				items: '> .panel-row',
				handle: '.panel-row-header'
			});
		};

		PanelContainer.prototype.initExistingPanels = function() {
			_.each(this.$el.find( ".panel-row" ), function(el) {
				console.log("Init existing");
				this.panels.push( new Panel( el ) );
			}, this);
		};

		// Event handlers
		PanelContainer.prototype.createNewPanel = function(e) {
			e.preventDefault();

			var target = $(e.currentTarget);
			var container = target.siblings( target.hasClass('create-new-child') ? 'div.panel-children' : 'div.panels' );
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

			this.newPanelContainer = container;
		};

		PanelContainer.prototype.pickPanelType = function(e) {
			e.preventDefault();
			if ( this.newPanelContainer === null ) {
				return;
			}

			var wrapper = $( e.currentTarget ).closest( '.panel-template' );
			var panelType = wrapper.data( 'panel-type' );
			var template = wp.template( 'panel-' + panelType );
			var uuid = _.uniqueId('panel_');

			var newRow = $(template({
				panel_id: uuid,
				field_name: uuid,
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
			newRow.trigger( 'new-panel-row', [uuid, {}] );

			this.panels.push( newRow.get(0) );

			this.newPanelContainer = null;
		};

		return PanelContainer;

	})();

	/**
	 * DOM Ready handler
	 * Basically kicks everything into motion
	 */
	$(function() {
		window.tribe = window.tribe || {};

		$(".panels").each(function() {
			window.tribe.panelContainer = new PanelContainer(this);
		});

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

			new_row.children('.panel-row-editor').hide();

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