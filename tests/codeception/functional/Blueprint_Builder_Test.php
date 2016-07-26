<?php


namespace ModularContent;


use Codeception\TestCase\WPTestCase;
use ModularContent\Fields\Checkbox;
use ModularContent\Fields\Group;
use ModularContent\Fields\Hidden;
use ModularContent\Fields\HTML;
use ModularContent\Fields\Image;
use ModularContent\Fields\ImageGallery;
use ModularContent\Fields\ImageSelect;
use ModularContent\Fields\Link;
use ModularContent\Fields\Post_List;
use ModularContent\Fields\PostQuacker;
use ModularContent\Fields\Posts;
use ModularContent\Fields\Radio;
use ModularContent\Fields\Repeater;
use ModularContent\Fields\Select;
use ModularContent\Fields\Swatch_Select;
use ModularContent\Fields\Text;
use ModularContent\Fields\TextArea;
use ModularContent\Fields\Video;

class Blueprint_Builder_Test extends WPTestCase {
	public function test_basic_blueprint() {
		$registry = new TypeRegistry();
		$type = new PanelType( 'test_type' );
		$type->set_label( 'Test Panel' );
		$type->set_description( 'A test panel' );
		$type->set_thumbnail( 'active_icon.png' );
		$type->set_max_children( 6 );
		$registry->register( $type );

		$builder = new Blueprint_Builder( $registry );
		$blueprint = $builder->get_blueprint();

		$expected = [
			[
				'type'            => 'test_type',
				'label'           => 'Test Panel',
				'description'     => 'A test panel',
				'thumbnail'       => 'active_icon.png',
				'fields'          => [
					[
						'type'        => 'Title',
						'label'       => 'Title',
						'name'        => 'title',
						'description' => '',
						'strings'     => [ ],
						'default'     => '',
					],
				],
				'settings_fields' => [ ],
				'children'        => [
					'max'   => 6,
					'label' => [
						'singular' => 'Module',
						'plural'   => 'Modules',
					],
					'types' => [ ],
				],
			],
		];

		$this->assertEquals( $expected, $blueprint[ 'types' ] );
	}

	public function test_settings_field_blueprint() {
		$registry = new TypeRegistry();
		$type = new PanelType( 'test_type' );
		$type->set_label( 'Test Panel' );
		$type->set_description( 'A test panel' );
		$type->set_thumbnail( 'active_icon.png' );
		$type->set_max_children( 6 );

		$type->add_settings_field( new Radio( [
			'label'       => 'Layout',
			'name'        => 'layout',
			'description' => 'Which layout should this panel use?',
			'default'     => 'horizontal',
			'options'     => [
				'horizontal',
				'vertical',
			],
		] ) );

		$registry->register( $type );

		$builder = new Blueprint_Builder( $registry );
		$blueprint = $builder->get_blueprint();

		$this->assertCount( 2, $blueprint[ 'types' ][ 0 ][ 'fields' ] ); // title field and layout field
		$this->assertEqualSets( [ 'layout' ], $blueprint[ 'types' ][ 0 ][ 'settings_fields' ] );
	}

