<?php


namespace ModularContent;


use ModularContent\Sets\Set;

class Blueprint_Builder implements \JsonSerializable {
	/** @var TypeRegistry */
	private $registry;

	/** @var PanelType[] */
	private $registered_panels = [ ];

	public function __construct( TypeRegistry $registry ) {
		$this->registry = $registry;
	}

	public function get_blueprint( $for_post_type = null ) {
		$blueprint = [
			'types'      => [ ],
			'categories' => array_values( $this->registry->registered_categories() ),
		];
		$this->registered_panels = $this->registry->registered_panels( $for_post_type );
		
		$this->registered_panels = apply_filters('panels_registered_panels', $this->registered_panels, $for_post_type);

		foreach ( $this->registered_panels as $type ) {
			if ( $this->is_top_level( $type ) ) {
				$blueprint[ 'types' ][] = $this->single_panel_type_blueprint( $type );
			}
		}
		
		return $blueprint;
	}

	private function is_top_level( PanelType $type ) {
		$allowed = $type->allowed_contexts();
		return empty( $allowed );
	}

	private function single_panel_type_blueprint( PanelType $type, $depth = 0 ) {
		$blueprint = [ ];
		$blueprint[ 'type' ] = $type->get_id();
		$blueprint[ 'label' ] = $type->get_label();
		$blueprint[ 'description' ] = $type->get_description();
		$blueprint[ 'thumbnail' ] = $type->get_thumbnail();
		$blueprint[ 'fields' ] = $this->get_fields( $type );
		$blueprint[ 'settings_fields' ] = $type->get_settings_field_names();
		$blueprint[ 'children' ] = [
			'max'   => $type->get_max_children(),
			'label' => [
				'singular' => $type->get_string( 'child.singular' ),
				'plural'   => $type->get_string( 'child.plural' ),
				'add'      => $type->get_string( 'child.add' ),
				'delete'   => $type->get_string( 'child.delete' ),
			],
			'types' => $this->get_child_types( $type, $depth + 1 ),
		];

		return $blueprint;
	}

	private function get_fields( PanelType $type ) {
		$fields = [ ];
		foreach ( $type->all_fields() as $field ) {
			$fields[] = $field->get_blueprint();
		}
		return $fields;
	}

	private function get_child_types( PanelType $parent, $depth ) {
		$children = [ ];
		$parent_id = $parent->get_id();
		foreach ( $this->registered_panels as $type ) {
			$max_depth = $type->get_max_depth();
			$allowed = $type->allowed_contexts();
			$forbidden = $type->forbidden_contexts();

			if ( $max_depth < $depth ) {
				continue; // too deep
			}
			if ( !empty( $allowed ) && !in_array( $parent_id, $allowed ) ) {
				continue; // not an allowed context
			}
			if ( !empty( $forbidden ) && in_array( $parent_id, $forbidden ) ) {
				continue; // not an allowed context
			}

			$children[] = $this->single_panel_type_blueprint( $type, $depth );
		}
		return $children;
	}

	public function jsonSerialize() {
		$type = $this->get_current_post_type();
		$blueprint = $this->get_blueprint( $type );
		foreach ( $blueprint[ 'types' ] as $index => $panel ) {
			$blueprint[ 'types' ][ $index ] = $this->normalize_string_arrays( $panel );
		}
		return $blueprint;
	}

	private function get_current_post_type() {
		$type = null;
		if ( ! is_admin() ) {
			return $type;
		}
		global $pagenow;
		if ( ! in_array( $pagenow, array( 'post.php', 'post-new.php' ), true ) ) {
			return $type;
	  	}
		$type = get_post_type( get_queried_object_id() );

		// Return null so all panel types are available to Panel Sets.
		if ( Set::POST_TYPE === $type ) {
			return null;
		}
		return $type;
	}

	private function normalize_string_arrays( $blueprint ) {
		foreach ( $blueprint[ 'fields' ] as $index => $field ) {
			$field[ 'strings' ] = (object)$field[ 'strings' ];
			if ( isset( $field[ 'fields' ] ) ) {
				$field = $this->normalize_string_arrays( $field );
			}
			if ( isset( $blueprint[ 'children' ][ 'types' ] ) ) {
				foreach ( $blueprint[ 'children' ][ 'types' ] as $child_index => $child ) {
					$blueprint[ 'children' ][ 'types' ][ $child_index ] = $this->normalize_string_arrays( $child );
				}
			}
			$blueprint[ 'fields' ][ $index ] = $field;
		}
		return $blueprint;
	}


}