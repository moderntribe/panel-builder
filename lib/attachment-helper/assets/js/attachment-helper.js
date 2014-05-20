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
				response = $.parseJSON(response.response);

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

	var AttachmentHelper = {

		frame_title : 'Upload Attachment',
		button_title : 'Attach something',

		// Call this from the upload button to initiate the upload frame.
		uploader : function(helper_div) {
			var field = helper_div.find('.attachment-helper-input');

			var frame = wp.media({
				title : field.data('label'),
				multiple : false,
				library : {
					type : field.data('type')
				},
				button : {
					text : field.data('label-set')
				}
			});

			// Handle results from media manager.
			frame.on('close', function() {
				var attachments = frame.state().get('selection').toJSON();
				AttachmentHelper.setValue(helper_div, attachments[0]);
			});

			frame.open();
			return false;
		},

		setValue : function(helper_div, attachment) {
			var field = helper_div.find('.attachment-helper-input');
			field.val(attachment.id);
			helper_div.find('.attachment-helper-remove').show();

			var preview = '';
			if (attachment.type == 'image' && attachment.sizes.hasOwnProperty(field.data('size'))) {
				var size = attachment.sizes[field.data('size')];
				preview = '<img src="' + size.url + '" width="' + size.width + '" height="' + size.height + '" />';
			} else {
				preview = attachment.title + ' (' + attachment.filename + ')';
				preview = '<span>' + preview + '</span>';
			}
			helper_div.find('.attachment-helper-set').html(preview);
		}
	};

	$('body').on('click', 'a.attachment-helper-set', function() {
		var div = $(this).parents('.attachment-helper');
		AttachmentHelper.uploader(div);
		return false;
	}).on('click', 'a.attachment-helper-remove', function() {
		var div = $(this).parents('.attachment-helper');
		var field = div.find('.attachment-helper-input');
		div.find('a.attachment-helper-set img, a.attachment-helper-set span').fadeOut(500, function() {
			$(this).parent().text(field.data('label-set'));
			$(this).remove();
		});
		field.val(0);
		$(this).hide();
		return false;
	});
}); 