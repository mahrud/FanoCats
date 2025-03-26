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
    @span_parsers.delete(:inline_math)
    @span_parsers.unshift(:tex_math)
  end

  TEX_MATH_START = /((\$\$?).+?\k<-1>|\\\(.+?\\\)|\\\[.+?\\\])/m

  def parse_tex_math
    start_line_number = @src.current_line_number
    @src.pos += @src.matched_size
    @tree.children << new_block_el(:math, @src[0].strip, nil, category: :span, location: start_line_number)
  end
  define_parser(:tex_math, TEX_MATH_START)
end

require 'kramdown/converter/html'

class Kramdown::Converter::Html
  def convert_math(el, indent)
    "#{el.value}"
  end
end
