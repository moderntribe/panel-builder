<?php


namespace ModularContent;

/**
 * Class PanelCollection
 *
 * @package ModularContent
 *
 * A collection of Panels.
 */
class PanelCollection implements \JsonSerializable {
	/** @var Panel[] */
	private $panels = array();

	/**
	 * Add a panel to this collection
	 *
	 * @param Panel $panel
	 *
	 * @return void
	 */
	public function add_panel( Panel $panel ) {
		$this->panels[] = $panel;
	}

	/**
	 * Get all the panels in this collection
	 *
	 * @return Panel[]
	 */
	public function panels() {
		return $this->panels;
	}


	/**
	 * Build a tree using the depth field of the panels in a collection
	 *
	 * @return Panel[]
	 */
	public function build_tree() {
		$tree = array();
		/** @var Panel[] $parents */
		$parents = array();
		$current_depth = 0;
		foreach ( $this->panels as $original_panel ) {
			$panel = clone( $original_panel );
			$type = $panel->get_type_object();
			$depth = $panel->get_depth();
			if ( $type->get_max_depth() < $depth || $depth > $current_depth + 1 ) {
				continue; // fell out of the tree
			}

			while ( $depth < $current_depth && $current_depth > 0 ) {
				unset($parents[$current_depth]);
				$current_depth--;
			}

			if ( $current_depth > 0 ) {
				$parents[$current_depth]->add_child($panel);
			} else {
				$tree[] = $panel;
			}

			if ( $type->get_max_children() > 0 ) {
				$current_depth++;
				$parents[$current_depth] = $panel;
			}
		}
		return $tree;
	}

	/**
	 * Render all panels in the collection to a string
	 *
	 * @return string
	 */
	public function render() {
		$loop = Plugin::instance()->loop();
		$loop->reset( $this );
		return $loop->render();
	}

	public function jsonSerialize() {
		return array(
			'panels' => $this->panels,
		);
	}

	public function to_json() {
		return \ModularContent\Util::json_encode($this->jsonSerialize());
	}

	/**
	 * Restore a panel collection from an array of panels
	 *
	 * @param array $data An associative array that should have JSON-encoded panels
	 *                    in an array at $data['panels']
	 * @param TypeRegistry $registry
	 *
	 * @return PanelCollection
	 */
	public static function create_from_array( $data, $registry = NULL ) {
		$registry = $registry ? $registry : Plugin::instance()->registry();
		$collection = new self();
		if ( !empty($data['panels']) ) {
			$panels = self::flatten_panel_list( $data, $registry );
			foreach ( $panels as $p ) {
				$collection->add_panel( $p );
			}
		}
		return $collection;
	}

	private static function flatten_panel_list( $data, TypeRegistry $registry ) {
		$panels = [];
		foreach ( $data[ 'panels' ] as $p ) {
			if ( !is_array($p) ) {
				$p = json_decode($p, TRUE);
			}
			try {
				$type = $registry->get($p['type']);
				$panels[] = new Panel( $type, isset($p['data']) ? $p['data'] : array(), isset($p['depth']) ? $p['depth'] : 0 );
				if ( isset( $p['panels'] ) && is_array( $p['panels'] ) ) {
					$panels = array_merge( $panels, self::flatten_panel_list( $p, $registry ) );
				}
			} catch ( \Exception $e ) {
				// skip
			}
		}
		return $panels;
	}

	/**
	 * Restore a panel collection that has been JSON encoded
	 *
	 * @param string $json
	 * @param TypeRegistry $registry
	 *
	 * @return PanelCollection
	 */
	public static function create_from_json( $json, $registry = NULL ) {
		$decoded = json_decode($json, TRUE);
		if ( $decoded === NULL ) {
			throw new \InvalidArgumentException( __('Cannot create a PanelCollection from invalid JSON', 'modular-content') );
		}
		return self::create_from_array( $decoded, $registry );
	}

	/**
	 * Get the panel collection saved to the given post
	 *
	 * @param int $post_id
	 * @param TypeRegistry $registry
	 *
	 * @return PanelCollection
	 */
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
