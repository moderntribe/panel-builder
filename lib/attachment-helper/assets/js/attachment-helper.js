jQuery(document).ready(function($) {

	setTimeout(function() {

		// Create uploader and pass configuration:
		var uploader = new plupload.Uploader( ModularContentAttachmentHelper.plupload_init );

		// Check for drag'n'drop functionality:
		uploader.bind('Init', function(up) {
			var uploaddiv = $('#plupload-upload-ui');

			// Add classes and bind actions:
			if (up.features.dragdrop) {
				uploaddiv.addClass('drag-drop');
				$('#drag-drop-area').bind('dragover.wp-uploader', function() {
					uploaddiv.addClass('drag-over');
				}).bind('dragleave.wp-uploader, drop.wp-uploader', function() {
					uploaddiv.removeClass('drag-over');
				});

			} else {
				uploaddiv.removeClass('drag-drop');
				$('#drag-drop-area').unbind('.wp-uploader');
			}
		});

		// Initiate uploading script:
		uploader.init();

		// File queue handler:
		uploader.bind('FilesAdded', function(up, files) {

			// Refresh and start:
			up.refresh();
			up.start();

			// Set sizes and hide container:
			var currentHeight = $('#uploaderSection').outerHeight();
			$('#uploaderSection').css({
				height : currentHeight
			});
			$('div#plupload-upload-ui').fadeOut('medium');
			$('#uploaderSection .loading').fadeIn('medium');

		});

		// A new file was uploaded:
		uploader.bind('FileUploaded', function(up, file, response) {

			// Toggle image:
			$('#current-uploaded-image').slideUp('medium', function() {

				// Parse response AS JSON:
				try {
					response = $.parseJSON(response.response);
				} catch( e ){
					console.log( response );
					return;	
				}

				attachment_helper_load_image( response.image );

			});

		});

	}, 1000);
	
	$('a#attachment_helper_library_button').click(function(e){

		// Prevent default:
		e.preventDefault();

		// Set frame object:
		var frame = wp.media({
			id: 'dgd_featured_image',
			multiple : false,
			library : { type : ModularContentAttachmentHelper.type },
		});

		// On select image:
		frame.on('select', function(){
			var attachment = frame.state().get('selection').first().toJSON();

			if( typeof( attachment.sizes[ModularContentAttachmentHelper.size].url ) !=  "undefined" ){
				attachment_helper_load_image( attachment.sizes[ModularContentAttachmentHelper.size].url );
			} else {
				attachment_helper_load_image( attachment.url );
			}
			
		});

		// Display:
		frame.open();

	});
	
	
	function attachment_helper_load_image( url ){
		// Update image with new info:
					var imageObject = $( '#uploadContainer img.attachment-'+ModularContentAttachmentHelper.size );

					imageObject.attr('src', url );
					imageObject.removeAttr('width');
					imageObject.removeAttr('height');
					imageObject.removeAttr('title');
					imageObject.removeAttr('alt');

					// Hide container:
					imageObject.load(function() {

						// Display container:
						$('#current-uploaded-image').slideDown('medium');

						// Fade in upload container:
						$('div#plupload-upload-ui').fadeIn('medium');
						$('#uploaderSection .loading').fadeOut('medium');

					});
		
	}
	

}); 