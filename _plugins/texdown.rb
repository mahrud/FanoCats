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

def capture_M2(lines)
  stdin, stdouterr, proc = Open3.popen2e("M2", *M2_args)
  stdin.puts lines.join("\n")
  stdin.puts "exit(0)"
  output = stdouterr.readlines().join("")
  stdin.close
  stdouterr.close

  if proc.value.success?
    # split, then drop first and last entries
    return output.split(M2_output_RE)[1..-2]
  else
    STDERR.puts output
    raise "M2 process failed with status #{proc.value.exitstatus}"
  end
end

class Kramdown::Converter::Html
  alias :old_initialize :initialize

  def initialize(root, options)
    old_initialize(root, options)

    @M2_counter = 0
    if 0 < @root.options[:M2].count
      print "\t Capturing M2 output ... "
      @M2_output = capture_M2(@root.options[:M2])
      puts "done!"
    end
  end

  M2_table_template = "<figure class=\"language-macaulay2\">\n%{row}</figure>"
  M2_example_template = "<pre><code>%{content}</code></pre>"

  def convert_M2(el, indent)
    s, e = @M2_counter, @M2_counter += el.value.lines.count
    rows = @M2_output[s .. e-1]
    M2_table_template % {
      row: rows.map { |content|
        M2_example_template % { content: content }
      }.join
    }
  end

  # LaTeX content will be rendered by KaTeX
  def convert_math(el, indent)
    "#{el.value}"
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
