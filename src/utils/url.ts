/**
 * Resolves the base URL for the current environment.
 * Used for authentication redirects and other environment-specific URLs.
 */
export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  
  // Ensure the URL has EXACTLY one trailing slash
  url = url.replace(/\/+$/, '') + '/';
  
  return url;
};
