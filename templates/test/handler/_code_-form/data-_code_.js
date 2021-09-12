const rows = {};

<% data.items.map(el => { %>
console.log("id: <%= el.id %>, name: '<%= el.name %>'");
<% }); %>

/*FOXB-INIT*/
/*FOXE-INIT*/

<% data.items.map(el => { %>
rows.push({id: <%= el.id %>, name: '<%= el.name %>'});
<% }); %>

/*FOXB-CODE*/
/*FOXE-CODE*/

console.log("Bye :)");
