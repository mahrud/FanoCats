---
---

Handlebars.registerHelper('displayHTML',function(inputData){
    data = new Handlebars.SafeString(inputData);
    return ( data == "undefined" ? "" : data );
});

{% raw %}
var template = Handlebars.compile(`
{{ displayHTML Synopsis }}
{{ displayHTML Description }}
{{ displayHTML SourceCode }}
{{ displayHTML Acknowledgement }}
{{ displayHTML Contributors }}
{{ displayHTML References }}
{{ displayHTML Caveat }}
{{ displayHTML SeeAlso }}
{{ displayHTML Subnodes }}
{{ displayHTML WaysToUse }}`);
{% endraw %}

//////////////////////////////////////////////////////////////////////

{%- if site.url == "http://localhost:4000" %}
var bucket = '{{ site.baseurl }}/packages/';
{% else %}
var bucket = 'https://raw.githubusercontent.com/mahrud/LearnM2/refs/heads/learn/_packages/';
{% endif -%}

var database = new Map([]);

//////////////////////////////////////////////////////////////////////

function updateSearch(results) {
    $('#outline-list').attr('open', true);
    $('.outline-list').html(
	results.slice(0, 25).map(elt => `
        <li class="outline-item">
          <a class="outline-link" href="#${database.get(elt.item)}">${elt.item}</a>
        </li>`).join(''));
}

function updateOutline(base, prefix, hash) {
    anchors.options.base = base + prefix;
    anchors.elements = [];
    anchors.add().remove('.index-heading, .outline-heading');
    if (hash) {
	$('html, body').animate(
            { scrollTop: $(hash).offset().top }, 500);
    };
    $('.outline-list').html(
	anchors.elements.map(elt => `
        <li class="outline-item">
          <a class="outline-link" href="${prefix}#${elt.id}">${elt.innerText}</a>
        </li>`).join(''));
}

const fuse = new Fuse([], { ignoreLocation: true, threshold: 0.4 });
function updateFuse(index, pkgname) {
    if (!database.has(pkgname)) {
	database.set(pkgname, pkgname);
	Object.keys(index).forEach(key => {
            var fkey = pkgname + '::' + key;
            if (!database.has(fkey)) {
		database.set(fkey, index[key]);
		fuse.add(fkey);
            };
	});
    };
}

function makeSubmenu(toc, pkgname, current) {
    var open = false;
    var menu = Object.entries(toc).map(function([key, subtoc]) {
	open = open || key == current;
	var n = Object.keys(subtoc).length;
	var style = key == current ? `background-color: yellow` : "";
	if (Object.keys(subtoc).length == 0) return `
        <li class="index-item">
          <a style="${style}" href="#${pkgname}::${key}" onclick="openNode(this)"><tt>${key}</tt></a>
        </li>`;
	var [submenu, subopen] = makeSubmenu(subtoc, pkgname, current);
	var openattr = (subopen || key == current) ? "open" : "";
	open = open || subopen;
	return `
        <li class="index-item toggle">
          <details ${openattr}>
            <summary><a style="${style}" href="#${pkgname}::${key}" onclick="openNode(this)"><tt>${key}</tt></a></summary>
            <ol>${submenu}
            </ol>
          </details>
        </li>`;
    }).join('');
    return [menu, open];
}

function updateSidebar(data, pkgname, current) {
    updateFuse(data["index"], pkgname);
    $('.index-list').html(
	makeSubmenu(data["toc"], pkgname, current)[0]);
}

function updateNavbar(param, pkgname, title) {
    $('#pkgname').html(pkgname);
    $('#pkgname').attr("href", "#"+pkgname);
    $('#headline').html(title);
    $('#headline').attr("href", param);
}

//////////////////////////////////////////////////////////////////////

var searchBox = $("input#x-search-query");
var urlParams = new URLSearchParams(window.location.search);

function doSearch(query) {
    if (query == null) query = searchBox.val();
    if (query == "") updatePage();
    var results = fuse.search(query);
    updateSearch(results);
    //var regex = new RegExp("<mark>(.*)</mark>", "gim");
    //var content = document.getElementById("main").innerHTML;
    //document.getElementById("main").innerHTML = content.replace(regex, "$1");
    //doHighlight(query);
}

// Highlight search Query
// function doHighlight(query) {
//   // regex matches at beginning of line, end of line or word boundary
//   var regex = new RegExp(
//     "(?:^|\\b)(.{0,5})(" + query + ")(.{0,5})(?:$|\\b)",
//     "gim",
//   );
//   var content = document.getElementById("main").innerHTML;
//   document.getElementById("main").innerHTML = content.replace(
//     regex,
//     "$1<mark>$2</mark>$3",
//   );
// }

var timeout = null;
searchBox.on("keyup", function(event) {
    clearTimeout(timeout);
    timeout = setTimeout(doSearch, 100);
});

//////////////////////////////////////////////////////////////////////

function openSearch(pkgname, query) {
    window.location.href = "{{ site.baseurl }}/search/?q=" + pkgname + "::" + query;
}

function openNode(param) {
    var regex = /#(.+)::(.+?)(#.*)?$/.exec(param);
    if (regex === null) return openPackage(param);
    var node = decodeURIComponent(regex[2]);
    var pkgname = regex[1];
    // TODO: sanitize this url
    $.getJSON(bucket+pkgname+'.json', function(data) {
	var rawdoc = data["nodes"][node];
	updateSidebar(data, pkgname, node);
	if (rawdoc == null) return openSearch(pkgname, node);
	updateNavbar(param, pkgname, rawdoc["Headline"])
	var content = template(rawdoc).replaceAll("../../Macaulay2/Style", "/LearnM2/static");
	$('#content').html(content);
	$('html, body').scrollTop(0);
	updateOutline('', '#'+pkgname+'::'+node, regex[3]);
	Prism.highlightAll()
	renderKaTeX();
    });
}

function openPackage(param) {
    // TODO: sanitize this url
    var regex = /#(.+?)(#.*)?$/.exec(param);
    var pkgname = regex[1];
    $.getJSON(bucket+pkgname+'.json', function(data) {
	updateSidebar(data, pkgname, pkgname);
	updateNavbar(param, pkgname, pkgname)
	var content = template(data["nodes"][pkgname]).replaceAll("../../Macaulay2/Style", "/LearnM2/static");
	$('#content').html(content);
	updateOutline('', '#'+pkgname, regex[2]);
	Prism.highlightAll()
	renderKaTeX();
    });
}

//////////////////////////////////////////////////////////////////////

function updatePage(param) {
    if ( window.location.href.match(/#.+::.+$/) ) { openNode(window.location); }
    else if ( window.location.href.match(/#.+$/) ) { openPackage(window.location); }
}

$("a.package").click(function() { openPackage(this) });

$(window).on('hashchange', updatePage);
//window.onpopstate = updatePage

$(document).ready(function () {
    if (urlParams.has("q")) {
	var query = urlParams.get("q");
	searchBox.val(query);
	doSearch(query);
    }
});
