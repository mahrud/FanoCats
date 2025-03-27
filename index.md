---
layout: page
title: Learn Macaulay2
---

{::options parse_block_html="true" /}

[_Macaulay2_](https://macaulay2.com/) is an interpreted, dynamically typed programming language intended to support research and experiments in [algebraic geometry] and [commutative algebra] through open sourced software.

{% comment %}
**Interested in contributing?** [Get in touch!](mailto:mahrud@fields.utoronto.ca)
{: style="background-color: #fef5c4; border-left: 8px solid #FADF98; padding: 10px 30px;"}
{% endcomment %}

[algebraic geometry]: https://en.wikipedia.org/wiki/Algebraic_geometry
[commutative algebra]: https://en.wikipedia.org/wiki/Commutative_algebra

---

#### A First Example
{:.label}

<div class="row">
 <div class="col-lg-12 col-md-12">
  Here is an example of how to compute the minimal free resolution of the [_twisted cubic_](examples/twisted-cubic):
 </div><div class="col-md-6">
#### Code:
```
R = QQ[x, y, z, w]; -- defines a ring
I = monomialCurveIdeal(R, {1, 2, 3})
C = res I -- computes the resolution
betti I -- displays the Betti table
```
<br />

#### Getting help:
```
-- quick usage information
? monomialCurveIdeal
```
```
-- details and examples
help monomialCurveIdeal
```
```
-- documentation on the web
viewHelp monomialCurveIdeal
```
```
-- documentation headlines about curves
headlines about "curve"
```
<br />
**Also try**: (either click or copy & enter in M2)
{: style="margin-bottom: 0px"}
- [`help "reading the documentation"`](help/#Macaulay2Doc::reading the documentation)
- [`help "getting help or reporting bugs"`](help/#Macaulay2Doc::getting help or reporting bugs)
- [`help "Tutorial: Modules in Macaulay2"`](help/#Macaulay2Doc::Tutorial: Modules in Macaulay2)
- [`help "computing Groebner bases"`](help/#Macaulay2Doc::computing Groebner bases)

 </div>
 <div class="col-md-6">
#### Result:
{% M2 index %}
R = QQ[x, y, z, w];
I = monomialCurveIdeal(R, {1, 2, 3})
C = res I
betti C
{% endM2 %}
 </div>
</div>

<div class="row">
 <div class="col-12" style="text-align: center">
  <a class="btn btn-sm btn-outline-primary" href="download">Download Macaulay2</a>
  <a class="btn btn-sm btn-outline-primary" href="https://www.unimelb-macaulay2.cloud.edu.au">Try M2 in a Browser</a>
 </div>
</div>

---

<div class="row justify-content-around">
 <div class="col-auto feature">
  <h4>Learn by Reading</h4>
  - [Getting Started](help/#Macaulay2Doc::Macaulay2Doc#getting-started)
  - [Computations Book](book)
  {% comment %}
  - [Cheat Sheet](cheatsheet)
  - [Beginning Macaulay2](packages/#BeginningMacaulay2)
  {% endcomment %}
 </div>

 <div class="col-auto feature">
  <h4>Learn by Writing</h4>
  - [A first Macaulay2 session](help/#Macaulay2Doc::Macaulay2Doc#a first Macaulay2 session)
  - [Project Ideas](https://github.com/Macaulay2/M2/wiki/Projects)
  {% comment %}
  - [Editors and Workflows](examples)
  {% endcomment %}
 </div>

 <div class="col-auto feature">
  <h4>Package Development</h4>
  - [M2 Style Guide](https://github.com/Macaulay2/M2/wiki/Package-Writing-Style-Guide)
  - [Package directory](packages)
 </div>

 <div class="col-auto feature">
  <h4>Documentation</h4>
  - [Language Reference](help/#Macaulay2Doc::The Macaulay2 language)
  - [Internal Notes](https://github.com/Macaulay2/M2/wiki/Internals%3A-Meeting-Notes)
  - [Source Code](https://github.com/Macaulay2/M2)
 </div>

 <div class="col-auto feature">
  <h4>M2 for Research</h4>
  - [JSAG](https://msp.org/jsag/about/journal/about.html)
  {% comment %}
  - [Citing Macaulay2](citing)
  - [Books and Articles](https://faculty.math.illinois.edu/Macaulay2/Publications)
  {% endcomment %}
 </div>

 <div class="col-auto feature">
  <h4>Events & Community</h4>
  - [Workshops](events)
  - [Slack Workspace](https://m2internals.slack.com/)
  - [Google Groups](https://groups.google.com/group/macaulay2)
 </div>
</div>

---

<div class="row justify-content-around align-items-center">
 <div class="col-2 feature">
   [![](https://www.gnu.org/software/emacs/images/emacs.png){:.feature}](https://www.gnu.org/software/emacs/)
 </div>

 <div class="col feature">
  The recommended IDE for using Macaulay2 in research is [Emacs](editors). \\
  Community plugins are also available for
  [Vim](https://github.com/Macaulay2/M2/tree/master/M2/Macaulay2/editors/vim),
  [Atom](https://github.com/Macaulay2/language-macaulay2),
  [VSCode](https://github.com/coreysharris/vscode-macaulay2), and
  [Sublime](https://github.com/Macaulay2/M2/wiki/Using-Macaulay2-with-Sublime).
  
  Here are some screenshots of Macaulay2's interface in Emacs:
 </div>
</div>

<div class="row">
{%- for i in (0..3) -%}
{%- assign screenshot = site.baseurl | append: "/static/emacs" | append: i | append: ".png" -%}
 <div class="col-3 feature">
  [![]({{ screenshot }}){:.feature}]({{ screenshot }})
 </div>
{%- endfor -%}
</div>

---

{% comment %}
<div class="row justify-content-around align-items-center">
 <div class="col feature">
  Development of Macaulay2 by [Daniel R. Grayson](https://faculty.math.illinois.edu/~dan/)
  and [Michael E. Stillman](https://math.cornell.edu/michael-e-stillman) has been funded
  by the National Science Foundation since 1992. We also acknowledge our many
  [contributors](contribute), [software libraries] used by Macaulay2,
  as well as [Macaulay](https://www.math.columbia.edu/~bayer/Macaulay/),
  the predecessor of Macaulay2 written by Dave Bayer and Michael Stillman. \\
  The namesake of Macaulay2 is [Francis Macaulay FRS](https://en.wikipedia.org/wiki/Francis_Sowerby_Macaulay).
 </div>

 <div class="col-2 feature">
  [![]({{ site.url }}{{ site.baseurl }}/static/NSF.jpg){:.feature}](https://www.nsf.gov/)
 </div>
</div>

[software libraries]: {{site.baseurl }}/packages/#Macaulay2Doc::Copyright and license

<!--
<div class="row justify-content-around align-items-center">
 <div class="col feature">
 - A random paper referring to Macaulay2: <script type="text/javascript">citation();</script>
 - A random Macaulay2 package: <script type="text/javascript">documentation();</script>
 </div>
</div>
-->
{% endcomment %}

<footer>
  This website, Learn**M2**, is a personal project of [Mahrud Sayrafi](https://mahrud.github.io/). \\
  Bug reports and contributions are welcome on [GitHub](https://github.com/mahrud/LearnM2/).
</footer>
