// this is the config object supplied by wp to js. i simulate defaults here for what i need in here for the karma tests.

export const CONFIG_DEFAULTS = {
	fields: {
		image: {
			plupload: {
				runtimes: 'html5,silverlight,flash,html4',
				browse_button: 'plupload-browse-button',
				container: 'plupload-upload-ui',
				drop_element: 'drag-drop-area',
				file_data_name: 'async-upload',
				multiple_queues: false,
				multi_selection: false,
				max_file_size: '1048576000b',
				url: 'http://localhost:3000/wp-admin/admin-ajax.php',
				flash_swf_url: 'http://localhost:3000/wp-includes/js/plupload/plupload.flash.swf',
				silverlight_xap_url: 'http://localhost:3000/wp-includes/js/plupload/plupload.silverlight.xap',
				multipart: true,
				urlstream_upload: true,
				multipart_params: {
					_ajax_nonce: '9e9fb061f0',
					action: 'attachment_helper_upload_image',
					postID: 1,
					size: 'medium',
				},
			},
		},
	},
};

