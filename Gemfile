# frozen_string_literal: true

# Gemfile for Jekyll GitHub Pages deployment
# This file specifies Ruby gem dependencies for the Jekyll site

source "https://rubygems.org"

# Specify Ruby version for consistency across environments
ruby "~> 3.1.0"

# Jekyll core - the static site generator
gem "jekyll", "~> 4.3.0"

# Required for Ruby 3.0+ compatibility
# Provides HTTP server functionality for local development
gem "webrick", "~> 1.7"

# Jekyll plugins for enhanced functionality and SEO
group :jekyll_plugins do
  # Generates Atom feed for your posts
  gem "jekyll-feed", "~> 0.12"
  
  # Automatically generates sitemap.xml for better SEO
  gem "jekyll-sitemap", "~> 1.4"
  
  # Adds SEO meta tags to your site
  gem "jekyll-seo-tag", "~> 2.8"
  
  # Minifies HTML, CSS, and JavaScript for better performance
  gem "jekyll-minifier", "~> 0.1"
  
  # Generates redirects for moved pages
  gem "jekyll-redirect-from", "~> 0.16"
  
  # Compresses images for faster loading
  gem "jekyll-imageoptim", "~> 0.2", require: false
  
  # GitHub Pages compatible plugins
  gem "jekyll-github-metadata", "~> 2.13"
end

# Performance and optimization gems
group :development do
  # Faster file watching on macOS/Linux
  gem "listen", "~> 3.0"
  
  # Live reload for development
  gem "jekyll-livereload", "~> 0.2"
  
  # Better error reporting
  gem "jekyll-compose", "~> 0.12"
end

# Platform-specific gems for cross-platform compatibility
platforms :mingw, :x64_mingw, :mswin, :jruby do
  # Windows timezone support
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
  
  # Windows-specific SSL certificate bundle
  gem "wincertstore"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock http_parser.rb gem to v0.6.x on JRuby builds for compatibility
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# Security and maintenance gems
group :production do
  # HTML proofer for link checking and validation
  gem "html-proofer", "~> 4.0", require: false
  
  # Security vulnerability scanner
  gem "bundler-audit", "~> 0.9", require: false
end

# Optional theme gems (uncomment if using a specific theme)
# gem "minima", "~> 2.5"
# gem "jekyll-theme-minimal", "~> 0.2"
# gem "jekyll-theme-architect", "~> 0.2"

# Additional utility gems
group :development, :test do
  # Code formatting and linting
  gem "rubocop", "~> 1.0", require: false
  
  # Testing framework for Jekyll sites
  gem "rspec", "~> 3.0", require: false
end
