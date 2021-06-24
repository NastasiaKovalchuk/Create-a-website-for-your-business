const signupButton = document.querySelector('#signupButton');
const message = document.getElementById('message');
const errorMessage = document.querySelector('#error-message-signup');
/**
 * Добавил функцию check для проверки паролей
 * и также fetch для signup
 * помогающие сообщения всплывут в случае ошибки
 */
const check = () => {
  if (document.getElementById('password').value
    === document.getElementById('password-repeat').value) {
    message.style.color = 'green';
    message.innerHTML = 'Пароли совпадают';
  } else {
    message.style.color = 'red';
    message.innerHTML = 'Пароли не совпадают, пожалуйста введите заново.';
  }
};

if (signupButton) {
  signupButton.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (e.target.password.value === e.target['password-repeat'].value) {
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      const secretWord = e.target['secret-word'].value;
      const response = await fetch('/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          secret: secretWord,
        }),
      });
      if (response.status === 200) {
        window.location = '/admin/requests';
      } else {
        const result = await response.json();
        errorMessage.innerHTML = result.error;
        errorMessage.style.color = 'red';
        errorMessage.style.fontSize = '1.5em';
      }
    }
  });
}