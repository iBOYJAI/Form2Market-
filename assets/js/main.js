// Toast Notification System
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Live Search Filter
function filterCards(searchElementId, cardSelector, textSelector) {
    const searchInput = document.getElementById(searchElementId);
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const cards = document.querySelectorAll(cardSelector);
        
        cards.forEach(card => {
            const textContent = card.querySelector(textSelector).textContent.toLowerCase();
            if (textContent.includes(query)) {
                card.style.display = 'flex'; // or block depending on layout, assumed flex based on css
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Check URL params for toasts on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === '1') {
        showToast('Operation successful! >_');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (urlParams.get('error')) {
        let msg = urlParams.get('error');
        msg = msg === 'unauthorized' ? 'Access Denied.' : 'Operation failed.';
        showToast(msg, 'error');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// Farm2Market Local Chart.js Palette & Defaults
const F2M_COLORS = {
  green:  '#15803d',
  green2: '#3db33d',
  green3: '#72ce72',
  gold:   '#d97706',
  gold2:  '#f59e0b',
  blue:   '#3b82f6',
  purple: '#8b5cf6',
  teal:   '#0d9488',
  red:    '#ef4444',
};
if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = 'Sora, sans-serif';
    Chart.defaults.color = '#5a7a5a';
}
