(function($) {
	var panels_div = $('div.panels');
	panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid) {
		var row = $(this);
		var containers = row.find('.attachment-helper-uploader');
		if ( containers.length < 1 ) {
			return;
		}
		containers.each( function() {
			var container = $(this);
			var settings_name = container.data('settings');
			settings_name = settings_name.replace( uuid, '{{data.panel_id}}' );

			if ( AttachmentHelper.settings.hasOwnProperty(settings_name) ) {
				AttachmentHelper.init( container, AttachmentHelper.settings[settings_name]);
			}
		});
	});
})(jQuery);