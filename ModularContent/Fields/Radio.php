<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


/**
 * Class Radio
 *
 * @package ModularContent\Fields
 *
 * A group of radio buttons.
 *
 * $field = new Radio( array(
 *   'label' => __('Pick One'),
 *   'name' => 'my-field',
 *   'description' => __( 'Pick the thing that you pick' )
 *   'options' => array(
 *     'first' => __( 'The First Option' ),
 *     'second' => __( 'The Second Option' ),
 *   )
 * ) );
 */
class Radio extends Select {}