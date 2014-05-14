/**
 * Override the default WPSetAsThumbnail function to use our custom callback
 *
 * @param id
 * @param nonce
 */
WPSetAsThumbnail = function(id, nonce) {
	var win = window.dialogArguments || opener || parent || top;
	win.ImageHelperSetImageID(id);
	win.tb_remove();
};

IUP_updateMediaForm = function() {
	var $ = jQuery;
	$('.savesend :submit.button').val(ImageUploadHelper.label).click( function() {
		var name = $(this).attr('name');
		WPSetAsThumbnail(name.substring(5, name.length-1));
		return false;
	});
	$('a.wp-post-thumbnail').hide().click( function() { return false; });
	$('table.describe').find('tr.post_excerpt, tr.post_content, tr.url, tr.align, tr.image-size, tr.exclude-from-gallery').hide();

	// carry over settings when using the search box
	$('#media-search').parents('form').each( function() {
		var form = $(this);
		if ( form.find('input[name=image-upload-helper]').length < 1 ) {
			var input = $('<input type="hidden" name="image-upload-helper" />');
			input.val(ImageUploadHelper.short_label);
			form.append(input);
		}
	});
};

IUP_original_updateMediaForm = updateMediaForm;
updateMediaForm = function () {
	IUP_original_updateMediaForm();
	IUP_updateMediaForm();
};

jQuery(document).ready(IUP_updateMediaForm);