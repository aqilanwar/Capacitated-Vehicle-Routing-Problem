
// Function to display customers in the table
function displayCustomers(data) {
  const tableBody = document.getElementById("customerTableBody");

  // Iterate through the customer data and generate a row for each customer
  let index = 1;
  for (let i = 1; i <= data.Number_of_customers; i++) {
    const customerKey = `customer_${i}`;
    if (customerKey in data) {
      const customer = data[customerKey];
      const newRow = document.createElement("tr");

      // Create table cells for each customer attribute
      const indexCell = document.createElement("td");
      indexCell.textContent = index;
      newRow.appendChild(indexCell);

      const addressCell = document.createElement("td");
      addressCell.textContent = customer.address;
      newRow.appendChild(addressCell);

      const coordinatesCell = document.createElement("td");
      coordinatesCell.textContent = `${customer.coordinates.x}, ${customer.coordinates.y}`;
      newRow.appendChild(coordinatesCell);

      const demandCell = document.createElement("td");
      demandCell.textContent = customer.demand;
      newRow.appendChild(demandCell);

      // Add the row to the table body
      tableBody.appendChild(newRow);

      index++;
    }
  }
}

function displayResults(data) {
    const bestIndividual = document.getElementById("bestIndividual");
    const numOfVehicles = document.getElementById("numOfVehicles");
    const bestDistance = document.getElementById("bestDistance");
    const routeResult = document.getElementById("routeResult");

    bestIndividual.textContent = data.best_individual
    numOfVehicles.textContent = data.num_vehicles
    bestDistance.textContent = parseFloat(data.best_distance).toFixed(2)+ ' km'

    // Accessing the values of each route
    const routeInfo = data.route_info;
    for (let i = 0; i < routeInfo.length; i++) {
        // Add "Depot" at the beginning of the route
        routeInfo[i].unshift("Depot");
        
        // Add "Landfill" at the end of the route
        routeInfo[i].push("Landfill");
        routeInfo[i].push("Depot");
      
        // Log the updated route
        // console.log(routeInfo[i]);

        routeResult.innerHTML += `
        <div class="row" id="route_${i + 1}">
          <h5 class="card-title">Truck ${i + 1}'s route</h5>
          <div class="alert alert-secondary" role="alert">
            <p class="card-text">${routeInfo[i].join(' -> ')}</p>
          </div>
        </div>
      `;
      }

    // const bestIndividual = document.getElementById("bestIndividual");
}

function initMap(data) {
    // var depot = { lat: data.depart.coordinates.x, lng: data.depart.coordinates.y };
  
    // var map = new google.maps.Map(document.getElementById('map'), {
    //   zoom: 12,
    //   center: depot
    // });
  
    // var depotObj = new google.maps.Marker({
    //   position: depot,
    //   map: map,
    //   title: 'Depot'
    // });

    // for(i=0; i< data.Number_of_customers ; i++){
    //     const customerKey = `customer_${i}`;
    //     const customer = data[customerKey].address;
    //     console.log(customer);
    // }
  
  
  }

  function subRoute() {
    let input_data;
  
    // Fetch the data from Input_Data.json
    fetch("static/Input_Data.json")
      .then((response) => response.json())
      .then((data) => {
        input_data = data;
      })
      .then(() => {
        // Fetch the data from Training_Result.json
        fetch("static/Training_Result.json")
          .then((response) => response.json())
          .then((data) => {
            const training_result = data;
  
            // Match each route to the customer details and calculate load_tracker
            const matchedRoutesWithLoad = training_result.route_info.map((route, index) => {
              const routeWithLoadTracker = {
                load_tracker: 0,
                locations: [],
              };
  
              route.forEach((customerNumber) => {
                const customerDetail = input_data[`customer_${customerNumber}`];
                routeWithLoadTracker.load_tracker += customerDetail.demand;
                routeWithLoadTracker.locations.push({
                  customerDetails: customerDetail,
                  load_tracker: routeWithLoadTracker.load_tracker,
                });
              });
  
              // Display the route details for each route
              displayRouteDetails(routeWithLoadTracker, index + 1);
  
              return routeWithLoadTracker;
            });
          });
      });
  }
function displayRouteDetails(routeData, routeNumber) {
  const pillsTab = document.getElementById("pills-tab");
  const pillsTabContent = document.getElementById("pills-tabContent");

  // Create the tab for the route
  const tabItem = document.createElement("li");
  tabItem.classList.add("nav-item");
  tabItem.innerHTML = `
    <button class="nav-link${routeNumber === 1 ? " active" : ""}" id="pills-tab-${routeNumber}" data-bs-toggle="pill" data-bs-target="#pills-route-${routeNumber}" type="button" role="tab" aria-controls="pills-route-${routeNumber}" aria-selected="${routeNumber === 1 ? "true" : "false"}">Truck ${routeNumber}</button>
  `;
  pillsTab.appendChild(tabItem);

  // Create the tab content for the route
  const tabContent = document.createElement("div");
  tabContent.classList.add("tab-pane", "fade");
  if (routeNumber === 1) {
    tabContent.classList.add("show", "active");
  }
  tabContent.id = `pills-route-${routeNumber}`;
  tabContent.setAttribute("role", "tabpanel");
  tabContent.setAttribute("aria-labelledby", `pills-tab-${routeNumber}`);

  // Create the table for the route details
  const table = document.createElement("table");
  table.classList.add("table", "table-hover");
  table.innerHTML = `
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">Location</th>
        <th scope="col">Coordinates</th>
        <th scope="col">Total load carry (kg)</th>
        <th scope="col">Distance travelled (km)</th>
      </tr>
    </thead>
    <tbody>
      ${routeData.locations
        .map(
          (location, index) => `
          <tr>
            <th scope="row">${index + 1}</th>
            <td style="max-width: 300px;">[${index === 0 ? "Depot" : `Customer ${index}`}] ${location.customerDetails.address}</td>
            <td>${location.customerDetails.coordinates.x}, ${location.customerDetails.coordinates.y}</td>
            <td>${location.load_tracker}</td>
            <td>${location.customerDetails.distance_travelled || 0}</td>
          </tr>
        `
        )
        .join("")}
    </tbody>
  `;

  tabContent.appendChild(table);
  pillsTabContent.appendChild(tabContent);
}

  
// Fetch the data from Input_Data.json
fetch("static/Input_Data.json")
  .then((response) => response.json())
  .then((data) => {
    // Update the HTML content with the fetched data
    document.getElementById("depotAddress").textContent = data.depart.address;
    document.getElementById(
      "depotCoordinates"
    ).textContent = `Coordinates: ${data.depart.coordinates.x} , ${data.depart.coordinates.y}`;
    document.getElementById("landfillAddress").textContent =
      data.landfill.address;
    document.getElementById(
      "landfillCoordinates"
    ).textContent = `Coordinates: ${data.landfill.coordinates.x} , ${data.landfill.coordinates.y}`;
    document.getElementById("numberOfCustomers").textContent =
      data.Number_of_customers;

    // Call the function to display customers using the provided JSON data
    displayCustomers(data);
    initMap(data);

  });

  // Fetch the data from Input_Data.json
fetch("static/Training_Result.json")
.then((response) => response.json())
.then((data) => {
    // console.log(data);
    displayResults(data);
});

subRoute()