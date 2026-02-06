/**
 * LMS Dashboard - Optimized JavaScript
 * This script handles the interactive functionality of the LMS dashboard
 */

// Cache DOM elements
const dom = {
    sidebar: document.getElementById('sidebar'),
    menuToggle: document.querySelector('.menu-toggle'),
    userProfile: document.querySelector('.user-profile'),
    navItems: document.querySelectorAll('.nav-item'),
    widgets: {
        students: document.querySelector('.widget-primary .widget-content h3'),
        teachers: document.querySelector('.widget-info .widget-content h3'),
        courses: document.querySelector('.widget-warning .widget-content h3'),
        attendance: document.querySelector('.widget-success .widget-content h3')
    },
    activityList: document.querySelector('.activity-list')
};

// Sample data (in a real app, this would come from an API)
const appData = {
    students: [
        { id: 1, name: 'Azizbek Olimov', group: 'Dasturlash', status: 'active' },
        { id: 2, name: 'Dilnoza Karimova', group: 'Ingliz tili', status: 'active' },
        { id: 3, name: 'Javohir Tursunov', group: 'Matematika', status: 'inactive' }
    ],
    attendance: [
        { studentId: 1, date: '2024-02-04', status: 'present' },
        { studentId: 2, date: '2024-02-04', status: 'present' },
        { studentId: 3, date: '2024-02-04', status: 'absent' }
    ],
    activities: [
        { 
            id: 1, 
            type: 'new_student', 
            title: 'Yangi o\'quvchi qo\'shildi', 
            description: 'Azizbek Olimov', 
            icon: 'user-plus',
            iconClass: 'success',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        { 
            id: 2, 
            type: 'attendance', 
            title: 'Dasturlash asoslari guruhi uchun davomat qayd etildi', 
            description: '10 ta o\'quvchidan 9 tasi darsda qatnashdi',
            icon: 'clipboard-check',
            iconClass: 'primary',
            timestamp: new Date(new Date().setHours(10, 30, 0, 0))
        },
        { 
            id: 3, 
            type: 'grades', 
            title: 'Ingliz tili guruhi uchun baholar kiritildi', 
            description: '5 ta o\'quvchi baholandi',
            icon: 'star',
            iconClass: 'warning',
            timestamp: new Date(new Date().setDate(new Date().getDate() - 1))
        }
    ]
};

/**
 * Initialize the application
 */
function init() {
    setupEventListeners();
    updateDashboard();
    updateActivities();
    
    // Set initial aria attributes
    dom.menuToggle.setAttribute('aria-expanded', 'false');
    dom.userProfile.setAttribute('aria-expanded', 'false');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Menu toggle
    dom.menuToggle.addEventListener('click', toggleSidebar);
    
    // Close sidebar when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    // Handle window resize with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });
    
    // Navigation
    dom.navItems.forEach(item => {
        item.addEventListener('click', handleNavClick);
    });
    
    // User profile dropdown
    dom.userProfile.addEventListener('click', toggleUserMenu);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-profile')) {
            dom.userProfile.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Toggle sidebar visibility
 */
function toggleSidebar(e) {
    e.stopPropagation();
    const isExpanded = dom.menuToggle.getAttribute('aria-expanded') === 'true';
    dom.menuToggle.setAttribute('aria-expanded', !isExpanded);
    dom.sidebar.classList.toggle('active');
}

/**
 * Toggle user menu
 */
function toggleUserMenu(e) {
    e.stopPropagation();
    const isExpanded = dom.userProfile.getAttribute('aria-expanded') === 'true';
    dom.userProfile.setAttribute('aria-expanded', !isExpanded);
}

/**
 * Handle clicks outside elements
 */
function handleOutsideClick(e) {
    if (window.innerWidth <= 992 && 
        !dom.sidebar.contains(e.target) && 
        !dom.menuToggle.contains(e.target)) {
        dom.sidebar.classList.remove('active');
        dom.menuToggle.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Handle window resize
 */
function handleResize() {
    if (window.innerWidth > 992) {
        dom.sidebar.classList.remove('active');
        dom.menuToggle.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Handle navigation clicks
 */
function handleNavClick(e) {
    e.preventDefault();
    
    // Update active state
    dom.navItems.forEach(item => item.classList.remove('active'));
    this.classList.add('active');
    
    // In a real app, we would load the appropriate content here
    const target = this.querySelector('a').getAttribute('href');
    console.log(`Navigating to: ${target}`);
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 992) {
        dom.sidebar.classList.remove('active');
        dom.menuToggle.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Update dashboard widgets with data
 */
function updateDashboard() {
    if (dom.widgets.students) {
        dom.widgets.students.textContent = appData.students.length;
    }
    
    if (dom.widgets.teachers) {
        // In a real app, this would come from the data
        dom.widgets.teachers.textContent = '12';
    }
    
    if (dom.widgets.courses) {
        // In a real app, this would come from the data
        dom.widgets.courses.textContent = '8';
    }
    
    if (dom.widgets.attendance) {
        const presentCount = appData.attendance.filter(a => a.status === 'present').length;
        const total = appData.attendance.length;
        const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;
        dom.widgets.attendance.textContent = `${percentage}%`;
    }
}

/**
 * Update recent activities list
 */
function updateActivities() {
    if (!dom.activityList) return;
    
    // Sort activities by timestamp (newest first)
    const sortedActivities = [...appData.activities].sort((a, b) => b.timestamp - a.timestamp);
    
    // Generate HTML for activities
    const activitiesHTML = sortedActivities.map(activity => `
        <article class="activity-item" data-activity-id="${activity.id}">
            <div class="activity-icon icon-${activity.iconClass}" aria-hidden="true">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-details">
                <p><strong>${activity.title}</strong> ${activity.description}</p>
                <time datetime="${activity.timestamp.toISOString()}" class="activity-time">
                    ${formatTimeAgo(activity.timestamp)}
                </time>
            </div>
        </article>
    `).join('');
    
    dom.activityList.innerHTML = activitiesHTML;
}

/**
 * Format timestamp as relative time (e.g., "2 hours ago")
 */
function formatTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        yil: 31536000,
        oy: 2592000,
        hafta: 604800,
        kun: 86400,
        soat: 3600,
        daqiqa: 60,
        soniya: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        
        if (interval >= 1) {
            if (interval === 1) {
                return unit === 'soat' ? '1 soat oldin' : 
                       unit === 'daqiqa' ? '1 daqiqa oldin' : 
                       `1 ${unit} oldin`;
            } else {
                return unit === 'soat' ? `${interval} soat oldin` : 
                       unit === 'daqiqa' ? `${interval} daqiqa oldin` : 
                       `${interval} ${unit} oldin`;
            }
        }
    }
    
    return 'hozirgina';
}

// Initialize the app when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOMContentLoaded has already fired
    init();
}

// Export for testing or future extensions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        formatTimeAgo,
        appData
    };
}