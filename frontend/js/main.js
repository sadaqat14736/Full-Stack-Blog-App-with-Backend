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
 










// ===== CREATE BLOG =====
const createBlogForm = document.getElementById("createBlogForm");

if (createBlogForm) {
  createBlogForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const blogMessage = document.getElementById("blogMessage");

    blogMessage.textContent = "";

    // Get token
    const token = localStorage.getItem("token");
    if (!token) {
      blogMessage.style.color = "red";
      blogMessage.textContent = "You must login first!";
      return;
    }

    try {
      const res = await axios({
        method: "post",
        url: "http://localhost:3000/api/blog/createBlog",
        data: { title, content },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      blogMessage.style.color = "green";
      blogMessage.textContent = res.data.message;

      // Clear form
      createBlogForm.reset();

    } catch (err) {
      console.error(err);
      blogMessage.style.color = "red";
      blogMessage.textContent = err.response?.data?.message || "Error creating blog!";
    }
  });
}




// ===== FETCH ALL BLOGS =====
const blogsContainer = document.getElementById("blogsContainer");

if (blogsContainer) {
  async function fetchBlogs() {
    try {
      const res = await axios.get("http://localhost:3000/api/blog/all");

      const blogs = res.data.blogs;
      blogsContainer.innerHTML = "";

      if (blogs.length === 0) {
        blogsContainer.innerHTML = "<p>No blogs found.</p>";
        return;
      }

      // blogs.forEach(blog => {
      //   const blogCard = document.createElement("div");
      //   blogCard.className = "blog-card";

      //   blogCard.innerHTML = `
      //     <p class="author">Author: ${blog.author}</p>
      //     <h3>${blog.title}</h3>
      //     <p class="content">${blog.content.substring(0, 150)}${blog.content.length > 150 ? "..." : ""}</p>
      //     <p class="date">Date: ${new Date(blog.createdAt).toLocaleString()}</p>
      //   `;

      //   blogsContainer.appendChild(blogCard);
      // });

      blogs.forEach(blog => {
  const blogCard = document.createElement("div");
  blogCard.className = "blog-card";

  const fullContent = blog.content;
  const previewContent = fullContent.length > 150 ? fullContent.substring(0, 150) + "..." : fullContent;

  blogCard.innerHTML = `
    <div class="blog-card-header">
      <span class="author">${blog.author}</span>
      <span class="date">${new Date(blog.createdAt).toLocaleDateString()}</span>
    </div>
    <h3 class="blog-title">${blog.title}</h3>
    <p class="content" id="content-${blog._id}">${previewContent}</p>
    ${fullContent.length > 150 ? `<button class="read-more" data-id="${blog._id}">Read More</button>` : ""}
  `;

  blogsContainer.appendChild(blogCard);
});



// ===== READ MORE BUTTON =====
document.querySelectorAll(".read-more").forEach(button => {
  button.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const contentEl = document.getElementById(`content-${id}`);
    if (e.target.textContent === "Read More") {
      contentEl.textContent = blogs.find(b => b._id === id).content;
      e.target.textContent = "Show Less";
    } else {
      const fullContent = blogs.find(b => b._id === id).content;
      contentEl.textContent = fullContent.substring(0, 150) + "...";
      e.target.textContent = "Read More";
    }
  });
});

    } catch (err) {
      console.error("Error fetching blogs:", err);
      blogsContainer.innerHTML = "<p>Error loading blogs. Check console.</p>";
    }
  }

  // Call on page load
  fetchBlogs();
}

// ===== LOGOUT FUNCTIONALITY =====
const logoutBtn = document.querySelector(".logout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html"; // redirect to login
  });
}







