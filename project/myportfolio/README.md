# My Portfolio Website

A modern, responsive portfolio website built with HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Works perfectly on all devices
- **Modern UI**: Clean and professional design with smooth animations
- **Navigation**: Fixed navigation bar with smooth scrolling
- **Sections**: Home, About, Projects, and Contact sections
- **Mobile Friendly**: Hamburger menu for mobile devices
- **Animations**: Scroll reveal animations and smooth transitions

## Customization Guide

### 1. Personal Information
Edit the `index.html` file to update your personal details:

```html
<!-- In the hero section -->
<h1 class="hero-title">Hi, I'm <span class="highlight">Your Name</span></h1>
<p class="hero-subtitle">Student at <span class="highlight">Your University</span></p>
<p class="hero-course">Course: <span class="highlight">Computer Science</span></p>
<p class="hero-section">Section: <span class="highlight">A</span></p>
```

### 2. Profile Picture
Replace the placeholder icon with your actual profile picture:

```html
<div class="hero-image">
    <img src="your-photo.jpg" alt="Your Name" class="profile-photo">
</div>
```

And add this CSS to `styles.css`:

```css
.profile-photo {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(255, 255, 255, 0.2);
}
```

### 3. Skills
Update the skills section in the About section:

```html
<div class="skill-tags">
    <span class="skill-tag">Your Skill 1</span>
    <span class="skill-tag">Your Skill 2</span>
    <span class="skill-tag">Your Skill 3</span>
</div>
```

### 4. Projects
Update the projects section with your actual projects:

```html
<div class="project-card">
    <div class="project-image">
        <i class="fas fa-code"></i>
    </div>
    <h3>Your Project Name</h3>
    <p>Project description goes here.</p>
    <div class="project-links">
        <a href="project-url" class="project-link">View Project</a>
        <a href="github-url" class="project-link">GitHub</a>
    </div>
</div>
```

### 5. Contact Information
Update your contact details:

```html
<div class="contact-item">
    <i class="fas fa-envelope"></i>
    <p>your.actual.email@example.com</p>
</div>
<div class="contact-item">
    <i class="fas fa-phone"></i>
    <p>Your actual phone number</p>
</div>
<div class="contact-item">
    <i class="fas fa-map-marker-alt"></i>
    <p>Your actual location</p>
</div>
```

### 6. Social Media Links
Update the social media links with your actual profiles:

```html
<div class="social-links">
    <a href="your-github-url" class="social-link"><i class="fab fa-github"></i></a>
    <a href="your-linkedin-url" class="social-link"><i class="fab fa-linkedin"></i></a>
    <a href="your-twitter-url" class="social-link"><i class="fab fa-twitter"></i></a>
</div>
```

### 7. Colors and Styling
You can customize the color scheme by editing the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #fbbf24;
    --accent-color: #667eea;
    --text-color: #333;
    --bg-color: #f8fafc;
}
```

## File Structure

```
myportfolio/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## How to Use

1. **Open the website**: Double-click on `index.html` to open it in your web browser
2. **Customize**: Edit the HTML file to add your personal information
3. **Deploy**: Upload the files to a web hosting service like GitHub Pages, Netlify, or Vercel

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript
- Font Awesome Icons
- Google Fonts (Poppins)

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have any questions or need help customizing your portfolio, feel free to ask!
