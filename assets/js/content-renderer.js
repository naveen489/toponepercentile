document.addEventListener('DOMContentLoaded', () => {
    // Helper to fetch JSON
    async function fetchJSON(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${path}:`, error);
            return null;
        }
    }

    // Helper to parse markdown (if marked is available)
    function parseMD(text) {
        if (!text) return "";
        if (typeof marked !== 'undefined') {
            return marked.parse(text);
        }
        return text;
    }

    async function init() {
        // 1. Render Homepage Content
        if (document.getElementById('home-hero-title')) {
            const homeData = await fetchJSON('content/homepage.json');
            if (homeData) {
                document.getElementById('home-hero-title').innerText = homeData.hero.title;
                document.getElementById('home-hero-subtitle').innerText = homeData.hero.subtitle;
                const ctaBtn = document.getElementById('home-hero-cta');
                ctaBtn.innerText = homeData.hero.cta_text;
                ctaBtn.href = homeData.hero.cta_url;

                // Stats
                const statsContainer = document.getElementById('home-stats-container');
                if (statsContainer && homeData.stats) {
                    statsContainer.innerHTML = homeData.stats.map(stat => `
                        <div>
                            <div style="font-size:2.5rem;font-weight:900;color:white;line-height:1;margin-bottom:0.5rem;" class="counter" data-target="${stat.value.replace(/[^0-9.]/g, '')}">0</div>
                            <div style="color:rgba(255,255,255,0.7);font-size:0.875rem;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">${stat.label}</div>
                        </div>
                    `).join('');
                }

                // Why Choose Us
                const whyContainer = document.getElementById('home-why-container');
                if (whyContainer && homeData.why_choose_us) {
                    whyContainer.innerHTML = homeData.why_choose_us.map(card => `
                        <div class="feature-card reveal" style="background:white;padding:2rem;border-radius:1rem;box-shadow:0 10px 30px rgba(0,0,0,0.03);border:1px solid #f3f4f6;">
                            <div style="width:3.5rem;height:3.5rem;border-radius:0.75rem;background:#fef9ee;display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;font-size:1.75rem;">${card.icon}</div>
                            <h3 style="font-size:1.1rem;font-weight:700;color:#111827;margin-bottom:0.75rem;">${card.title}</h3>
                            <div style="color:#6b7280;font-size:0.9375rem;line-height:1.6;">${parseMD(card.description)}</div>
                        </div>
                    `).join('');
                }
            }
        }

        // 2. Render About Content (on homepage)
        if (document.getElementById('home-about-heading')) {
            const aboutData = await fetchJSON('content/about.json');
            if (aboutData) {
                document.getElementById('home-about-heading').innerText = aboutData.heading;
                document.getElementById('home-about-description').innerHTML = parseMD(aboutData.description);
                
                const missionVisionContainer = document.getElementById('home-mission-vision');
                if (missionVisionContainer) {
                    missionVisionContainer.innerHTML = `
                        <div style="background:#fef9ee;padding:1.5rem;border-radius:1rem;border-left:4px solid #ddb448;">
                            <h4 style="font-weight:700;color:#1a3a6b;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;"><span>🎯</span> Our Mission</h4>
                            <div style="color:#4b5563;font-size:0.9375rem;line-height:1.6;">${parseMD(aboutData.mission)}</div>
                        </div>
                        <div style="background:#f8fafc;padding:1.5rem;border-radius:1rem;border-left:4px solid #1a3a6b;">
                            <h4 style="font-weight:700;color:#1a3a6b;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;"><span>👁️</span> Our Vision</h4>
                            <div style="color:#4b5563;font-size:0.9375rem;line-height:1.6;">${parseMD(aboutData.vision)}</div>
                        </div>
                    `;
                }
            }
        }

        // 3. Render Programs
        if (document.getElementById('programs-list') || document.getElementById('home-programs-container')) {
            const programsData = await fetchJSON('content/programs.json');
            if (programsData && programsData.programs) {
                programsData.programs.sort((a,b) => (a.order || 0) - (b.order || 0));

                const programsList = document.getElementById('programs-list');
                if (programsList) {
                    programsList.innerHTML = programsData.programs.map((prog, index) => {
                        const isEven = index % 2 !== 0;
                        const contentCol = `
                            <div class="reveal">
                                <div style="display:inline-block;padding:0.375rem 1rem;background:#eff6ff;color:#1a3a6b;border-radius:999px;font-size:0.875rem;font-weight:600;margin-bottom:1rem;">${prog.title}</div>
                                <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.75rem,3vw,2.25rem);font-weight:700;color:#111827;margin-bottom:1.25rem;line-height:1.2;">${prog.title}</h2>
                                <div style="color:#4b5563;font-size:1.0625rem;line-height:1.7;margin-bottom:2rem;">${parseMD(prog.description)}</div>
                                
                                <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:1.5rem;margin-bottom:2rem;">
                                    ${(prog.features || []).map(f => `
                                        <div style="display:flex;gap:0.75rem;">
                                            <div style="width:2.5rem;height:2.5rem;border-radius:0.5rem;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0;">${f.icon}</div>
                                            <div><h4 style="font-weight:600;color:#111827;font-size:0.9375rem;margin-bottom:0.25rem;">${f.title}</h4></div>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <div style="background:#fef9ee;border:1px solid #f2dfa6;border-radius:1rem;padding:1.25rem;margin-bottom:2rem;display:flex;gap:1rem;">
                                    <div style="font-size:1.5rem;flex-shrink:0;">📌</div>
                                    <div>
                                        <h4 style="font-weight:700;color:#8c6b25;font-size:0.9375rem;margin-bottom:0.25rem;">Eligibility</h4>
                                        <div style="color:#6b7280;font-size:0.875rem;line-height:1.5;margin:0;">${parseMD(prog.eligibility)}</div>
                                    </div>
                                </div>
                                <a href="contact.html" class="btn-primary" style="display:inline-flex;">${prog.cta_text || 'Enquire Now'}</a>
                            </div>
                        `;
                        const imgCol = `
                            <div class="reveal" style="${isEven ? 'order:-1;' : ''}">
                                ${prog.image ? `<img src="${prog.image}" alt="${prog.title}" style="width:100%;border-radius:1.5rem;box-shadow:0 20px 40px rgba(26,58,107,0.1);" />` : `<div style="background:linear-gradient(135deg,#f8fafc,#e2e8f0);border-radius:1.5rem;padding:3rem;text-align:center;box-shadow:0 20px 40px rgba(26,58,107,0.1);height:100%;min-height:24rem;display:flex;align-items:center;justify-content:center;"><div style="font-size:5rem;">${prog.icon}</div></div>`}
                            </div>
                        `;
                        return `
                            <div id="${prog.id}" style="padding:5rem 0;scroll-margin-top:6rem;">
                                <div class="container">
                                    <div style="display:grid;grid-template-columns:1fr;gap:3rem;align-items:center;" class="desktop-grid-2">
                                        ${isEven ? imgCol + contentCol : contentCol + imgCol}
                                    </div>
                                </div>
                            </div>
                            ${index < programsData.programs.length - 1 ? `<div class="container"><hr style="border:none;border-top:1px solid #f3f4f6;margin:0;" /></div>` : ''}
                        `;
                    }).join('');
                }
                
                const homePrograms = document.getElementById('home-programs-container');
                if (homePrograms) {
                    homePrograms.innerHTML = programsData.programs.slice(0, 3).map(prog => `
                        <a href="programs.html#${prog.id}" class="program-card">
                            <div style="padding:2.5rem 2rem;">
                                <div class="prog-icon">${prog.icon}</div>
                                <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.35rem;font-weight:700;color:#111827;margin-bottom:1rem;line-height:1.3;">${prog.title}</h3>
                                <div style="color:#6b7280;font-size:0.9375rem;line-height:1.6;margin-bottom:1.5rem;">${prog.description.replace(/<[^>]*>?/gm, '').substring(0, 100)}...</div>
                                <span style="display:inline-flex;align-items:center;color:#1a3a6b;font-weight:600;font-size:0.875rem;">Explore Program <svg style="width:1rem;height:1rem;margin-left:0.25rem;transition:transform 0.2s;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></span>
                            </div>
                        </a>
                    `).join('');
                }
            }
        }

        // 4. Render Testimonials
        if (document.getElementById('testi-masonry') || document.getElementById('home-testi-track')) {
            const testiData = await fetchJSON('content/testimonials.json');
            if (testiData && testiData.testimonials) {
                testiData.testimonials.sort((a,b) => (a.order || 0) - (b.order || 0));

                const masonry = document.getElementById('testi-masonry');
                if (masonry) {
                    masonry.innerHTML = testiData.testimonials.map(t => `
                        <div style="break-inside:avoid;margin-bottom:1.5rem;">
                            <div class="testimonial-card">
                                <div style="display:flex;gap:0.15rem;margin-bottom:0.75rem;"><span style="color:#ddb448;font-size:1.1rem;">${'★'.repeat(t.rating || 5)}</span></div>
                                <div style="font-size:3rem;color:#d5e3f5;font-family:Georgia,serif;line-height:1;margin-bottom:0.5rem;">"</div>
                                <blockquote style="color:#4b5563;font-size:0.9375rem;line-height:1.7;margin-bottom:1.25rem;font-style:italic;">${parseMD(t.review)}</blockquote>
                                <div style="display:flex;align-items:center;gap:0.75rem;padding-top:1rem;border-top:1px solid #f3f4f6;">
                                    ${t.photo ? `<img src="${t.photo}" style="width:3rem;height:3rem;border-radius:50%;object-fit:cover;border:2px solid #ddb448;"/>` : `<div style="width:3rem;height:3rem;border-radius:50%;background:linear-gradient(135deg,#4e81cc,#1a3a6b);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1.1rem;flex-shrink:0;border:2px solid #ddb448;">${t.name.charAt(0)}</div>`}
                                    <div><div style="font-weight:700;color:#111827;font-size:0.9rem;">${t.name}</div><div style="color:#1a3a6b;font-size:0.8rem;font-weight:600;">${t.exam}</div><div style="color:#9ca3af;font-size:0.7rem;">${t.year}</div></div>
                                </div>
                            </div>
                        </div>
                    `).join('');
                }

                const track = document.getElementById('home-testi-track');
                if (track) {
                    track.innerHTML = testiData.testimonials.map(t => `
                        <div class="carousel-slide" style="flex:0 0 100%;min-width:100%;padding:0 1rem;box-sizing:border-box;">
                            <div style="background:white;border-radius:1.5rem;padding:2.5rem;box-shadow:0 10px 40px rgba(26,58,107,0.08);margin:1rem;border:1px solid #f3f4f6;text-align:left;">
                                <div style="display:flex;gap:0.15rem;margin-bottom:1rem;"><span style="color:#ddb448;font-size:1.25rem;">${'★'.repeat(t.rating || 5)}</span></div>
                                <blockquote style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.1rem,2vw,1.35rem);color:#111827;line-height:1.6;margin-bottom:2rem;font-style:italic;">"${parseMD(t.review).replace(/<[^>]*>?/gm, '')}"</blockquote>
                                <div style="display:flex;align-items:center;gap:1rem;">
                                    ${t.photo ? `<img src="${t.photo}" style="width:3.5rem;height:3.5rem;border-radius:50%;object-fit:cover;"/>` : `<div style="width:3.5rem;height:3.5rem;border-radius:50%;background:linear-gradient(135deg,#1a3a6b,#0d1f3c);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1.25rem;">${t.name.charAt(0)}</div>`}
                                    <div><div style="font-weight:700;color:#111827;font-size:1rem;">${t.name}</div><div style="color:#6b7280;font-size:0.875rem;">${t.exam} - ${t.year}</div></div>
                                </div>
                            </div>
                        </div>
                    `).join('');
                    if (window.initCarousel) window.initCarousel();
                }
            }
        }

        // 5. Render Faculty
        if (document.getElementById('faculty-container')) {
            const facultyData = await fetchJSON('content/faculty.json');
            if (facultyData) {
                document.getElementById('fac-name').innerText = facultyData.name;
                document.getElementById('fac-designation').innerText = facultyData.designation;
                document.getElementById('fac-qualification').innerText = facultyData.qualification;
                document.getElementById('fac-experience').innerText = facultyData.experience;
                
                if (facultyData.photo) {
                    const photoDiv = document.getElementById('fac-photo');
                    photoDiv.innerHTML = `<img src="${facultyData.photo}" style="width:100%;height:100%;object-fit:cover;" alt="${facultyData.name}" />`;
                }

                if (facultyData.expertise) {
                    document.getElementById('fac-expertise').innerHTML = facultyData.expertise.map(e => `
                        <span style="display:inline-block;padding:0.25rem 0.75rem;background:#eff6ff;color:#1a3a6b;border-radius:999px;font-size:0.75rem;font-weight:600;">${e}</span>
                    `).join('');
                }

                document.getElementById('fac-bio').innerHTML = parseMD(facultyData.biography);
                document.getElementById('fac-philosophy').innerHTML = parseMD(facultyData.philosophy);
                
                if (facultyData.achievements) {
                    document.getElementById('fac-achievements').innerHTML = facultyData.achievements.map(a => `
                        <li style="display:flex;gap:0.75rem;margin-bottom:0.75rem;">
                            <span style="color:#ddb448;margin-top:0.1rem;">★</span>
                            <span style="color:#4b5563;font-size:0.9375rem;line-height:1.6;">${parseMD(a).replace(/<p>|<\/p>/g, '')}</span>
                        </li>
                    `).join('');
                }
            }
        }

        // 6. Render FAQ
        if (document.getElementById('faq-container')) {
            const faqData = await fetchJSON('content/faq.json');
            if (faqData && faqData.faqs) {
                faqData.faqs.sort((a,b) => (a.order || 0) - (b.order || 0));
                document.getElementById('faq-container').innerHTML = faqData.faqs.map((f, i) => `
                    <div class="faq-item">
                        <button class="faq-btn" id="faq-btn-${i}" aria-expanded="false">
                            <span style="font-weight:600;color:#111827;font-size:0.9375rem;"><span style="color:#1a3a6b;font-weight:700;margin-right:0.5rem;">Q.</span>${f.question}</span>
                            <span class="faq-icon"><svg style="width:1rem;height:1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></span>
                        </button>
                        <div class="faq-body" id="faq-body-${i}">
                            <div style="border-top:1px solid #f3f4f6;padding:1rem 1.5rem 1.25rem;">
                                <div style="color:#4b5563;font-size:0.9375rem;line-height:1.7;"><span style="color:#c9a84c;font-weight:700;margin-right:0.5rem;float:left;">A.</span>${parseMD(f.answer)}</div>
                            </div>
                        </div>
                    </div>
                `).join('');
                if (window.initFAQ) window.initFAQ();
            }
        }

        // 7. Render Contact info across pages
        const contactData = await fetchJSON('content/contact.json');
        if (contactData) {
            document.querySelectorAll('.contact-address').forEach(el => el.innerHTML = parseMD(contactData.address));
            document.querySelectorAll('.contact-phone').forEach(el => { el.innerText = contactData.phone; if(el.tagName === 'A') el.href = "tel:" + contactData.phone.replace(/[^0-9+]/g, ''); });
            document.querySelectorAll('.contact-phone-link').forEach(el => { if(el.tagName === 'A') el.href = "tel:" + contactData.phone.replace(/[^0-9+]/g, ''); });
            document.querySelectorAll('.contact-email').forEach(el => { el.innerText = contactData.email; if(el.tagName === 'A') el.href = "mailto:" + contactData.email; });
            document.querySelectorAll('.contact-email-link').forEach(el => { if(el.tagName === 'A') el.href = "mailto:" + contactData.email; });
            document.querySelectorAll('.contact-hours').forEach(el => el.innerText = contactData.working_hours);
            document.querySelectorAll('.contact-wa-link').forEach(el => el.href = "https://wa.me/" + contactData.whatsapp);
            
            if (document.getElementById('contact-map') && contactData.map_url) {
                document.getElementById('contact-map').innerHTML = `<iframe src="${contactData.map_url}" width="100%" height="100%" style="border:0;border-radius:1.5rem;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
            } else if (document.getElementById('contact-map')) {
                document.getElementById('contact-map').innerHTML = `<div style="font-size:3rem;">🗺️</div><p style="color:#6b7280;font-size:0.875rem;line-height:1.6;">Map coming soon.<br>Please visit us at our address above.</p>`;
            }
        }

        // Re-initialize scroll reveals and counters
        if (window.initReveal) window.initReveal();
        if (window.initCounters) window.initCounters();
    }

    init();
});
