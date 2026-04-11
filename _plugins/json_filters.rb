require "json"

module JsonFilters
  def parse_json(input)
    JSON.parse(input)
  end
end

Liquid::Template.register_filter(JsonFilters)
