<?php


namespace ModularContent\Sets;


class Preview_Image_Meta_Box extends Panel_Set_Meta_Box {
	/**
	 * @param object $post The post being edited
	 *
	 * @return void
	 */
	public function render( $post ) {
		$set = new Set( $post->ID );
		$image_id = $set->get_preview_image_id();
		$field = new \AttachmentHelper\Field(array(
			'label' => __('preview image', 'tribe'),
			'value' => $image_id,
			'name'  => Set::META_KEY_PREVIEW_IMAGE_ID,
			'id'    => Set::META_KEY_PREVIEW_IMAGE_ID,
		));
		$field->render();
		printf('<p class="description">%s</p>', __('The image to use in to pop-up preview of the set', 'tribe') );
	}

	/**
	 * @param int $post_id The ID of the post being saved
	 * @param object $post The post being saved
	 *
	 * @return void
	 */
	protected function save( $post_id, $post ) {
		$set = new Set($post_id);
		$set->set_preview_image_id( $_POST[ Set::META_KEY_PREVIEW_IMAGE_ID ] );
	}

} 