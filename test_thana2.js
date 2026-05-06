fetch('http://localhost:3001/auth/me', {
  headers: { 'Authorization': 'Bearer ' + process.argv[2] }
}).then(r => r.json()).then(user => {
  console.log("User Context:", user.orgName, user.orgType);
  
  fetch('http://localhost:3001/organization/hierarchy/tree', {
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
    let filteredLevelOptions = [];
    if (userLevelIndex + 1 < levelOptions.length) {
      filteredLevelOptions = levelOptions.slice(userLevelIndex + 1);
    } else {
      filteredLevelOptions = [user.orgType];
    }
    console.log("Filtered Level Options:", filteredLevelOptions);
    
    for (const lvl of filteredLevelOptions) {
      const orgsAtLevel = availableOrgs.filter(o => o.type === lvl);
      console.log(`Available ${lvl}s:`, orgsAtLevel.length);
      if (lvl === 'WARD') {
         console.log('Sample Wards:', orgsAtLevel.slice(0,3).map(o => o.name));
      }
    }
  });
});
