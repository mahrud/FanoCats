---
layout: doc
title: Smoothness of a Gushel-Mukai Threefold
author: Mahrud Sayrafi
status: published
parse: true
---

Source: [_Question_](https://groups.google.com/g/macaulay2/c/M6NBRiKKBw0/m/oSzucGkaAgAJ) by Chris Dare, answered by Xiaowen Hu. The following is only edited for clarify.

## How to verify that a variety is a Gushel--Mukai threefold?

The general construction of a smooth Gushel--Mukai threefold of the 1st type from [[Iliev94]](http://www.numdam.org/item/CM_1994__94_1_81_0/) is as follows:
- take $V = \mathbb C^5$ (or any other field of characteristic 0) and let $G = \operatorname{Gr}(2, V)$;
- let $X$ be a (complete) intersection of $G$ with a $\PP^7$ and a quadric $Q$.

If the resulting variety is smooth, it is a Fano threefold of Picard number 1 and degree 10 and called a Gushel--Mukai threefold of the 1st type. My code for trying to construct one is as follows:

{% M2 Gushel-Mukai %}
S = QQ[x_0..x_20];
G = Grassmannian(2, 5, S)
P = ideal(x_8..x_20);
Q = ideal(x_0*x_7 + x_1*x_6 + x_2*x_5 + x_3*x_4);
I = G + P + Q;
X = Proj(S/I);
{% endM2 %}

We can verify the dimension and degree[^1]:
{% M2 Gushel-Mukai %}
dim X
degree X
{% endM2 %}

[^1]: Side note: can we also verify that $X$ is Fano with Picard number 1?

At first glance everything looks good, so what I want to do is make sure this particular variety is smooth in order to verify that this system of equations gives a GM threefold of the first kind. But when I run
```m2
X = singularLocus X
```
the computer just keeps running... for hours. I let it run all afternoon and wasn't able to get Macaulay2 to store the singular locus in an object to check to make sure the singularLocus is empty (i.e. check dim = 0, deg = 0).

## Solution #1

If singularLocus uses the Jacobian criterion, it is rather time consuming in computing the minors of a matrix with polynomial entries. In my experience, 20 variables are too many for a direct computation, unless the ideal is very simple.  more efficient way is to manually find an affine covering, say $$\{U_i\}$$, such that, by some manipulations on the defining equations, we
can decompose $U_i = V_i\times Y_i$, where $Y_i$ is known to be smooth, and $V_i$ might be singular, but with a smaller embedded dimension or simpler defining equations. Then use M2 to compute singularLocus $V_i$.
