<?php


namespace ModularContent;


use Codeception\TestCase\WPTestCase;
use ModularContent\Fields\ImageSelect;
use ModularContent\Fields\Link;
use ModularContent\Fields\Repeater;
use ModularContent\Fields\Text;
use ModularContent\Fields\TextArea;

class Blueprint_Builder_Test extends WPTestCase {
	public function test_basic_blueprint() {
		$registry = new TypeRegistry();
		$type = new PanelType( 'test_type' );
		$type->set_label( 'Test Panel' );
		$type->set_description( 'A test panel' );
		$type->set_icon( 'active_icon.png', 'active' );
		$type->set_icon( 'inactive_icon.png', 'inactive' );
		$type->set_max_children( 6 );
		$registry->register( $type );

		$builder = new Blueprint_Builder( $registry );
		$blueprint = $builder->get_blueprint();

		$expected = [
			[
				'type'        => 'test_type',
				'label'       => 'Test Panel',
				'description' => 'A test panel',
				'icon'        => [
					'active'   => 'active_icon.png',
					'inactive' => 'inactive_icon.png',
				],
				'fields'      => [
					[
						'type'        => 'ModularContent\Fields\Title',
						'label'       => 'Title',
						'name'        => 'title',
						'description' => '',
						'strings'     => [ ],
						'default'     => '',
					],
				],
				'children'    => [
					'max'   => 6,
					'label' => [
						'singular' => 'Module',
						'plural'   => 'Modules',
					],
					'types' => [ ],
				],
			],
		];

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_nested_blueprint() {
		$registry = new TypeRegistry();
		$type = new PanelType( 'test_type' );
		$type->set_label( 'Test Panel' );
		$type->set_description( 'A test panel' );
		$type->set_icon( 'active_icon.png', 'active' );
		$type->set_icon( 'inactive_icon.png', 'inactive' );
		$type->set_max_children( 6 );
		$registry->register( $type );

		$child = new PanelType( 'test_child' );
		$child->set_label( 'Test Child' );
		$child->set_description( 'A child panel' );
		$child->set_icon( 'active_child.png', 'active' );
		$child->set_icon( 'inactive_child.png', 'inactive' );
		$child->set_max_depth( 2 );
		$child->set_context( 'test_type', true );
		$registry->register( $child );

		$builder = new Blueprint_Builder( $registry );
		$blueprint = $builder->get_blueprint();

		$expected = [
			[
				'type'        => 'test_type',
				'label'       => 'Test Panel',
				'description' => 'A test panel',
				'icon'        => [
					'active'   => 'active_icon.png',
					'inactive' => 'inactive_icon.png',
				],
				'fields'      => [
					[
						'type'        => 'ModularContent\Fields\Title',
						'label'       => 'Title',
						'name'        => 'title',
						'description' => '',
						'strings'     => [ ],
						'default'     => '',
					],
				],
				'children'    => [
					'max'   => 6,
					'label' => [
						'singular' => 'Module',
						'plural'   => 'Modules',
					],
					'types' => [
						[
							'type'        => 'test_child',
							'label'       => 'Test Child',
							'description' => 'A child panel',
							'icon'        => [
								'active'   => 'active_child.png',
								'inactive' => 'inactive_child.png',
							],
							'fields'      => [
								[
									'type'        => 'ModularContent\Fields\Title',
									'label'       => 'Title',
									'name'        => 'title',
									'description' => '',
									'strings'     => [ ],
									'default'     => '',
								],
							],
							'children'    => [
								'max'   => 0,
								'label' => [
									'singular' => 'Module',
									'plural'   => 'Modules',
								],
								'types' => [ ],
							],
						],
					],
				],
			],
		];

		$this->assertCount( 1, $blueprint, 'only one top-level panel type expected' );
		$this->assertEquals( $expected, $blueprint );
	}


	public function test_forbidden_nested_panel() {
		$registry = new TypeRegistry();
		$type = new PanelType( 'test_type' );
		$type->set_label( 'Test Panel' );
		$type->set_description( 'A test panel' );
		$type->set_icon( 'active_icon.png', 'active' );
		$type->set_icon( 'inactive_icon.png', 'inactive' );
		$type->set_max_children( 6 );
		$registry->register( $type );

		$child = new PanelType( 'test_child' );
		$child->set_label( 'Test Child' );
		$child->set_description( 'A child panel' );
		$child->set_icon( 'active_child.png', 'active' );
		$child->set_icon( 'inactive_child.png', 'inactive' );
		$child->set_max_depth( 2 );
		$child->set_context( 'test_type', false );
		$child->set_context( 'test_child', false );
		$registry->register( $child );

		$builder = new Blueprint_Builder( $registry );
		$blueprint = $builder->get_blueprint();

		$this->assertCount( 2, $blueprint, 'two top-level panel types expected' );
		$this->assertCount( 0, $blueprint[ 0 ][ 'children' ][ 'types' ], 'not expecting a child panel type' );
		$this->assertCount( 0, $blueprint[ 1 ][ 'children' ][ 'types' ], 'not expecting a child panel type' );
	}

	public function test_recursive_nested_panel() {
		$registry = new TypeRegistry();
		$type = new PanelType( 'test_type' );
		$type->set_label( 'Test Panel' );
		$type->set_description( 'A test panel' );
		$type->set_icon( 'active_icon.png', 'active' );
		$type->set_icon( 'inactive_icon.png', 'inactive' );
		$type->set_max_children( 6 );
		$type->set_max_depth( 6 );
		$registry->register( $type );

		$builder = new Blueprint_Builder( $registry );
		$blueprint = $builder->get_blueprint();

		$this->assertCount( 1, $blueprint, 'one top-level panel type expected' );

		$top = $blueprint;
		for ( $i = 0; $i < 5; $i++ ) {
			$this->assertCount( 1, $top[ 0 ][ 'children' ][ 'types' ], 'expecting a child panel type' );
			$this->assertEquals( 'test_type', $top[ 0 ][ 'children' ][ 'types' ][ 0 ][ 'type' ], 'expecting a child panel type' );
			$top = $top[ 0 ][ 'children' ][ 'types' ];
		}
		$this->assertCount( 0, $top[ 0 ][ 'children' ][ 'types' ], 'not expecting a child panel type' );
	}

	public function test_fields() {
		$registry = new TypeRegistry();
		$type = new PanelType( 'test_type' );
		$type->set_label( 'Test Panel' );
		
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$default = __LINE__;
		$type->add_field( new Text( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'default'     => $default,
		] ) );

		$registry->register( $type );

		$builder = new Blueprint_Builder( $registry );
		$blueprint = $builder->get_blueprint();

		$this->assertCount( 1, $blueprint );
		$fields = $blueprint[0]['fields'];
		$this->assertCount( 2, $fields );
		$this->assertEquals( 'ModularContent\Fields\Title', $fields[0]['type'] );
		$this->assertEquals( 'ModularContent\Fields\Text', $fields[1]['type'] );
	}

