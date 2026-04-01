<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
add_action( 'after_setup_theme', 'zenctuary_theme_setup' );
function zenctuary_theme_setup(): void {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/editor.css' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'custom-logo' );
	add_theme_support( 'woocommerce' );

	register_nav_menus(
		array(
			'primary' => __( 'Primary Navigation', 'zenctuary' ),
			'footer'  => __( 'Footer Navigation', 'zenctuary' ),
		)
	);
}
