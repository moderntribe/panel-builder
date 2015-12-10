<?php


namespace ModularContent\Fields;
use ModularContent\Panel;

/**
 * Class PostQuacker
 *
 * @package ModularContent\Fields
 *
 * A complex field for selecting a post, or making something that looks like one
 *
 * $field = new PostQuacker( array(
 *   'label' => __( 'Featured Post' ),
 *   'name' => 'featured-post',
 * ) );
 *
 * Returns an array with data for the selected post or the simulated post
 *
 * $post = get_panel_var( 'featured-post' );
 * $title = $post['title']; // the title of the post, or the value entered into the title field
 * $content = $post['content']; // the content of the post, or the value entered into the content field
 * $excerpt = $post['excerpt']; // the excerpt of the post, or the value entered into the content field
 * $image = $post['image']; // the post's featured image ID, or the ID of the image entered into the image field
 * $link = $post['link']; // an array with the url, label, and target to which this should link
 * $post_type = $post['post_type']; // the selected post's type, or empty if a simulated post
 * $post_id = $post['post_id']; // the selected post's ID, or 0 if a simulated post
 */
class PostQuacker extends Field {

	protected $default = '{ type: "manual", post_id: 0, title: "", content: "", image: 0, link: { url: "", target: "", label: "" } }';


	protected function render_opening_tag() {
		printf('<fieldset class="panel-input input-type-postquacker input-name-%s">', $this->esc_class($this->name));
	}

	protected function render_label() {
		if ( !empty($this->label) ) {
			printf('<legend class="panel-input-label">%s</legend>', $this->label);
		}
	}

	protected function render_closing_tag() {
		echo '</fieldset>';
	}

	protected function get_default_value_js() {
		return $this->default;
	}

	protected function render_description() {
		// do not render
	}

	public function render_field() {
		$input_name = $this->get_input_name();
		$input_value = sprintf("data.fields.%s", $this->name);
		$manual_fields = $this->get_manual_fields();
		include(\ModularContent\Plugin::plugin_path('admin-views/field-postquacker.php'));
		wp_enqueue_script( 'modular-content-posts-field', \ModularContent\Plugin::plugin_url('assets/scripts/js/fields/posts-field.js'), array('jquery', 'jquery-ui-tabs', 'select2'), FALSE, TRUE );
		wp_enqueue_style( 'jquery-ui' );
		wp_enqueue_style( 'select2' );
	}

	protected function get_manual_fields() {
		$fields = $this->get_manual_field_definitions();
		ob_start();
		foreach ( $fields as $f ) {
			$f->render();
		}
		return ob_get_clean();
	}

	protected function get_manual_field_definitions() {
		/** @var Field[] $fields */
		$fields = array(
			'title' => new Text( array( 'name' => $this->name.'.title', 'label' => __('Title', 'modular-content') ) ),
			'image' => new Image( array( 'name' => $this->name.'.image', 'label' => __('Image', 'modular-content') ) ),
			'content' => new TextArea( array( 'name' => $this->name.'.content', 'label' => __('Content', 'modular-content'), 'richtext' => TRUE ) ),
			'link' => new Link( array( 'name' => $this->name.'.link', 'label' => __('Link', 'modular-content') ) ),
		);
		return $fields;
	}

	public function get_vars( $data, $panel ) {
		if ( $data['type'] == 'manual' ) {
			$post_id = !empty($data['post_ids']) ? reset($data['post_ids']) : 0;
			$vars = $this->post_id_to_array( $post_id );
		} else {
			$fields = $this->get_manual_field_definitions();
			$vars = array();
			foreach ( $fields as $key => $f ) {
				if ( isset($data[$key]) ) {
					$vars[$key] = $f->get_vars($data[$key], $panel);
				} else {
					$vars[$key] = $f->get_vars('', $panel);
				}
			}
			$vars['excerpt'] = $vars['content'];
			$vars['post_type'] = '';
			$vars['post_id'] = 0;
		}

		$vars = apply_filters( 'panels_field_vars', $vars, $this, $panel );

		return $vars;
	}

	public function get_vars_for_api( $data, $panel ) {

		if ( $data['type'] == 'manual' ) {
			$post_id = ! empty( $data['post_ids'] ) ? reset( $data['post_ids'] ) : 0;
			$vars    = $this->post_id_to_array( $post_id );
		} else {
			$fields = $this->get_manual_field_definitions();
			$vars   = array();
			foreach ( $fields as $key => $f ) {
				if ( isset( $data[ $key ] ) ) {
					$vars[ $key ] = $f->get_vars_for_api( $data[ $key ], $panel );
				} else {
					$vars[ $key ] = $f->get_vars_for_api( '', $panel );
				}
			}
			$vars['excerpt']   = $vars['content'];
			$vars['post_type'] = '';
			$vars['post_id']   = 0;
		}


		$return_data = apply_filters( 'panels_field_vars_for_api', $vars, $data, $this, $panel );

		return $return_data;
	}

	protected function post_id_to_array( $post_id ) {
		$data = array(
			'title' => '',
			'content' => '',
			'excerpt' => '',
			'image' => 0,
			'link' => array(
				'url' => '',
				'target' => '',
				'label' => '',
			),
			'post_type' => '',
			'post_id' => 0,
		);
		if ( empty($post_id) ) {
			return $data;
		}

		global $post;
		$post = get_post( $post_id );
		setup_postdata($post);
		$data['title'] = get_the_title();
		$data['content'] = get_the_content();
		$data['excerpt'] = get_the_excerpt();
		$data['image'] = get_post_thumbnail_id();
		$data['link'] = array(
			'url' => get_permalink(),
			'target' => '',
			'label' => $data['title'],
		);
		$data['post_type'] = $post->post_type;
		$data['post_id'] = $post->ID;
		$_post = $post;
		wp_reset_postdata();

		return apply_filters( 'panel_post_id_to_array', $data, $post_id, $_post );
	}

	public function post_type_options() {
		$post_types = get_post_types(array('has_archive' => TRUE, 'public' => TRUE), 'objects', 'and');
		$post_types['post'] = get_post_type_object('post'); // posts are special
		unset($post_types['landing_page']); // because, really, why would you?
		$post_types = apply_filters('panels_query_post_type_options', $post_types, $this );
		return array_filter( $post_types );
	}
}