// Google Sheet Configuration
const SHEET_ID = '147iXEbZRs1KtJlkUCpLzKUHtmyTBesjnxwLNKETcbfo';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeModal();
    loadTipsFromSheet();
    setupRefreshButton();
});

// ===== MODAL FUNCTIONALITY =====
function initializeModal() {
    const modal = document.getElementById('lead-dialog');
    const openBtns = document.querySelectorAll('[id^="open-dialog-btn"]');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('contact-form');

    // Open modal
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    });

    // Close modal with X button
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            timestamp: new Date().toLocaleString('en-IN'),
            name: formData.get('Name'),
            email: formData.get('Email'),
            mobile: formData.get('Mobile'),
            experience: formData.get('Experience'),
            interest: formData.get('Interest')
        };

        console.log('Form Data:', data);
        
        // Show success message
        alert('✓ Success! Your registration is confirmed.\n\nCheck your email and SMS for your free trial access.\n\nWelcome to Grow Genius!');
        
        form.reset();
        modal.classList.remove('active');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FETCH TIPS FROM GOOGLE SHEET =====
async function loadTipsFromSheet() {
    try {
        const response = await fetch(SHEET_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch sheet data');
        }

        const csvText = await response.text();
        const rows = csvText.trim().split('\n');
        
        if (rows.length < 2) {
            displaySampleTips();
            return;
        }

        // Parse CSV
        const tips = [];
        for (let i = 1; i < rows.length && i < 11; i++) { // Limit to 10 rows
            const cols = parseCSVRow(rows[i]);
            if (cols.length >= 6) {
                tips.push({
                    time: cols[0] || '--',
                    symbol: cols[1] || 'NIFTY50',
                    type: cols[2] || 'CALL',
                    entry: cols[3] || '--',
                    target: cols[4] || '--',
                    stopLoss: cols[5] || '--',
                    status: cols[6] || 'Active'
                });
            }
        }

        if (tips.length > 0) {
            displayTips(tips);
        } else {
            displaySampleTips();
        }
    } catch (error) {
        console.error('Error loading tips:', error);
        displaySampleTips();
    }
}

// Parse CSV row handling quoted values
function parseCSVRow(row) {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            result.push(current.trim().replace(/"/g, ''));
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim().replace(/"/g, ''));
    return result;
}

// Display tips in table
function displayTips(tips) {
    const tbody = document.getElementById('tips-tbody');
    tbody.innerHTML = '';

    tips.forEach(tip => {
        const row = document.createElement('tr');
        
        const statusColor = tip.status.toLowerCase() === 'active' ? '#43a047' : 
                           tip.status.toLowerCase() === 'completed' ? '#1a73e8' : '#ff6d00';
        
        row.innerHTML = `
            <td>${formatTime(tip.time)}</td>
            <td>${tip.symbol}</td>
            <td><span style="background: ${tip.type === 'CALL' ? '#43a047' : '#e53935'}; color: white; padding: 4px 8px; border-radius: 3px; font-size: 0.85em; font-weight: 600;">${tip.type}</span></td>
            <td>${tip.entry}</td>
            <td>${tip.target}</td>
            <td>${tip.stopLoss}</td>
            <td><span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 3px; font-size: 0.85em; font-weight: 600;">${tip.status}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

// Display sample/demo tips if sheet fails to load
function displaySampleTips() {
    const sampleTips = [
        { time: '09:30 AM', symbol: 'NIFTY50', type: 'CALL', entry: '22,150', target: '22,400', stopLoss: '22,000', status: 'Active' },
        { time: '10:15 AM', symbol: 'BANKNIFTY', type: 'PUT', entry: '45,800', target: '45,200', stopLoss: '46,100', status: 'Active' },
        { time: '10:45 AM', symbol: 'NIFTY50', type: 'CALL', entry: '22,200', target: '22,500', stopLoss: '22,050', status: 'Active' },
        { time: '11:30 AM', symbol: 'BANKNIFTY', type: 'CALL', entry: '45,950', target: '46,300', stopLoss: '45,700', status: 'Completed' },
        { time: '01:00 PM', symbol: 'NIFTY50', type: 'PUT', entry: '22,100', target: '21,800', stopLoss: '22,300', status: 'Active' }
    ];
    
    displayTips(sampleTips);
}

// Format time display
function formatTime(timeStr) {
    if (!timeStr || timeStr === '--') return 'Live';
    return timeStr;
}

// Setup refresh button
function setupRefreshButton() {
    const refreshLink = document.querySelector('.refresh-tips');
    if (refreshLink) {
        refreshLink.addEventListener('click', (e) => {
            e.preventDefault();
            const tbody = document.getElementById('tips-tbody');
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Refreshing data...</td></tr>';
            
            setTimeout(() => {
                loadTipsFromSheet();
            }, 500);
        });
    }
}