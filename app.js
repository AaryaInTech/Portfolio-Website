// API Configuration
const API_BASE_URL = window.location.origin; // Use same origin as the frontend

// Global State
let portfolioData = null; // Data will be loaded here
const pageIds = ['home', 'experience', 'about', 'work', 'certs', 'contact']; 
let currentPageId = 'home'; // Tracks the currently active page
let isDarkMode = false; // State for dark mode

// Contact form handler
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                    formMessage.className = 'text-xs text-accent-green italic mt-2';
                    formMessage.classList.remove('hidden');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                // Fallback to mailto if API fails
                const mailtoLink = `mailto:aarya.gourkar05@gmail.com?subject=Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message)}`;
                window.location.href = mailtoLink;
                formMessage.textContent = 'Opening email client...';
                formMessage.className = 'text-xs text-text-gray/80 dark:text-dark-gray-text/80 italic mt-2';
                formMessage.classList.remove('hidden');
            }
        });
    }
});

// --- Core Functions ---

/**
 * Toggles the dark mode by adding/removing the 'dark' class on the body.
 */
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const body = document.body;
    const toggleIcon = document.getElementById('dark-mode-icon');
    const toggleButton = document.getElementById('dark-mode-toggle');

    if (isDarkMode) {
        body.classList.add('dark');
        toggleIcon.innerHTML = `
            <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        `;
        toggleButton.setAttribute('aria-label', 'Switch to light mode');
    } else {
        body.classList.remove('dark');
        toggleIcon.innerHTML = `
            <svg class="w-6 h-6 text-text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        `;
        toggleButton.setAttribute('aria-label', 'Switch to dark mode');
    }
}

/**
 * Fetches data from the backend API, stores it, and initializes rendering.
 */
