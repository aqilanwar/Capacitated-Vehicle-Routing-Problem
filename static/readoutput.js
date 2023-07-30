
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
  
              // Add the "Depot" as the starting location
              routeWithLoadTracker.locations.push({
                customerDetails: input_data.depart,
                load_tracker: 0,
              });
  
              route.forEach((customerNumber) => {
                const customerDetail = input_data[`customer_${customerNumber}`];
                routeWithLoadTracker.load_tracker += customerDetail.demand;
                routeWithLoadTracker.locations.push({
                  customerDetails: customerDetail,
                  load_tracker: routeWithLoadTracker.load_tracker,
                });
              });
  
              // Add the "Landfill" as the last location with load_tracker set to 0
              routeWithLoadTracker.locations.push({
                customerDetails: input_data.landfill,
                load_tracker: 0,
              });
  
              // Add the "Depot" after the "Landfill" visit
              routeWithLoadTracker.locations.push({
                customerDetails: input_data.depart,
                load_tracker: 0,
              });
  
              // Display the route details for each route
              console.log(routeWithLoadTracker)
              return routeWithLoadTracker;
            });
          });
      });
}

// Function to fetch the distance matrix and display it in a table
function displayDistanceMatrix() {
    // Fetch the data from Input_Data.json
    fetch("static/Input_Data.json")
      .then((response) => response.json())
      .then((data) => {
        // Get the distance_matrix from the data
        const distanceMatrix = data.distance_matrix;
  
        // Create the table element
        const table = document.createElement("table");
        table.classList.add("table", "table-hover");
  
        // Create the table header row
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = "<th>Location</th>";
  
        // Add column headers (location indices)
        for (let i = 0; i < distanceMatrix.length; i++) {
          headerRow.innerHTML += `<th>${i}</th>`;
        }
  
        thead.appendChild(headerRow);
        table.appendChild(thead);
  
        // Create the table body and add rows for each location
        const tbody = document.createElement("tbody");
        for (let i = 0; i < distanceMatrix.length; i++) {
          const row = document.createElement("tr");
          row.innerHTML = `<td>${i}</td>`;
  
          // Add the distances from this location to other locations
          for (let j = 0; j < distanceMatrix[i].length; j++) {
            row.innerHTML += `<td>${distanceMatrix[i][j]}</td>`;
          }
  
          tbody.appendChild(row);
        }
  
        table.appendChild(tbody);
  
        // Add the table to the HTML document
        const tableContainer = document.getElementById("distanceMatrixContainer");
        const tableWrapper = document.createElement("div");
        tableWrapper.classList.add("table-responsive");
        tableWrapper.style.overflowX = "auto"; // Add the overflow style here
        tableWrapper.appendChild(table);
        tableContainer.appendChild(tableWrapper);
      })
      .catch((error) => console.error("Error fetching distance matrix:", error));
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
displayDistanceMatrix()
