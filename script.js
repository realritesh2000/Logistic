/* =========================================
   1. IMPORTS & FIREBASE SETUP
   (Must be at the top of the file)
   ========================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- YOUR FIREBASE KEYS ---
const firebaseConfig = {
    apiKey: "AIzaSyA0V3z0ujx3WjpLygMAKEqZKlAUbdsAKZ0",
    authDomain: "tridev-logistics.firebaseapp.com",
    projectId: "tridev-logistics",
    storageBucket: "tridev-logistics.firebasestorage.app",
    messagingSenderId: "1072370972061",
    appId: "1:1072370972061:web:e8d70223559178e7a32b74",
    measurementId: "G-H4MMTWX8EH"
};

// Initialize App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* =========================================
   2. GLOBAL FUNCTIONS (For HTML onclick="")
   ========================================= */

// Toggle the Review Popup
window.toggleReviewModal = function() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.toggle('active');
    } else {
        console.error("Modal not found!");
    }
};

// Review Slider Logic
let activeReviews = [];
let currentRevIndex = 0;
const reviewTrack = document.getElementById('reviewTrack');

window.nextReview = function() {
    if (activeReviews.length > 0) {
        currentRevIndex = (currentRevIndex + 1) % activeReviews.length;
        updateReviewSlide();
    }
};

window.prevReview = function() {
    if (activeReviews.length > 0) {
        currentRevIndex = (currentRevIndex - 1 + activeReviews.length) % activeReviews.length;
        updateReviewSlide();
    }
};

function updateReviewSlide() {
    if (reviewTrack) {
        const cardWidth = 320 + 50; // Card width (320px) + Gap (50px)
        reviewTrack.style.transform = `translateX(-${currentRevIndex * cardWidth}px)`;
    }
}


/* =========================================
   3. FIREBASE LOGIC (Load & Add Reviews)
   ========================================= */

// A. LOAD APPROVED REVIEWS
async function loadReviews() {
    if (!reviewTrack) return;
    
    reviewTrack.innerHTML = "<p style='text-align:center; width:100%; color:gray;'>Loading reviews...</p>";

    try {
        // Query: Get reviews where status is 'active'
        const q = query(collection(db, "reviews"), where("status", "==", "active"));
        const querySnapshot = await getDocs(q);
        
        reviewTrack.innerHTML = ""; // Clear loading msg
        activeReviews = []; // Reset array

        if (querySnapshot.empty) {
            reviewTrack.innerHTML = "<p style='text-align:center; width:100%; color:#666;'>No reviews yet. Be the first!</p>";
            return;
        }

        // Store data and render
        querySnapshot.forEach((doc) => activeReviews.push(doc.data()));

        activeReviews.forEach(data => {
            const card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML = `
                <div class="review-card-inner">
                    <div class="review-quote"><i class="fas fa-quote-right"></i></div>
                    <p class="review-body">"${data.text}"</p>
                    <div class="review-user">
                        <img src="https://ui-avatars.com/api/?name=${data.name}&background=random" alt="User">
                        <div class="user-info">
                            <h4>${data.name}</h4>
                            <span>${data.role}</span>
                        </div>
                    </div>
                </div>`;
            reviewTrack.appendChild(card);
        });
        
        // Reset slider position
        currentRevIndex = 0;
        updateReviewSlide();

    } catch (error) {
        console.error("Error loading reviews:", error);
        reviewTrack.innerHTML = "<p style='color:red; text-align:center;'>Error loading reviews.</p>";
    }
}

// B. SUBMIT NEW REVIEW
const pubRevForm = document.getElementById('publicReviewForm');
if (pubRevForm) {
    pubRevForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = pubRevForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = "Sending...";
        btn.disabled = true;

        try {
            await addDoc(collection(db, "reviews"), {
                name: document.getElementById('r-name').value,
                role: document.getElementById('r-role').value,
                text: document.getElementById('r-msg').value,
                status: "pending", // Sends to Admin
                date: new Date()
            });

            alert("Thank you! Your review has been submitted for approval.");
            window.toggleReviewModal(); // Close modal
            pubRevForm.reset();
        } catch (error) {
            console.error("Error adding review: ", error);
            alert("Error submitting review. Check console for details.");
        }
        
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

// Load reviews when page opens
document.addEventListener('DOMContentLoaded', loadReviews);


/* =========================================
   4. ANIMATIONS & OTHER LOGIC
   ========================================= */

// Initialize AOS
if (typeof AOS !== 'undefined') {
    AOS.init({ once: true, offset: 100 });
}

// 3D Globe Background
if (typeof VANTA !== 'undefined') {
    try {
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
    } catch (e) { console.log("Vanta not loaded"); }
}

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
    hamburger.addEventListener('click', () => { navLinks.classList.toggle('active'); });
}

// 3D Logo Script
const logoContainer = document.getElementById('logo3d');
if (logoContainer) {
    const logoImg = logoContainer.querySelector('.logo-img');
    document.addEventListener('mousemove', (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        // Limit rotation
        if (xAxis > 20) xAxis = 20; if (xAxis < -20) xAxis = -20;
        if (yAxis > 20) yAxis = 20; if (yAxis < -20) yAxis = -20;
        logoImg.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
}

// Contact Form (Google Sheets)
const scriptURL = 'https://script.google.com/macros/s/AKfycbxN97WkMrWH0OoegFZAWxKysONuLlk7KiVYh2vLONsfZq71U3JiCeMoiWc8BY0cTY-f/exec';
const contactForm = document.forms['contact-form'];

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const btn = contactForm.querySelector('.form-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending...';
        
        const formData = new FormData(contactForm);
        const now = new Date();
        formData.append('Date', now.toLocaleDateString());
        formData.append('Time', now.toLocaleTimeString());

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(() => {
                btn.innerHTML = 'Success!';
                btn.style.background = '#25D366';
                contactForm.reset();
                setTimeout(() => { btn.innerHTML = originalText; btn.style.background = ''; }, 3000);
            })
            .catch(() => { alert('Error sending message.'); btn.innerHTML = originalText; });
    });
}