module MatrixFilters
  CELL_SIZE = 7
  T_COLORS = {
    1 => '#c00',
    2 => '#e66a00',
    3 => '#c0a000',
    4 => '#008800',
    5 => '#0070c0',
    6 => '#00c'
  }.freeze

  def latex_matrix(input, transpose = false)
    rows = matrix_rows(input, transpose)
    return input if rows.empty?

    latex_from_rows(rows)
  end

  def matrix_preview(input, transpose = false, force_svg = false, column_limit = 20)
    rows = matrix_rows(input, transpose)
    return input if rows.empty?

    force_svg = force_svg || rows.first.length > column_limit.to_i
    force_svg ? minimal_matrix_svg(rows) : "$#{latex_from_rows(rows)}$"
  end

  def strip_times(input)
    input.gsub(/\*/, '')
  end

  def normalize_grouped_superscripts(input)
    input.gsub(/\^\(([^()]*)\)/, '^{\1}')
  end

  def matrix_rows(input, transpose = false)
    columns = parse_brace_list(input.to_s.strip)
    return [] if columns.empty?

    widths = columns.map(&:length).uniq
    raise ArgumentError, "matrix columns must all have the same length" unless widths.length == 1

    transpose ? columns.transpose : columns
  end

  def latex_from_rows(rows)
    rows = rows.map do |row|
      row.map { |entry| normalize_grouped_superscripts(entry) }.join(' & ')
    end
    "\\begin{pmatrix}#{rows.join(' \\\\ ')}\\end{pmatrix}".gsub(/\*/, '')
  end

  def minimal_matrix_svg(rows)
    width = rows.first.length * CELL_SIZE
    height = rows.length * CELL_SIZE
    black = +''
    t_paths = Hash.new { |paths, exponent| paths[exponent] = +'' }

    rows.each_with_index do |row, y_index|
      row.each_with_index do |entry, x_index|
        next if entry == '0'

        x = x_index * CELL_SIZE
        y = y_index * CELL_SIZE
        path = "M#{x} #{y}h#{CELL_SIZE}v#{CELL_SIZE}h-#{CELL_SIZE}z"
        exponent = t_exponent(entry)
        exponent ? t_paths[exponent] << path : black << path
      end
    end

    svg = %(<svg class="minimal-matrix" width="#{width}" height="#{height}" viewBox="0 0 #{width} #{height}" role="img" aria-label="#{rows.length} by #{rows.first.length} matrix preview" shape-rendering="crispEdges">)
    svg << %(<path fill="#000" d="#{black}"/>) unless black.empty?
    T_COLORS.each do |exponent, color|
      path = t_paths[exponent]
      svg << %(<path fill="#{color}" d="#{path}"/>) unless path.empty?
    end
    svg << %(</svg>)
  end

  def t_exponent(entry)
    exponents = entry.scan(/T(?:\^\(?(-?\d+)\)?)?/).map do |match|
      match[0].nil? || match[0].empty? ? 1 : match[0].to_i
    end
    return nil if exponents.empty?

    [[exponents.max, 1].max, 6].min
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
