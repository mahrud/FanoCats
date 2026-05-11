---
layout: page
title: FanoCats
fanos: [0,1,5,18,124,866,7622]
rhos:
  1: [0,1]
  2: [0,1,2,1,1]
  3: [0,1,4,7,4,2]
  4: [0,1,9,28,47,27,10,1,1]
  5: [0,1,15,91,268,312,137,35,5,2]
  6: [0,1,26,257,1318,2807,2204,771,186,39,11,1,1]
---

{::options parse_block_html="true" /}

This website, inspired by Pieter Belmans' [Fanography](https://www.fanography.info), is a tool for visually studying the derived categories of smooth fano toric varieties.

See [here]({{ site.baseurl }}/README) for an explainer. Please get in touch with me if you'd like to use the Macaulay2 package used for these computations.

Bug reports and contributions are welcome on [GitHub](https://github.com/mahrud/FanoCats/).

## Smooth Fano Toric Surfaces
{% include table.toric.html class='fano-2' varieties=site.data.fano-2 %}

## Smooth Fano Toric Threefolds
{% include table.toric.html class='fano-3' varieties=site.data.fano-3 %}

## Smooth Fano Toric 4,5,6-folds
The are respectively 124, 866, and 7622 smooth fano toric varieties in dimensions 4, 5, and 6,
thus they are further broken up by Picard rank.

**Note: this data is computed, but only available online in dim $\leq4$ or Picard rank $\leq3$, so gray links don't work yet.**

<style>
.pad7 {
  display: inline-block;
  width: 7ch;      /* max length */
  text-align: left;
}
</style>

<table class="table table-hover">
  <thead>
    <tr>
      <th scope="col" data-sort-method="number">$\dim$</th>
      <th scope="col" colspan="12">$\operatorname{rk} \mathrm{Pic}$</th>
    </tr>
  </thead>

  <tbody>
    {% for dim in (2..6) %}
	{% assign max = page.rhos[dim] | size | minus: 1 %}
    <tr>
      <td class="align-middle dim">${{ dim }}$ ({{ page.fanos[dim] }})</td>
      <td class="align-middle">
		<a class="text-nowrap pad7" href="{{ site.baseurl }}/fano-{{ dim }}-{% if dim < 4 %}all{% else %}2{% endif %}">
		  ≤2 (1+{{ page.rhos[dim][2] }})</a> &ensp; &ensp;
		{% for rho in (3..max) %}
		<a class="text-nowrap pad7" href="{{ site.baseurl }}/fano-{{ dim }}-{% if dim < 4 %}all{% else %}{{ rho }}{% endif %}"
		  {% if dim > 4 and rho > 3 %}style="color: gray"{% endif %}>
		  {{ rho }} ({{ page.rhos[dim][rho] }})</a> &ensp;
		{% endfor %}
	  </td>
    </tr>
    {% endfor %}
  </tbody>
</table>
