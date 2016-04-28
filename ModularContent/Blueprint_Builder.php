<?php


namespace ModularContent;


class Blueprint_Builder implements \JsonSerializable{
	/** @var TypeRegistry */
	private $registry;

	/** @var PanelType[] */
	private $registered_panels = [];

	public function __construct( TypeRegistry $registry ) {
		$this->registry = $registry;
	}

	public function get_blueprint( $for_post_type = null ) {
		$blueprint = [ ];
		$this->registered_panels = $this->registry->registered_panels( $for_post_type );
		foreach ( $this->registered_panels as $type ) {
			if ( $this->is_top_level( $type ) ) {
				$blueprint[] = $this->single_panel_type_blueprint( $type );
			}
		}
		return $blueprint;
	}

	private function is_top_level( PanelType $type ) {
		$allowed = $type->allowed_contexts();
		return empty( $allowed );
	}

	private function single_panel_type_blueprint( PanelType $type, $depth = 1 ) {
		$blueprint = [ ];
		$blueprint[ 'type' ] = $type->get_id();
		$blueprint[ 'label' ] = $type->get_label();
		$blueprint[ 'description' ] = $type->get_description();
		$blueprint[ 'icon' ] = [
			'active'   => $type->get_icon( 'active' ),
			'inactive' => $type->get_icon( 'inactive' ),
		];
		$blueprint[ 'fields' ] = $this->get_fields( $type );
		$blueprint[ 'children' ] = [
			'max'   => $type->get_max_children(),
			'label' => [
				'singular' => $type->get_child_label( 'singular' ),
				'plural'   => $type->get_child_label( 'plural' ),
			],
			'types' => $this->get_child_types( $type, $depth + 1 ),
		];

		return $blueprint;
	}

	private function get_fields( PanelType $type ) {
		$fields = [];
		foreach( $type->all_fields() as $field ) {
			$fields[] = $field->get_blueprint();
		}
		return $fields;
	}

	private function get_child_types( PanelType $parent, $depth ) {
		$children = [];
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
		return $this->get_blueprint();
	}


}