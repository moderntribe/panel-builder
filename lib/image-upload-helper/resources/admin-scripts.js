(function($,$win){
	var last_clicked = null;

	window.ImageHelperSetImageID = function( id ) {
		var $input = $(last_clicked).parents('.image-upload-helper').find('input.image-upload-helper-input');
		$input.val(id);
		$.get(
			ajaxurl,
			{
				action: 'image_upload_helper_image',
				thumbnail_id: id,
				label: $input.parents('.image-upload-helper').find('.image-upload-helper-label').text(),
				size: $input.siblings('.image-upload-helper-size').val(),
				field_name: $input.attr('name'),
				post_ID: $('#post_ID').val()
			},
			function(data) {
				$input.parents('.image-upload-helper').replaceWith(data);
			}
		);
	};

	$(document).ready( function() {
		$('body').on('click', 'a.image-upload-helper-set', function() {
			last_clicked = this;
		});
		$('body').on('click', 'a.image-upload-helper-remove', function() {
			var $div = $(this).parents('.image-upload-helper');
			var label = $div.find('.image-upload-helper-label').text();
			$div.find('a.image-upload-helper-set img').fadeOut(500, function() {
				$(this).parent().text('Set '+label);
				$(this).remove();
			});
			$div.find('input.image-upload-helper-input').val(0);
			$(this).remove();
		});
	});
})(jQuery,jQuery(window));