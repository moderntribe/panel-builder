<?php


namespace ModularContent;

class TypeRegistry_Test extends UnitTestCase {
	public function test_add_panel_type() {
		$registry = new TypeRegistry();
		$type = new PanelType('test_type');
		$registry->register($type);
		$retrieved = $registry->get('test_type');
		$this->assertEquals($type->id, $retrieved->id);
	}

	public function test_post_type_assignment() {
		$registry = new TypeRegistry();
		$typeA = new PanelType('Type A');
		$typeB = new PanelType('Type B');
		$typeC = new PanelType('Type C');
		$typeD = new PanelType('Type D');
		$registry->register($typeA);
		$registry->register($typeB, 'post');
		$registry->register($typeC, 'post');
		$registry->register($typeD, 'page');

		$for_posts = $registry->registered_panels('post');
		$this->assertEqualSets( $for_posts, array($typeA, $typeB, $typeC) );

		$for_pages = $registry->registered_panels('page');
		$this->assertEqualSets( $for_pages, array($typeA, $typeD) );

		$for_anything = $registry->registered_panels('all');
		$this->assertEqualSets( $for_anything, array($typeA) );

		$this->assertCount( 4, $registry->registered_panels() );
	}
} 