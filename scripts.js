(function(){
  const loginToggle = document.getElementById('loginToggle');
  const left = document.querySelector('.left');
  const firstInput = document.getElementById('loginUser');

  if (!loginToggle || !left) return;

  loginToggle.addEventListener('click', function(e){
    e.preventDefault();
    const opening = !left.classList.contains('login-open');
    left.classList.toggle('login-open', opening);
    if (opening) setTimeout(()=> firstInput?.focus(), 260);
  });

  // close on ESC
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') left.classList.remove('login-open');
  });

  // handle login submit -> redirect for librarian with fade/dissolve
  const loginForm = document.getElementById('loginCard');
  const loginUser = document.getElementById('loginUser');
  const loginPass = document.getElementById('loginPass');

  if (loginForm && loginUser && loginPass) {
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const user = loginUser.value.trim();
      const pass = loginPass.value;
      if (user === 'lib' && pass === 'lib') {
        // add exit class to body so CSS can fade/dissolve the page, then navigate
        document.body.classList.add('site-exit');
        // match timeout to the CSS transition below (~420ms)
        setTimeout(()=> window.location.href = './librarianPage/librarian.html', 420);
      } else {
        alert('Incorrect username or password');
        loginPass.focus();
      }
    });
  }
})();