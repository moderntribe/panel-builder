<?php
/**
 * The Panels meta box
 *
 * @var array $meta_box_data The accumulated configuration data to send to js
 */
?>
<?php do_action( 'before_panel_meta_box' ); ?>
<div class="panels" data-depth="0">
	<script>
		var ModularContent = <?php echo \ModularContent\Util::json_encode( $meta_box_data ); ?>;
		<?php do_action( 'modular_content_metabox_js_init' ); ?>
	</script>
</div>
<?php do_action( 'after_panel_meta_box' ); ?>
