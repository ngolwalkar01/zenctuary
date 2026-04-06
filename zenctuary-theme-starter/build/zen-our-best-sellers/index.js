( function ( blocks, blockEditor, components, element, i18n, apiFetch ) {
	const el = element.createElement;
	const Fragment = element.Fragment;
	const RawHTML = element.RawHTML;
	const useEffect = element.useEffect;
	const useMemo = element.useMemo;
	const useState = element.useState;
	const registerBlockType = blocks.registerBlockType;
	const useBlockProps = blockEditor.useBlockProps;
	const InspectorControls = blockEditor.InspectorControls;
	const PanelBody = components.PanelBody;
	const SelectControl = components.SelectControl;
	const ToggleControl = components.ToggleControl;
	const BaseControl = components.BaseControl;
	const UnitControl = components.__experimentalUnitControl || components.UnitControl || components.TextControl;
	const Spinner = components.Spinner;
	const Notice = components.Notice;
	const __ = i18n.__;

	function defaultSpacing() {
		return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
	}

	function getSpacingStyle( spacing, prefix ) {
		const value = Object.assign( defaultSpacing(), spacing || {} );
		const style = {};
		style[ prefix + 'Top' ] = value.top;
		style[ prefix + 'Right' ] = value.right;
		style[ prefix + 'Bottom' ] = value.bottom;
		style[ prefix + 'Left' ] = value.left;
		return style;
	}

	function renderFourSideControls( label, value, onChange ) {
		const nextValue = Object.assign( defaultSpacing(), value || {} );

		function updateSide( side, sideValue ) {
			onChange( Object.assign( {}, nextValue, { [ side ]: sideValue || '0px' } ) );
		}

		return el(
			BaseControl,
			{ label: label },
			el( UnitControl, { label: __( 'Top', 'zenctuary' ), value: nextValue.top, onChange: function ( sideValue ) { updateSide( 'top', sideValue ); } } ),
			el( UnitControl, { label: __( 'Right', 'zenctuary' ), value: nextValue.right, onChange: function ( sideValue ) { updateSide( 'right', sideValue ); } } ),
			el( UnitControl, { label: __( 'Bottom', 'zenctuary' ), value: nextValue.bottom, onChange: function ( sideValue ) { updateSide( 'bottom', sideValue ); } } ),
			el( UnitControl, { label: __( 'Left', 'zenctuary' ), value: nextValue.left, onChange: function ( sideValue ) { updateSide( 'left', sideValue ); } } )
		);
	}

	function decodeEntities( value ) {
		const textArea = document.createElement( 'textarea' );
		textArea.innerHTML = value || '';
		return textArea.value;
	}

	function stripHtml( value ) {
		return decodeEntities( String( value || '' ).replace( /<[^>]*>/g, ' ' ).replace( /\s+/g, ' ' ).trim() );
	}

	function normalizeIngredientParts( value ) {
		if ( Array.isArray( value ) ) {
			return value.map( function ( item ) { return stripHtml( item ); } ).filter( Boolean );
		}

		if ( typeof value === 'string' ) {
			return value.split( /[,;\n|]/ ).map( function ( item ) { return stripHtml( item ); } ).filter( Boolean );
		}

		return [];
	}

	function extractAttributeValue( attribute ) {
		if ( ! attribute ) {
			return [];
		}

		if ( Array.isArray( attribute.terms ) ) {
			return attribute.terms.map( function ( term ) { return stripHtml( term.name || term.slug || term ); } ).filter( Boolean );
		}

		if ( Array.isArray( attribute.options ) ) {
			return attribute.options.map( function ( option ) { return stripHtml( option ); } ).filter( Boolean );
		}

		if ( typeof attribute.value === 'string' ) {
			return normalizeIngredientParts( attribute.value );
		}

		return [];
	}

	function findMetaValue( metaSource, keys ) {
		if ( ! metaSource ) {
			return '';
		}

		if ( Array.isArray( metaSource ) ) {
			for ( let index = 0; index < metaSource.length; index += 1 ) {
				const item = metaSource[ index ];
				const key = String( item && ( item.key || item.meta_key || '' ) ).toLowerCase();
				if ( keys.indexOf( key ) !== -1 ) {
					return item.value || item.meta_value || '';
				}
			}
			return '';
		}

		for ( let index = 0; index < keys.length; index += 1 ) {
			if ( metaSource[ keys[ index ] ] !== undefined ) {
				return metaSource[ keys[ index ] ];
			}
		}

		return '';
	}

	function formatPrice( prices ) {
		if ( ! prices ) {
			return '';
		}

		if ( prices.price && prices.currency_symbol ) {
			const rawPrice = Number( prices.price ) / Math.pow( 10, prices.currency_minor_unit || 2 );
			return prices.currency_symbol + rawPrice.toFixed( prices.currency_minor_unit || 2 );
		}

		if ( prices.price_html ) {
			return stripHtml( prices.price_html );
		}

		return '';
	}

	function normalizeProduct( product ) {
		if ( ! product ) {
			return null;
		}

		const attributes = Array.isArray( product.attributes ) ? product.attributes : [];
		const ingredientAttribute = attributes.find( function ( attribute ) {
			const label = String( attribute.name || attribute.slug || '' ).toLowerCase();
			return label.indexOf( 'zutat' ) !== -1 || label.indexOf( 'ingredient' ) !== -1;
		} );
		const quantityAttribute = attributes.find( function ( attribute ) {
			const label = String( attribute.name || attribute.slug || '' ).toLowerCase();
			return label.indexOf( 'quantity' ) !== -1 || label.indexOf( 'menge' ) !== -1 || label.indexOf( 'size' ) !== -1;
		} );
		const ingredientMeta = findMetaValue( product.meta_data || product.meta || product.acf, [ 'zutaten', 'ingredients', '_zutaten', '_ingredients' ] );
		const quantityMeta = findMetaValue( product.meta_data || product.meta || product.acf, [ 'quantity', 'menge', '_quantity', '_menge' ] );
		const ingredients = normalizeIngredientParts( ingredientMeta ).length
			? normalizeIngredientParts( ingredientMeta )
			: extractAttributeValue( ingredientAttribute );
		const quantityParts = normalizeIngredientParts( quantityMeta ).length
			? normalizeIngredientParts( quantityMeta )
			: extractAttributeValue( quantityAttribute );

		return {
			id: product.id,
			name: decodeEntities( product.name || '' ),
			imageUrl: product.images && product.images[ 0 ] ? product.images[ 0 ].src : '',
			imageAlt: product.images && product.images[ 0 ] ? decodeEntities( product.images[ 0 ].alt || product.name || '' ) : decodeEntities( product.name || '' ),
			price: formatPrice( product.prices || product ),
			shortDescription: product.short_description || product.description || '',
			ingredients: ingredients.slice( 0, 8 ),
			quantity: quantityParts.join( ', ' ),
			permalink: product.permalink || ''
		};
	}

	function fetchProductsList() {
		return apiFetch( { path: '/wc/store/v1/products?per_page=100&page=1' } );
	}

	function fetchProductById( productId ) {
		return apiFetch( { path: '/wc/store/v1/products/' + productId } );
	}

	function productOptionLabel( product ) {
		return decodeEntities( product.name || '' );
	}

	function ProductCard( props ) {
		const product = props.product;

		return el(
			'article',
			{ className: 'zen-best-sellers__card' },
			el(
				'div',
				{ className: 'zen-best-sellers__top' },
				el(
					'h2',
					{ className: 'zen-best-sellers__title' },
					product.permalink
						? el( 'a', { className: 'zen-best-sellers__title-link', href: product.permalink }, product.name || __( 'Untitled product', 'zenctuary' ) )
						: product.name || __( 'Untitled product', 'zenctuary' )
				)
			),
			el(
				'div',
				{ className: 'zen-best-sellers__middle' },
				el(
					'div',
					{ className: 'zen-best-sellers__image-wrap' },
					product.imageUrl ? el( 'img', { src: product.imageUrl, alt: product.imageAlt || product.name || '' } ) : el( 'div', { className: 'zen-best-sellers__ingredients-empty' }, __( 'No image selected', 'zenctuary' ) )
				),
				el( 'div', { className: 'zen-best-sellers__separator', 'aria-hidden': 'true' } ),
				el(
					'div',
					{ className: 'zen-best-sellers__ingredients' },
					el( 'p', { className: 'zen-best-sellers__ingredients-label' }, __( 'Zutaten:', 'zenctuary' ) ),
					product.ingredients && product.ingredients.length
						? el(
								'ul',
								{ className: 'zen-best-sellers__ingredients-list' },
								product.ingredients.map( function ( ingredient, index ) {
									return el( 'li', { key: index }, ingredient );
								} )
						  )
						: el( 'p', { className: 'zen-best-sellers__ingredients-empty' }, __( 'Add ingredients via a product attribute or custom field.', 'zenctuary' ) )
				)
			),
			el(
				'div',
				{ className: 'zen-best-sellers__bottom' },
				el(
					'div',
					{ className: 'zen-best-sellers__pricing' },
					el( 'h4', { className: 'zen-best-sellers__price' }, product.price || '\u00a3' + '0.00' ),
					product.quantity ? el( 'div', { className: 'zen-best-sellers__quantity' }, product.quantity ) : null
				),
				el(
					'div',
					{ className: 'zen-best-sellers__description' },
					product.shortDescription ? el( RawHTML, null, product.shortDescription ) : __( 'Short description unavailable.', 'zenctuary' )
				)
			)
		);
	}

	function renderSlides( products ) {
		return products.map( function ( product ) {
			return el(
				'div',
				{ key: product.id, className: 'zen-best-sellers__slide' },
				el( ProductCard, { product: product } )
			);
		} );
	}

	function Edit( props ) {
		const attributes = props.attributes;
		const setAttributes = props.setAttributes;
		const [ availableProducts, setAvailableProducts ] = useState( [] );
		const [ isLoading, setIsLoading ] = useState( true );
		const [ errorMessage, setErrorMessage ] = useState( '' );
		const [ currentIndex, setCurrentIndex ] = useState( 0 );
		const selectedIds = Array.isArray( attributes.selectedProductIds ) ? attributes.selectedProductIds.slice( 0, 3 ) : [];
		const selectedProducts = Array.isArray( attributes.selectedProducts ) ? attributes.selectedProducts.filter( Boolean ) : [];
		const blockProps = useBlockProps( {
			className: 'is-editor-preview',
			style: Object.assign(
				{},
				getSpacingStyle( attributes.sectionPadding, 'padding' ),
				getSpacingStyle( attributes.sectionMargin, 'margin' )
			),
			'data-products-count': String( Math.max( 1, selectedProducts.length ) )
		} );

		useEffect( function () {
			let isMounted = true;

			fetchProductsList()
				.then( function ( products ) {
					if ( ! isMounted ) {
						return;
					}

					setAvailableProducts( Array.isArray( products ) ? products : [] );
					setErrorMessage( '' );
				} )
				.catch( function () {
					if ( isMounted ) {
						setErrorMessage( __( 'WooCommerce products could not be loaded. Please confirm WooCommerce is active and the Store API is available.', 'zenctuary' ) );
					}
				} )
				.finally( function () {
					if ( isMounted ) {
						setIsLoading( false );
					}
				} );

			return function () {
				isMounted = false;
			};
		}, [] );

		useEffect( function () {
			if ( ! selectedIds.length ) {
				if ( selectedProducts.length ) {
					setAttributes( { selectedProducts: [] } );
				}
				return;
			}

			let isMounted = true;

			Promise.all(
				selectedIds.map( function ( productId ) {
					return fetchProductById( productId ).then( normalizeProduct );
				} )
			).then( function ( products ) {
				if ( ! isMounted ) {
					return;
				}

				const normalizedProducts = products.filter( Boolean );
				const currentSignature = JSON.stringify( selectedProducts );
				const nextSignature = JSON.stringify( normalizedProducts );

				if ( currentSignature !== nextSignature ) {
					setAttributes( { selectedProducts: normalizedProducts } );
				}
			} ).catch( function () {
				if ( isMounted ) {
					setErrorMessage( __( 'Selected products could not be refreshed from WooCommerce.', 'zenctuary' ) );
				}
			} );

			return function () {
				isMounted = false;
			};
		}, [ JSON.stringify( selectedIds ) ] );

		useEffect( function () {
			setCurrentIndex( function ( current ) {
				return Math.min( current, Math.max( 0, selectedProducts.length - 1 ) );
			} );
		}, [ selectedProducts.length ] );

		function updateSelectedId( slotIndex, value ) {
			const nextIds = selectedIds.slice( 0, 3 );
			const normalizedValue = value ? parseInt( value, 10 ) : 0;

			while ( nextIds.length < 3 ) {
				nextIds.push( 0 );
			}

			nextIds[ slotIndex ] = normalizedValue;

			const cleanedIds = nextIds.filter( function ( item ) {
				return !! item;
			} ).filter( function ( item, index, values ) {
				return values.indexOf( item ) === index;
			} );

			setAttributes( { selectedProductIds: cleanedIds } );
		}

		const productOptions = useMemo( function () {
			return [ { label: __( 'Select a product', 'zenctuary' ), value: 0 } ].concat(
				availableProducts.map( function ( product ) {
					return {
						label: productOptionLabel( product ),
						value: product.id
					};
				} )
			);
		}, [ availableProducts ] );

		return el(
			Fragment,
			null,
			el(
				InspectorControls,
				null,
				el(
					PanelBody,
					{ title: __( 'Block Layout', 'zenctuary' ), initialOpen: true },
					el( ToggleControl, { label: __( 'Show Heading', 'zenctuary' ), checked: !! attributes.showHeading, onChange: function ( value ) { setAttributes( { showHeading: value } ); } } ),
					renderFourSideControls( __( 'Padding', 'zenctuary' ), attributes.sectionPadding, function ( value ) { setAttributes( { sectionPadding: value } ); } ),
					renderFourSideControls( __( 'Margin', 'zenctuary' ), attributes.sectionMargin, function ( value ) { setAttributes( { sectionMargin: value } ); } )
				),
				el(
					PanelBody,
					{ title: __( 'Select Product', 'zenctuary' ), initialOpen: true },
					isLoading ? el( Spinner ) : null,
					errorMessage ? el( Notice, { status: 'warning', isDismissible: false }, errorMessage ) : null,
					el( SelectControl, { label: __( 'Product 1', 'zenctuary' ), value: selectedIds[ 0 ] || 0, options: productOptions, onChange: function ( value ) { updateSelectedId( 0, value ); } } ),
					el( SelectControl, { label: __( 'Product 2', 'zenctuary' ), value: selectedIds[ 1 ] || 0, options: productOptions, onChange: function ( value ) { updateSelectedId( 1, value ); } } ),
					el( SelectControl, { label: __( 'Product 3', 'zenctuary' ), value: selectedIds[ 2 ] || 0, options: productOptions, onChange: function ( value ) { updateSelectedId( 2, value ); } } )
				)
			),
			el(
				'section',
				blockProps,
				attributes.showHeading ? el( 'h2', { className: 'zen-best-sellers__heading' }, __( 'Our Best Sellers', 'zenctuary' ) ) : null,
				selectedProducts.length > 1
					? el(
							'div',
							{ className: 'zen-best-sellers__nav' },
							el( 'button', { type: 'button', className: 'zen-best-sellers__nav-button zen-best-sellers__nav-button--prev', onClick: function () { setCurrentIndex( Math.max( 0, currentIndex - 1 ) ); }, disabled: currentIndex <= 0 }, '<' ),
							el( 'button', { type: 'button', className: 'zen-best-sellers__nav-button zen-best-sellers__nav-button--next', onClick: function () { setCurrentIndex( Math.min( selectedProducts.length - 1, currentIndex + 1 ) ); }, disabled: currentIndex >= selectedProducts.length - 1 }, '>' )
					  )
					: null,
				selectedProducts.length
					? el(
							'div',
							{ className: 'zen-best-sellers__viewport' },
							el(
								'div',
								{
									className: 'zen-best-sellers__track',
									style: window.innerWidth <= 781 ? { transform: 'translate3d(-' + ( currentIndex * 100 ) + '%, 0, 0)' } : undefined
								},
								renderSlides( selectedProducts )
							)
					  )
					: el( 'div', { className: 'zen-best-sellers__placeholder' }, __( 'Select up to three WooCommerce products to populate this block.', 'zenctuary' ) )
			)
		);
	}

	function Save( props ) {
		const attributes = props.attributes;
		const products = Array.isArray( attributes.selectedProducts ) ? attributes.selectedProducts.filter( Boolean ).slice( 0, 3 ) : [];
		const blockProps = useBlockProps.save( {
			style: Object.assign(
				{},
				getSpacingStyle( attributes.sectionPadding, 'padding' ),
				getSpacingStyle( attributes.sectionMargin, 'margin' )
			),
			'data-products-count': String( Math.max( 1, products.length ) ),
			'data-current-index': '0'
		} );

		return el(
			'section',
			blockProps,
			attributes.showHeading ? el( 'h2', { className: 'zen-best-sellers__heading' }, __( 'Our Best Sellers', 'zenctuary' ) ) : null,
			products.length > 1
				? el(
						'div',
						{ className: 'zen-best-sellers__nav' },
						el( 'button', { type: 'button', className: 'zen-best-sellers__nav-button zen-best-sellers__nav-button--prev', 'aria-label': __( 'Previous product', 'zenctuary' ), disabled: true }, '<' ),
						el( 'button', { type: 'button', className: 'zen-best-sellers__nav-button zen-best-sellers__nav-button--next', 'aria-label': __( 'Next product', 'zenctuary' ) }, '>' )
				  )
				: null,
			products.length
				? el(
						'div',
						{ className: 'zen-best-sellers__viewport' },
						el( 'div', { className: 'zen-best-sellers__track' }, renderSlides( products ) )
				  )
				: null
		);
	}

	registerBlockType( 'zenctuary/zen-our-best-sellers', {
		apiVersion: 3,
		title: 'Our Best Sellers',
		category: 'widgets',
		icon: 'products',
		attributes: {
			showHeading: { type: 'boolean', default: true },
			sectionPadding: { type: 'object', default: defaultSpacing() },
			sectionMargin: { type: 'object', default: defaultSpacing() },
			selectedProductIds: { type: 'array', default: [] },
			selectedProducts: { type: 'array', default: [] }
		},
		supports: {
			html: false,
			anchor: true,
			align: [ 'wide', 'full' ]
		},
		edit: Edit,
		save: Save
	} );
}( window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n, window.wp.apiFetch ) );
