// Google Analytics Configuration
// Replace G-XXXXXXXXXX with your actual Google Analytics Measurement ID

(function() {
  // Check if analytics is already loaded
  if (window.gtag) {
    return;
  }

  // Google Analytics 4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  // Configure Google Analytics
  gtag('config', 'G-XXXXXXXXXX', {
    send_page_view: false, // We'll handle page views manually via React
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  // Make gtag available globally
  window.gtag = gtag;

  // Track initial page view
  gtag('event', 'page_view', {
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    page_location: window.location.href,
  });
})();
