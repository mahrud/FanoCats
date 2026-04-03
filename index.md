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

Next, the columns of the $\Theta$-collection are the degrees of line bundles in the Bondal-Thomsen collection (in the default basis for the Picard group chosen by Macaulay2), which form a full generating set for the derived category. The significance of this collection lies in the fact that it is also a full generating set for the derived category of any other toric variety with the same set of rays.

The Ext tables encapsulate the rank of Ext groups among the $\Theta$-collection: the $ij$-entry is a Laurent polynomial $\sum \operatorname{rk}\mathrm{Ext}^k(\OO(d_i),\OO(d_j)) \cdot T^k$. In this notation, the collection is exceptional if the table is upper triangular with ones on the diagonal, and it is strong if all entries are constant.

For instance, for all but two threefolds, $(3,1)$ and $(3,10)$, the $\Theta$-collection is already a full strong exceptional collection. For those two, it can be shown that simply removing the line bundle corresponding to the row with higher extensions yields a full strong exceptional collection.

### Future goals:
- add descriptions and symbolic identifiers (e.g. $\mathrm{Bl}_1\PP^2$ or $\PP(\OO_{\PP^1}\oplus\OO_{\PP^1}(1))$).
- add primitive collections, chamber decomposition, and visualize the secondary fan relationships
- mention mutations that yield exceptional collections
- add dim 4,5,6 data? (~70MB total)
- link to the corresponding entries in:
  - the Fanography database at <https://www.fanography.info/toric>
  - the GRDB database at <http://www.grdb.co.uk/search/toricsmooth>
  - the FanoSearch database at <http://coates.ma.ic.ac.uk/fanosearch/?page_id=277>
- add references and code

Please get in touch with me if you'd like to use the Macaulay2 package used for these computations. \\
Bug reports and contributions are welcome on [GitHub](https://github.com/mahrud/FanoCats/).

## Smooth Fano Toric Surfaces
{% include table.toric.html dimension=2 fanos=site.data.toric-2 %}

## Smooth Fano Toric Threefolds
{% include table.toric.html dimension=3 fanos=site.data.toric-3 %}

## Smooth Fano Toric 4,5,6-folds
The are respectively 124, 866, and 7622 smooth fano toric varieties in dimensions 4, 5, and 6,
thus they are further broken up by Picard rank.

**Note: this data is computed, but not yet available online, so the links don't work yet.**

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
    <tr>
      <td class="align-middle dim">${{ dim }}$ ({{ page.fanos[dim] }})</td>
      <td class="align-middle">
		<a class="text-nowrap pad7" href="{{ site.baseurl }}/toric-{{ dim }}-2">
		  ≤2 (1+{{ page.rhos[dim][2] }})</a> &ensp; &ensp;
	    {% assign max = page.rhos[dim] | size | minus: 1 %}
		{% for rho in (3..max) %}
		<a class="text-nowrap pad7" href="{{ site.baseurl }}/toric-{{ dim }}-{{ rho }}">
		  {{ rho }} ({{ page.rhos[dim][rho] }})</a> &ensp;
		{% endfor %}
	  </td>
    </tr>
    {% endfor %}
  </tbody>
</table>

<footer>
  This website, FanoCats, is a personal project of [Mahrud Sayrafi](https://mahrud.github.io/). \\
  Bug reports and contributions are welcome on [GitHub](https://github.com/mahrud/FanoCats/).
</footer>
