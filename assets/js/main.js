// main.js — entry point (placeholder). Route to page initializers here when implementing.
//remove data from localStorage

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});
