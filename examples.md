---
layout: page
title: Examples
category: links
order: 4
---

This is a collection of interesting Macaulay2-fu observed in the wild, sometimes from questions and answers on the [Google group], with credits.

{% for item in site.examples -%}
* [{{ item.title }}]({{ site.baseurl }}{{ item.url }})
{% endfor %}

[Google group]: http://groups.google.com/group/macaulay2
