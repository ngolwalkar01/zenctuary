<?php
/**
 * Title: Contact & Map
 * Slug: zenctuary/contact-map
 * Categories: featured, text
 */
?>
<!-- wp:group {"align":"full","className":"zen-contact-section","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull zen-contact-section">
    <!-- wp:columns {"align":"full","style":{"spacing":{"blockGap":{"top":"0px","left":"0px"}}}} -->
    <div class="wp-block-columns alignfull" style="gap:0">
        <!-- wp:column {"width":"50%"} -->
        <div class="wp-block-column" style="flex-basis:50%">
            <!-- wp:html -->
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.847525381881!2d13.4312845!3d52.4939764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e491c1b1811%3A0xe53ccac6f83196ed!2sReichenberger%20Str.%2080%2C%2010999%20Berlin%2C%20Germany!5e0!3m2!1sen!2sde!4v1712211902030!5m2!1sen!2sde" width="100%" height="680" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <!-- /wp:html -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column {"width":"50%"} -->
        <div class="wp-block-column" style="flex-basis:50%">
            <!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
            <figure class="wp-block-image size-large"><img src="https://placehold.co/720x680/2b3420/fff?text=Buddha+Statue" alt="Buddha Statue"/></figure>
            <!-- /wp:image -->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->

    <!-- wp:group {"className":"zen-contact-overlay","style":{"color":{"background":"var(--wp--preset--color--primary-grey)","text":"var(--wp--preset--color--primary-beige)"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"center","alignItems":"center"}} -->
    <div class="wp-block-group zen-contact-overlay has-primary-beige-color has-primary-grey-background-color has-text-color has-background">
        <!-- wp:heading {"textAlign":"center","style":{"typography":{"textTransform":"uppercase"},"color":{"text":"var(--wp--preset--color--primary-gold)"}}} -->
        <h2 class="wp-block-heading has-text-align-center has-text-color" style="color:var(--wp--preset--color--primary-gold);text-transform:uppercase">Zenctuary</h2>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"align":"center","style":{"typography":{"fontStyle":"italic"}}} -->
        <p class="has-text-align-center" style="font-style:italic">MO-FR: 09:00-22:00</p>
        <!-- /wp:paragraph -->

        <!-- wp:spacer {"height":"24px"} -->
        <div style="height:24px" aria-hidden="true" class="wp-block-spacer"></div>
        <!-- /wp:spacer -->

        <!-- wp:group {"layout":{"type":"flex","orientation":"vertical","flexWrap":"nowrap"}} -->
        <div class="wp-block-group">
            <!-- wp:html -->
            <div class="zen-contact-item">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/></svg>
                <span>Reichenberger Straße 80<br>10999 Berlin</span>
            </div>
            
            <div class="zen-contact-item">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L12.53 12.67C12.21 12.87 11.79 12.87 11.47 12.67L4.4 8.25C4.15 8.09 4 7.82 4 7.53C4 6.86 4.73 6.46 5.3 6.81L12 11L18.7 6.81C19.27 6.46 20 6.86 20 7.53C20 7.82 19.85 8.09 19.6 8.25Z" fill="currentColor"/></svg>
                <span>contact@company.com</span>
            </div>

            <div class="zen-contact-item">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/></svg>
                <span>+49 123 456 789</span>
            </div>
            <!-- /wp:html -->
        </div>
        <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->
