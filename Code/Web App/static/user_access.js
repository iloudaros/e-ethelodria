  //Function for onclick logout
  function logout() {
  fetch('/logout', {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('loading')
      window.location.href = '/';
    })
    .catch((error) => {
      console.error('Logout error:', error);
    });
}

function fetchDataAndDisplayTable() {
   fetch('/getdata')
      .then((response) => response.json())
      .then((data) => {
         const tableContainer = document.getElementById("table-container");

         // Log the received data
         console.log(data);

         // Check if data is received
         if (data && data.length > 0) {
            // Generate HTML table
            const tableHTML = generateHTMLTable(data);

            // Log the generated HTML to the console
            console.log(tableHTML);

            // Insert the table HTML into the container
            tableContainer.innerHTML = tableHTML;
         } else {
            // Display a message if no data is received
            tableContainer.innerHTML = "<p>No data available.</p>";
         }
      })
      .catch((error) => {
         console.error('Error fetching data:', error);
      })
      .finally(() => {
         // Hide loading spinner after the request is complete (if applicable)
         // loadingSpinner.style.display = "none";
      });
}

//Table row generation
 function generateHTMLTable(data) {
    const headerNames = ['Product ID', 'Product Name', 'Category ID', 'Category Name', 'Quantity'];
    const columns = Object.keys(data[0]);
    const filteredColumns = columns.slice(1);
    let tableHTML = '<table class="table table-hover" id="table-container">';
    tableHTML += '<tbody>';
    
    // Create table headers
    headerNames.forEach((header, index) => {
      tableHTML += `<th scope="col">${header}</th>`;
    });

    tableHTML += '</tr></thead><tbody>';

    // Create table rows
    data.forEach(rowData => {
      tableHTML += `<tr>`;
      filteredColumns.forEach(column => {
        tableHTML += `<td>${rowData[column]}</td>`;
      });
      tableHTML += `</tr>`;
    });

    tableHTML += `</tbody></table>`;

    return tableHTML;
  }

  /*//Fill the dropdown with category list
  function addCategoryDropdown(data) {
    const categoryFilter = document.getElementById("categoryFilter");

    const categories = [...new Set(data.map(item => item.category_name)];

    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.text = category;
      categoryFilter.appendChlid(option);
    });      
  } 
  
  //Functionality of filter button click
  function handleFilterButtonClick() {
    const selectedCategories = getSelectedCategories();
    filterTableByCategory(selectedCategories);
  } 

  //Get selected categories from dropdown
  function getSelectedCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    return Array.from(categoryFilter.selectedOptions, option => option.value);
  }

  //Filtering of table based on category
  function filterTableByCategory(selectedCategories) {
    const tableRows = document.querySelectorAll("#table-container tbody tr");

    tableRows.forEach(row => {
        const categoryCell = row.querySelector("td:nth-child(5)"); // Assuming category is in the 5th column
        const category = categoryCell.textContent;

        // Show or hide rows based on selected categories
        row.style.display = selectedCategories.length === 0 || selectedCategories.includes(category) ? "" : "none";
    });
  }

  document.getElementById("filterButton").addEventListener("click", handleFilterButtonClick); */

function fetchServiceStatistics() {
  console.log('Fetching service statistics...');
  fetch('/serviceStatisticsWithTime')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      createServiceChart(data);
    })
    .catch((error) => {
      console.error('Error fetching service statistics:', error);
    });
}

function createServiceChart(data) {
  const ctx = document.getElementById('serviceChart').getContext('2d');

  const dates = data.newRequests.map(entry => new Date(entry.date));
  const newRequestCounts = data.newRequests.map(entry => entry.newRequestCount);
  const processedRequestCounts = data.processedRequests.map(entry => entry.processedRequestCount);
  const newOfferCounts = data.newOffers.map(entry => entry.newOfferCount);
  const processedOfferCounts = data.processedOffers.map(entry => entry.processedOfferCount);

  const serviceChart = new Chart(ctx, {
    type: 'line', // Use line chart for time series
    data: {
      labels: dates,
      datasets: [
        {
          label: 'New Requests',
          data: newRequestCounts,
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false,
        },
        {
          label: 'Processed Requests',
          data: processedRequestCounts,
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: false,
        },
        {
          label: 'New Offers',
          data: newOfferCounts,
          borderColor: 'rgba(255, 206, 86, 1)',
          fill: false,
        },
        {
          label: 'Processed Offers',
          data: processedOfferCounts,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'time', // Specify time scale for x-axis
          time: {
            unit: 'day', // Adjust the time unit as needed (day, week, month, etc.)
            tooltipFormat: 'll', // Format for tooltips
          },
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            min: 0,
          },
          title: {
            display: true,
            text: 'Count',
          },
        },
      },
    },
  });
}

/*const dateRangeSlider = document.getElementById('dateRangeSlider');
dateRangeSlider.addEventListener('input', handleDateRangeChange);

//Function to handle slider value change
function handleDateRangeChange() {
  const selectedPercentage = dateRangeSlider.value;
  
  const startIndex = 0;
  const endIndex = Math.floor(data.newRequests.length * (selectedPercentage / 100));

  //Filter your data based on the calculated indices
  const filteredData = {
    newRequests: data.newRequests.slice(startIndex, endIndex),
    processedRequests: data.processedRequests.slice(startIndex, endIndex),
    newOffers: data.newOffers.slice(startIndex, endIndex),
    processedOffers: data.processedOffers.slice(startIndex, endIndex),
  };

  //Update your chart or other UI elements with the filtered data
  createServiceChart(filteredData.newRequestCount, filteredData.processedRequestCount, filteredData.newOfferCount, filteredData.processedOfferCount);
}
*/

//Validtion Code For Inputs
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");
  const loadingSpinner = document.getElementById("loading-spinner");
  const messageContainer = document.getElementById("message-container");
  const vRegistrationForm = document.getElementById("vRegistrationForm");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Simple client-side validation
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    // Show loading spinner
    loadingSpinner.style.display = "block";

    // AJAX request
    fetch("/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = './user_home.html';
        } else {
          // Display error message
          messageContainer.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
        }
        // Display success message
        //messageContainer.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
      })
      .catch((error) => {
        // Display error message
        messageContainer.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
      })
      .finally(() => {
        // Hide loading spinner after the request is complete
        loadingSpinner.style.display = "none";
      });
  });

/*vRegistrationForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  const telephone = document.getElementById("telephone").value;
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;

  if (!username || !password || !email || !telephone || !name || !surname) {
    alert("Please fill in all the required fields.");
    return;
  }

  //AJAX request for registration 
  fetch("v_register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email, telephone, name, surname}),
  })
    .then((response) => response.json())
    .then((data) => {
      if(data.success) {
        alert(data.message);
        window.location.href = '/v_account.html';
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error('Registration Error:', error);
      alert('An error occured during registration. Please try again.');
    });
}); */

fetchDataAndDisplayTable();
fetchServiceStatistics();

console.log(tableHTML);

   return tableHTML;

});

