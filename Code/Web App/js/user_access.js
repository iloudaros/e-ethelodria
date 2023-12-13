/*document.addEventListener('DOMContentLoaded', function () {
    // This ensures that the script runs only after the DOM is fully loaded

    const errorContainer = document.getElementById('error-container');
    const successContainer = document.getElementById('success-container');

    function submitForm() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Reset previous messages
        errorContainer.innerHTML = '';
        successContainer.innerHTML = '';

        if (username === '' || password === '') {
            displayError('Please enter both username and password.');
        } else {
            // Perform AJAX request to the server
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
            .then(response => response.text())
            .then(res => {
                if (res === '0') {
                    displayError('Invalid username or password.');
                } else {
                    displaySuccess('Login successful! Redirecting to user_home.html');
                    setTimeout(() => {
                        window.location.href = '/user_home.html';
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayError('An error occurred. Please try again.');
            });
        }
    }

    function displayError(message) {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'text-red-500';
        errorMessage.textContent = message;
        errorContainer.appendChild(errorMessage);
    }

    function displaySuccess(message) {
        const successMessage = document.createElement('p');
        successMessage.className = 'text-green-500';
        successMessage.textContent = message;
        successContainer.appendChild(successMessage);
    }

    const loginButton = document.querySelector('[type="button"]');
    if (loginButton) {
        loginButton.addEventListener('click', submitForm);
    } else {
        console.error("Error: Login button not found in the DOM");
    }
});
*/

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
