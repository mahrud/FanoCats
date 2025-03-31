---
layout: page
title: Emacs Cheat Sheet
---

### Emacs Cheat Sheet

These are the most commonly used key bindings for Emacs. Here is the notation:
- <kbd>C-x</kbd> means hold <kbd>Ctrl</kbd> down and press <kbd>x</kbd>;
- <kbd>C-x k</kbd> means do <kbd>C-x</kbd> first, release all, then press <kbd>k</kbd>.
- <kbd>C-x C-f</kbd> means do <kbd>C-x</kbd>, release <kbd>x</kbd> only, then press <kbd>f</kbd>.
- <kbd>M-x</kbd> means hold <kbd>Alt</kbd> (or <kbd>Option</kbd>) down and press <kbd>x</kbd>;
- <kbd>M-x "grep"</kbd> means do <kbd>M-x</kbd> first, release, then type <kbd>grep</kbd>.
- a **buffer** in Emacs is the equivalent of a tab in a web browser.

| Keyboard Shortcut                          | Emacs Action              |
| ------------------------------------------ | ------------------------- |
| <kbd>F12</kbd>                             | open M2 in a buffer       |
| <kbd>F11</kbd> (or <kbd>F9</kbd> on macOS) | send line/section to M2   |
| <kbd>C-x C-f [filename]</kbd>              | open or create a file     |
| <kbd>C-x C-s</kbd>                         | save the current file     |
| <kbd>C-x C-c</kbd>                         | close Emacs               |
| <kbd>C-x k</kbd>                           | close (kill) a buffer     |
| <kbd>M-TAB</kbd>                           | auto-complete the word    |
| <kbd>C-Shift-Underscore</kbd>              | undo!                     |
| <kbd>C-x-Plus</kbd>                        | zoom in                   |
| <kbd>C-x-Minus</kbd>                       | zoom out                  |
| <kbd>C-g C-g</kbd>                         | GET ME OUT OF HERE!!      |
{: style="width: 68%"}

<br />
And here are slightly fancier bindings which are nevertheless quite useful.

| <kbd>C-x [right/left arrow]</kbd> | rotate among open buffers       |
| <kbd>C-x 2</kbd>                  | split buffer horizontally       |
| <kbd>C-x 3</kbd>                  | split buffer vertically         |
| <kbd>C-x 0</kbd>                  | merge buffer splitting          |
| <kbd>C-x o</kbd>                  | switch to another buffer        |
| <kbd>C-u F12 [path to M2]</kbd>   | change the command that runs M2 |
| <kbd>M-x "eshell"</kbd>           | open a shell inside Emacs       |
| <kbd>M-x "set-input-method"</kbd> | enable typing $\TeX$ in Emacs   |
| <kbd>M-x "xterm-mouse-mode"</kbd> | re-enable mouse inside Emacs    |
{: style="width: 80%"}

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
