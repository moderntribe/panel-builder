<?php


namespace ModularContent;


use Codeception\TestCase\WPTestCase;

class PanelCollection_Test extends WPTestCase {

	public function test_create_collection() {
		$type = new PanelType( 'test_type' );
		$type->add_field( new Fields\Title('test_title') );

		$collection = new PanelCollection();

		$collection->add_panel( new Panel( $type, array( 'post_title' => 'First' ) ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => 'Second' ) ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => 'Third' ) ) );

		$this->assertCount( 3, $collection->panels() );
	}

	public function test_json_encode() {
		$type = new PanelType( 'test_type' );
		$type->add_field( new Fields\Title('test_title') );

		$collection = new PanelCollection();

		$collection->add_panel( new Panel( $type, array( 'post_title' => 'First' ) ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => 'Second' ) ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => 'Third' ) ) );

		$json = json_encode($collection);
		$decoded = json_decode( $json, TRUE );

		$this->assertCount( 3, $decoded['panels'] );
		$second = $decoded['panels'][1];
		$this->assertEquals( 'Second', $second['data']['post_title'] );
	}

	public function test_reconstitute() {
		$type = new PanelType( 'test_type' );
		$type->add_field( new Fields\Title('test_title') );

		$registry = new TypeRegistry();
		$registry->register($type);

		$collection = new PanelCollection();

		$collection->add_panel( new Panel( $type, array( 'post_title' => 'First' ) ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => 'Second' ) ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => 'Third' ) ) );

		$json = json_encode($collection);

		$new_collection = PanelCollection::create_from_json($json, $registry);
		$panels = $new_collection->panels();
		$this->assertCount( 3, $panels );
		$this->assertEquals( 'First', $panels[0]->get('post_title') );
		$this->assertEquals( 'Second', $panels[1]->get('post_title') );
		$this->assertEquals( 'Third', $panels[2]->get('post_title') );
	}

	public function test_build_tree() {
		$type = new PanelType( 'test_type' );
		$type->set_max_children( 2 );
		$type->set_max_depth( 2 );

		$registry = new TypeRegistry();
		$registry->register($type);

		$collection = new PanelCollection();

		$collection->add_panel( new Panel( $type, array( 'post_title' => '1' ), 0 ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => '1.1' ), 1 ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => '1.2' ), 1 ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => '2' ), 0 ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => '3' ), 0 ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => '3.1' ), 1 ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => '3.1.1' ), 2 ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => '3.1.2' ), 2 ) );
		$collection->add_panel( new Panel( $type, array( 'post_title' => '3.2' ), 1 ) );

		$tree = $collection->build_tree();
		$this->assertCount( 3, $tree );
		$this->assertCount( 2, $tree[0]->get_children() );
		$this->assertCount( 0, $tree[1]->get_children() );
		$children_of_third = $tree[2]->get_children();
		$this->assertCount( 2, $children_of_third );
		$this->assertCount( 2, $children_of_third[0]->get_children() );
		$this->assertCount( 0, $children_of_third[1]->get_children() );
	}
} 