debug Core
debug "JSON"

-- changes behavior of htmlFilename and html(TO)
documentMode = "Markdown"

net DocumentTag := tag -> pad(concatenate (tag.Package, " :: ", format tag), 70) | net locate tag

toJSON DocumentTag := o -> t -> replace(" :: ", "::", format toString t)
toJSON ForestNode := o -> x -> ( s := toJSON(toList x, o); concatenate("{", s_(1,#s-2), "}") )
toJSON   TreeNode := o -> x -> concatenate(toJSON(format x#0, o), o.NameSeparator, toJSON(x#1, o))

testpkgs = { "SimpleDoc", "Saturation", "Truncations", "VirtualResolutions", "Varieties", "BeginningMacaulay2", "Complexes" }
pkgname = "Macaulay2Doc"
pkgname = "Saturation"
elapsedTime pkg = loadPackage(pkgname, Reload => true, LoadDocumentation => true)

end--
restart
needs "generate-json.m2"

errorDepth=1
--elapsedTime package' \ methods(); -- ~18s cache warming
for pkgname in testpkgs do
elapsedTime installPackage(pkgname, -- down to ~11s
    Verbose => false,
    RerunExamples => false,
    CheckDocumentation => true,
    IgnoreExampleErrors => false,
    RemakeAllDocumentation => true,
    MakeHTML => false,
    MakeInfo => false,
    MakeJSON => true,
    InstallPrefix => "/home/mahrud/Projects/M2/quickfix/M2/BUILD/build/usr-dist/",
    UserMode => false,
    SeparateExec => true,
    DebuggingMode => true)

toc = unbag Saturation#"table of contents"
json(toc, Indent => 2)

L = new HashTable from pkg#"raw documentation";
L = selectValues(L, x -> not x#?PrimaryTag and not x#?"undocumented" and not instance(x.DocumentTag.Key, Array));
--L = selectKeys(L, match_{"basis", "module", "provided", "Macaulay2Doc"});
L = elapsedTime applyPairs(L, (key, rawdoc) -> key => getData((rawtag := rawdoc.DocumentTag).Key, rawtag, rawdoc));
elapsedTime ("static/"|pkgname|".json") << toJSON(L, Indent => 2) << flush << close

(key, tag, rawdoc) = ("annihilator", makeDocumentTag annihilator, Saturation#"raw documentation"#"annihilator");
json(getData(key, tag, rawdoc), Indent => 2)

packages = {"Macaulay2Doc", "Saturation", "Truncations"}
H = hashTable apply(packages, pkgname -> pkgname => headline pkgname)
elapsedTime ("static/Packages.json") << toJSON(H, Indent => 2) << flush << close


elapsedTime L = apply(makeDocumentTag methods resolution, fetchRawDocumentation);
Macaulay2Doc#"raw documentation"#"resolution(Ideal)"


needsPackage "JSON"
debug Core
getFullIndex = () -> (
    fullindex := new MutableHashTable;
    for pkg in getPackageInfoList() do (
	pkgname := pkg#"name";
	if fullindex#?(pkgname | "::" | pkgname) then continue;
	dbname := pkg#"doc db file name";
	dbkeys := pkg#"doc keys"();
	db := openDatabase dbname;
	re := "PrimaryTag => new DocumentTag from \\{.+?,\"(.+?)\",\"" | pkgname | "\"\\}";
	-- TODO: order by type, put the package first?
	dbkeys = select(dbkeys, key -> not match("\"undocumented\" => true", db#key));
	scan(dbkeys, key -> fullindex#(fkey := pkgname | "::" | key) =
	    if 0 < #(m := select(re, pkgname | "::\\1", db#key)) then m#0 else fkey));
    new HashTable from fullindex)
fullindex = getFullIndex();
#fullindex
"_packages/fullindex.json" << json(Sort => true, Indent => 2, fullindex) << endl << flush
