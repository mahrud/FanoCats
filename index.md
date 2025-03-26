---
layout: page
title: Learn Macaulay2
---

{::options parse_block_html="true" /}

[_Macaulay2_](https://macaulay2.com/) is an interpreted, dynamically typed programming language intended to support research in [algebraic geometry] and [commutative algebra] through open sourced software.

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

 </div>
 <div class="col-md-6">
#### Result:
{% M2 index %}
R = QQ[x, y, z, w];
I = monomialCurveIdeal(R, {1, 2, 3})
C = res I
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
  - [Beginning Macaulay2]({{ site.baseurl }}/packages/#BeginningMacaulay2) <!-- TODO: [a first Macaulay2 session](a first Macaulay2 session)? -->
  - [Computations Book](book)
  - [Cheat Sheet](cheatsheet)
 </div>

 <div class="col-auto feature">
  <h4>Learn by Writing</h4>
  - [Project Ideas](https://faculty.math.illinois.edu/Macaulay2/dev/projects/)
  - [Editors and Workflows](examples)
 </div>

 <div class="col-auto feature">
  <h4>Package Development</h4>
  - [M2 Style Guide](https://github.com/Macaulay2/M2/wiki/Package-Writing-Style-Guide)
  - [Package directory](packages)
 </div>

 <div class="col-auto feature">
  <h4>Documentation</h4>
  - [Language Reference](reference) <!-- ({{ site.baseurl }}/packages/#Macaulay2Doc::The Macaulay2 language) -->
  - [Internal Notes](https://github.com/Macaulay2/M2/wiki/Internals%3A-Meeting-Notes)
  - [Source Code](https://github.com/Macaulay2/M2)
 </div>

 <div class="col-auto feature">
  <h4>M2 for Research</h4>
  - [Books and Articles](https://faculty.math.illinois.edu/Macaulay2/Publications)
  - [Citing Macaulay2](citing)
  - [JSAG](https://j-sag.org/)
 </div>

 <div class="col-auto feature">
  <h4>Events & Community</h4>
  - [Workshops]({{ site.baseurl }}/events)
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
  The recommended IDE for using Macaulay2 in research is [Emacs](https://www.gnu.org/software/emacs/)
  (here is a [cheat sheet](https://www.gnu.org/software/emacs/refcards/pdf/refcard.pdf)).
  Community plugins are also available for
  [Vim](https://github.com/Macaulay2/M2/tree/master/M2/Macaulay2/editors/vim),
  [Atom](https://github.com/Macaulay2/language-macaulay2),
  [VSCode](https://github.com/coreysharris/vscode-macaulay2), and
  [Sublime](https://github.com/Macaulay2/M2/wiki/Using-Macaulay2-with-Sublime).
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

<div class="row justify-content-around align-items-center">
 <div class="col feature">
  Development of Macaulay2 by [Daniel R. Grayson](https://faculty.math.illinois.edu/~dan/)
  and [Michael E. Stillman](https://math.cornell.edu/michael-e-stillman) has been funded
  by the National Science Foundation since 1992. We also acknowledge our many
  [contributors](contributors), [software libraries] used by Macaulay2,
  as well as [Macaulay](https://www.math.columbia.edu/~bayer/Macaulay/),
  the predecessor of Macaulay2 written by Dave Bayer and Michael Stillman.

  The namesake of Macaulay2 is [Francis Macaulay FRS](https://en.wikipedia.org/wiki/Francis_Sowerby_Macaulay).
 </div>

 <div class="col-2 feature">
  [![]({{ site.url }}{{ site.baseurl }}/static/NSF.jpg){:.feature}](https://www.nsf.gov/)
 </div>
</div>

[software libraries]: {{site.baseurl }}/packages/#Macaulay2Doc::Copyright and license

<!--
---

<div class="row justify-content-around align-items-center">
 <div class="col feature">
 - A random paper referring to Macaulay2: <script type="text/javascript">citation();</script>
 - A random Macaulay2 package: <script type="text/javascript">documentation();</script>
 </div>
</div>

---

<div class="row justify-content-around align-items-center">
 <div class="col feature">
 </div>
</div>

-->

<script src="{{ site.url }}{{ site.baseurl }}/static/packages.js"></script>
<script>
var bucket = '{{ site.baseurl }}/packages/';
$.getJSON(bucket+'fullindex.json', function(data) { updateFuse(data, '') })
</script>
