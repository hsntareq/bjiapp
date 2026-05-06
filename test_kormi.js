fetch('http://localhost:3001/organization/hierarchy/tree?global=true', {
  headers: { 'Authorization': 'Bearer ' + process.argv[2] }
}).then(r => r.json()).then(data => {
  const flattenOrgs = (orgs) => {
    let result = [];
    for (const org of orgs) {
      result.push({ id: org.id, name: org.name, type: org.type, parentId: org.parentId || (org.parent ? org.parent.id : null) });
      if (org.children && org.children.length > 0) {
        result = result.concat(flattenOrgs(org.children));
      }
    }
    return result;
  };
  const all = flattenOrgs(data);
  const units = all.filter(o => o.type === 'UNIT');
  const myUnits = units.filter(o => o.parentId === 108); // 108 is Thana 1 Ward 1 parent
  console.log("All Units length:", units.length);
  console.log("Sibling Units length:", myUnits.length);
  console.log("Sibling Units:", myUnits.map(u => u.name).join(", "));
});
