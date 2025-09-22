document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById("profileButton");
    const profileModal = document.getElementById("profileModal");
    const closeProfile = document.getElementById("closeProfile");
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const logoutBtn = document.getElementById("logoutBtn");
  
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (user && user.name) {
      profileBtn.textContent = user.name.charAt(0).toUpperCase(); // initial
      profileName.textContent = user.name;
      profileEmail.textContent = user.email;
      profileBtn.classList.remove("hidden"); // show button
    } else {
      profileBtn.classList.add("hidden"); // hide if no user
    }
  
    // Open modal
    profileBtn.addEventListener("click", () => {
      profileModal.classList.remove("hidden");
      profileModal.classList.add("flex");
    });
  
    // Close modal
    closeProfile.addEventListener("click", () => {
      profileModal.classList.add("hidden");
    });
  
    // Logout
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user"); // remove user data
      window.location.href = "/login.html";
    });
  });
  