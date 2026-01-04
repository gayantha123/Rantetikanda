// Default donors
const defaultDonors = [
    { photo: "1.jpg", name: "සුරංග කොන්ගහ ගෙදර", amount: "00" },
    { photo: "2.jpeg", name: "ප්‍රබාත්", amount: "000" },
    { photo: "3.jpg", name: "ප්‍රසන්න ගීත් කුලියාපිටිය", amount: "00" }
];

let donors = [];
const ADMIN_PASSWORD = "admin123";

function showLogin() {
    document.getElementById('loginOverlay').classList.remove('hidden');
}

function closeLogin() {
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('loginForm').reset();
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === ADMIN_PASSWORD) {
        document.querySelector('.admin-panel').classList.add('active');
        closeLogin();
        renderDonors(); // Re-render to show delete buttons
        alert('Admin panel එකට සාර්ථකව ඇතුල් වුනා! / Admin panel ekata successfully login una!');
    } else {
        alert('වැරදි මුරපදයක්! නැවත උත්සාහ කරන්න. / Weradi password eka! Nawatha try karanna.');
    }
});

function loadDonors() {
    const saved = localStorage.getItem('donors');
    if (saved) {
        try {
            donors = JSON.parse(saved);
        } catch (e) {
            donors = [...defaultDonors];
        }
    } else {
        donors = [...defaultDonors];
    }
    renderDonors();
}

function saveDonors() {
    localStorage.setItem('donors', JSON.stringify(donors));
}

function renderDonors() {
    const grid = document.getElementById('donorGrid');
    const isAdminMode = document.querySelector('.admin-panel').classList.contains('active');
    
    if (donors.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>තවම දායකයින් එකතු කර නොමැත / Tavama Dayakayin Add Kara Nomath</p></div>';
        return;
    }

    grid.innerHTML = donors.map((donor, index) => `
        <div class="donor-card">
            <img src="${donor.photo}" alt="${donor.name}" class="donor-photo" onerror="this.src='https://via.placeholder.com/120'">
            <div class="donor-name">${donor.name}</div>
            <div class="donor-amount">රු. ${Number(donor.amount).toLocaleString()}</div>
            ${isAdminMode ? `<button class="delete-btn" onclick="deleteDonor(${index})">ඉවත් කරන්න / Remove</button>` : ''}
        </div>
    `).join('');
}

function deleteDonor(index) {
    if (confirm('මෙම දායකයා ඉවත් කිරීමට අවශ්‍ය ද? / Me dayakaya remove karanna oneda?')) {
        donors.splice(index, 1);
        saveDonors();
        renderDonors();
    }
}

document.getElementById('donorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const photo = document.getElementById('photoUrl').value;
    const name = document.getElementById('donorName').value;
    const amount = document.getElementById('amount').value;

    donors.push({ photo, name, amount });
    saveDonors();
    renderDonors();

    this.reset();
    alert('දායකයා සාර්ථකව එකතු කරන ලදී! / Dayakaya successfully add una!');
});

document.getElementById('bulkForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const bulkData = document.getElementById('bulkData').value;
    const lines = bulkData.split('\n').filter(line => line.trim() !== '');
    
    let successCount = 0;
    let errorCount = 0;
    
    lines.forEach(line => {
        const parts = line.split(',').map(part => part.trim());
        
        if (parts.length === 3) {
            const [photo, name, amount] = parts;
            if (photo && name && amount && !isNaN(amount)) {
                donors.push({ photo, name, amount });
                successCount++;
            } else {
                errorCount++;
            }
        } else {
            errorCount++;
        }
    });
    
    if (successCount > 0) {
        saveDonors();
        renderDonors();
        this.reset();
    }
    
    alert(`සාර්ථකව එකතු වූ දායකයින්: ${successCount}\nවැරදි entries: ${errorCount}\n\nSuccessfully added: ${successCount}\nErrors: ${errorCount}`);
});

// Initialize
loadDonors();
