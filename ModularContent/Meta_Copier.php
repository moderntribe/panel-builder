<?php

namespace ModularContent;

/**
 * Class Meta_Copier
 *
 * Copies all the metadata from one post to another,
 * clearing out existing meta on the latter.
 */
class Meta_Copier {
	/**
	 * @param int $original_post
	 * @param int $destination_post
	 *
	 * @return void
	 */
	public function copy_meta( $original_post, $destination_post ) {
		$this->clear_meta( $destination_post );
		$post_meta_keys = get_post_custom_keys( $original_post );
		if ( empty( $post_meta_keys ) ) {
			return;
		}
		$meta_blacklist = $this->get_meta_key_blacklist( $original_post );
		$meta_keys      = array_diff( $post_meta_keys, $meta_blacklist );

		foreach ( $meta_keys as $meta_key ) {
			// bypass caching/filters to get raw values
			$meta_values = get_post_custom_values( $meta_key, $original_post );
			foreach ( $meta_values as $meta_value ) {
				$meta_value = maybe_unserialize( $meta_value ); // wp will reserialize it

				// use add_metadata instead of add_post_meta because the latter will
				// rewrite revision/autosave post IDs to the parent post ID
				add_metadata( 'post', $destination_post, $meta_key, $meta_value, false );
			}
		}
	}

	private function clear_meta( $post_id ) {
		$post_meta_keys = get_post_custom_keys( $post_id );
		$blacklist      = $this->get_meta_key_blacklist( $post_id );
		$post_meta_keys = array_diff( $post_meta_keys, $blacklist );
		foreach ( $post_meta_keys as $key ) {
			// use delete_metadata instead of delete_post_meta because the latter will
			// rewrite revision/autosave post IDs to the parent post ID
			delete_metadata( 'post', $post_id, $key );
		}
	}

	/**
	 * Get a list of meta which should not be copied.
	 * It will be left alone if it already exists on
	 * the destination post.
	 *
	 * @param int $post_id
	 * @return array
	 */
	private function get_meta_key_blacklist( $post_id ) {
		$list = array(
			'_edit_lock',
			'_edit_last',
		);

		return apply_filters( 'modular_content_meta_copier_blacklist', $list, $post_id );
	}
}

