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

/**
 * Register term meta for space_type taxonomy.
 *
 * Allows admins to set a custom icon image URL and description
 * per space term (e.g., Movement Space, Soul Space).
 * These are rendered in the section header of the experience-space block.
 */
add_action( 'init', 'zenctuary_register_space_term_meta' );

function zenctuary_register_space_term_meta(): void {

    // Icon image URL for the space header.
    register_term_meta( 'space_type', '_zen_space_icon_url', [
        'type'              => 'string',
        'description'       => __( 'URL of the icon image displayed in the space section header', 'zenctuary' ),
        'single'            => true,
        'show_in_rest'      => true,
        'sanitize_callback' => 'esc_url_raw',
        'auth_callback'     => '__return_true',
    ] );

    // Short description shown below the space title.
    register_term_meta( 'space_type', '_zen_space_description', [
        'type'              => 'string',
        'description'       => __( 'Short description shown below the space section title', 'zenctuary' ),
        'single'            => true,
        'show_in_rest'      => true,
        'sanitize_callback' => 'sanitize_textarea_field',
        'auth_callback'     => '__return_true',
    ] );
}

/**
 * Add icon URL and description fields to the space_type term edit screens in WP Admin.
 */
add_action( 'space_type_add_form_fields',  'zenctuary_space_type_add_fields' );
add_action( 'space_type_edit_form_fields', 'zenctuary_space_type_edit_fields' );
add_action( 'created_space_type',          'zenctuary_save_space_type_meta' );
add_action( 'edited_space_type',           'zenctuary_save_space_type_meta' );

function zenctuary_space_type_add_fields(): void {
    ?>
    <div class="form-field">
        <label for="zen_space_icon_url"><?php esc_html_e( 'Icon Image URL', 'zenctuary' ); ?></label>
        <input type="url" name="zen_space_icon_url" id="zen_space_icon_url" value="" />
        <p><?php esc_html_e( 'URL to the icon SVG or image shown next to the space title.', 'zenctuary' ); ?></p>
    </div>
    <div class="form-field">
        <label for="zen_space_description_custom"><?php esc_html_e( 'Section Description', 'zenctuary' ); ?></label>
        <textarea name="zen_space_description_custom" id="zen_space_description_custom" rows="4"></textarea>
        <p><?php esc_html_e( 'Short text displayed below the space title.', 'zenctuary' ); ?></p>
    </div>
    <?php
}

function zenctuary_space_type_edit_fields( WP_Term $term ): void {
    $icon_url    = get_term_meta( $term->term_id, '_zen_space_icon_url', true );
    $description = get_term_meta( $term->term_id, '_zen_space_description', true );
    ?>
    <tr class="form-field">
        <th scope="row"><label for="zen_space_icon_url"><?php esc_html_e( 'Icon Image URL', 'zenctuary' ); ?></label></th>
        <td>
            <input type="url" name="zen_space_icon_url" id="zen_space_icon_url" value="<?php echo esc_attr( $icon_url ); ?>" />
            <p class="description"><?php esc_html_e( 'URL to the icon SVG or image shown next to the space title.', 'zenctuary' ); ?></p>
        </td>
    </tr>
    <tr class="form-field">
        <th scope="row"><label for="zen_space_description_custom"><?php esc_html_e( 'Section Description', 'zenctuary' ); ?></label></th>
        <td>
            <textarea name="zen_space_description_custom" id="zen_space_description_custom" rows="4"><?php echo esc_textarea( $description ); ?></textarea>
            <p class="description"><?php esc_html_e( 'Short text displayed below the space title.', 'zenctuary' ); ?></p>
        </td>
    </tr>
    <?php
}

function zenctuary_save_space_type_meta( int $term_id ): void {
    if ( isset( $_POST['zen_space_icon_url'] ) ) {
        update_term_meta( $term_id, '_zen_space_icon_url', esc_url_raw( wp_unslash( $_POST['zen_space_icon_url'] ) ) );
    }
    if ( isset( $_POST['zen_space_description_custom'] ) ) {
        update_term_meta( $term_id, '_zen_space_description', sanitize_textarea_field( wp_unslash( $_POST['zen_space_description_custom'] ) ) );
    }
}

