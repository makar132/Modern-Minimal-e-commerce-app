const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  document.getElementById("authLinks").style.display = "none";
  document.getElementById("logoutBtn").style.display = "inline-block";
} else {
  document.getElementById("logoutBtn").style.display = "none";
}
