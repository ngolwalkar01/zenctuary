( function () {
	function getSnapOffsets( viewport, slides ) {
		if ( ! viewport || ! slides.length ) {
			return [ 0 ];
		}

		const maxOffset = Math.max( 0, viewport.scrollWidth - viewport.clientWidth );
		const offsets = slides
			.map( function ( slide ) {
				return Math.min( slide.offsetLeft, maxOffset );
			} )
			.filter( function ( offset, index, values ) {
				return index === 0 || Math.abs( offset - values[ index - 1 ] ) > 1;
			} );

		if ( ! offsets.length ) {
			offsets.push( 0 );
		}

		if ( Math.abs( offsets[ offsets.length - 1 ] - maxOffset ) > 1 ) {
			offsets.push( maxOffset );
		}

		return offsets;
	}

	function mountCarousel( block ) {
		const track = block.querySelector( '.zen-carousel__track' );
		const slides = Array.from( block.querySelectorAll( '.zen-carousel__slide' ) );
		const prevButton = block.querySelector( '.zen-carousel__arrow--prev' );
		const nextButton = block.querySelector( '.zen-carousel__arrow--next' );
		const viewport = block.querySelector( '.zen-carousel__viewport' );
		let currentIndex = 0;
		let snapOffsets = [];
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
			const maxIndex = Math.max( 0, snapOffsets.length - 1 );

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
			const offset = snapOffsets[ currentIndex ] || 0;

			track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';
			updateButtons();
		}

		function refreshSnapOffsets() {
			snapOffsets = getSnapOffsets( viewport, slides );
			currentIndex = Math.max( 0, Math.min( currentIndex, snapOffsets.length - 1 ) );
		}

		function goTo( nextIndex ) {
			const maxIndex = Math.max( 0, snapOffsets.length - 1 );
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

		window.addEventListener( 'resize', function () {
			refreshSnapOffsets();
			render();
		} );
		refreshSnapOffsets();
		render();
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		document.querySelectorAll( '.wp-block-zenctuary-zen-carousel-block' ).forEach( mountCarousel );
	} );
} )();
