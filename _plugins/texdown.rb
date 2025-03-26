# Implements support for simple LaTeX math blocks,
# enclosed in $..$, $$..$$, \(..\), and \[..\].

require 'kramdown/parser/gfm'

class Kramdown::Parser::TeXdown < Kramdown::Parser::GFM
  # we replace the default parser kramdown/parser/kramdown.rb
  # see https://kramdown.gettalong.org/rdoc/Kramdown/Parser/Kramdown.html
  def initialize(source, options)
    super
    @block_parsers.delete(:block_math)
    @block_parsers.unshift(:tex_math)
    @block_parsers.unshift(:M2)
    @span_parsers.delete(:inline_math)
    @span_parsers.unshift(:tex_math)
    @root.options[:M2] = []
  end

  TEX_MATH_START = /((\$\$?).+?\k<-1>|\\\(.+?\\\)|\\\[.+?\\\])/m

  def parse_tex_math
    start_line_number = @src.current_line_number
    @src.pos += @src.matched_size
    @tree.children << new_block_el(:math, @src[0].strip, nil, category: :span, location: start_line_number)
  end
  define_parser(:tex_math, TEX_MATH_START)

  M2_START = /~~~m2(.*?)~~~/m

  def parse_M2
    start_line_number = @src.current_line_number
    @src.pos += @src.matched_size
    @root.options[:M2] << @src[1].strip
    @tree.children << new_block_el(:M2, @src[1].strip, nil, category: :block, location: start_line_number)
  end
  define_parser(:M2, M2_START)
end

require 'kramdown/converter/html'

# see m2/examples.m2
M2_output_RE = /\n+(?=i+[1-9][0-9]* : )/
M2_args = "--silent --print-width 0 --stop " \
  "--int --no-readline -q --no-randomize".split

class Kramdown::Converter::Html
  def initialize(root, options)
    super
    @footnote_counter = @footnote_start = @options[:footnote_nr]
    @footnotes = []
    @footnotes_by_name = {}
    @footnote_location = nil
    @toc = []
    @toc_code = nil
    @indent = 2
    @stack = []

    # stash string representation of symbol to avoid allocations from multiple interpolations.
    @highlighter_class = " highlighter-#{options[:syntax_highlighter]}"
    @dispatcher = Hash.new {|h, k| h[k] = :"convert_#{k}" }

    @M2_counter = 0

    Open3.popen2e("M2", *M2_args) do |stdin, stdouterr, proc|
      puts "running M2 ..."
      stdin.puts @root.options[:M2].join("\n")
      stdin.puts "exit(0)"
      output = stdouterr.readlines().join("")
      puts "done!"
      stdin.close
      stdouterr.close

      if proc.value.success?
        @M2out = output.split(M2_output_RE)[1..-2] # split, then drop first and last entries
      else
        raise "*** M2 process failed with status #{proc.value.exitstatus}:\n#{output}"
      end
    end
  end

  def convert_math(el, indent)
    "#{el.value}"
  end

  M2_table_template = "<figure class=\"highlight\">\n%{row}</figure>"
  M2_example_template = "<pre class=\"language-macaulay2\"><code>%{content}</code></pre>"

  def convert_M2(el, indent)
    s, e = @M2_counter, @M2_counter += el.value.lines.count
    rows = @M2out[s .. e-1]
    M2_table_template % { row: rows.map { |content| M2_example_template % { content: content } }.join }
  end
end

class M2Block < Liquid::Raw
  # Class of Macaulay2 blocks, designated as {% M2 [src] %} ... {% endM2 %}
  def initialize(tag_name, markup, parse_context)
    @source = markup.split[0]
    markup = ''
    super
  end

  def render(_context)
    "~~~m2\n#{@body}\n~~~"
  end
end

Liquid::Template.register_tag('M2', M2Block)
