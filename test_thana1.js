fetch('http://localhost:3001/auth/me', {
  headers: { 'Authorization': 'Bearer ' + process.argv[2] }
}).then(r => r.json()).then(user => {
  console.log("User Context:", user);
  
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
    const availableOrgs = flattenOrgs(data);
    
    // Simulate UI logic
    const levelOptions = ['CENTRAL', 'DIVISION', 'CITY', 'THANA', 'WARD', 'UNIT'];
    const userLevelIndex = levelOptions.indexOf(user.orgType);
    const nextLevelIndex = userLevelIndex + 1 < levelOptions.length ? userLevelIndex + 1 : userLevelIndex;
    const selectedLevel = levelOptions[nextLevelIndex];
    console.log("Selected Level:", selectedLevel);
    
    const orgsAtLevel = availableOrgs.filter(o => o.type === selectedLevel);
    const filteredOrgOptions = orgsAtLevel.filter(o => o.parentId === user.organizationId);
    console.log("Filtered Org Options:", filteredOrgOptions.map(o => o.name));
  });
});
