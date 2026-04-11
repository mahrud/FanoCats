---
layout: page
title: FanoCats
---

In each row, the first three columns denote the dimension and index of the variety in Macaulay2's database, accessible using [`smoothFanoToricVariety(d,i)`](https://mahrud.github.io/LearnM2/help/#NormalToricVarieties::smoothFanoToricVariety(ZZ,ZZ)), followed by the ranks of the Picard group (= #rays - dim) and Grothendieck group (= #maximal cones). If the variety is a surface, then the fan is also displayed.

Next, the if the Picard rank is at most 3, the secondary fan of the toric variety is displayed, with the nef chamber colored in blue. Note that for Picard rank 3, the picture is really a 2D section of the 3D fan. If you click on the black triangle to the left of the row, you can also see the ray generators, maximal cones, and primitive collections of the variety.

Next, the degrees of the variables in the Cox ring and degrees of the line bundles in the Bondal-Thomsen collection are displayed as columns of matrices (in the default basis for the Picard group chosen by Macaulay2). Then $\Theta$-collection is of interest because it forms a full generating set for the derived category, and in particular it is also a full generating set for the derived category of any other toric variety with the same set of rays.

The Ext tables encapsulate the rank of Ext groups among the $\Theta$-collection: the $ij$-entry is a Laurent polynomial $\sum \operatorname{rk}\mathrm{Ext}^k(\OO(d_i),\OO(d_j)) \cdot T^k$. In this notation, the collection is exceptional if the table is upper triangular with ones on the diagonal, and it is strong if all entries are constant.

{% assign data = site.data.fano-2 | subdict: "2" %}
{% include table.toric.html class='fano-2' varieties=data %}

For instance, for all but two threefolds, $(3,1)$ and $(3,10)$, the $\Theta$-collection is already a full strong exceptional collection. For those two, it can be shown that simply removing the line bundle corresponding to the row with higher extensions yields a full strong exceptional collection.

{% assign data = site.data.fano-3 | subdict: "1", "10" %}
{% include table.toric.html class='fano-3' varieties=data %}

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
- TODO: few Kleinschmidt varieties
- TODO: some non-smooth or non-projectively normal ones
