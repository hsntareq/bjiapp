fetch('http://localhost:3001/users/by-organization?orgId=107&level=THANA', {
  headers: { 'Authorization': 'Bearer ' + process.argv[2] }
}).then(r => r.json()).then(data => {
  console.log("Current Org User keys:", Object.keys(data.currentOrgUsers[0] || {}));
});
