const errorContainer = document.getElementById("error-container");
const successContainer = document.getElementById("success-container");

function submitForm() {
  // alert("submitForm() called");
  var errorContainer = document.getElementById("error-container");
  console.log("errorContainer:", errorContainer);

  if (errorContainer) {
    errorContainer.innerHTML = "Your error message"; // Set innerHTML only if the element exists
  } else {
    console.error("Error: 'error-container' element not found in the DOM");
  }

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Reset previous messages
  errorContainer.innerHTML = "";
  successContainer.innerHTML = "";

  if (username === "" || password === "") {
    displayError("Please enter both username and password.");
  } else {
    // Perform AJAX request to the server
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.text())
      .then((res) => {
        if (res === "0") {
          displayError("Invalid username or password.");
        } else {
          displaySuccess("Login successful! Redirecting to user_home.html");
          setTimeout(() => {
            window.location.href = "/user_home.html";
          }, 1000);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        displayError("An error occurred. Please try again.");
      });
  }
}

function displayError(message) {
  const errorContainer = document.getElementById("error-container");
  const errorMessage = document.createElement("p");
  errorMessage.className = "text-red-500";
  errorMessage.textContent = message;
  errorContainer.appendChild(errorMessage);
}

function displaySuccess(message) {
  const successContainer = document.getElementById("success-container");
  const successMessage = document.createElement("p");
  successMessage.className = "text-green-500";
  successMessage.textContent = message;
  successContainer.appendChild(successMessage);
}
