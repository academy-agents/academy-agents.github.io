source "https://rubygems.org"

# The site is built by .github/workflows/deploy.yml, which uses this Gemfile.
# Keep local and CI versions in sync by committing Gemfile.lock.
gem "jekyll", "~> 4.4"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"    # /feed.xml
  gem "jekyll-seo-tag", "~> 2.8"  # <title>, description, Open Graph, Twitter cards
  gem "jekyll-sitemap", "~> 1.4"  # /sitemap.xml
end

# Local preview server.
gem "webrick", "~> 1.8"

# Stdlib gems unbundled from Ruby 3.4+ that Jekyll's dependencies still expect.
gem "base64"
gem "bigdecimal"
gem "csv"
gem "logger"
