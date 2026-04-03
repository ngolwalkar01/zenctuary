( function () {
	function getSlidesPerView( block ) {
		const mobile = parseFloat( block.dataset.visibleMobile || '1' );
		const tablet = parseFloat( block.dataset.visibleTablet || '2' );
		const desktop = parseFloat( block.dataset.visibleDesktop || '3.3' );
		const width = window.innerWidth;

		if ( width <= 781 ) {
			return mobile;
		}

		if ( width <= 1023 ) {
			return tablet;
		}

		return desktop;
	}

	function getMaxIndex( block, slidesPerView ) {
		const slideCount = block.querySelectorAll( '.zen-carousel__slide' ).length;
		return Math.max( 0, slideCount - Math.ceil( slidesPerView ) );
	}

	function mountCarousel( block ) {
		const track = block.querySelector( '.zen-carousel__track' );
		const slides = Array.from( block.querySelectorAll( '.zen-carousel__slide' ) );
		const prevButton = block.querySelector( '.zen-carousel__arrow--prev' );
		const nextButton = block.querySelector( '.zen-carousel__arrow--next' );
		const viewport = block.querySelector( '.zen-carousel__viewport' );
		let currentIndex = 0;
		let startX = 0;
		let isDragging = false;

		if ( ! track || slides.length < 2 ) {
			if ( prevButton ) {
				prevButton.disabled = true;
			}

			if ( nextButton ) {
				nextButton.disabled = true;
			}

			return;
		}

		function updateButtons() {
			const maxIndex = getMaxIndex( block, getSlidesPerView( block ) );

			if ( prevButton ) {
				prevButton.disabled = currentIndex <= 0;
				prevButton.classList.toggle( 'is-active', currentIndex > 0 );
			}

			if ( nextButton ) {
				nextButton.disabled = currentIndex >= maxIndex;
				nextButton.classList.toggle( 'is-active', currentIndex < maxIndex );
			}
		}

		function render() {
			const targetSlide = slides[ currentIndex ];
			const offset = targetSlide ? targetSlide.offsetLeft : 0;

			track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';
			updateButtons();
		}

		function goTo( nextIndex ) {
			const maxIndex = getMaxIndex( block, getSlidesPerView( block ) );
			currentIndex = Math.max( 0, Math.min( nextIndex, maxIndex ) );
			render();
		}

		if ( prevButton ) {
			prevButton.addEventListener( 'click', function () {
				goTo( currentIndex - 1 );
			} );
		}

		if ( nextButton ) {
			nextButton.addEventListener( 'click', function () {
				goTo( currentIndex + 1 );
			} );
		}

		if ( viewport ) {
			viewport.addEventListener( 'pointerdown', function ( event ) {
				isDragging = true;
				startX = event.clientX;
			} );

			viewport.addEventListener( 'pointerup', function ( event ) {
				if ( ! isDragging ) {
					return;
				}

				const delta = event.clientX - startX;
				isDragging = false;

				if ( Math.abs( delta ) < 40 ) {
					return;
				}

				if ( delta < 0 ) {
					goTo( currentIndex + 1 );
					return;
				}

				goTo( currentIndex - 1 );
			} );

			viewport.addEventListener( 'pointerleave', function () {
				isDragging = false;
			} );
		}

		window.addEventListener( 'resize', render );
		render();
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		document.querySelectorAll( '.wp-block-zenctuary-zen-carousel-block' ).forEach( mountCarousel );
	} );
} )();
