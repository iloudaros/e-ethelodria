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
   let tableHTML;

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
