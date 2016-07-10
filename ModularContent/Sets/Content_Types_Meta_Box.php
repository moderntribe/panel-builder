<?php


namespace ModularContent\Sets;


class Content_Types_Meta_Box extends Panel_Set_Meta_Box {
	/**
	 * @param object $post The post being edited
	 *
	 * @return void
	 */
	public function render( $post ) {
		$set = new Set( $post->ID );
		$supported_post_types = $set->get_post_types();
		$all_post_types = $this->get_all_post_types();
		foreach ( $all_post_types as $post_type ) {
			printf( '<p><label><input type="checkbox" name="%s[%s]" value="1" %s /> <span>%s</span></label>',
				esc_attr( Set::META_KEY_POST_TYPES ),
				esc_attr( $post_type ),
				checked( in_array( $post_type, $supported_post_types ), TRUE, FALSE ),
				esc_html( $this->get_post_type_label( $post_type ) )
			);
		}
		printf('<p class="description">%s</p>', __('All post types will be supported if all are unchecked', 'tribe') );
	}

	private function get_all_post_types() {
		$post_types = get_post_types();
		$support_panels = array();
		foreach ( $post_types as $pt ) {
			if ( post_type_supports( $pt, 'modular-content' ) ) {
				$support_panels[] = $pt;
			}
		}
		return $support_panels;
	}

	private function get_post_type_label( $post_type_id ) {
		$post_type_object = get_post_type_object( $post_type_id );
		return $post_type_object->label;
	}

	/**
	 * @param int $post_id The ID of the post being saved
	 * @param object $post The post being saved
	 *
	 * @return void
	 */
	protected function save( $post_id, $post ) {
		$post_types = array();
		if ( !empty($_POST[Set::META_KEY_POST_TYPES]) ) {
			foreach ( $_POST[Set::META_KEY_POST_TYPES] as $key => $value ) {
				if ( $value ) {
					$post_types[] = $key;
				}
			}
		}
		$set = new Set($post_id);
		$set->set_post_types( $post_types );
	}

} 