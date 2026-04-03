<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
define( 'ZENCTUARY_THEME_VERSION', '0.1.0' );
define( 'ZENCTUARY_THEME_DIR', get_template_directory() );
define( 'ZENCTUARY_THEME_URI', get_template_directory_uri() );

require_once ZENCTUARY_THEME_DIR . '/inc/setup.php';
require_once ZENCTUARY_THEME_DIR . '/inc/enqueue.php';
require_once ZENCTUARY_THEME_DIR . '/inc/patterns.php';

add_action('cst_action', function(){
	echo "<p>Hello World</p>";
});