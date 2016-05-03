<?php


namespace ModularContent;


use Codeception\TestCase\WPTestCase;
use ModularContent\Fields\Image;
use ModularContent\Fields\ImageSelect;
use ModularContent\Fields\Link;
use ModularContent\Fields\Post_List;
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
		$fields = $blueprint[ 0 ][ 'fields' ];
		$this->assertCount( 2, $fields );
		$this->assertEquals( 'ModularContent\Fields\Title', $fields[ 0 ][ 'type' ] );
		$this->assertEquals( 'ModularContent\Fields\Text', $fields[ 1 ][ 'type' ] );
	}

	/**
	 * One of the main goals of this method is to build
	 * a JSON file out of all the standard field type
	 * and save them to _data/blueprint.json, as well as
	 * some sample data populating those fields for front-end
	 * testing.
	 */
	public function test_build_json() {
		$registry = new TypeRegistry();
		$collection = new PanelCollection();

		$this->register_contentgrid( $registry );
		$this->add_sample_contentgrid( $collection, $registry->get( 'contentgrid' ) );
		$this->register_gallery( $registry );
		$this->add_sample_gallery( $collection, $registry->get( 'gallery' ) );
		$this->register_imagetext( $registry );
		$this->add_sample_imagetext( $collection, $registry->get( 'imagetext' ) );
		$this->register_micronav( $registry );
		$this->add_sample_micronav( $collection, $registry->get( 'micronav' ) );
		$this->register_wysiwyg( $registry );
		$this->register_tabgroup( $registry );
		$this->add_sample_tabgroup( $collection, $registry->get( 'tabgroup' ), $registry->get( 'wysiwyg' ) );
		$this->add_sample_wysiwyg( $collection, $registry->get( 'wysiwyg' ) );

		$builder = new Blueprint_Builder( $registry );
		$json = json_encode( $builder, JSON_PRETTY_PRINT | JSON_PARTIAL_OUTPUT_ON_ERROR );
		$output_file = codecept_data_dir() . '/blueprint.json';
		$return = file_put_contents( $output_file, $json );
		$this->assertNotEmpty( $return, 'no data written to blueprint.json' );

		$samples = json_encode( $collection, JSON_PRETTY_PRINT | JSON_PARTIAL_OUTPUT_ON_ERROR );
		$output_file = codecept_data_dir() . '/sample_panels.json';
		$return = file_put_contents( $output_file, $samples );
		$this->assertNotEmpty( $return, 'no data written to sample_panels.json' );
	}

	private function register_contentgrid( TypeRegistry $registry ) {
		$panel = new PanelType( 'contentgrid' );
		$panel->set_label( 'Content Grid' );
		$panel->set_description( 'A grid of content with 2 layouts.' );
		$panel->set_icon( 'module-contentgrid.png', 'inactive' );
		$panel->set_icon( 'module-contentgrid.png', 'active' );

		// Panel Style
		$panel->add_field( new Fields\ImageSelect( [
			'name'    => 'layout',
			'label'   => 'Style',
			'options' => [
				'standard' => 'module-contentgrid-standard.png',
				'cards'    => 'module-contentgrid-cards.png',
				'full'     => 'module-contentgrid-full.png',
			],
			'default' => 'standard',
		] ) );

		// Panel Description
		$panel->add_field( new TextArea( [
			'name'  => 'content',
			'label' => 'Description',
		] ) );

		// Grid Columns
		/** @var Fields\Group $columns */
		$columns = new Repeater( [
			'label'            => 'Content Blocks',
			'name'             => 'columns',
			'min'              => 2,
			'max'              => 4,
			'new_button_label' => 'Add Content Block',
		] );

		// Column Title
		$columns->add_field( new Text( [
			'name'  => 'title',
			'label' => 'Column Title',
		] ) );

		// Column Text
		$columns->add_field( new TextArea( [
			'name'     => 'text',
			'label'    => 'Column Text',
			'richtext' => true,
		] ) );

		// Column CTA Link
		$columns->add_field( new Link( [
			'name'  => 'cta',
			'label' => 'Call To Action Link',
		] ) );

		// Column CTA Link Style
		$columns->add_field( new ImageSelect( [
			'name'    => 'cta_style',
			'label'   => 'Call To Action Link Style',
			'options' => [
				'text'   => 'link-style-text.png',
				'button' => 'link-style-button.png',
			],
			'default' => 'text',
		] ) );

		// Repeater Fields
		$panel->add_field( $columns );

		$registry->register( $panel );
	}

	private function add_sample_contentgrid( PanelCollection $collection, PanelType $type ) {
		$panel = new Panel( $type, [
			'title' => 'Sample Content Grid',
		  'layout' => 'cards',
		  'content' => 'Content Grid Content',
		  'columns' => [
			  [
				  'title' => 'Column One',
			    'text' => 'This goes in column one',
			  ],
		    [
			    'title' => 'Column Two',
		      'text' => 'An image in column two: <img width="300" height="250" src="http://griddle.tri.be/?w=300&h=250" />',
		    ],
		    [
			    'title' => 'Column Three',
		      'text' => '',
			  ],
		  ],
		  'cta' => [
			  'url' => 'http://tri.be/',
		    'target' => '',
		    'label' => 'Modern Tribe',
		  ],
		  'cta_style' => [
			  'button',
		  ],
		], 0 );
		$collection->add_panel( $panel );
	}

	private function register_gallery( TypeRegistry $registry ) {

		$panel = new PanelType( 'gallery' );
		$panel->set_label( 'Gallery' );
		$panel->set_description( 'An image gallery slider.' );
		$panel->set_icon( 'module-gallery.png', 'inactive' );
		$panel->set_icon( 'module-gallery.png', 'active' );

		// Panel Description
		$panel->add_field( new Fields\TextArea( [
			'name'  => 'content',
			'label' => 'Description',
		] ) );

		// ImageGallery
		$panel->add_field( new Fields\ImageGallery( [
			'label' => 'Image Gallery',
			'name'  => 'gallery',
		] ) );

		$registry->register( $panel );
	}

	private function add_sample_gallery( PanelCollection $collection, PanelType $type ) {
		$panel = new Panel( $type, [
			'title' => 'Some Images',
		  'content' => 'A caption to go with the gallery',
		  'gallery' => [
			  [
				  'id' => 12345,
			    'thumbnail' => 'http://griddle.tri.be/?w=300&h=250',
			  ],
			  [
				  'id' => 12346,
				  'thumbnail' => 'http://griddle.tri.be/?w=350&h=250',
			  ],
			  [
				  'id' => 12347,
				  'thumbnail' => 'http://griddle.tri.be/?w=400&h=250',
			  ],
			  [
				  'id' => 12348,
				  'thumbnail' => 'http://griddle.tri.be/?w=450&h=250',
			  ],
		  ],
		]);
		$collection->add_panel( $panel );
	}

	private function register_imagetext( TypeRegistry $registry ) {

		$panel = new PanelType( 'imagetext' );

		$panel->set_label( 'Image+Text' );
		$panel->set_description( 'An image and text with several layout options.' );
		$panel->set_icon( 'module-imagetext.png', 'inactive' );
		$panel->set_icon( 'module-imagetext.png', 'active' );
		$panel->set_max_depth( 2 );

		// Panel Layout
		$panel->add_field( new ImageSelect( [
			'name'    => 'layout',
			'label'   => 'Layout',
			'options' => [
				'image-right' => 'module-imagetext-right.png',
				'image-left'  => 'module-imagetext-left.png',
				'boxed'       => 'module-imagetext-boxed.png',
				'hero'        => 'module-imagetext-hero.png',
			],
			'default' => 'image-right',
		] ) );

		// Content
		$panel->add_field( new TextArea( [
			'name'     => 'content',
			'label'    => 'Description',
			'richtext' => true,
		] ) );

		// Image
		$panel->add_field( new Image( [
			'name'        => 'image',
			'label'       => 'Image',
			'description' => 'Optimal image sizes: 1500 x 1125 for Left/Right Aligned layouts; 1500 x 844 for Boxed/Hero layouts.',
			'size'        => 'medium', // the size displayed in the admin
		] ) );

		// Image Overlay
		$panel->add_field( new ImageSelect( [
			'name'        => 'overlay',
			'label'       => 'Image Overlay',
			'description' => 'Apply a color over the image to improve text visibility. Only applies to Boxed/Hero layouts.',
			'options'     => [
				'none'      => 'module-imagetext-none.png',
				'tint'      => 'module-imagetext-tint.png',
				'primary'   => 'module-imagetext-blue.png',
				'secondary' => 'module-imagetext-orange.png',
			],
			'default'     => 'none',
		] ) );

		// CTA Link
		$panel->add_field( new Link( [
			'name'  => 'cta',
			'label' => 'Call To Action Link',
		] ) );

		// CTA Link Style
		$panel->add_field( new ImageSelect( [
			'name'    => 'cta_style',
			'label'   => 'Call To Action Link Style',
			'options' => [
				'text'   => 'link-style-text.png',
				'button' => 'link-style-button.png',
			],
			'default' => 'text',
		] ) );

		$registry->register( $panel );
	}

	private function add_sample_imagetext( PanelCollection $collection, PanelType $type ) {
		$panel = new Panel( $type, [
			'title' => 'Sample Image + Text Panel',
		  'layout' => 'boxed',
		  'content' => '',
		  'image' => 1234,
		  'overlay' => 'tint',
		  'cta' => [
			  'url' => 'http://tri.be',
		    'target' => '_blank',
		    'label' => 'Visit the Tribe',
		  ],
		  'cta_style' => [
			  'text',
		  ],
		]);
		$collection->add_panel( $panel );
	}

	private function register_micronav( TypeRegistry $registry ) {
		$panel = new PanelType( 'micronav' );

		$panel->set_label( 'MicroNav' );
		$panel->set_description( 'Display a set of links and related content.' );
		$panel->set_icon( 'module-micronav.png', 'inactive' );
		$panel->set_icon( 'module-micronav.png', 'active' );

		// Panel Layout
		$panel->add_field( new ImageSelect( array(
			'name'      => 'layout',
			'label'     => 'Style',
			'options'   => array(
				'buttons'   => 'module-micronav-buttons.png',
				'list'      => 'module-micronav-list.png',
			),
			'default' => 'buttons',
		) ) );

		// Optional Content
		$panel->add_field( new TextArea( array(
			'name'      => 'content',
			'label'     => 'Content',
			'richtext'  => true
		) ) );

		$panel->add_field( new Post_List( array(
			'name' => 'items',
			'label' => 'Links',
			'max' => 12,
			'min' => 1,
			'suggested' => 3,
			'show_max_control' => true,
			'hidden_fields' => [ 'post_content', 'thumbnail_id' ],
			'strings' => [
				'button.create_content' => 'Add Link',
			]
		) ) );
		
		$registry->register( $panel );
	}

	private function add_sample_micronav( PanelCollection $collection, PanelType $type ) {
		$panel = new Panel( $type, [
			'title' => 'Some Links',
		  'layout' => 'list',
		  'content' => 'Preface to the links',
		  'items' => [
			  'type' => 'manual',
		    'posts' => [],
		    'filters' => [],
		    'max' => 0,
		  ],
		]);
		$collection->add_panel( $panel );
	}

	private function register_wysiwyg( TypeRegistry $registry ) {
		$panel = new PanelType( 'wysiwyg' );

		$panel->set_label( 'WYSIWYG Editor' );
		$panel->set_description( 'Displays custom content' );
		$panel->set_icon( 'module-wysiwyg.png', 'inactive' );
		$panel->set_icon( 'module-wysiwyg.png', 'active' );
		$panel->set_max_depth( 2 );

		// Field: Editor Columns
		$group = new Fields\Repeater( array(
			'label'            => 'Columns',
			'name'             => 'repeater',
			'min'              => 1,
			'max'              => 3,
			'new_button_label' => 'Add Column'
		) );

		$group->add_field( new Fields\TextArea( array(
			'label'    => 'Column',
			'name'     => 'column',
			'richtext' => true
		) ) );

		$panel->add_field( $group );
		
		$registry->register( $panel );
	}

	private function add_sample_wysiwyg( PanelCollection $collection, PanelType $type ) {
		$panel = new Panel( $type, [
			'title' => 'Wysiwyg Panel',
		  'repeater' => [
			  [
				  'column' => 'Column 1 Content',
			  ],
			  [
				  'column' => 'Column 2 Content',
			  ],
		  ]
		]);
		$collection->add_panel( $panel );
	}

	private function register_tabgroup( TypeRegistry $registry ) {
		$panel = new PanelType( 'tabgroup' );

		$panel->set_label( 'Tab Group' );
		$panel->set_description( 'Displays a group of panels as tabs' );
		$panel->set_icon( 'module-tabgroup.png', 'inactive' );
		$panel->set_icon( 'module-tabgroup.png', 'active' );
		$panel->set_max_children( 6 );

		$registry->register( $panel );
	}

	private function add_sample_tabgroup( PanelCollection $collection, PanelType $parent, PanelType $child ) {
		$tabs = new Panel( $parent, [ 'title' => 'A group of tabs' ] );
		$collection->add_panel( $tabs );

		$child_1 = new Panel( $child, [
			'title' => 'Wysiwyg Panel 1',
			'repeater' => [
				[
					'column' => 'Column 1 Content',
				],
				[
					'column' => 'Column 2 Content',
				],
			]
		], 1 );
		$collection->add_panel( $child_1 );

		$child_2 = new Panel( $child, [
			'title' => 'Wysiwyg Panel 2',
			'repeater' => [
				[
					'column' => 'Column 1 Content',
				],
			]
		], 1 );
		$collection->add_panel( $child_2 );
	}

} 