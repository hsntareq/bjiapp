fetch('http://localhost:3001/organization/hierarchy/tree?global=true', {
  headers: { 'Authorization': 'Bearer ' + process.argv[2] }
}).then(r => r.json()).then(data => {
  const flattenOrgs = (orgs) => {
    let result = [];
    for (const org of orgs) {
      result.push({ id: org.id, name: org.name, type: org.type, parentId: org.parentId, parentObj: org.parent });
      if (org.children && org.children.length > 0) {
        result = result.concat(flattenOrgs(org.children));
      }
    }
    return result;
  };
  const availableOrgs = flattenOrgs(data);
  const sampleUnit = availableOrgs.find(o => o.type === 'UNIT');
  console.log("Sample Unit:", sampleUnit);
});