async function fetchPortfolioDataAndRender() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/portfolio`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        portfolioData = data;
        
        // Render the content using safe DOM methods
        renderSkills(portfolioData.skills);
        renderProjects(portfolioData.projects);
        renderCertifications(portfolioData.skills.certifications);
        
        // Set initial navigation link style
        let initialPage = window.location.hash.substring(1) || 'home';
        if (!pageIds.includes(initialPage)) {
            initialPage = 'home';
        }
        currentPageId = initialPage;
        
        updateNavigationStyles(initialPage);
    } catch (error) {
        console.error("Could not load portfolio data from API:", error.message);
        // Fallback: Try to load from data.json directly
        try {
            const fallbackResponse = await fetch('/data.json');
            if (fallbackResponse.ok) {
                const data = await fallbackResponse.json();
                portfolioData = data;
                renderSkills(portfolioData.skills);
                renderProjects(portfolioData.projects);
                renderCertifications(portfolioData.skills.certifications);
                
                let initialPage = window.location.hash.substring(1) || 'home';
                if (!pageIds.includes(initialPage)) {
                    initialPage = 'home';
                }
                currentPageId = initialPage;
                updateNavigationStyles(initialPage);
            } else {
                throw new Error('Fallback also failed');
            }
        } catch (fallbackError) {
            console.error("Fallback also failed:", fallbackError);
            // Fallback error UI
            const containers = ['skills-container', 'projects-container', 'certs-list-container'];
            containers.forEach(containerId => {
                const container = document.getElementById(containerId);
                if (container) {
                    container.textContent = '';
                    const errDiv = document.createElement('div');
                    errDiv.className = 'text-red-500 italic';
                    errDiv.textContent = 'Error loading data. Please refresh the page.';
                    container.appendChild(errDiv);
                }
            });
        }
    }
}

// --- Dynamic Safe Rendering Functions (XSS Secure & Fast) ---

/**
 * Renders the skills dynamically.
 * @param {object} skills - The skills data object.
 */
function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (container && skills) {
        container.textContent = ''; // Safe clear
        
        // Iterate through all categories except certifications
        for (const category in skills) {
            if (category === 'certifications') continue;
            
            const categorySkills = skills[category];
            if (Array.isArray(categorySkills) && categorySkills.length > 0) {
                // Create category header
                const h3 = document.createElement('h3');
                h3.className = 'text-2xl font-semibold text-text-dark dark:text-dark-text mb-4';
                h3.textContent = category;
                container.appendChild(h3);
                
                // Create skills container
                const skillsDiv = document.createElement('div');
                skillsDiv.className = 'flex flex-wrap gap-3 mb-6';
                
                categorySkills.forEach(skill => {
                    const span = document.createElement('span');
                    span.className = 'bg-bg-soft dark:bg-dark-soft text-text-dark dark:text-dark-text px-3 py-1 rounded-full text-base font-medium';
                    span.textContent = skill;
                    skillsDiv.appendChild(span);
                });
                
                container.appendChild(skillsDiv);
            }
        }
    }
    // Rebind custom cursor mouse event listeners to dynamically added content
    if (window.updateCursorListeners) window.updateCursorListeners();
}

/**
 * Renders the certification cards dynamically.
 * @param {Array<string>} certs - The array of certification names.
 */
function renderCertifications(certs) {
    const container = document.getElementById('certs-list-container');
    if (container && certs && Array.isArray(certs)) {
        container.textContent = ''; // Safe clear
        
        certs.forEach((cert, index) => {
            const card = document.createElement('div');
            card.className = 'cert-card bg-bg-card dark:bg-dark-card p-5 rounded-xl shadow-lg border-l-4 border-primary-pink transition duration-300 hover:shadow-primary-pink/30 hover:bg-bg-soft/70 dark:hover:bg-dark-soft/70';
            
            const flexDiv = document.createElement('div');
            flexDiv.className = 'flex items-start space-x-4';
            
            const spanIndex = document.createElement('span');
            spanIndex.className = 'text-3xl font-bold text-accent-green flex-shrink-0';
            spanIndex.textContent = (index + 1).toString();
            
            const pText = document.createElement('p');
            pText.className = 'text-lg font-medium text-text-dark dark:text-dark-text';
            pText.textContent = cert; // XSS Safe
            
            flexDiv.appendChild(spanIndex);
            flexDiv.appendChild(pText);
            card.appendChild(flexDiv);
            container.appendChild(card);
        });
    }
    if (window.updateCursorListeners) window.updateCursorListeners();
}

/**
 * Renders the project cards dynamically.
 * @param {Array<Object>} projects - The array of project objects.
 */
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (container && projects && Array.isArray(projects)) {
        container.textContent = ''; // Safe clear
        
        projects.forEach(project => {
            const linkText = project.tags && project.tags.some(tag => tag.toLowerCase().includes('research')) 
                ? 'View Project Details' 
                : 'View Codebase';
                
            const card = document.createElement('div');
            card.className = 'project-card bg-bg-card dark:bg-dark-card p-6 rounded-2xl shadow-lg border border-bg-soft dark:border-dark-soft hover:shadow-primary-pink/20 transition duration-300 transform hover:-translate-y-1';
            
            const h3 = document.createElement('h3');
            h3.className = 'text-2xl font-bold text-text-dark dark:text-dark-text mb-2';
            h3.textContent = project.title; // XSS Safe
            
            const pSubtitle = document.createElement('p');
            pSubtitle.className = 'text-text-gray dark:text-dark-gray-text text-base uppercase tracking-wider mb-3 text-accent-green font-semibold';
            pSubtitle.textContent = project.subtitle || ''; // XSS Safe
            
            const pDesc = document.createElement('p');
            pDesc.className = 'text-lg text-text-dark dark:text-dark-text mb-4';
            pDesc.textContent = project.description; // XSS Safe
            
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'flex flex-wrap gap-2 text-base';
            
            (project.tags || []).forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'bg-bg-soft dark:bg-dark-soft px-3 py-1 rounded-full text-base text-primary-pink';
                tagSpan.textContent = tag; // XSS Safe
                tagsContainer.appendChild(tagSpan);
            });
            
            const aLink = document.createElement('a');
            aLink.href = project.link || '#';
            aLink.target = '_blank';
            aLink.className = 'block mt-4 text-primary-pink hover:underline text-lg font-medium';
            aLink.textContent = `${linkText} →`; // XSS Safe
            
            card.appendChild(h3);
            card.appendChild(pSubtitle);
            card.appendChild(pDesc);
            card.appendChild(tagsContainer);
            card.appendChild(aLink);
            
            container.appendChild(card);
        });
    }
    if (window.updateCursorListeners) window.updateCursorListeners();
}

// --- Custom Cursor Logic (Performance optimized, Accessible, Handles Touch Screens) ---

/**
 * Initializes and handles the custom cursor animation.
 */
function setupCursor() {
    const cursor = document.getElementById('pixel-cursor');
    const body = document.body;

    // Guard: Disable completely on devices with touch capabilities
    if (window.matchMedia('(pointer: coarse)').matches) {
        if (cursor) cursor.style.display = 'none';
        body.classList.remove('custom-cursor-active');
        return;
    }

    body.classList.add('custom-cursor-active');

    // Follow the mouse coordinates using performant hardware-accelerated transform3d
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(${e.clientX - 25}px, ${e.clientY - 25}px, 0)`;
    });

    // Helper functions for mouse listener callbacks
    function addHoveredClass() { body.classList.add('hovered'); }
    function removeHoveredClass() { body.classList.remove('hovered'); }
    function hideCursor() { 
        cursor.style.opacity = '0'; 
        body.classList.remove('custom-cursor-active');
    }
    function showCursor() { 
        cursor.style.opacity = '1'; 
        body.classList.add('custom-cursor-active');
    }

    // Register cursor hover state event listeners
    const updateCursorListeners = () => {
        // Find links, buttons, and form labels
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input[type="submit"], label');
        interactiveElements.forEach(el => {
            el.removeEventListener('mouseenter', addHoveredClass);
            el.removeEventListener('mouseleave', removeHoveredClass);
            el.addEventListener('mouseenter', addHoveredClass);
            el.addEventListener('mouseleave', removeHoveredClass);
        });
        
        // Hide custom cursor and restore standard text pointer on text fields
        const textFields = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
        textFields.forEach(el => {
            el.removeEventListener('focus', hideCursor);
            el.removeEventListener('blur', showCursor);
            el.addEventListener('focus', hideCursor);
            el.addEventListener('blur', showCursor);
        });
    };

    updateCursorListeners();
    window.updateCursorListeners = updateCursorListeners;
}

