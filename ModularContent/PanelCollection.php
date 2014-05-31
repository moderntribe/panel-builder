<?php


namespace ModularContent;

/**
 * Class PanelCollection
 *
 * @package ModularContent
 */
class PanelCollection implements \JsonSerializable {
	/** @var Panel[] */
	private $panels = array();

	public function add_panel( Panel $panel ) {
		$this->panels[] = $panel;
	}

	public function panels() {
		return $this->panels;
	}

	/**
	 * Render all panels in the collection to a string
	 *
	 * @return string
	 */
	public function render() {
		$renderer = new CollectionRenderer($this);
		return $renderer->render();
	}

	public function jsonSerialize() {
		return array(
			'panels' => $this->panels,
		);
	}

	public function to_json() {
		return json_encode($this->jsonSerialize());
	}

	public static function create_from_array( $data, $registry = NULL ) {
		$registry = $registry ? $registry : Plugin::instance()->registry();
		$collection = new self();
		if ( !empty($data['panels']) ) {
			foreach ( $data['panels'] as $p ) {
				if ( !is_array($p) ) {
					$p = json_decode($p, TRUE);
				}
				try {
					$type = $registry->get($p['type']);
					$panel = new Panel( $type, isset($p['data']) ? $p['data'] : array(), isset($p['depth']) ? $p['depth'] : 0 );
					$collection->add_panel($panel);
				} catch ( \Exception $e ) {
					// skip
				}
			}
		}
		return $collection;
	}

	public static function create_from_json( $json, $registry = NULL ) {
		$decoded = json_decode($json, TRUE);
		if ( $decoded === NULL ) {
			throw new \InvalidArgumentException( __('Cannot create a PanelCollection from invalid JSON', 'modular-content') );
		}
		return self::create_from_array( $decoded, $registry );
	}

	public static function find_by_post_id( $post_id, $registry = NULL ) {
		$post = get_post($post_id);
		$meta = $post->post_content_filtered;
		if ( empty($meta) ) {
			return new self();
		}
		try {
			return self::create_from_json($meta, $registry);
		} catch (\Exception $e) {
			return new self();
		}
	}
} 