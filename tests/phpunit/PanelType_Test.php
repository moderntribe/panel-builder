<?php


namespace ModularContent;


class PanelType_Test extends UnitTestCase {
	public function test_contexts() {
		$type = new PanelType('test_type');
		$type->set_context( 'a', TRUE );
		$type->set_context( 'b', TRUE );
		$type->set_context( 'c', FALSE );
		$type->set_context( 'd', FALSE );

		$this->assertEqualSets( array('a', 'b'), $type->allowed_contexts() );
		$this->assertEmpty( $type->forbidden_contexts() );

		$type->remove_context( 'a' );
		$type->remove_context( 'b' );

		$this->assertEmpty( $type->allowed_contexts() );
		$this->assertEqualSets( array('c', 'd'), $type->forbidden_contexts());
	}
} 