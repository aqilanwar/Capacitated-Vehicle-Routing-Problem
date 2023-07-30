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
            // Make a request to the FastAPI server to trigger the model training process
            const response = await fetch('/train_model', {
                method: 'GET',
            });

            // Display an alert if the response is true (indicating process is done)
            if (response.ok) {
                // Update the modal body with the success message
                addressModalBody.innerHTML = `
                <p>Distance matrix calculation process has finished.</p>
                `;

                changeButton.innerHTML = `
                <button class="btn btn-primary">Train model</button>
                `
            } else {
                // Update the modal body with an error message
                addressModalBody.innerHTML = '<p>Error occurred while running the model.</p>';
            }
        } catch (error) {
            console.error('Error occurred while running the model:', error);
            // Update the modal body with an error message
            addressModalBody.innerHTML = '<p>Error occurred while running the model.</p>';
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
  
