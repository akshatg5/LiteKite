import { Helmet } from 'react-helmet-async';

const MetadataComponent = ({ 
  title = 'Litekite - All in one Mock-stock exchange. Trade without real money.', 
  description = 'All in one Mock-stock exchange. Trade without real money.', 
  imageUrl = 'https://litekite.vercel.app/litekiteLanding.png',
  url = 'https://litekite.vercel.app/' 
}) => {
  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default MetadataComponent;