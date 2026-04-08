needs "fano.m2"
needsPackage "JSON"

tables = {
    2, 3,
    (4,2), (4,3),
    (5,2), (5,3),
    (6,2) -- (6,3)
    }

datadir = "~/Projects/M2/fano/_data/"

storeFanoCatData = method()
storeFanoCatData ZZ := d0 -> (
    h0 := selectKeys(new HashTable from ExtTables, (d,i) -> d == d0);
    storeFanoCatData(keys h0, "toric-" | d0 | ".json"))
storeFanoCatData(ZZ, ZZ) := (d0, r0) -> (
    h0 := selectKeys(new HashTable from ExtTables, (d,i) -> d == d0
	and if r0 == 2 then fanoPicardRank(d,i) <= r0 else fanoPicardRank(d,i) == r0);
    storeFanoCatData(keys h0, "toric-" | d0 | "-" | r0 | ".json"))
storeFanoCatData(List, String) := (L, name) -> (
    h1 := hashTable apply(L, (d,i) ->
	i => hashTable splice {
	    X := fano(d,i);
	    r := fanoPicardRank(d,i);
	    L := fanoZonotopeDegrees(d,i);
	    E := ExtTables#(d,i);
	    F := secondaryFan X;
	    -- TODO: find a cleaner way to find the nef cone
	    -- as a maximal cone of the secondary fan
	    C := apply(cols nefGenerators X,
		ray -> position(cols rays F, ray' -> ray == ray'));
	    "rho" => r,
	    "rays" => #rays X,
	    "cones" => #max X,
	    "theta" => [toExternalString L, #L],
	    "degs"  =>  toExternalString degrees ring X,
	    "Ext"   => [toExternalString entries E, isExceptional E],
	    "chambers" => if r > 3 then #maxCones F else toExternalString(
		-- TODO: rays in the secondary fan and degs are redundant
		 entries transpose rays F, unique prepend_C maxCones F,
		 flatten entries interiorVector dualCone coneFromVData rays F)
	    });
    (datadir | name) << json(h1, Indent => 2) << close)

end--
restart
needs "fanocats.m2"

apply(tables, loadFanoDB)
apply(tables, storeFanoCatData)

primitiveCollections fano(2,3)
