// main.js

// ===== SIGNUP FUNCTIONALITY =====
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get input values
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Send POST request to backend
      const res = await axios.post("http://localhost:3000/api/createUser", {
        username,
        email,
        password
      });

      // Show success message
      alert(res.data.message); // "signup successfully"

      // Redirect to login page
      window.location.href = "index.html";

    } catch (err) {
      console.error(err.response || err);
      // Show error message
      if (err.response && err.response.data && err.response.data.message) {
        alert("Signup failed: " + err.response.data.message);
      } else {
        alert("Signup failed. Check console for details.");
      }
    }
  });
}

// ===== LOGIN FUNCTIONALITY =====
const loginForm = document.getElementById("loginForm");

if (loginForm) {   // <-- only run if loginForm exists
  const loginMessage = document.getElementById("loginMessage");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    loginMessage.textContent = ""; // reset message

    if (!email || !password) {
      loginMessage.textContent = "Please enter email and password!";
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/login", { email, password });

      console.log("Response:", res.data);

      if (res.data.status === 200) {
        loginMessage.style.color = "green";
        loginMessage.textContent = res.data.message;

        // Save token and user
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.dbUser));

        // Redirect after short delay
        setTimeout(() => window.location.href = "create.html", 1000);

      } else {
        loginMessage.style.color = "red";
        loginMessage.textContent = res.data.message || "Login failed!";
      }

    } catch (err) {
      console.error("Login error:", err);

      if (err.response && err.response.data && err.response.data.message) {
        loginMessage.textContent = "Login failed: " + err.response.data.message;
      } else if (err.request) {
        loginMessage.textContent = "No response from server. Check backend!";
      } else {
        loginMessage.textContent = "Login error: " + err.message;
      }
    }
  });
} 
 




// ===== CREATE BLOG FUNCTIONALITY =====
const createBlogForm = document.getElementById("createBlogForm");

if (createBlogForm) {
  const blogMessage = document.getElementById("blogMessage");

  createBlogForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) {
      blogMessage.style.color = "red";
      blogMessage.textContent = "Please enter title and content!";
      return;
    }

    // Get JWT token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      blogMessage.style.color = "red";
      blogMessage.textContent = "You must login first!";
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/createBlog",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Blog created:", res.data);

      blogMessage.style.color = "green";
      blogMessage.textContent = "Blog created successfully!";

      // Reset form
      createBlogForm.reset();

      // Optional: redirect to all blogs page after 1 second
      setTimeout(() => {
        window.location.href = "blogs.html";
      }, 1000);

    } catch (err) {
      console.error("Error creating blog:", err);
      blogMessage.style.color = "red";
      blogMessage.textContent = err.response?.data?.message || "Failed to create blog!";
    }
  });
}
