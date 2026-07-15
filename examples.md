---
layout: page
title: Examples and Counterexamples
---

In addition to the examples linked above, here are various examples and counterexamples I have collected over time. Note that they are not all necessarily Fano!

{% for item in site.examples %}
* [{{ item.headline }}]({{ site.baseurl }}{{ item.url }}){% endfor %}
