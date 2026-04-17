require 'set'

class ToricHelixPage < Jekyll::Page
  def initialize(site, base, dir, data_key, variety)
    @site = site
    @base = base
    @dir = dir
    @name = 'index.md'

    process(@name)

    self.data = {
      'layout' => 'page',
      'title' => 'HelixCats',
      'variety' => variety,
      'helix' => site.data[data_key],
    }

    self.content = <<~MARKDOWN
      ## #{self.class.heading(variety)}
      {% include table.helix.html %}
    MARKDOWN
  end

  def self.heading(variety)
    "Partial helix of exceptional collections on #{latex_variety(variety)}"
  end

  def self.latex_variety(variety)
    variety.gsub(/P(\d+)/, '$\\PP^\1$').gsub(/H(\d+)/, '$\\mathbb{H}_\1$')
  end
end

class HelixPagesGenerator < Jekyll::Generator
  safe true
  priority :low

  DATA_KEY_PATTERN = /\Ahelix-(.+)\z/

  def generate(site)
    existing_urls = site.pages.map(&:url).to_set

    site.data.keys.sort.each do |data_key|
      match = DATA_KEY_PATTERN.match(data_key)
      next unless match

      variety = match[1]
      url = "/#{data_key}/"
      next if existing_urls.include?(url)

      page = ToricHelixPage.new(site, site.source, data_key, data_key, variety)
      site.pages << page
      existing_urls << page.url
    end
  end
end
