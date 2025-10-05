
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  noindex?: boolean;
  canonical?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqSchema?: Array<{ question: string; answer: string }>;
  videoSchema?: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration?: string;
  };
}

const SEO: React.FC<SEOProps> = ({
  title = "Chetna_AI - Your Mental Wellness Companion",
  description = "Experience compassionate AI support for anxiety, depression, stress, and mental health challenges with Chetna_AI. Get personalized mental wellness guidance 24/7.",
  keywords = "mental health, AI therapy, anxiety help, depression support, stress management, emotional wellness, Chetna AI, mental wellness companion, therapy chat, psychological support",
  image = "https://chetna.live/og-image.png",
  url = "https://chetna.live",
  type = "website",
  article,
  noindex = false,
  canonical,
  breadcrumbs,
  faqSchema,
  videoSchema
}) => {
  // Add error boundary protection
  try {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : "WebSite",
      "name": title,
      "description": description,
      "url": url,
      "image": image,
      ...(type === "website" && {
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://chetna.live/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }),
      ...(type === "article" && article && {
        "headline": title,
        "datePublished": article.publishedTime,
        "dateModified": article.modifiedTime,
        "author": {
          "@type": "Person",
          "name": article.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Chetna AI",
          "logo": {
            "@type": "ImageObject",
            "url": "https://chetna.live/logo.png"
          }
        }
      })
    };

    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Chetna AI",
      "url": "https://chetna.live",
      "logo": "https://chetna.live/logo.png",
      "description": "AI-powered mental wellness companion providing compassionate support for mental health challenges",
      "sameAs": [
        "https://twitter.com/Keshav_Kumar_04"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-XXX-XXX-XXXX",
        "contactType": "customer service",
        "email": "keshavkumarhf@gmail.com"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "95",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    // Breadcrumb Schema
    const breadcrumbSchema = breadcrumbs ? {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    } : null;

    // FAQ Schema
    const faqSchemaData = faqSchema ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqSchema.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    } : null;

    // Video Schema
    const videoSchemaData = videoSchema ? {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": videoSchema.name,
      "description": videoSchema.description,
      "thumbnailUrl": videoSchema.thumbnailUrl,
      "uploadDate": videoSchema.uploadDate,
      "duration": videoSchema.duration,
      "contentUrl": url
    } : null;

    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Keshav Kumar" />
        
        {/* Canonical URL */}
        {canonical && <link rel="canonical" href={canonical} />}
        
        {/* Robots meta */}
        <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content="Chetna AI" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Keshav_Kumar_04" />
        <meta name="twitter:creator" content="@Keshav_Kumar_04" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        
        {/* Article specific meta tags */}
        {type === "article" && article && (
          <>
            <meta property="article:published_time" content={article.publishedTime} />
            <meta property="article:modified_time" content={article.modifiedTime} />
            <meta property="article:author" content={article.author} />
            <meta property="article:section" content={article.section} />
            {article.tags?.map(tag => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
          </>
        )}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationData)}
        </script>
        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}
        {faqSchemaData && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchemaData)}
          </script>
        )}
        {videoSchemaData && (
          <script type="application/ld+json">
            {JSON.stringify(videoSchemaData)}
          </script>
        )}
        
        {/* Additional SEO meta tags */}
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Helmet>
    );
  } catch (error) {
    console.error('SEO component error:', error);
    // Return minimal helmet if there's an error
    return (
      <Helmet>
        <title>Chetna_AI - Your Mental Wellness Companion</title>
        <meta name="description" content="Experience compassionate AI support for mental health challenges with Chetna_AI." />
      </Helmet>
    );
  }
};

export default SEO;
