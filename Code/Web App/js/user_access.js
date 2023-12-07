function validateForm() {
  var username = $('#username').val();
  var password = $('#password').val();
  var errorContainer = $('#error-container');
  var successContainer = $('#success-container');

  // Reset previous messages
  errorContainer.empty();
  successContainer.empty();

  if (username === '' || password === '') {
    displayError('Please enter both username and password.');
  } else {
    $.post('/login', $('#loginForm').serialize(), function (res) {
      if (res === '0') {
        displayError('Invalid username or password.');
      } else {
        displaySuccess('Login successful! Redirecting to user_home.html');
        setTimeout(function () {
          window.location.href = '/user_home.html';
        }, 1000);
      }
    });
  }
}

function displayError(message) {
  var errorContainer = $('#error-container');
  var errorMessage = $('<p>').addClass('text-red-500').text(message);
  errorContainer.append(errorMessage);
}

function displaySuccess(message) {
  var successContainer = $('#success-container');
  var successMessage = $('<p>').addClass('text-green-500').text(message);
  successContainer.append(successMessage);
}
