<?php


namespace ModularContent\Fields;

/**
 * Class Style Family Select
 *
 * @package ModularContent\Fields
 *
 * Functionally the same as a Select Field; the UI renders this with some slight differences.
 *
 * $field = new Style_Family_Select( array(
 *   'label' => __('Style Families'),
 *   'name' => 'style-families',
 *   'description' => __( 'Pick the thing that you pick' )
 *   'options' => array(
 *     'first' => __( 'The First Option' ),
 *     'second' => __( 'The Second Option' ),
 *   )
 * ) );
 */
class Style_Family_Select extends Select {}