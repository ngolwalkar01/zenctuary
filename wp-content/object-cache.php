<?php
function __wpcloud_php_ext_memcached() {
	if ( ! defined( 'ATOMIC_SITE_ID' ) ) {
		return false;
	}

	if ( ! defined( 'ATOMIC_SERVER_POOL_ID' ) ) {
		return false;
	}

	$site_id = (int) ATOMIC_SITE_ID;
	$pool_id = (int) ATOMIC_SERVER_POOL_ID;

	if ( $site_id < 1 || $pool_id < 1 ) {
		return false;
	}

	// Percentage of sites on each pool to use memcached.
	$memcached_pools = [
		1   => 100,
		4   => 100,
		22  => 100,
		145 => 80,
		253 => 100,
		254 => 100,
		255 => 100,
		256 => 100,
	];

	if ( ! array_key_exists( $pool_id, $memcached_pools ) ) {
		$memcached_pools[ $pool_id ] = 10;
	}

	if ( ! class_exists( 'Memcached' ) ) {
		return false;
	}

	$percentage = $memcached_pools[ $pool_id ];

	if ( ( $site_id % 100 ) < $percentage ) {
		return true; // Use memcache-dee!
	}

	return false;
}

if ( __wpcloud_php_ext_memcached() ) {
	require_once( '/scripts/object-cache.memcached.php' );
} else {
	require_once( '/scripts/object-cache.memcache.php' );
}
