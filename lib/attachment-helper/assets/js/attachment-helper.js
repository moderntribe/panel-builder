jQuery(document).ready(function($) {

	setTimeout(function() {

		// Create uploader and pass configuration:
		var uploader = new plupload.Uploader(AttachmentHelper_plupload_init);

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

				// Find current image and continue:
				if ($('#uploadContainer').find('.attachment-medium').length > 0) {

					// Update image with new info:
					var imageObject = $('#uploadContainer img.attachment-medium');

					imageObject.attr('src', response.image);
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

						// Remove previous uploads:
						if (uploader.files.length >= 1) {
							uploader.splice(0, (uploader.files.length - 1));
						}

					});

				}

			});

		});

	}, 1000);

}); 