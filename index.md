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

In each row, the first three columns denote the dimension and index of the variety in Macaulay2's database, accessible using [`smoothFanoToricVariety(d,i)`](https://mahrud.github.io/LearnM2/help/#NormalToricVarieties::smoothFanoToricVariety(ZZ,ZZ)), followed by the ranks of the Picard group (= #rays - dim) and Grothendieck group (= #maximal cones).

Next, the if the Picard rank is at most 3, the secondary fan of the toric variety is displayed, with the nef chamber colored in blue. Note that for Picard rank 3, the picture is really a 2D section of the 3D fan. If you click on the black triangle to the left of the row, you can also see the ray generators, maximal cones, and primitive collections of the variety.

Next, the degrees of the variables in the Cox ring and degrees of the line bundles in the Bondal-Thomsen collection are displayed as columns of matrices (in the default basis for the Picard group chosen by Macaulay2). Then $\Theta$-collection is of interest because it forms a full generating set for the derived category, and in particular it is also a full generating set for the derived category of any other toric variety with the same set of rays.

The Ext tables encapsulate the rank of Ext groups among the $\Theta$-collection: the $ij$-entry is a Laurent polynomial $\sum \operatorname{rk}\mathrm{Ext}^k(\OO(d_i),\OO(d_j)) \cdot T^k$. In this notation, the collection is exceptional if the table is upper triangular with ones on the diagonal, and it is strong if all entries are constant.

For instance, for all but two threefolds, $(3,1)$ and $(3,10)$, the $\Theta$-collection is already a full strong exceptional collection. For those two, it can be shown that simply removing the line bundle corresponding to the row with higher extensions yields a full strong exceptional collection.

### Future goals:
- interpret the primitive collections and use it to:
  - add descriptions and symbolic identifiers (e.g. $\mathrm{Bl}_1\PP^2$ or $\PP(\OO_{\PP^1}\oplus\OO_{\PP^1}(1))$).
  - linkify the secondary fan relationships
- mention mutations that yield exceptional collections
- for dim<=3, visualize the fan?
- add dim 4,5,6 rho>3 data? (~90MB total)
- link to the corresponding entries in:
  - the Fanography database at <https://www.fanography.info/toric>
  - the GRDB database at <http://www.grdb.co.uk/search/toricsmooth>
  - the FanoSearch database at <http://coates.ma.ic.ac.uk/fanosearch/?page_id=277>
- add references and code

Please get in touch with me if you'd like to use the Macaulay2 package used for these computations. \\
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

## Non-Fano Toric Varieties

- [Hirzebruch surfaces]({{ site.baseurl }}/hirzebruch)
- TODO: few Kleinschmidt varieties
- TODO: some non-smooth or non-projectively normal ones

## Other Experiments

- [Helices on $\PP^2$]({{ site.baseurl }}/helix-P2)
- [Helices on $\PP^3$]({{ site.baseurl }}/helix-P3)
- [Helices on $\PP^4$]({{ site.baseurl }}/helix-P4)
- [Helices on $\mathbb{H}_2$]({{ site.baseurl }}/helix-H2)
- [Helices on $\mathbb{H}_2$ after a spherical twist]({{ site.baseurl }}/helix-H2-spherical)


<footer>
  This website, FanoCats, is a personal project of [Mahrud Sayrafi](https://mahrud.github.io/). \\
  Bug reports and contributions are welcome on [GitHub](https://github.com/mahrud/FanoCats/).
</footer>
