---
layout: doc
title: The Twisted Cubic
author: Mahrud Sayrafi
---

Let's first define the coordinate ring of $ \PP^3 $, where the twisted cubic lies:
{% M2 twisted-cubic %}
kk = ZZ/32003;
R = kk[w, x, y, z]; -- this is a ring
{% endM2 %}

## Parametric Curve
{:.label}

This methods yields the twisted cubic as the ideal of a projective curve given parametrically by the map:
\[
\begin{aligned}
  k[x,y,z] &\to k[t] \cr
  x &\mapsto t^3 \cr
  y &\mapsto t^2 \cr
  z &\mapsto t.
\end{aligned}
\]

{% M2 twisted-cubic %}
monomialCurveIdeal(R, {1, 2, 3})
{% endM2 %}


## Determinantal Ideal
{:.label}

This method defines the twisted cubic as a determinantal ideal of $2\times 2$ minors, that is:
\[ I = I_2
  \begin{pmatrix}
    x & y & z \cr
    y & z & w
  \end{pmatrix}
\]

{% M2 twisted-cubic %}
minors(2, matrix {{x, y, z}, {y, z, w}})
{% endM2 %}


## Veronese Embedding
{:.label}

This method defines the twisted cubic as the kernel of the Veronese embedding of degree three on the projective line.
That is:

{% M2 twisted-cubic %}
kernel map(kk[s,t], R, {s^3, s^2*t, s*t^2, t^3})
{% endM2 %}

## Resolution and Betti Table

A minimal free resolution of the ideal defining the twisted cubic:
\[ 0 \gets \mathcal O_C \gets \mathcal O_{\PP^3} \gets 3\mathcal O_{\PP^3}(-2) \gets 2\mathcal O_{\PP^3}(-3) \gets 0 \]

{% M2 twisted-cubic %}
res oo
betti oo
{% endM2 %}
