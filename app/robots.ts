import type {MetadataRoute} from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/*", "/admin/*"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}

/**
 * robots.ts - Web Crawler Configuration File
 *
 * This 'robots.ts' file generates a 'robots.txt' file that provides instructions to web robots
 * (also known as web crawlers or bots) on which pages they are allowed or disallowed to access
 * and index on a website. The robots.txt file should be placed in the root directory of the website
 * (e.g., https://www.example.com/robots.txt), and it acts as a request to bots to follow these
 * guidelines before crawling any other pages.
 *
 * The file consists of specific directives such as 'User-agent', 'Disallow', and 'Allow' to manage
 * access for different robots. By using this file, site owners can limit the visibility of certain
 * parts of the site to search engines, enhance privacy, or avoid indexing irrelevant content.
 *
 * Robots that choose to follow the instructions will fetch this file first and use the rules before
 * crawling any other page. If this file is missing, bots assume there are no restrictions and will
 * crawl the entire site. A robots.txt file is especially important for search engine crawlers like
 * Googlebot, which respect the guidelines provided within it.
 *
 * While it is possible to restrict crawling in robots.txt, links to pages listed in the file might
 * still appear in search engine results if they are linked to from other crawled pages.
 *
 * It is important to note that a robots.txt file applies to one specific origin. If a website has
 * multiple subdomains, each subdomain must have its own robots.txt file. For example, the rules
 * defined for 'example.com' would not apply to 'a.example.com' unless a robots.txt file is also
 * placed on the subdomain. Additionally, each protocol (HTTP, HTTPS) and port (e.g.,
 * http://example.com:8080) needs a separate robots.txt file.
 *
 * This file helps manage SEO effectively by ensuring search engines only index and follow the most
 * relevant pages of a website, preventing unnecessary load or indexing of irrelevant content.
 */