	/**
	 * One of the main goals of this method is to build
	 * a JSON file out of all the standard field type
	 * and save them to _data/blueprint.json for front-end
	 * testing.
	 */
	public function test_build_json() {
		$registry = new TypeRegistry();

		$contentgrid = new PanelType( 'contentgrid' );
		$contentgrid->set_label( 'Content Grid' );
		$contentgrid->set_description( 'A grid of content with 2 layouts.' );
		$contentgrid->set_icon( 'module-contentgrid.png', 'inactive' );
		$contentgrid->set_icon( 'module-contentgrid.png', 'active' );

		// Panel Style
		$contentgrid->add_field( new Fields\ImageSelect( array(
			'name'      => 'layout',
			'label'     => 'Style',
			'options'   => array(
				'standard'  => 'module-contentgrid-standard.png',
				'cards'     => 'module-contentgrid-cards.png',
				'full'      => 'module-contentgrid-full.png',
			),
			'default' => 'standard',
		) ) );

		// Panel Description
		$contentgrid->add_field( new TextArea( array(
			'name'      => 'content',
			'label'     => 'Description',
		) ) );

		// Grid Columns
		/** @var Fields\Group $columns */
		$columns = new Repeater( array(
			'label'            => 'Content Blocks',
			'name'             => 'columns',
			'min'              => 2,
			'max'              => 4,
			'new_button_label' => 'Add Content Block',
		) );

		// Column Title
		$columns->add_field( new Text( array(
			'name'      => 'title',
			'label'     => 'Column Title',
		) ) );

		// Column Text
		$columns->add_field( new TextArea( array(
			'name'      => 'text',
			'label'     => 'Column Text',
			'richtext'  => true
		) ) );

		// Column CTA Link
		$columns->add_field( new Link( array(
			'name'      => 'cta',
			'label'     => 'Call To Action Link',
		) ) );

		// Column CTA Link Style
		$columns->add_field( new ImageSelect( array(
			'name'      => 'cta_style',
			'label'     => 'Call To Action Link Style',
			'options'   => array(
				'text'      => 'link-style-text.png',
				'button'    => 'link-style-button.png',
			),
			'default' => 'text',
		) ) );

		// Repeater Fields
		$contentgrid->add_field( $columns );

		$registry->register( $contentgrid );

		$builder = new Blueprint_Builder( $registry );
		$json = json_encode( $builder, JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR );
		$output_file = codecept_data_dir() . '/blueprint.json';
		file_put_contents( $output_file, $json );
	}

} 