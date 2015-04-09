<?php


namespace ModularContent;

/**
 * Class TypeRegistry
 *
 * @package ModularContent
 *
 * A collection of registered panel types.
 */
class TypeRegistry {

	/** @var PanelType[] */
	private $types = array();

	private $post_type_map = array();

	/**
	 * Register a panel type.
	 *
	 * @param PanelType $type The type the register
	 * @param array|string $post_type An optional array of post types the type will be limited to
	 *
	 * @return void
	 * @throws \InvalidArgumentException
	 */
	public function register( PanelType $type, $post_type = array() ) {
		if ( isset($this->types[$type->id]) ) {
			throw new \InvalidArgumentException(sprintf(__('PanelType "%s" already registered', 'modular-content'), $type->id));
		}
		$this->types[$type->id] = $type;
		$post_type = $this->normalize_post_type($post_type);
		$this->add_to_post_type_map($type->id, $post_type);
	}

	/**
	 * Convert empty or string post types to an array
	 *
	 * @param string $post_type
	 * @return array
	 */
	private function normalize_post_type( $post_type ) {
		if ( empty($post_type) ) {
			$post_type = array('all');
		} elseif ( !is_array($post_type) ) {
			$post_type = array($post_type);
		}
		return $post_type;
	}

	/**
	 * Maintain a mapping of panel IDs available for each post type
	 *
	 * @param string $type_id
	 * @param array $post_types
	 *
	 * @return void
	 */
	private function add_to_post_type_map( $type_id, $post_types ) {
		foreach ( $post_types as $pt ) {
			$this->post_type_map[$pt][] = $type_id;
		}
	}

	/**
	 * Remove a panel type from the registry
	 *
	 * @param string $type_id
	 * @return void
	 */
	public function unregister( $type_id ) {
		unset($this->types[$type_id]);
	}

	/**
	 * Get a registered panel type object
	 *
	 * @param string $type_id
	 * @return PanelType
	 * @throws \RuntimeException
	 */
	public function get( $type_id ) {
		if ( isset($this->types[$type_id]) ) {
			return $this->types[$type_id];
		}
		throw new \RuntimeException(sprintf(__('Retrieving an unregistered panel type: %s', 'modular-content'), $type_id));
	}

	/**
	 * @param string|array|null $for_post_type
	 *
	 * @return PanelType[] All panel types available for the given post type, or all registered panel types if NULL is given.
	 */
	public function registered_panels( $for_post_type = NULL ) {
		if ( $for_post_type === NULL ) {
			return $this->types;
		}
		$for_post_type = $this->normalize_post_type($for_post_type);
		if ( !in_array('all', $for_post_type) ) {
			$for_post_type[] = 'all';
		}
		$types = array();
		foreach ( $for_post_type as $pt ) {
			if ( isset($this->post_type_map[$pt]) ) {
				foreach ( $this->post_type_map[$pt] as $panel_type_id ) {
					try {
						$types[] = $this->get($panel_type_id);
					} catch (\Exception $e) {
						// ignore
					}
				}
			}
		}
		return array_unique($types);
	}
} 