// --- Navigation & Core SPA Router ---

/**
 * Handles mobile hamburger toggle drawer.
 */
function toggleMobileMenu() {
    const drawer = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    if (drawer && backdrop) {
        const isOpen = drawer.classList.contains('mobile-nav-open');
        if (isOpen) {
            drawer.classList.remove('mobile-nav-open');
            drawer.classList.add('mobile-nav-closed');
            backdrop.classList.replace('opacity-100', 'opacity-0');
            backdrop.classList.add('pointer-events-none');
        } else {
            drawer.classList.remove('mobile-nav-closed', 'translate-x-full');
            drawer.classList.add('mobile-nav-open');
            backdrop.classList.replace('opacity-0', 'opacity-100');
            backdrop.classList.remove('pointer-events-none');
        }
    }
}

/**
 * Handles clicking on START button.
 */
function startPortfolio() {
    const splash = document.getElementById('splash-screen');
    const mainContent = document.getElementById('portfolio-main');
    const homePage = document.getElementById('home-page');

    if (!splash) return;

    // Trigger native CSS exit animation
    splash.classList.add('animate-splash-exit');
    
    // Wait for the exit animation keyframe duration (0.5s) to complete
    setTimeout(() => {
        splash.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        
        if (mainContent) {
            mainContent.style.display = 'block';
            mainContent.classList.remove('opacity-0');
            mainContent.classList.add('animate-page-enter');
        }
        
        if (homePage) {
            homePage.style.display = 'block';
            
            // Stagger hero text contents slide in
            const heroItems = document.querySelectorAll('#home-content > *');
            heroItems.forEach((item, idx) => {
                item.classList.add('animate-slide-in', `delay-${idx + 1}`);
            });
        }
    }, 500);
}

/**
 * Single-page router showing sections with CSS transitions.
 */
function showPage(newPageId) {
    if (newPageId === currentPageId) return;

    const oldPageId = currentPageId;
    const oldPage = document.getElementById(`${oldPageId}-page`);
    const newPage = document.getElementById(`${newPageId}-page`);

    currentPageId = newPageId;
    window.location.hash = newPageId;
    
    updateNavigationStyles(newPageId);

    if (oldPage && newPage) {
        // Trigger native page exit transition
        oldPage.classList.remove('animate-page-enter');
        oldPage.classList.add('animate-page-exit');
        
        setTimeout(() => {
            oldPage.style.display = 'none';
            oldPage.classList.remove('animate-page-exit');
            
            // Trigger native page entry transition
            newPage.style.display = 'block';
            newPage.classList.add('animate-page-enter');
            
            // If going to the About section, trigger item slide-in stagger
            if (newPageId === 'about') {
                const animateItems = newPage.querySelectorAll('.space-y-6 > h3, #core-skills-container > span, #ml-data-container > span');
                animateItems.forEach((item, idx) => {
                    item.classList.remove('animate-slide-in');
                    void item.offsetWidth; // Trigger reflow to restart transition
                    item.classList.add('animate-slide-in', `delay-${(idx % 8) + 1}`);
                });
            }
        }, 300); // Wait for exit animation
    }
}

/**
 * Updates styles of active navigation links (desktop + mobile drawer).
 */
function updateNavigationStyles(activePageId) {
    // 1. Update Desktop links
    document.querySelectorAll('nav button').forEach(button => {
        button.classList.remove('border-primary-pink', 'text-primary-pink');
        button.classList.add('text-text-gray', 'dark:text-dark-gray-text', 'hover:text-primary-pink');
    });
    
    const activeLink = document.getElementById(`${activePageId}-link`);
    if (activeLink) {
        activeLink.classList.add('border-b-2', 'border-primary-pink', 'text-primary-pink');
        activeLink.classList.remove('text-text-gray', 'dark:text-dark-gray-text', 'hover:text-primary-pink');
    }
    
    // 2. Update Mobile links inside drawer
    const activeLinkMobile = document.getElementById(`${activePageId}-link-mobile`);
    if (activeLinkMobile) {
        document.querySelectorAll('#mobile-nav-drawer nav button').forEach(button => {
            button.classList.remove('text-primary-pink');
            button.classList.add('text-text-gray', 'dark:text-dark-gray-text');
        });
        activeLinkMobile.classList.add('text-primary-pink');
        activeLinkMobile.classList.remove('text-text-gray', 'dark:text-dark-gray-text');
    }
}

// --- Window Initialization ---

window.onload = () => {
    // Fetch data and build pages dynamically
    fetchPortfolioDataAndRender();

    // Hide main content initially (splash active)
    const mainContent = document.getElementById('portfolio-main');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    
    // Set up responsive custom cursor
    setupCursor();
    
    // Routing handler for hash URLs
    window.addEventListener('hashchange', () => {
        const pageId = window.location.hash.substring(1);
        if (pageIds.includes(pageId)) {
            showPage(pageId);
        }
    });
};
