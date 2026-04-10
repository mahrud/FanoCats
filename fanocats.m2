needs "fano.m2"
needsPackage "JSON"

tables = {
    2, 3,
    (4,2), (4,3),
    (5,2), (5,3),
    (6,2), (6,3)
    }

alltables = splice {
    apply(4..8,  r -> (4,r)),
    apply(4..9,  r -> (5,r)),
    apply(4..11, r -> (6,r)) -- TODO: 6,12 isn't computed yet!
    }

datadir = "~/Projects/M2/fano/_data/"

toJSON Array := o -> L -> if #L == 0 then "[]" else (
    concatenate("[", demark_"," apply(L, x -> toJSON(x)), "]"))

storeFanoCatData = method()
storeFanoCatData ZZ := d0 -> (
    h0 := selectKeys(new HashTable from ExtTables, (d,i) -> d == d0);
    storeFanoCatData(keys h0, "toric-" | d0 | ".json"))
storeFanoCatData(ZZ, ZZ) := (d0, r0) -> (
    h0 := selectKeys(new HashTable from ExtTables, (d,i) -> d == d0
	and if r0 == 2 then fanoPicardRank(d,i) <= r0 else fanoPicardRank(d,i) == r0);
    storeFanoCatData(keys h0, "toric-" | d0 | "-" | r0 | ".json"))

storeFanoCatData(List, String) := (L, name) -> (
    h1 := hashTable apply(sort L, (d,i) ->
	i => hashTable splice {
	    X := fano(d,i);
	    r := fanoPicardRank(d,i);
	    L := fanoZonotopeDegrees(d,i);
	    E := if d < 4 or r < 4 or #L <= 10 then ExtTables#(d,i) else id_(ZZ^0);
	    F := secondaryFan X;
	    -- TODO: find a cleaner way to find the nef cone
	    -- as a maximal cone of the secondary fan
	    C := apply(cols nefGenerators X,
		ray -> position(cols rays F, ray' -> ray == ray'));
	    "rho" => r,
	    "rays" => [#rays X, toString rays X],
	    "cones" => [#max X, toString  max X],
	    "theta" => [#L, toExternalString L],
	    "degs"  =>  toExternalString degrees ring X,
	    "Ext"   => [toExternalString entries E, isExceptional E],
	    "chambers" => if r > 3 then #maxCones F else toExternalString(
		-- TODO: rays in the secondary fan and degs are redundant
		 entries transpose rays F, unique prepend_C maxCones F,
		 flatten entries interiorVector dualCone coneFromVData rays F),
	    "primitive" => toString primitiveCollections X,
	    });
    (datadir | name) << json(h1, Indent => 2, Sort => true) << close)

storeToricCatData = (L, Xs, name) -> (
    h1 := hashTable apply(L, Xs, (i, X) ->
	i => hashTable splice {
	    r := rank picardGroup X;
	    L := zonotopeDegrees X;
	    E := ExtTableL(X, L);
	    F := secondaryFan X;
	    -- TODO: find a cleaner way to find the nef cone
	    -- as a maximal cone of the secondary fan
	    C := apply(cols nefGenerators X,
		ray -> position(cols rays F, ray' -> ray == ray'));
	    "rho" => r,
	    "rays" => [#rays X, toString rays X],
	    "cones" => [#max X, toString  max X],
	    "theta" => [#L, toExternalString L],
	    "degs"  =>  toExternalString degrees ring X,
	    "Ext"   => [toExternalString entries E, isExceptional E],
	    "chambers" => if r > 3 then #maxCones F else toExternalString(
		-- TODO: rays in the secondary fan and degs are redundant
		 entries transpose rays F, unique prepend_C maxCones F,
		 flatten entries interiorVector dualCone coneFromVData rays F),
	    "primitive" => toString primitiveCollections X,
	    });
    (datadir | name) << json(h1, Indent => 2, Sort => true) << close)

end--
restart
needs "fanocats.m2"

apply(tables, loadFanoDB)
apply(tables, storeFanoCatData)

apply(alltables, loadFanoDB)
apply(alltables, storeFanoCatData)

primitiveCollections fano(2,3)


storeToricCatData(toList(0..5), apply(6, hirzebruchSurface), "hirzebruchs.json")
