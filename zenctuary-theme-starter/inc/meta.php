<?php
/**
 * Experience Product Meta Fields
 *
 * Registers REST-compatible structured meta fields on WooCommerce products.
 * Uses native register_post_meta — no ACF dependency required.
 *
 * @package Zenctuary
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'init', 'zenctuary_register_experience_meta' );

function zenctuary_register_experience_meta(): void {

    $defaults = [
        'object_subtype' => 'product',
        'show_in_rest'   => true,
        'single'         => true,
    ];

    // Duration: e.g., "60 min" or just 60
    register_post_meta( 'product', '_zen_duration', array_merge( $defaults, [
        'type'              => 'string',
        'description'       => __( 'Duration of the experience (e.g., "60 min")', 'zenctuary' ),
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback'     => '__return_true',
    ] ) );

    // Instructor name
    register_post_meta( 'product', '_zen_instructor_name', array_merge( $defaults, [
        'type'              => 'string',
        'description'       => __( 'Name of the instructor', 'zenctuary' ),
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback'     => '__return_true',
    ] ) );

    // Difficulty level: e.g., Beginner / Intermediate / Advanced / All Levels
    register_post_meta( 'product', '_zen_difficulty_level', array_merge( $defaults, [
        'type'              => 'string',
        'description'       => __( 'Difficulty level of the experience', 'zenctuary' ),
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback'     => '__return_true',
    ] ) );

    // Language
    register_post_meta( 'product', '_zen_language', array_merge( $defaults, [
        'type'              => 'string',
        'description'       => __( 'Language the experience is conducted in', 'zenctuary' ),
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback'     => '__return_true',
    ] ) );

    // Zencoin price/cost
    register_post_meta( 'product', '_zen_coins', array_merge( $defaults, [
        'type'              => 'integer',
        'description'       => __( 'Number of Zencoins required for this experience', 'zenctuary' ),
        'sanitize_callback' => 'absint',
        'auth_callback'     => '__return_true',
        'default'           => 0,
    ] ) );

    // Short description for card UI (separate from WooCommerce short_description)
    register_post_meta( 'product', '_zen_short_description', array_merge( $defaults, [
        'type'              => 'string',
        'description'       => __( 'Short summary for card display', 'zenctuary' ),
        'sanitize_callback' => 'sanitize_textarea_field',
        'auth_callback'     => '__return_true',
    ] ) );

    // Optional badge label: e.g., "NEW", "HOT", "Limited"
    register_post_meta( 'product', '_zen_badge_label', array_merge( $defaults, [
        'type'              => 'string',
        'description'       => __( 'Optional badge label displayed on cards', 'zenctuary' ),
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback'     => '__return_true',
    ] ) );

    // Sort order for manual ordering within groups
    register_post_meta( 'product', '_zen_sort_order', array_merge( $defaults, [
        'type'              => 'integer',
        'description'       => __( 'Manual sort order within a group (lower = first)', 'zenctuary' ),
        'sanitize_callback' => 'absint',
        'auth_callback'     => '__return_true',
        'default'           => 0,
    ] ) );
}
