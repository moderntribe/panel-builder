<?php


namespace ModularContent;


class TypeRegistry {

	/** @var PanelType[] */
	private $types = array();

	private $post_type_map = array();

	/**
	 * @param PanelType $type
	 * @param array|string $post_type
	 *
	 * @return void
	 * @throws \InvalidArgumentException
	 */
	public function register( PanelType $type, $post_type = array() ) {
		if ( isset($this->types[$type->id]) ) {
			throw new \InvalidArgumentException(sprintf(__('Panel Type "%s" already registered', 'panels'), $type->id));
		}
		$this->types[$type->id] = $type;
		$post_type = $this->normalize_post_type($post_type);
		$this->add_to_post_type_map($type->id, $post_type);
	}

	private function normalize_post_type( $post_type ) {
		if ( empty($post_type) ) {
			$post_type = array('all');
		} elseif ( !is_array($post_type) ) {
			$post_type = array($post_type);
		}
		return $post_type;
	}

	private function add_to_post_type_map( $type_id, $post_types ) {
		foreach ( $post_types as $pt ) {
			$this->post_type_map[$pt][] = $type_id;
		}
	}

	public function unregister( $type_id ) {
		unset($this->types[$type_id]);
	}

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