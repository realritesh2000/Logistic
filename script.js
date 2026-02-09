
        // 1. Initialize Animations
        AOS.init({ once: true, offset: 100 });

        // 2. 3D Globe Background (Restored)
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
        })

        // 3. Hamburger Menu
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        hamburger.addEventListener('click', () => { navLinks.classList.toggle('active'); });

        // 4. Form Logic (with Date & Time)
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxN97WkMrWH0OoegFZAWxKysONuLlk7KiVYh2vLONsfZq71U3JiCeMoiWc8BY0cTY-f/exec'; // <--- PASTE HERE
        const form = document.forms['contact-form'];
        const loadingMsg = document.getElementById('loadingMessage');
        const successMsg = document.getElementById('successMessage');

        form.addEventListener('submit', e => {
            e.preventDefault();
            let isValid = true;
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if(!input.value) { input.style.borderColor = 'red'; isValid = false; }
                else { input.style.borderColor = '#e2e8f0'; }
            });

            if(isValid) {
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

        // 5. 3D Logo Script
        const logoContainer = document.getElementById('logo3d');
        const logoImg = logoContainer.querySelector('.logo-img');
        document.addEventListener('mousemove', (e) => {
            let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            if(xAxis>20) xAxis=20; if(xAxis<-20) xAxis=-20;
            if(yAxis>20) yAxis=20; if(yAxis<-20) yAxis=-20;
            logoImg.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        // 6. Newsletter Logic (with Date & Time)
        const newsBtn = document.getElementById('newsletter-btn');
        const newsInput = document.getElementById('newsletter-email');
        const newsMsg = document.getElementById('newsletter-msg');

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
