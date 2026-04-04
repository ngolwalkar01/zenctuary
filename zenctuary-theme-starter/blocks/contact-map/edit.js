import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, MediaPlaceholder, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { mapEmbedUrl, imageUrl, imageAlt, schedule, address, email, phone } = attributes;

    const blockProps = useBlockProps();

    const onSelectImage = (media) => {
        setAttributes({
            imageUrl: media.url,
            imageId: media.id,
            imageAlt: media.alt
        });
    };

    return (
        <div { ...blockProps }>
            <InspectorControls>
                <PanelBody title={__('Map Settings', 'zenctuary')}>
                    <TextControl
                        label={__('Google Maps Embed src URL', 'zenctuary')}
                        value={mapEmbedUrl}
                        onChange={(value) => setAttributes({ mapEmbedUrl: value })}
                        help={__('Paste the URL found inside the src="" attribute of your Google Maps Embed code.', 'zenctuary')}
                    />
                </PanelBody>
            </InspectorControls>

            <div style={{ backgroundColor: '#2a2a2a', padding: '40px', borderRadius: '16px', display: 'flex', gap: '32px', flexDirection: 'column' }}>
                
                <h2 style={{ color: '#fff', margin: 0 }}>Contact Map configuration</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    
                    {/* Map config side */}
                    <div style={{ background: '#333', padding: '20px', borderRadius: '8px' }}>
                        <h4 style={{ color: '#aaa', marginTop: 0 }}>Left Side (Map Embed)</h4>
                        <TextControl
                            label={__('Google Maps URL', 'zenctuary')}
                            value={mapEmbedUrl}
                            onChange={(value) => setAttributes({ mapEmbedUrl: value })}
                        />
                        {mapEmbedUrl ? (
                            <iframe src={mapEmbedUrl} width="100%" height="200" style={{ border: 0 }} />
                        ) : (
                            <div style={{ height: '200px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>No Map URL Provided</div>
                        )}
                    </div>

                    {/* Image config side */}
                    <div style={{ background: '#333', padding: '20px', borderRadius: '8px' }}>
                        <h4 style={{ color: '#aaa', marginTop: 0 }}>Right Side (Statue Image)</h4>
                        {imageUrl ? (
                            <div>
                                <img src={imageUrl} alt={imageAlt} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                <Button isSecondary onClick={() => setAttributes({ imageUrl: null, imageId: null })} style={{ marginTop: '10px' }}>
                                    Remove Image
                                </Button>
                            </div>
                        ) : (
                            <MediaPlaceholder
                                onSelect={onSelectImage}
                                allowedTypes={['image']}
                                multiple={false}
                                labels={{ title: 'Select Image' }}
                            />
                        )}
                    </div>

                </div>

                {/* Overlap Info Config */}
                <div style={{ background: '#333', padding: '30px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#aaa', marginTop: 0 }}>Contact Details (Center Box)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#888', marginBottom: '4px' }}>Schedule/Hours</label>
                            <RichText
                                tagName="div"
                                value={schedule}
                                onChange={(val) => setAttributes({ schedule: val })}
                                style={{ background: '#111', color: '#fff', padding: '10px', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#888', marginBottom: '4px' }}>Address Info</label>
                            <RichText
                                tagName="div"
                                value={address}
                                onChange={(val) => setAttributes({ address: val })}
                                style={{ background: '#111', color: '#fff', padding: '10px', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#888', marginBottom: '4px' }}>Email</label>
                            <RichText
                                tagName="div"
                                value={email}
                                onChange={(val) => setAttributes({ email: val })}
                                style={{ background: '#111', color: '#fff', padding: '10px', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#888', marginBottom: '4px' }}>Phone</label>
                            <RichText
                                tagName="div"
                                value={phone}
                                onChange={(val) => setAttributes({ phone: val })}
                                style={{ background: '#111', color: '#fff', padding: '10px', borderRadius: '4px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
