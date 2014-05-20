jQuery(function($) {
	var count = 1;
	setTimeout(function() {

		$('.attachment-helper-uploader').each(function() {

			ModularContentAttachmentHelper.plupload_init.container = 'plupload-upload-ui-' + count;
			ModularContentAttachmentHelper.plupload_init.drop_element = 'drag-drop-area-' + count;

			// Create uploader and pass configuration:
			var uploader = new plupload.Uploader( ModularContentAttachmentHelper.plupload_init );
			

			// Check for drag'n'drop functionality:
			uploader.bind('Init', function(up) {
				var uploaddiv = $('#plupload-upload-ui-' + count);
				
				// Add classes and bind actions:
				if (uploader.features.dragdrop) {
					uploaddiv.addClass('drag-drop');
					$('#drag-drop-area-' + count).bind('dragover.wp-uploader', function() {
						uploaddiv.addClass('drag-over');
					}).bind('dragleave.wp-uploader, drop.wp-uploader', function() {
						uploaddiv.removeClass('drag-over');
					});

				} else {
					uploaddiv.removeClass('drag-drop');
					$('#drag-drop-area-' + count).unbind('.wp-uploader');
				}
			});

			// Initiate uploading script:
			uploader.init();

			// File queue handler:
			uploader.bind('FilesAdded', function(up, files) {

				// Refresh and start:
				uploader.refresh();
				uploader.start();

				// Set sizes and hide container:
				var currentHeight = $('#uploaderSection-' + count).outerHeight();
				$('#uploaderSection-' + count).css({
					height : currentHeight
				});
				$('div#plupload-upload-ui-' + count).fadeOut('medium');
				$('#uploaderSection-' + count + ' .loading').fadeIn('medium');

			});

			// A new file was uploaded:
			uploader.bind('FileUploaded', function(up, file, response) {

				// Toggle image:
				$('#current-uploaded-image-' + count).slideUp('medium', function() {

					// Parse response AS JSON:
					try {
						response = $.parseJSON(response.response);
					} catch( e ) {
						console.log(response);
						return;
					}

					attachment_helper_load_image( response.image, count );

				});

			});

			$( 'a#attachment_helper_library_button-' + count ).click( function(e) {
				
				count = $(this).data( 'count' );
				
				// Prevent default:
				e.preventDefault();

				// Set frame object:
				var frame = wp.media({
					multiple : false,
					library : {
						type : ModularContentAttachmentHelper.type
					},
				});

				// On select image:
				frame.on('select', function() {
					var attachment = frame.state().get('selection').first().toJSON();

					if ( typeof (attachment.sizes[ModularContentAttachmentHelper.size].url ) != "undefined") {
						attachment_helper_load_image(attachment.sizes[ModularContentAttachmentHelper.size].url, count );
					} else {
						attachment_helper_load_image(attachment.url, count );
					}

				});

				// Display:
				frame.open();

			});

			//count++;
		});

	}, 1000);

	
	function attachment_helper_load_image( url, count ) {

		// Update image with new info:
		var imageObject = $('#uploadContainer-' + count + ' img.attachment-' + ModularContentAttachmentHelper.size);

		imageObject.attr('src', url);
		imageObject.removeAttr('width');
		imageObject.removeAttr('height');
		imageObject.removeAttr('title');
		imageObject.removeAttr('alt');

		// Hide container:
		imageObject.load(function() {

			// Display container:
			$('#current-uploaded-image-' + count).slideDown('medium');

			// Fade in upload container:
			$('div#plupload-upload-ui-' + count).fadeIn('medium');
			$('#uploaderSection-' + count + ' .loading').fadeOut('medium');

		});

	}

});
