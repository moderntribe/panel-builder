jQuery(function($) {
	var count = 1;
	setTimeout(function() {

		$('.attachment-helper-uploader').each(function() {

			ModularContentAttachmentHelper.plupload_init.container = 'plupload-upload-ui-' + count;
			ModularContentAttachmentHelper.plupload_init.drop_element = 'drag-drop-area-' + count;
			ModularContentAttachmentHelper.plupload_init.multipart_params.size = $(this).data( 'size' );

			// Create uploader and pass configuration:
			var uploader = new plupload.Uploader( ModularContentAttachmentHelper.plupload_init );
			uploader.count = count;
			uploader.size =  $(this).data( 'size' );
			uploader.type =  $(this).data( 'type' );
			

			// Check for drag'n'drop functionality:
			uploader.bind('Init', function(up) {
				count = this.count;
			
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
                count = this.count;
                
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
                count = this.count;
                size  = this.size;
                
				// Toggle image:
				$('#current-uploaded-image-' + count).slideUp('medium', function() {

					// Parse response AS JSON:
					try {
						response = $.parseJSON(response.response);
					} catch( e ) {
						console.log(response);
						return;
					}
	
                    $('#attachment_helper_value-' + count ).val( response.id );
					attachment_helper_load_image( response.image, count, size );

				});

			});

			$( 'a#attachment_helper_library_button-' + count ).click( function(e) {
				
				count = $(this).data( 'count' );
				type  = $(this).data( 'type' );
				size  = $(this).data( 'size' );
				
				// Prevent default:
				e.preventDefault();

				// Set frame object:
				var frame = wp.media({
					multiple : false,
					library : {
						type : type
					},
				});

				// On select image:
				frame.on('select', function() {
					var attachment = frame.state().get('selection').first().toJSON();
					
					$('#attachment_helper_value-' + count ).val( attachment.id );

					if ( typeof (attachment.sizes[size].url ) != "undefined") {
						attachment_helper_load_image(attachment.sizes[size].url, count, size, attachment.caption );
					} else {
						attachment_helper_load_image(attachment.url, count, size, attachment.caption );
					}

				});

				// Display:
				frame.open();

			});
			
			//remove image link
			$('#remove-image-'+count ).click( function(){
				var count = $(this).data( 'count' );
				$('#attachment_helper_value-' + count ).val( '' );
				$('#current-uploaded-image-' + count + ' img' ).attr( 'src', '' );
				$('#uploadContainer-' + count + ' .wp-caption' ).html( '' );
				$("html, body").animate({ scrollTop: $('#uploadContainer-' + count ).offset().top }, 1000);
				
			});
			
			//turn the value into the thumb
			var attachmentID = $('#attachment_helper_value-' + count ).val();
			if( attachmentID != "" ){
				attachment_helper_generate_thumb( attachmentID, count, uploader.size, $('#current-uploaded-image-' + count + ' img' ) );
			};
			

			count++;
		});

	}, 1000);



	function attachment_helper_generate_thumb( id, count, size ){
		
		data = {
			'action'  : 'attachment_helper_get_image',
			'post_id' : id,
			'size'    : size
		};
		
		$.post (ajaxurl, data, function(response) {	
			attachment_helper_load_image( response.url, count, size, response.caption);
		});
	}
	
	
	function attachment_helper_load_image( url, count, size, caption) {
		
		// Update image with new info:
		var imageObject = $('#uploadContainer-' + count + ' img.attachment-' + size);

		imageObject.attr('src', url);
		imageObject.removeAttr('width');
		imageObject.removeAttr('height');
		imageObject.removeAttr('title');
		imageObject.removeAttr('alt');

		if( typeof( caption ) != "undefined" ){
			$('#uploadContainer-' + count + ' .wp-caption' ).html( '<p>'+caption+'</p>' );	
		} else {
			$('#uploadContainer-' + count + ' .wp-caption' ).html( '' );
		}

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
