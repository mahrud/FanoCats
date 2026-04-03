module MatrixFilters
  def latex_matrix(input, transpose = false)
    columns = parse_brace_list(input.to_s.strip)
    return input if columns.empty?

    widths = columns.map(&:length).uniq
    raise ArgumentError, "matrix columns must all have the same length" unless widths.length == 1

    rows = transpose ? columns.transpose : columns
    rows = rows.map { |row| row.join(' & ') }
    "\\begin{pmatrix}#{rows.join(' \\\\ ')}\\end{pmatrix}".gsub(/\*/, '')
  end

  def parse_brace_list(source)
    parser = BraceListParser.new(source)
    parsed = parser.parse
    unless parsed.is_a?(Array) && parsed.all? { |entry| entry.is_a?(Array) }
      raise ArgumentError, "expected a list of lists"
    end

    parsed
  rescue StandardError => e
    raise ArgumentError, "invalid matrix input: #{e.message}"
  end
end

class BraceListParser
  def initialize(source)
    @source = source
    @index = 0
  end

  def parse
    skip_whitespace
    list = parse_list
    skip_whitespace
    raise ArgumentError, "unexpected trailing input" unless eof?

    list
  end

  private

  def parse_list
    consume('{')
    values = []

    loop do
      skip_whitespace
      break if peek == '}'

      values << parse_value
      skip_whitespace
      break if peek == '}'

      consume(',')
    end

    consume('}')
    values
  end

  def parse_value
    peek == '{' ? parse_list : parse_atom
  end

  def parse_atom
    start = @index
    advance while !eof? && !['{', '}', ','].include?(peek)
    value = @source[start...@index].strip

    raise ArgumentError, "empty matrix entry" if value.empty?

    value
  end

  def skip_whitespace
    advance while !eof? && whitespace?(peek)
  end

  def consume(char)
    raise ArgumentError, "expected '#{char}'" unless peek == char

    advance
  end

  def peek
    @source[@index]
  end

  def advance
    @index += 1
  end

  def eof?
    @index >= @source.length
  end

  def whitespace?(char)
    char.match?(/\s/)
  end
end

Liquid::Template.register_filter(MatrixFilters)
