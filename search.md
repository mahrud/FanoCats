---
layout: default
title: Search
---

{::options parse_block_html="false" /}

<nav class="navbar justify-content-between navbar-expand-lg navbar-light bg-light headline-wrapper">
  <span class="navbar-brand headline">Search Results</span>
  <form class="form-inline my-2 my-lg-0 search" id="x-search" role="search">
    <input class="form-control mr-sm-2" id="x-search-query" type="text" name="q" placeholder="Search" />
  </form>
</nav>

<div class="main-wrapper">
{% if page.layout == "entry" %}
  {%- include sidebar.html -%}
{%- endif %}

  <main class="main-content" id="main">
    <article class="main-page-content">
      <div id="content">
	<section class="outline-section">
	  <ul class="outline-list">
            <!-- <li class="outline-item">
		 <a class="outline-link" href="/url#hash">text</a>
            </li> -->
	  </ul>
	</section>
      </div>
    </article>
  </main>
</div>

<script src="{{ site.url }}{{ site.baseurl }}/static/packages.js"></script>
<script>
function updateSearch(results) {
    $('.outline-list').html(
	results.slice(0, 100).map(elt => `
        <li class="outline-item">
          <a class="outline-link" href="{{ site.baseurl }}/documentation/#${encodeTag(database.get(elt.item))}">${elt.item}</a>
        </li>`).join(''));
}

$.getJSON(bucket+'fullindex.json', function(index) {
    database = new Map(Object.entries(index));
    fuse.setCollection(Array.from(database.keys()));
    if (urlParams.has("q")) {
	var query = decodeTag(urlParams.get("q"));
	searchBox.val(query);
	doSearch(query);
    };
});
</script>
