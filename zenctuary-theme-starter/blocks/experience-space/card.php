<?php
/**
 * Card partial — included by render.php.
 *
 * Expects these variables to be set by the including scope:
 *   $product      (WP_Post)
 *   $meta         (array)   — from get_experience_meta()
 *   $link         (string)  — permalink
 *   $title        (string)  — product title
 *   $thumb_url    (string)  — featured image URL, or false
 *   $show_zencoins (bool)
 *   $show_difficulty (bool)
 *   $show_book_btn   (bool)
 *   $book_btn_label  (string)
 *
 * @package Zenctuary
 */
?>
<article class="zen-class-card">

    <!-- Image + Zencoins overlay -->
    <div class="zen-class-card__image-wrap">
        <?php if ( $thumb_url ) : ?>
            <img class="zen-class-card__image"
                 src="<?php echo esc_url( $thumb_url ); ?>"
                 alt="<?php echo esc_attr( $title ); ?>" />
        <?php else : ?>
            <div class="zen-class-card__image zen-class-card__image--placeholder"></div>
        <?php endif; ?>

        <?php if ( $show_zencoins && $meta['zen_coins'] ) : ?>
        <div class="zen-class-card__zencoins">
            <span class="zen-zencoins-label"><?php esc_html_e( 'Zencoins:', 'zenctuary' ); ?></span>
            <span class="zen-zencoins-badge"><?php echo (int) $meta['zen_coins']; ?></span>
        </div>
        <?php endif; ?>
    </div>

    <!-- Card Body -->
    <div class="zen-class-card__body">
        <h3 class="zen-class-card__title"><?php echo esc_html( strtoupper( $title ) ); ?></h3>

        <?php if ( $show_difficulty && ! empty( $meta['difficulty_level'] ) ) : ?>
        <div class="zen-class-card__difficulty">
            <svg class="zen-difficulty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9.29 16.29L5.7 12.7C5.31 12.31 5.31 11.68 5.7 11.29C6.09 10.9 6.72 10.9 7.11 11.29L10 14.17L16.88 7.29C17.27 6.9 17.9 6.9 18.29 7.29C18.68 7.68 18.68 8.31 18.29 8.7L10.7 16.29C10.32 16.68 9.68 16.68 9.29 16.29Z" fill="currentColor"/>
            </svg>
            <span><?php echo esc_html( $meta['difficulty_level'] ); ?></span>
        </div>
        <?php endif; ?>

        <?php if ( ! empty( $meta['short_description'] ) ) : ?>
        <p class="zen-class-card__desc"><?php echo esc_html( $meta['short_description'] ); ?></p>
        <?php endif; ?>

        <?php if ( $show_book_btn ) : ?>
        <a href="<?php echo esc_url( $link ); ?>" class="zen-btn zen-btn--primary zen-class-card__btn">
            <?php echo esc_html( $book_btn_label ); ?>
        </a>
        <?php endif; ?>
    </div>

</article>
