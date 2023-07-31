      // Event listener for the "Load CSV" button
      const loadBtn = document.getElementById('load-csv'); 
      const runModel = document.getElementById('run-model')
      const changeButton = document.getElementById('change-button')

      loadBtn.addEventListener('click', function () {
        const fileInput = document.getElementById('inputGroupFile04');
        const file = fileInput.files[0];
  
        if (file) {
          processCSV(file);
        } else {
          alert('Please select a CSV file to load.');
        }
      });

      runModel.addEventListener('click', async () => {
        changeButton.innerHTML = `
          <button class="btn btn-primary" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </button>
        `
        addressModalBody.innerHTML = `
            <div class="d-flex justify-content-center">
                <p>Calculating Distance Matrix</p>
            </div>
                <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
        `;

        try {
          // Make a request to the FastAPI server to trigger the distance matrix calculation process
          const response = await fetch('/train_model', {
              method: 'GET',
          });
      
          // Display an alert if the response is true (indicating the process is done)
          if (response.ok) {
              // Update the modal body with the success message
              addressModalBody.innerHTML = `<p>Distance matrix calculation process has finished.</p>`;
      
              // Update the modal body with a button to train the model
              changeButton.innerHTML = `<button class="btn btn-primary" id="train-model">Train model</button>`;
      
              // Add click event listener to the "Train model" button
              const trainModelButton = document.getElementById('train-model');
              trainModelButton.addEventListener('click', async () => {
                  try {
                      // Show a loading spinner while waiting for the trainResponse
                      changeButton.innerHTML = `
                          <button class="btn btn-primary" type="button" disabled>
                              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              Loading...
                          </button>
                      `;

                      addressModalBody.innerHTML = `
                      <div class="d-flex justify-content-center">
                          <p>Training Model</p>
                      </div>
                          <div class="d-flex justify-content-center">
                              <div class="spinner-border" role="status">
                                  <span class="visually-hidden">Loading...</span>
                              </div>
                          </div>
                  `;
      
                      // Make a request to the FastAPI server to trigger the model training process
                      const trainResponse = await fetch('/run_model', {
                          method: 'GET',
                      });
      
                      // Display an alert if the model training response is ok (indicating the process is done)
                      if (trainResponse.ok) {
                          // Update the modal body with the success message
                          addressModalBody.innerHTML = `<p>Model training process has finished.</p>`;
      
                          // Update the modal body with a button to view the result
                          changeButton.innerHTML = `<a class="btn btn-primary" id="view-result" href="http://127.0.0.1:8000/dashboard">View result</a>`;
                      } else {
                          // Update the modal body with an error message if model training response is not ok
                          addressModalBody.innerHTML = '<p>Error occurred while running the model training process.</p>';
                      }
                  } catch (error) {
                      console.error('Error occurred while running the model training process:', error);
                      // Update the modal body with an error message
                      addressModalBody.innerHTML = '<p>Error occurred while running the model training process.</p>';
                  }
              });
          } else {
              // Update the modal body with an error message if the distance matrix calculation response is not ok
              addressModalBody.innerHTML = '<p>Error occurred while running the distance matrix calculation process.</p>';
          }
      } catch (error) {
          console.error('Error occurred while running the distance matrix calculation process:', error);
          // Update the modal body with an error message
          addressModalBody.innerHTML = '<p>Error occurred while running the distance matrix calculation process.</p>';
      }
      
    });




        
    
    // Function to process the loaded CSV file
    function processCSV(file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const csvContent = event.target.result;
          const rows = csvContent.split(/\r?\n/); // Use regular expression to handle line breaks
  
          // Calculate the number of customers in the CSV
          const numberOfCustomers = rows.length - 1; // Exclude the header row
  
          // Display the number of customers in the modal
          const addressModalBody = document.getElementById('addressModalBody');
          addressModalBody.innerHTML = `<p class="text-start"><strong>Number of Customers:</strong> ${numberOfCustomers-1}</p>`;
  
          // Show the modal using Bootstrap's JavaScript method
          const addressModal = new bootstrap.Modal(document.getElementById('addressModal'));
          addressModal.show();
        };
  
        reader.onerror = function () {
          alert('Error occurred while reading the CSV file.');
        };
  
        reader.readAsText(file);
      }
  
