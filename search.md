---
layout: default
title: Search
---

{::options parse_block_html="false" /}

<nav class="navbar justify-content-between navbar-expand-lg navbar-light bg-light headline-wrapper">
  <div class="container">
	<span class="navbar-brand headline">Search Results</span>
    <span>
		<button onclick="p -= 1; updateSearch()">prev</button>
		<button onclick="p += 1; updateSearch()">next</button>
	</span>
  </div>
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
var p = 0;
function updateSearch(input) {
    if (input) results = input;
    var m = Math.floor(window.innerHeight / 35);
    $('.outline-list').html(
	results.slice(p * m, (p + 1) * m).map(elt => `
        <li class="outline-item">
          <a class="outline-link" href="{{ site.baseurl }}/help/#${encodeTag(database.get(elt.item))}">${elt.item}</a>
        </li>`).join(''));
}

$.getJSON(bucket+version+'/fullindex.json', function(index) {
    database = new Map(Object.entries(index));
    fuse.setCollection(Array.from(database.keys()));
    if (urlParams.has("q")) {
	var query = decodeTag(urlParams.get("q"));
	searchBox.val(query);
	doSearch(query);
    };
});
</script>