	public function test_nested_blueprint() {
		$registry = new TypeRegistry();
		$type = new PanelType( 'test_type' );
		$type->set_label( 'Test Panel' );
		$type->set_description( 'A test panel' );
		$type->set_thumbnail( 'active_icon.png' );
		$type->set_max_children( 6 );
		$registry->register( $type );

		$child = new PanelType( 'test_child' );
		$child->set_label( 'Test Child' );
		$child->set_description( 'A child panel' );
		$child->set_thumbnail( 'active_child.png' );
		$child->set_max_depth( 2 );
		$child->set_context( 'test_type', true );
		$registry->register( $child );

		$builder = new Blueprint_Builder( $registry );
		$blueprint = $builder->get_blueprint();

		$expected = [
			[
				'type'            => 'test_type',
				'label'           => 'Test Panel',
				'description'     => 'A test panel',
				'thumbnail'       => 'active_icon.png',
				'fields'          => [
					[
						'type'        => 'Title',
						'label'       => 'Title',
						'name'        => 'title',
						'description' => '',
						'strings'     => [ ],
						'default'     => '',
					],
				],
				'settings_fields' => [ ],
				'children'        => [
					'max'   => 6,
					'label' => [
						'singular' => 'Module',
						'plural'   => 'Modules',
					],
					'types' => [
						[
							'type'            => 'test_child',
							'label'           => 'Test Child',
							'description'     => 'A child panel',
							'thumbnail'       => 'active_child.png',
							'fields'          => [
								[
									'type'        => 'Title',
									'label'       => 'Title',
									'name'        => 'title',
									'description' => '',
									'strings'     => [ ],
									'default'     => '',
								],
							],
							'settings_fields' => [ ],
							'children'        => [
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

		$this->assertCount( 1, $blueprint[ 'types' ], 'only one top-level panel type expected' );
		$this->assertEquals( $expected, $blueprint[ 'types' ] );
	}


	public function test_forbidden_nested_panel() {
		$registry = new TypeRegistry();
		$type = new PanelType( 'test_type' );
		$type->set_label( 'Test Panel' );
		$type->set_description( 'A test panel' );
		$type->set_thumbnail( 'active_icon.png' );
		$type->set_max_children( 6 );
		$registry->register( $type );

		$child = new PanelType( 'test_child' );
		$child->set_label( 'Test Child' );
		$child->set_description( 'A child panel' );
		$child->set_thumbnail( 'active_child.png' );
		$child->set_max_depth( 2 );
		$child->set_context( 'test_type', false );
		$child->set_context( 'test_child', false );
		$registry->register( $child );

		$builder = new Blueprint_Builder( $registry );
		$blueprint = $builder->get_blueprint();

		$this->assertCount( 2, $blueprint[ 'types' ], 'two top-level panel types expected' );
		$this->assertCount( 0, $blueprint[ 'types' ][ 0 ][ 'children' ][ 'types' ], 'not expecting a child panel type' );
		$this->assertCount( 0, $blueprint[ 'types' ][ 1 ][ 'children' ][ 'types' ], 'not expecting a child panel type' );
	}

	public function test_recursive_nested_panel() {
		$registry = new TypeRegistry();
		$type = new PanelType( 'test_type' );
		$type->set_label( 'Test Panel' );
		$type->set_description( 'A test panel' );
		$type->set_thumbnail( 'active_icon.png' );
		$type->set_max_children( 6 );
		$type->set_max_depth( 6 );
		$registry->register( $type );

		$builder = new Blueprint_Builder( $registry );
		$blueprint = $builder->get_blueprint();

		$this->assertCount( 1, $blueprint[ 'types' ], 'one top-level panel type expected' );

		$top = $blueprint[ 'types' ];
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

		$this->assertCount( 1, $blueprint[ 'types' ] );
		$fields = $blueprint[ 'types' ][ 0 ][ 'fields' ];
		$this->assertCount( 2, $fields );
		$this->assertEquals( 'Title', $fields[ 0 ][ 'type' ] );
		$this->assertEquals( 'Text', $fields[ 1 ][ 'type' ] );
	}

	public function test_categorized_panels() {
		$registry = new TypeRegistry();
		$type = new PanelType( 'test_type' );
		$type->set_label( 'Test Panel' );
		$type->set_description( 'A test panel' );
		$type->set_thumbnail( 'active_icon.png' );
		$type->set_max_children( 6 );
		$registry->register( $type );

		$registry->add_category( 'test_cat', 'Test Category', 'A category for testing' );
		$registry->categorize( 'test_type', 'test_cat' );

		$builder = new Blueprint_Builder( $registry );
		$blueprint = $builder->get_blueprint();

		$expected_categories = [
			[
				'category'    => 'test_cat',
				'label'       => 'Test Category',
				'description' => 'A category for testing',
				'weight'      => 0,
				'types'       => [ 'test_type' ],
			],
		];

		$this->assertEquals( $expected_categories, $blueprint[ 'categories' ] );
	}

	/**
	 * One of the main goals of this method is to build
	 * a JSON file out of all the standard field type
	 * and save them to _data/blueprint.json, as well as
	 * some sample data populating those fields for front-end
	 * testing.
	 */
	public function test_build_json() {
		$this->factory()->tag->create();
		$this->factory()->tag->create();
		$registry = new TypeRegistry();
		$collection = new PanelCollection();


		$registry->add_category( 'yellow', 'Yellow Panels', 'These panels render with a yellow-ish theme' );
		$registry->add_category( 'blue', 'Blue Panels', 'These panels render with a blue theme' );

		$this->register_kitchensink( $registry );

		$this->register_contentgrid( $registry );
		$registry->categorize( 'contentgrid', 'yellow' );
		$this->add_sample_contentgrid( $collection, $registry->get( 'contentgrid' ) );
		$this->register_gallery( $registry );
		$registry->categorize( 'gallery', 'blue' );
		$this->add_sample_gallery( $collection, $registry->get( 'gallery' ) );
		$this->register_imagetext( $registry );
		$registry->categorize( 'imagetext', 'blue' );
		$this->add_sample_imagetext( $collection, $registry->get( 'imagetext' ) );
		$this->register_micronav( $registry );
		$this->add_sample_micronav( $collection, $registry->get( 'micronav' ) );
		$this->register_wysiwyg( $registry );
		$this->register_tabgroup( $registry );
		$registry->categorize( 'wysiwyg', 'yellow' );
		$registry->categorize( 'wysiwyg', 'blue' );
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

	private function register_kitchensink( TypeRegistry $registry ) {
		$panel = new PanelType( 'kitchensink' );
		$panel->set_label( 'Kitchen Sink' );
		$panel->set_description( 'At least one of every kind of field' );
		$panel->set_thumbnail( 'module-kitchensink.png' );

		$panel->add_field( new HTML( [
			'name'        => 'help',
			'label'       => 'Need Help?',
			'description' => '<p>Check out the <a href="https://github.com/moderntribe/panel-builder/blob/master/readme.md">Readme</a>.</p>',
		] ) );

		$panel->add_field( new Radio( [
			'name'    => 'alignment',
			'label'   => 'Alignment',
			'options' => [
				'left'  => 'Left',
				'right' => 'Right',
			],
			'default' => 'left',
		] ) );

		$panel->add_field( new Checkbox( [
			'name'    => 'partner',
			'label'   => 'Partner',
			'options' => [
				'peter' => 'Peter',
				'reid'  => 'Reid',
				'shane' => 'Shane',
			],
			'default' => [ 'reid' => 1 ],
		] ) );

		$links = new Repeater( [
			'name'    => 'links',
			'label'   => 'Links',
			'strings' => [
				'button.new' => 'Add a link',
			],
			'max'     => 6,
		] );
		$links->add_field( new Link( [
			'label' => 'Link',
			'name'  => 'link',
		] ) );
		$links->add_field( new Image( [
			'label' => 'Image (optional)',
			'name'  => 'image',
		] ) );
		$panel->add_field( $links );

		$panel->add_field( new ImageGallery( [
			'label'       => 'Gallery',
			'name'        => 'gallery',
			'description' => 'This is a gallery field',
		] ) );

		$panel->add_field( new Post_List( [
			'label'            => 'A Post_List field',
			'name'             => 'posts',
			'min'              => 2,
			'max'              => 12,
			'suggested'        => 6,
			'show_max_control' => true,
			'strings'          => [
				'tabs.manual'  => 'Select/Create',
				'tabs.dynamic' => 'Query',
			],
		] ) );

		$panel->add_field( new PostQuacker( [
			'name'  => 'quack',
			'label' => 'Quacker',
		] ) );

		$panel->add_field( new Select( [
			'name'        => 'budget',
			'label'       => 'Proposed budget',
			'options'     => [
				'<100'    => 'Less than $100,000',
				'100-200' => '$100,000 - $200,000',
				'200+'    => 'More than $200,000',
			],
			'description' => 'How much money do you have?',
		] ) );

		$name = new Group( [
			'name'        => 'name',
			'label'       => 'Your Name',
			'description' => 'What do people call you?',
		] );
		$name->add_field( new Text( [
			'name'  => 'first_name',
			'label' => 'First Name',
		] ) );
		$name->add_field( new Text( [
			'name'  => 'last_name',
			'label' => 'Last Name',
		] ) );
		$panel->add_field( $name );

		$panel->add_field( new Hidden( [
			'name'    => 'secret',
			'default' => "You can't see me",
		] ) );

		// Panel Style
		$panel->add_settings_field( new ImageSelect( [
			'name'    => 'layout',
			'label'   => 'Style',
			'options' => [
				'standard' => 'module-contentgrid-standard.png',
				'cards'    => 'module-contentgrid-cards.png',
				'full'     => 'module-contentgrid-full.png',
			],
			'default' => 'standard',
		] ) );

		$panel->add_settings_field( new Swatch_Select( [
			'label'       => 'Background Color',
			'name'        => 'background',
			'description' => 'Select a background color',
			'default'     => 'blue',
			'options'     => [
				'blue'  => [
					'color' => '#0000BB',
					'label' => 'Blue',
				],
				'green-blue' => [
					'color' => 'linear-gradient(113.59deg, rgba(186, 191, 16, 1) 0%, rgba(169, 189, 36, 1) 12.24%, rgba(126, 185, 88, 1) 37.36%, rgba(57, 179, 171, 1) 72.79%, rgba(0, 174, 239, 1) 100%)',
					'label' => 'Green to Blue Gradient',
				],
			],
		] ) );

		$panel->add_field( new TextArea( [
			'name'        => 'bio',
			'label'       => 'Biography',
			'description' => 'Provide a brief history of your life to date.',
			'richtext'    => 'false',
		] ) );

		$panel->add_field( new TextArea( [
			'name'          => 'content',
			'label'         => 'Content',
			'description'   => 'Anything you would like to say. Really.',
			'richtext'      => 'true',
			'media_buttons' => true,
		] ) );

		$panel->add_field( new TextArea( [
			'name'            => 'discontent',
			'label'           => 'Discontent',
			'description'     => "Maybe don't say so much. Thanks.",
			'richtext'        => 'true',
			'media_buttons'   => true,
			'editor_settings' => [
				'teeny' => true,
			],
		] ) );

		$panel->add_field( new Video( [
			'name'        => 'cat_video',
			'label'       => 'Cat Video',
			'description' => 'URL to a cute cate video on YouTube',
		] ) );

		$registry->register( $panel );
	}

	private function register_contentgrid( TypeRegistry $registry ) {
		$panel = new PanelType( 'contentgrid' );
		$panel->set_label( 'Content Grid' );
		$panel->set_description( 'A grid of content with 2 layouts.' );
		$panel->set_thumbnail( 'module-contentgrid.png' );

		// Panel Style
		$panel->add_settings_field( new Fields\ImageSelect( [
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
			'title'     => 'Sample Content Grid',
			'layout'    => 'cards',
			'content'   => 'Content Grid Content',
			'columns'   => [
				[
					'title' => 'Column One',
					'text'  => 'This goes in column one',
				],
				[
					'title' => 'Column Two',
					'text'  => 'An image in column two: <img width="300" height="250" src="http://griddle.tri.be/?w=300&h=250" />',
				],
				[
					'title' => 'Column Three',
					'text'  => '',
				],
			],
			'cta'       => [
				'url'    => 'http://tri.be/',
				'target' => '',
				'label'  => 'Modern Tribe',
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
		$panel->set_thumbnail( 'module-gallery.png' );

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
			'title'   => 'Some Images',
			'content' => 'A caption to go with the gallery',
			'gallery' => [
				[
					'id'        => 12345,
					'thumbnail' => 'http://griddle.tri.be/?w=300&h=250',
				],
				[
					'id'        => 12346,
					'thumbnail' => 'http://griddle.tri.be/?w=350&h=250',
				],
				[
					'id'        => 12347,
					'thumbnail' => 'http://griddle.tri.be/?w=400&h=250',
				],
				[
					'id'        => 12348,
					'thumbnail' => 'http://griddle.tri.be/?w=450&h=250',
				],
			],
		] );
		$collection->add_panel( $panel );
	}

	private function register_imagetext( TypeRegistry $registry ) {

		$panel = new PanelType( 'imagetext' );

		$panel->set_label( 'Image+Text' );
		$panel->set_description( 'An image and text with several layout options.' );
		$panel->set_thumbnail( 'module-imagetext.png' );
		$panel->set_max_depth( 2 );

		// Panel Layout
		$panel->add_settings_field( new ImageSelect( [
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
		$panel->add_settings_field( new ImageSelect( [
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
		$panel->add_settings_field( new ImageSelect( [
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
			'title'     => 'Sample Image + Text Panel',
			'layout'    => 'boxed',
			'content'   => '',
			'image'     => 1234,
			'overlay'   => 'tint',
			'cta'       => [
				'url'    => 'http://tri.be',
				'target' => '_blank',
				'label'  => 'Visit the Tribe',
			],
			'cta_style' => [
				'text',
			],
		] );
		$collection->add_panel( $panel );
	}

	private function register_micronav( TypeRegistry $registry ) {
		$panel = new PanelType( 'micronav' );

		$panel->set_label( 'MicroNav' );
		$panel->set_description( 'Display a set of links and related content.' );
		$panel->set_thumbnail( 'module-micronav.png' );

		// Panel Layout
		$panel->add_settings_field( new ImageSelect( [
			'name'    => 'layout',
			'label'   => 'Style',
			'options' => [
				'buttons' => 'module-micronav-buttons.png',
				'list'    => 'module-micronav-list.png',
			],
			'default' => 'buttons',
		] ) );

		// Optional Content
		$panel->add_field( new TextArea( [
			'name'     => 'content',
			'label'    => 'Content',
			'richtext' => true,
		] ) );

		$panel->add_field( new Post_List( [
			'name'             => 'items',
			'label'            => 'Links',
			'max'              => 12,
			'min'              => 1,
			'suggested'        => 3,
			'show_max_control' => true,
			'hidden_fields'    => [ 'post_content', 'thumbnail_id' ],
			'strings'          => [
				'button.create_content' => 'Add Link',
			],
		] ) );

		$registry->register( $panel );
	}

	private function add_sample_micronav( PanelCollection $collection, PanelType $type ) {
		$panel = new Panel( $type, [
			'title'   => 'Some Links',
			'layout'  => 'list',
			'content' => 'Preface to the links',
			'items'   => [
				'type'    => 'manual',
				'posts'   => [ ],
				'filters' => [ ],
				'max'     => 0,
			],
		] );
		$collection->add_panel( $panel );
	}

	private function register_wysiwyg( TypeRegistry $registry ) {
		$panel = new PanelType( 'wysiwyg' );

		$panel->set_label( 'WYSIWYG Editor' );
		$panel->set_description( 'Displays custom content' );
		$panel->set_thumbnail( 'module-wysiwyg.png' );
		$panel->set_max_depth( 2 );

		// Field: Editor Columns
		$group = new Fields\Repeater( [
			'label'            => 'Columns',
			'name'             => 'repeater',
			'min'              => 1,
			'max'              => 3,
			'new_button_label' => 'Add Column',
		] );

		$group->add_field( new Fields\TextArea( [
			'label'    => 'Column',
			'name'     => 'column',
			'richtext' => true,
		] ) );

		$panel->add_field( $group );

		$registry->register( $panel );
	}

	private function add_sample_wysiwyg( PanelCollection $collection, PanelType $type ) {
		$panel = new Panel( $type, [
			'title'    => 'Wysiwyg Panel',
			'repeater' => [
				[
					'column' => 'Column 1 Content',
				],
				[
					'column' => 'Column 2 Content',
				],
			],
		] );
		$collection->add_panel( $panel );
	}

	private function register_tabgroup( TypeRegistry $registry ) {
		$panel = new PanelType( 'tabgroup' );

		$panel->set_label( 'Tab Group' );
		$panel->set_description( 'Displays a group of panels as tabs' );
		$panel->set_thumbnail( 'module-tabgroup.png' );
		$panel->set_max_children( 6 );

		$registry->register( $panel );
	}

	private function add_sample_tabgroup( PanelCollection $collection, PanelType $parent, PanelType $child ) {
		$tabs = new Panel( $parent, [ 'title' => 'A group of tabs' ] );
		$collection->add_panel( $tabs );

		$child_1 = new Panel( $child, [
			'title'    => 'Wysiwyg Panel 1',
			'repeater' => [
				[
					'column' => 'Column 1 Content',
				],
				[
					'column' => 'Column 2 Content',
				],
			],
		], 1 );
		$collection->add_panel( $child_1 );

		$child_2 = new Panel( $child, [
			'title'    => 'Wysiwyg Panel 2',
			'repeater' => [
				[
					'column' => 'Column 1 Content',
				],
			],
		], 1 );
		$collection->add_panel( $child_2 );
	}

} 