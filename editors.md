---
layout: page
title: Emacs Cheat Sheet
---

### Brief Cheat Sheet

| Emacs Shortcut                             | Action                    |
| ------------------------------------------ | ------------------------- |
| <kbd>F12</kbd>                             | open M2 in a buffer       |
| <kbd>F11</kbd> (or <kbd>F9</kbd> on macOS) | send line/section to M2   |
| <kbd>C-x C-f [filename]</kbd>              | create/open a file        |
| <kbd>C-x C-s</kbd>                         | save the current file     |
| <kbd>C-x k</kbd>                           | close the current buffer  |
| <kbd>C-x o</kbd>                           | switch to another buffer  |
| <kbd>C-x [right/left arrow]</kbd>          | rotate between buffers    |
| <kbd>C-x 2</kbd>                           | split buffer horizontally |
| <kbd>C-x 3</kbd>                           | split buffer vertically   |
| <kbd>C-x 0</kbd>                           | merge buffer splitting    |
| <kbd>C-Shift _</kbd>                       | undo!                     |
| <kbd>C-g C-g</kbd>                         | GET ME OUTTA HERE         |
{: style="width: 60%"}

---

### Extended Reference Card

For many more key bindings and notation, see this [reference card](https://www.gnu.org/software/emacs/refcards/pdf/refcard.pdf).

<div class="row">
{%- for i in (0..3) -%}
{%- assign screenshot = site.baseurl | append: "/static/emacs" | append: i | append: ".png" -%}
 <div class="col-3 feature">
  [![]({{ screenshot }}){:.feature}]({{ screenshot }})
 </div>
{%- endfor -%}
</div>

##### Try also: [`help "using Macaulay2 with Emacs"`](../help/#Macaulay2Doc::using Macaulay2 with Emacs)

<div id="content">
<script src="{{ site.url }}{{ site.baseurl }}/static/packages.js"></script>
<script>help("Macaulay2Doc::using Macaulay2 with Emacs")</script>
</div>
