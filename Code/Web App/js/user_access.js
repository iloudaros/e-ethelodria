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
});
