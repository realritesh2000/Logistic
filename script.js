/* =========================================
   1. EXISTING WEBSITE LOGIC
   ========================================= */

// Initialize Animations
AOS.init({ once: true, offset: 100 });

// 3D Globe Background
VANTA.GLOBE({
    el: "#home",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0xf97316,
    backgroundColor: 0x0f172a,
    size: 1.20
});

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
    hamburger.addEventListener('click', () => { navLinks.classList.toggle('active'); });
}

// Contact Form Logic (Google Sheets)
const scriptURL = 'https://script.google.com/macros/s/AKfycbxN97WkMrWH0OoegFZAWxKysONuLlk7KiVYh2vLONsfZq71U3JiCeMoiWc8BY0cTY-f/exec';
const form = document.forms['contact-form'];

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (!input.value) { input.style.borderColor = 'red'; isValid = false; }
            else { input.style.borderColor = '#e2e8f0'; }
        });

        if (isValid) {
            const btn = form.querySelector('.form-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending...';

            const now = new Date();
            const formData = new FormData(form);
            formData.append('Date', now.toLocaleDateString());
            formData.append('Time', now.toLocaleTimeString());

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    btn.innerHTML = 'Success!';
                    btn.style.background = '#25D366';
                    form.reset();
                    setTimeout(() => { btn.innerHTML = originalText; btn.style.background = 'var(--primary)'; }, 3000);
                })
                .catch(error => { alert('Error! Check Script URL.'); btn.innerHTML = originalText; });
        }
    });
}

// 3D Logo Script
const logoContainer = document.getElementById('logo3d');
if (logoContainer) {
    const logoImg = logoContainer.querySelector('.logo-img');
    document.addEventListener('mousemove', (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        if (xAxis > 20) xAxis = 20; if (xAxis < -20) xAxis = -20;
        if (yAxis > 20) yAxis = 20; if (yAxis < -20) yAxis = -20;
        logoImg.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
}

// Newsletter Logic
const newsBtn = document.getElementById('newsletter-btn');
const newsInput = document.getElementById('newsletter-email');
const newsMsg = document.getElementById('newsletter-msg');

if (newsBtn) {
    newsBtn.addEventListener('click', () => {
        const email = newsInput.value;
        if (!email || !email.includes('@')) {
            newsMsg.style.color = '#ef4444'; newsMsg.innerText = "Invalid email."; return;
        }
        const originalIcon = newsBtn.innerHTML;
        newsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        const now = new Date();
        const data = new FormData();
        data.append('Name', 'Newsletter Subscriber');
        data.append('Email', email);
        data.append('Message', 'Subscribed from Footer');
        data.append('Date', now.toLocaleDateString());
        data.append('Time', now.toLocaleTimeString());

        fetch(scriptURL, { method: 'POST', body: data })
            .then(() => {
                newsBtn.innerHTML = '<i class="fas fa-check"></i>';
                newsBtn.style.background = '#25D366';
                newsMsg.style.color = '#25D366'; newsMsg.innerText = "Subscribed!";
                newsInput.value = "";
                setTimeout(() => { newsBtn.innerHTML = originalIcon; newsBtn.style.background = 'var(--accent)'; newsMsg.innerText = ""; }, 3000);
            })
            .catch(() => { newsMsg.innerText = "Error."; newsBtn.innerHTML = originalIcon; });
    });
}


/* =========================================
   2. NEW: REVIEW SYSTEM LOGIC
   ========================================= */

// Default Data (Fallback if LocalStorage is empty)
const defaultReviews = [
    { id: 1, name: "Alex Johnson", role: "Logistics Mgr", text: "The colorful design and smooth tracking animation blew me away. Best service ever!" },
    { id: 2, name: "Sarah Smith", role: "CEO, TechFlow", text: "Incredible attention to detail. The dashboard is intuitive and the delivery was fast." },
    { id: 3, name: "Mike Tyson", role: "Heavy Freight", text: "Robust and reliable. They handled our heavy machinery with extreme care." }
];

// Load Data from LocalStorage (Shared with Admin Panel)
// We use 'activeReviews' for display and 'pendingReviews' for submission
let activeReviews = JSON.parse(localStorage.getItem('activeReviews')) || defaultReviews;
let pendingReviews = JSON.parse(localStorage.getItem('pendingReviews')) || [];

const reviewTrack = document.getElementById('reviewTrack');
let currentRevIndex = 0;

// --- RENDER FUNCTION ---
function renderReviews() {
    if (!reviewTrack) return; // Guard clause in case element is missing
    reviewTrack.innerHTML = "";
    
    activeReviews.forEach(data => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-card-inner">
                <div class="review-quote"><i class="fas fa-quote-right"></i></div>
                <p class="review-body">"${data.text}"</p>
                <div style="color: gold; margin-bottom: 10px;">⭐⭐⭐⭐⭐</div>
                <div class="review-user">
                    <img src="https://ui-avatars.com/api/?name=${data.name}&background=random" alt="User">
                    <div class="user-info">
                        <h4>${data.name}</h4>
                        <span>${data.role}</span>
                    </div>
                </div>
            </div>
        `;
        reviewTrack.appendChild(card);
    });
    updateReviewSlide();
}

// --- SLIDER CONTROLS ---
function nextReview() {
    if (activeReviews.length > 0) {
        currentRevIndex = (currentRevIndex + 1) % activeReviews.length;
        updateReviewSlide();
    }
}

function prevReview() {
    if (activeReviews.length > 0) {
        currentRevIndex = (currentRevIndex - 1 + activeReviews.length) % activeReviews.length;
        updateReviewSlide();
    }
}

function updateReviewSlide() {
    const cardWidth = 320 + 40; // Card width (320px) + Gap (40px)
    if (reviewTrack) {
        reviewTrack.style.transform = `translateX(-${currentRevIndex * cardWidth}px)`;
    }
}

// --- MODAL & SUBMISSION ---
const reviewModal = document.getElementById('reviewModal');

function toggleReviewModal() {
    if (reviewModal) {
        reviewModal.classList.toggle('active');
    }
}

const pubRevForm = document.getElementById('publicReviewForm');
if (pubRevForm) {
    pubRevForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get Values
        const name = document.getElementById('r-name').value;
        const role = document.getElementById('r-role').value;
        const text = document.getElementById('r-msg').value;

        // Create New Review Object
        const newReview = { 
            id: Date.now(), 
            name: name, 
            role: role, 
            text: text 
        };
        
        // 1. Get latest Pending list from storage (to avoid overwriting)
        let currentPending = JSON.parse(localStorage.getItem('pendingReviews')) || [];
        
        // 2. Add new review to Pending
        currentPending.push(newReview);
        
        // 3. Save back to LocalStorage (Admin will see this)
        localStorage.setItem('pendingReviews', JSON.stringify(currentPending));

        // 4. UI Feedback
        toggleReviewModal();
        pubRevForm.reset();
        alert("Thank you! Your review has been submitted and is waiting for Admin approval.");
    });
}

// --- INITIALIZE REVIEWS ON LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    renderReviews();
});




