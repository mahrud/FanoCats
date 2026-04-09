needs "fano.m2"
needsPackage "JSON"
debug needsPackage "AssociativeAlgebras"

chern Complex := RingElement => C -> sum(pairs C.module, (i, M) -> (-1)^i * chern M)

ncListForm = f -> (
    kk := coefficientRing ring f;
    L := rawSparseListFormMonomial \ last rawPairs(raw kk, raw f);
    apply(L, word -> splice apply(word, (i,e) -> e:i)))

braidMonomials = (d, n) -> (
    F := QQ<|s_0..s_(n-1)|>;
    -- commuting relations |i-j|>1
    rel0 := flatten for i from 0 to n-3 list (
	for j from i+2 to n-1 list (
	    F_i*F_j - F_j*F_i));
    -- braid relations
    rel1 := for i from 0 to n-2 list (
	F_i*F_(i+1)*F_i - F_(i+1)*F_i*F_(i+1));
    B := F / join(rel0, rel1);
    ncBasis(0, d, B))

datadir = "~/Projects/M2/fano/_data/"

toJSON Array := o -> L -> if #L == 0 then "[]" else (
    concatenate("[", demark_"," apply(L, x -> toJSON(x)), "]"))

end--
restart
needs "helixcats.m2"

n = 3
X = hirzebruchSurface 2
BT = (sheaf \ zonotopeBundles X)_{0,1,3,4}
ExtTable(X, BT)
OC = sheaf koszulComplex (vars ring X)_{1}
BT = sphericalTwist(OC, BT)

n = 4
X = fano(n, 0)
BT = lineBundle_X \ -fanoZonotopeDegrees(n, 0)
ExtTable(X, BT)

-- the list of braid mutations to try
B = braidMonomials(2, n)

-- the partial helices
H = hashTable apply(first entries B, word -> word => fold(-*reduce' @@*- mutate, BT, first ncListForm word));
H = selectPairs(H, (word, E) -> rank sum directSum E < 100); -- throws away a handful of really large ones
E = elapsedTime applyPairs(H, (word, E) -> word => ExtTable(X, E, Strategy => "Basic"))

(datadir | "helix-H" | 2 | ".json") << json(Indent => 2, Sort => true,
    applyPairs(E, (k,v) ->
	toExternalString k => hashTable {
	    "Chern" => toExternalString { apply(H#k, E -> chern E) },
	    "Ranks" => toExternalString { apply(H#k, E -> rank E) },
	    "Ext" => toExternalString entries v
	    })
    ) << close
