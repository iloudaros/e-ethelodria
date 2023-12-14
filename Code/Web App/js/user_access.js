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


//Validtion Code For Inputs
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");
  const loadingSpinner = document.getElementById("loading-spinner");
  const messageContainer = document.getElementById("message-container");

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

fetchDataAndDisplayTable();

console.log(tableHTML);

   return tableHTML;

});

