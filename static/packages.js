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

var version = "v1.25.05"
{%- if site.url == "http://localhost:4000" %}
var bucket = '{{ site.baseurl }}/packages/';
{% else %}
var bucket = 'https://raw.githubusercontent.com/mahrud/LearnM2/refs/heads/learn/_packages/';
{% endif -%}
var repo = 'https://github.com/Macaulay2/M2/blob/development/'

var database = new Map([]);

//////////////////////////////////////////////////////////////////////

// encodeURI is a bit too strong
// TODO: do we need to encode anything else?
function encodeTag(fkey) {
    return fkey.replaceAll(/"/g, "%22").replaceAll(/%(?![0-9A-F]{2})/g, "%25");
}

function decodeTag(str) {
    return decodeURIComponent(encodeTag(str));
}

var results = null;
function updateSearch(input) {
    if (input) results = input;
    $('#outline-list').attr('open', true);
    $('.outline-list').html(
	results.slice(0, 25).map(elt => `
        <li class="outline-item">
          <a class="outline-link" href="#${encodeTag(database.get(elt.item))}">${elt.item}</a>
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
	var node = "#" + pkgname + "::" + key;
	var style = key == current ? `background-color: yellow` : "";
	if (Object.keys(subtoc).length == 0) return `
        <li class="index-item">
          <a style="${style}" href="${node}" onclick="openNode('${node}')"><tt>${key}</tt></a>
        </li>`;
	var [submenu, subopen] = makeSubmenu(subtoc, pkgname, current);
	var openattr = (subopen || key == current) ? "open" : "";
	open = open || subopen;
	return `
        <li class="index-item toggle">
          <details ${openattr}>
            <summary><a style="${style}" href="${node}" onclick="openNode('${node}')"><tt>${key}</tt></a></summary>
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
    if (pkgname == title[0])
	title = [ title[1].replace("-- ", "") ];
    $('#pkgname').html(pkgname);
    $('#pkgname').attr("href", "#"+pkgname);
    $('#headline').html(title);
    $('#headline').attr("href", param);
    document.title = pkgname + " :: " + title[0];
}

//////////////////////////////////////////////////////////////////////

var searchBox = $("input#x-search-query");
var urlParams = new URLSearchParams(window.location.search);

function doSearch(query) {
    if (query == null) query = searchBox.val();
    if (query == "") help();
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

// search the full index if the node isn't found
function openSearch(pkgname, query) {
    window.location.href = "{{ site.baseurl }}/search/?q=" + pkgname + "::" + query;
}

// hot-swapping the links for better online experience
function fixLinks(content) {
    return content
	.replace(/href="..\/..\/Macaulay2\/.+">(.+):(.+):(.+)<\/a>/,
		 "href=\"" + repo + "M2/Macaulay2/packages/$1#L$2\">$1:$2:$3</a>")
	.replaceAll("../../Macaulay2/Style", "/LearnM2/static");
}

// TODO: also handle #[pkgname] and #[pkgname]#[anchor] inputs
function parseKey(param) {
    // [proto]://[addr]/[path]#[pkgname]::[fkey]#[anchor]
    // A handful of keys contain '%', so before we decode, we encode it!
    var uri = decodeTag(param);
    var [, tag] = /#(.*)$/.exec(uri);
    var [, pkgname, rest] = /(.+?)::(.*)$/.exec(tag);
    if (!rest) return [pkgname, null, null];
    // We also have to be careful when handling '#', so we assume that
    // any '#' within a formatted key is followed by either ' ' or '? '
    // and that anchors begin with an alphanumeric character or '-'
    // "Macaulay2Doc::##description"
    // "Macaulay2Doc::#?#description"
    // "Macaulay2Doc::# List#description"
    // "Macaulay2Doc::List # ZZ#description"
    // "Macaulay2Doc::List #? ZZ#description"
    var [, node, anchor] = /^(#|#\?|(?:# |#\? |[^#])+?)?(#[a-zA-Z0-9-].*)?$/.exec(rest);
    return [pkgname, node, anchor];
}

// TODO: should parseKey be called before here?
function openNode(param) {
    var [pkgname, node, anchor] = parseKey(param);
    if (node === '') return openPackage(pkgname);
    $.getJSON(bucket+version+"/"+pkgname+'.json', function(data) {
	var rawdoc = data["nodes"][node];
	if (rawdoc == null) return openSearch(pkgname, node);
	updateSidebar(data, pkgname, node);
	updateNavbar(param, pkgname, rawdoc["Headline"]);
	var content = fixLinks(template(rawdoc));
	$('#content').html(content);
	$('html, body').scrollTop(0);
	updateOutline('', '#'+pkgname+'::'+node, anchor);
	Prism.highlightAll();
	renderKaTeX();
    }).fail(function() { openSearch(pkgname, node) });;
}

function openPackage(param) {
    // TODO: sanitize this url
    var [, pkgname, , anchor] = /#(.+?)(::)?(#.*)?$/.exec(param);
    $.getJSON(bucket+version+"/"+pkgname+'.json', function(data) {
	var rawdoc = data["nodes"][pkgname];
	updateSidebar(data, pkgname, pkgname);
	updateNavbar(param, pkgname, rawdoc["Headline"]);
	var content = fixLinks(template(rawdoc));
	$('#content').html(content);
	updateOutline('', '#'+pkgname, anchor);
	Prism.highlightAll();
	renderKaTeX();
    }).fail(function() { openSearch(pkgname, '') });
}

//////////////////////////////////////////////////////////////////////

var start_page = "Macaulay2Doc::Macaulay2Doc"

function help(param) {
    if (urlParams.has("v"))
	version = urlParams.get("v");
    if (typeof param == "string")
	start_page = param;
    var hash = window.location.hash;
    if ( hash.match(/#.+::.+$/) ) return openNode(hash);
    if ( hash.match(/#.+$/) )     return openPackage(hash);
    openNode("#" + start_page);
}

$("a.package").click(function() { openPackage(this) });

$(window).on('hashchange', help);
//window.onpopstate = help

$(document).ready(function () {
    if (urlParams.has("q")) {
	var query = urlParams.get("q");
	searchBox.val(query);
	doSearch(query);
    }
});
