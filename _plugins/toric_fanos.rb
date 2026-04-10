require 'set'

class ToricFanoPage < Jekyll::Page
  def initialize(site, base, dir, data_key, dim, rho)
    @site = site
    @base = base
    @dir = dir
    @name = 'index.md'

    process(@name)

    self.data = {
      'layout' => 'page',
      'title' => 'FanoCats',
      'class' => "fano-#{dim}",
      'varieties' => site.data[data_key],
    }

    self.content = <<~MARKDOWN
      ## #{self.class.heading(dim, rho)}
      {% include table.toric.html %}
    MARKDOWN
  end

  def self.heading(dim, rho)
    qualifier = if rho == 2
      'with $\\rho\\leq2$'
    else
      "with $\\rho=#{rho}$"
    end

    "Smooth Fano Toric #{dim}-folds #{qualifier}"
  end
end

class ToricPagesGenerator < Jekyll::Generator
  safe true
  priority :low

  DATA_KEY_PATTERN = /\Afano-(\d+)-(\d+)\z/

  def generate(site)
    existing_urls = site.pages.map(&:url).to_set

    site.data.keys.sort.each do |data_key|
      match = DATA_KEY_PATTERN.match(data_key)
      next unless match

      dim = match[1].to_i
      rho = match[2].to_i
      url = "/#{data_key}/"
      next if existing_urls.include?(url)

      page = ToricFanoPage.new(site, site.source, data_key, data_key, dim, rho)
      site.pages << page
      existing_urls << page.url
    end
  end
end
