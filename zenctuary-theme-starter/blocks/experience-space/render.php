<?php
/**
 * Server-side render template for zenctuary/experience-space block.
 *
 * Vars available from WordPress:
 *   $attributes  (array)    — block attributes
 *   $content     (string)   — inner block content (unused, dynamic block)
 *   $block       (WP_Block) — block instance
 *
 * @package Zenctuary
 */

// Pull and sanitize attributes.
$filter_taxonomy    = sanitize_key( $attributes['filterTaxonomy']    ?? 'experience_category' );
$filter_term_slug   = sanitize_key( $attributes['filterTermSlug']    ?? '' );
$primary_taxonomy   = sanitize_key( $attributes['primaryTaxonomy']   ?? 'space_type' );
$accordion_taxonomy = sanitize_key( $attributes['accordionTaxonomy'] ?? 'activity_type' );
$show_zencoins      = (bool) ( $attributes['showZencoins']    ?? true );
$show_difficulty    = (bool) ( $attributes['showDifficulty']  ?? true );
$show_book_btn      = (bool) ( $attributes['showBookButton']  ?? true );
$book_btn_label     = esc_html( $attributes['bookButtonLabel'] ?? 'Book now →' );

// Build dynamic filter arg for the query helper.
$query_args = [];
if ( $filter_term_slug && $filter_taxonomy ) {
    $query_args[ $filter_taxonomy ] = $filter_term_slug;
}
$query_args['posts_per_page'] = -1;
$query_args['meta_key']       = '_zen_sort_order';
$query_args['orderby']        = 'meta_value_num';
$query_args['order']          = 'ASC';

// Because get_experience_products() accepts named taxonomy args, we need to pass them correctly.
// Re-key to match the helper's expected parameter names.
$helper_args = [];
if ( $filter_term_slug ) {
    $helper_args[ $filter_taxonomy ] = $filter_term_slug;
}

$query = get_experience_products( $helper_args );

if ( empty( $query->posts ) ) {
    echo '<p class="zen-no-results">' . esc_html__( 'No experiences found.', 'zenctuary' ) . '</p>';
    return;
}

// Group: primary taxonomy → accordion taxonomy → products.
$grouped = group_products_nested( $query->posts, $primary_taxonomy, $accordion_taxonomy );

if ( empty( $grouped ) ) {
    echo '<p class="zen-no-results">' . esc_html__( 'No grouping data available.', 'zenctuary' ) . '</p>';
    return;
}

?>
<div class="zen-experience-space-block">

    <?php foreach ( $grouped as $primary_slug => $primary_group ) :
        $primary_term = $primary_group['term'];
        $sub_groups   = $primary_group['groups'] ?? [];

        // Load term meta for space icon + description (only meaningful for space_type).
        $space_icon_url    = get_term_meta( $primary_term->term_id, '_zen_space_icon_url', true );
        $space_description = get_term_meta( $primary_term->term_id, '_zen_space_description', true );
    ?>

    <section class="zen-space-section" id="space-<?php echo esc_attr( $primary_slug ); ?>">

        <!-- Space Header -->
        <header class="zen-space-header">
            <?php if ( $space_icon_url ) : ?>
                <img class="zen-space-icon" src="<?php echo esc_url( $space_icon_url ); ?>" alt="<?php echo esc_attr( $primary_term->name ); ?>" />
            <?php endif; ?>
            <h2 class="zen-space-title"><?php echo esc_html( $primary_term->name ); ?></h2>
        </header>

        <?php if ( $space_description ) : ?>
            <p class="zen-space-description"><?php echo esc_html( $space_description ); ?></p>
        <?php endif; ?>

        <!-- Accordion Groups -->
        <?php if ( ! empty( $sub_groups ) ) : ?>
        <div class="zen-accordion-wrapper">
            <?php foreach ( $sub_groups as $activity_slug => $activity_group ) :
                $activity_term     = $activity_group['term'];
                $activity_products = $activity_group['products'];
                $is_first          = ( array_key_first( $sub_groups ) === $activity_slug );
            ?>

            <div class="zen-accordion-item <?php echo $is_first ? 'zen-accordion-item--open' : ''; ?>"
                 data-activity="<?php echo esc_attr( $activity_slug ); ?>">

                <button class="zen-accordion-header" aria-expanded="<?php echo $is_first ? 'true' : 'false'; ?>">
                    <span class="zen-accordion-title"><?php echo esc_html( $activity_term->name ); ?></span>
                    <span class="zen-accordion-icon" aria-hidden="true">
                        <span class="zen-accordion-icon--minus">&#8212;</span>
                        <span class="zen-accordion-icon--plus">+</span>
                    </span>
                </button>

                <div class="zen-accordion-panel" <?php echo ! $is_first ? 'hidden' : ''; ?>>
                    <div class="zen-class-cards-grid">
                        <?php foreach ( $activity_products as $product ) :
                            $meta      = get_experience_meta( $product->ID );
                            $link      = get_permalink( $product->ID );
                            $title     = get_the_title( $product );
                            $thumb_url = get_the_post_thumbnail_url( $product->ID, 'large' );
                        ?>
                            <?php include __DIR__ . '/card.php'; ?>
                        <?php endforeach; ?>
                    </div>
                </div>

            </div><!-- /.zen-accordion-item -->

            <?php endforeach; ?>
        </div><!-- /.zen-accordion-wrapper -->

        <?php else : ?>
        <!-- Fallback: no accordion sub-grouping — render cards directly -->
        <!-- This happens when products have no activity_type term assigned -->
        <div class="zen-class-cards-grid">
            <?php foreach ( $primary_group['products'] as $product ) :
                $meta      = get_experience_meta( $product->ID );
                $link      = get_permalink( $product->ID );
                $title     = get_the_title( $product );
                $thumb_url = get_the_post_thumbnail_url( $product->ID, 'large' );
            ?>
                <?php include __DIR__ . '/card.php'; ?>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

    </section>


    <?php endforeach; ?>

</div><!-- /.zen-experience-space-block -->

<script>
( function() {
    document.querySelectorAll( '.zen-accordion-header' ).forEach( function( btn ) {
        btn.addEventListener( 'click', function() {
            var item  = btn.closest( '.zen-accordion-item' );
            var panel = item.querySelector( '.zen-accordion-panel' );
            var open  = item.classList.contains( 'zen-accordion-item--open' );

            if ( open ) {
                item.classList.remove( 'zen-accordion-item--open' );
                btn.setAttribute( 'aria-expanded', 'false' );
                panel.setAttribute( 'hidden', '' );
            } else {
                item.classList.add( 'zen-accordion-item--open' );
                btn.setAttribute( 'aria-expanded', 'true' );
                panel.removeAttribute( 'hidden' );
            }
        } );
    } );
} )();
</script>
