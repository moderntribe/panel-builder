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