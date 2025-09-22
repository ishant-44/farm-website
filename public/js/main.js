// main.js
document.addEventListener("DOMContentLoaded", () => {
  // ---------------- Mobile menu toggle ----------------
  const menuBtn = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // ---------------- Order Form ----------------
  const orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(orderForm).entries());

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        alert(data.message || "Something went wrong");
        if (res.ok) orderForm.reset();
      } catch (err) {
        alert("Error submitting order: " + err.message);
      }
    });
  }

  // ---------------- Signup Form ----------------
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(signupForm).entries());

      if (formData.password !== formData["confirm-password"]) {
        return alert("❌ Passwords do not match!");
      }

      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (res.ok && data.user) {
          alert("✅ Signup successful!");
          localStorage.setItem("user", JSON.stringify(data.user));
          signupForm.reset();
          window.location.href = "/login.html";
        } else {
          alert(data.message || data.error || "Signup failed");
        }
      } catch (err) {
        alert("Error signing up: " + err.message);
      }
    });
  }

  // ---------------- Login Form ----------------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(loginForm).entries());

      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (res.ok && data.user) {
          alert(data.message || "✅ Login successful!");
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "/index.html";
        } else {
          alert(data.message || data.error || "❌ Login failed");
        }
      } catch (err) {
        alert("Error logging in: " + err.message);
      }
    });
  }

  // ---------------- Profile Modal ----------------
  const profileBtn = document.getElementById("profileButton");
  const profileModal = document.getElementById("profileModal");
  const closeProfile = document.getElementById("closeProfile");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  function updateProfile() {
    const userStr = localStorage.getItem("user");
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
    }

    if (user && profileBtn) {
      profileBtn.textContent = user.name.charAt(0).toUpperCase();
      profileName.textContent = user.name;
      profileEmail.textContent = user.email;
      profileBtn.classList.remove("hidden");
    } else if (profileBtn) {
      profileBtn.classList.add("hidden");
    }
  }

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      profileModal.classList.remove("hidden");
      profileModal.classList.add("flex");
    });
  }

  if (closeProfile) {
    closeProfile.addEventListener("click", () => {
      profileModal.classList.add("hidden");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      updateProfile();
      alert("Logged out!");
      window.location.href = "/login.html";
    });
  }

  // Run on page load
  updateProfile();
});
