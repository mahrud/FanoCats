module HashFilters
  def subdict(input, *keys)
    return {} unless input.respond_to?(:to_h)

    hash = input.to_h
    result = {}

    keys.flatten.each do |key|
      k = key.to_s
      if hash.key?(k)
        result[k] = hash[k]
      elsif hash.key?(key)
        result[key] = hash[key]
      end
    end

    result
  end
end

Liquid::Template.register_filter(HashFilters)
