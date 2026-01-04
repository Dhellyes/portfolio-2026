
function exportToExcel(type) {
    let data, filename, headers;
    
    if (type === 'employees') {
        headers = ['Nom', 'Prénom', 'Poste', 'Département', 'Email', 'Téléphone', 'Date d\'entrée', 'Jours de congés'];
        data = employees.map(emp => [
            emp.lastName,
            emp.firstName,
            emp.position,
            emp.department,
            emp.email,
            emp.phone,
            emp.startDate,
            emp.leaveDays
        ]);
        filename = `employes_${currentUser.companyName}_${new Date().toISOString().split('T')[0]}.csv`;
        
    } else if (type === 'leaves') {
        headers = ['Employé', 'Type', 'Date début', 'Date fin', 'Jours', 'Statut'];
        data = leaveRequests.map(leave => {
            const emp = employees.find(e => e.id === leave.employeeId);
            const statusText = leave.status === 'pending' ? 'En attente' : 
                             leave.status === 'approved' ? 'Approuvé' : 'Refusé';
            return [
                emp ? `${emp.firstName} ${emp.lastName}` : 'Inconnu',
                leave.type,
                leave.startDate,
                leave.endDate,
                leave.days,
                statusText
            ];
        });
        filename = `conges_${currentUser.companyName}_${new Date().toISOString().split('T')[0]}.csv`;
        
    } else if (type === 'absences') {
        headers = ['Employé', 'Type', 'Date', 'Jours'];
        data = absences.map(abs => {
            const emp = employees.find(e => e.id === abs.employeeId);
            return [
                emp ? `${emp.firstName} ${emp.lastName}` : 'Inconnu',
                abs.type,
                abs.date,
                abs.days
            ];
        });
        filename = `absences_${currentUser.companyName}_${new Date().toISOString().split('T')[0]}.csv`;
    }
    
    // Generate CSV content
    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    csvContent += headers.join(';') + '\n';
    data.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(';') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    customAlert(`Fichier ${filename} téléchargé avec succès !\n\nOuvrez-le avec Excel pour visualiser vos données.`, 'success', 'Export réussi');
}

// ==================== CUSTOM ALERT SYSTEM ====================
function customAlert(message, type = 'info', title = '') {
    return new Promise((resolve) => {
        const overlay = document.getElementById('customAlertOverlay');
        const iconDiv = document.getElementById('customAlertIcon');
        const titleDiv = document.getElementById('customAlertTitle');
        const messageDiv = document.getElementById('customAlertMessage');
        const buttonsDiv = document.getElementById('customAlertButtons');
        
        // Set icon based on type
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const titles = {
            success: title || 'Succès',
            error: title || 'Erreur',
            warning: title || 'Attention',
            info: title || 'Information'
        };
        
        iconDiv.className = `custom-alert-icon ${type}`;
        iconDiv.textContent = icons[type] || 'ℹ';
        titleDiv.textContent = titles[type];
        messageDiv.textContent = message;
        
        // Create OK button
        buttonsDiv.innerHTML = `
            <button class="custom-alert-btn primary" onclick="closeCustomAlert()">OK</button>
        `;
        
        overlay.classList.add('active');
        
        window.closeCustomAlert = () => {
            overlay.classList.remove('active');
            resolve(true);
        };
    });
}

function customConfirm(message, title = 'Confirmation') {
    return new Promise((resolve) => {
        const overlay = document.getElementById('customAlertOverlay');
        const iconDiv = document.getElementById('customAlertIcon');
        const titleDiv = document.getElementById('customAlertTitle');
        const messageDiv = document.getElementById('customAlertMessage');
        const buttonsDiv = document.getElementById('customAlertButtons');
        
        iconDiv.className = 'custom-alert-icon warning';
        iconDiv.textContent = '?';
        titleDiv.textContent = title;
        messageDiv.textContent = message;
        
        // Create Yes/No buttons
        buttonsDiv.innerHTML = `
            <button class="custom-alert-btn secondary" onclick="resolveCustomConfirm(false)">Annuler</button>
            <button class="custom-alert-btn danger" onclick="resolveCustomConfirm(true)">OK</button>
        `;
        
        overlay.classList.add('active');
        
        window.resolveCustomConfirm = (result) => {
            overlay.classList.remove('active');
            resolve(result);
        };
    });
}

// Replace all alert() calls with customAlert()
window.alert = customAlert;

// ==================== COMPANY CODE SHARING ====================
function shareCompanyCode() {
    const code = currentUser.companyCode;
    const companyName = currentUser.companyName;
    
    const overlay = document.getElementById('customAlertOverlay');
    const iconDiv = document.getElementById('customAlertIcon');
    const titleDiv = document.getElementById('customAlertTitle');
    const messageDiv = document.getElementById('customAlertMessage');
    const buttonsDiv = document.getElementById('customAlertButtons');
    
    iconDiv.className = 'custom-alert-icon info';
    iconDiv.textContent = '📤';
    titleDiv.textContent = 'Partager le code d\'entreprise';
    messageDiv.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.1); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">Code d'entreprise :</div>
            <div style="font-size: 28px; font-weight: 800; color: #10b981; font-family: monospace; letter-spacing: 4px;">${code}</div>
        </div>
        <div style="font-size: 14px; color: #94a3b8; margin-bottom: 16px;">
            Choisissez comment partager ce code avec vos employés :
        </div>
    `;
    
    const message = `Rejoignez ${companyName} sur SIRH Pro !\n\nUtilisez ce code lors de votre inscription : ${code}\n\nLien : ${window.location.origin}`;
    const emailSubject = `Rejoignez ${companyName} sur SIRH Pro`;
    const emailBody = `Bonjour,\n\nVous êtes invité(e) à rejoindre ${companyName} sur notre système SIRH Pro.\n\nPour créer votre compte :\n1. Allez sur ${window.location.origin}\n2. Cliquez sur "Créer un compte"\n3. Sélectionnez "Rejoindre une entreprise existante"\n4. Entrez le code : ${code}\n\nÀ bientôt !\n\nL'équipe RH`;
    
    buttonsDiv.innerHTML = `
        <div class="share-options" style="width: 100%;">
            <button class="share-btn" onclick="copyCodeToClipboard('${code}')">
                
                <span>Copier le code</span>
            </button>
            <button class="share-btn" onclick="shareViaEmail('${emailSubject}', \`${emailBody}\`)">
                
                <span>Par Email</span>
            </button>
            <button class="share-btn" onclick="shareViaWhatsApp(\`${message}\`)">
                
                <span>Sur WhatsApp</span>
            </button>
            <button class="share-btn" onclick="shareViaSMS(\`${message}\`)">
                
                <span>Par SMS</span>
            </button>
        </div>
        <button class="custom-alert-btn secondary" onclick="closeCustomAlert()" style="margin-top: 16px;">Fermer</button>
    `;
    
    overlay.classList.add('active');
}

function copyCodeToClipboard(code) {
    navigator.clipboard.writeText(code).then(() => {
        customAlert(`Code ${code} copié dans le presse-papier !`, 'success', 'Code copié');
    }).catch(() => {
        customAlert(`Code : ${code}\n\nVeuillez le copier manuellement.`, 'info', 'Code d\'entreprise');
    });
}

function shareViaEmail(subject, body) {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    closeCustomAlert();
}

function shareViaWhatsApp(message) {
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
    closeCustomAlert();
}

function shareViaSMS(message) {
    const smsLink = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = smsLink;
    closeCustomAlert();
}

function copyCompanyCode() {
    const code = currentUser.companyCode;
    copyCodeToClipboard(code);
}

function closeCustomAlert() {
    document.getElementById('customAlertOverlay').classList.remove('active');
}

// ==================== STATE ====================
let currentUser = null; // Will include: { name, email, userId, role, department, companyId, companyName }
let isDemoMode = false;
let currentView = 'dashboard';
let employees = [];
let leaveRequests = [];
let absences = [];
let documents = []; // Documents RH
let alternants = []; // Tableau pour les stagiaires et alternants
let alternantCalendars = {}; // Calendriers scolaires (école/entreprise) par alternant: { alternantId: { 'YYYY-MM-DD': 'ecole'|'entreprise' } }
let alternantAbsences = []; // Absences/congés des alternants (gérées par manager)
let editingItem = null;
let modalType = '';

// Calendar state for alternants
let currentCalendarMonth = new Date();
let selectedAlternantId = null;

// Company Settings - Now per company
let companySettings = {
    selfServiceEnabled: true // Default: enabled
};

// Role permissions
const ROLES = {
    admin: { label: '👔 Manager RH', canApproveAll: true, canManageAll: true },
    manager: { label: '📊 Manager', canApproveTeam: true, canManageTeam: true },
    employee: { label: '👤 Employé', canApproveAll: false, canManageAll: false }
};

// ==================== COMPANY MANAGEMENT ====================
function generateCompanyCode() {
    // Generate unique 6-character code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing characters
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function createCompany(companyName) {
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    const code = generateCompanyCode();
    
    // Check if code already exists (very unlikely but possible)
    while (companies.find(c => c.code === code)) {
        code = generateCompanyCode();
    }
    
    const newCompany = {
        id: Date.now().toString(),
        name: companyName,
        code: code,
        createdAt: new Date().toISOString(),
        settings: {
            selfServiceEnabled: true
        }
    };
    
    companies.push(newCompany);
    localStorage.setItem('companies', JSON.stringify(companies));
    
    return newCompany;
}

function getCompanyByCode(code) {
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    return companies.find(c => c.code.toUpperCase() === code.toUpperCase());
}

function getCompanyById(companyId) {
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    return companies.find(c => c.id === companyId);
}

function getCompanySettings(companyId) {
    const company = getCompanyById(companyId);
    return company ? company.settings : { selfServiceEnabled: true };
}

function saveCompanySettings(companyId, settings) {
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    const companyIndex = companies.findIndex(c => c.id === companyId);
    if (companyIndex >= 0) {
        companies[companyIndex].settings = settings;
        localStorage.setItem('companies', JSON.stringify(companies));
    }
}

// ==================== DEMO DATA ====================
const demoData = {
    employees: [
        { id: 1, firstName: 'Emma', lastName: 'ROBERT', position: 'Développeur Junior', department: 'Développement', contractType: 'CDI', startDate: '2022-09-01', email: 'emma.robert@entreprise.fr', phone: '06 12 34 56 01', birthDate: '1995-09-08', leaveDays: 30 },
        { id: 2, firstName: 'Alexandre', lastName: 'RICHARD', position: 'Responsable Commercial', department: 'Commercial', contractType: 'CDI', startDate: '2017-04-01', email: 'alexandre.richard@entreprise.fr', phone: '06 12 34 56 02', birthDate: '1993-12-12', leaveDays: 32 },
        { id: 3, firstName: 'Léa', lastName: 'DURAND', position: 'Commercial Senior', department: 'Commercial', contractType: 'CDI', startDate: '2021-11-01', email: 'lea.durand@entreprise.fr', phone: '06 12 34 56 03', birthDate: '1993-12-12', leaveDays: 32 },
        { id: 4, firstName: 'Antoine', lastName: 'LEROY', position: 'Développeur Full-Stack', department: 'Développement', contractType: 'CDI', startDate: '2020-02-01', email: 'antoine.leroy@entreprise.fr', phone: '06 12 34 56 04', birthDate: '1991-03-04', leaveDays: 34 },
        { id: 5, firstName: 'Camille', lastName: 'MOREAU', position: 'Assistante RH', department: 'Ressources Humaines', contractType: 'CDI', startDate: '2022-03-01', email: 'camille.moreau@entreprise.fr', phone: '06 12 34 56 05', birthDate: '1994-08-09', leaveDays: 31 },
        { id: 6, firstName: 'Hugo', lastName: 'SIMON', position: 'Chef de Projet Marketing', department: 'Marketing', contractType: 'CDI', startDate: '2018-10-01', email: 'hugo.simon@entreprise.fr', phone: '06 12 34 56 06', birthDate: '1989-07-01', leaveDays: 36 },
        { id: 7, firstName: 'Julie', lastName: 'LAURENT', position: 'Community Manager', department: 'Marketing', contractType: 'CDD', startDate: '2023-04-01', email: 'julie.laurent@entreprise.fr', phone: '06 12 34 56 07', birthDate: '1991-03-04', leaveDays: 34 },
        { id: 8, firstName: 'Nathan', lastName: 'LEFEBVRE', position: 'Directeur Développement', department: 'Développement', contractType: 'CDI', startDate: '2016-01-01', email: 'nathan.lefebvre@entreprise.fr', phone: '06 12 34 56 08', birthDate: '1986-09-08', leaveDays: 39 },
        { id: 9, firstName: 'Anaïs', lastName: 'MICHEL', position: 'Développeur Back-End', department: 'Développement', contractType: 'CDI', startDate: '2020-08-01', email: 'anais.michel@entreprise.fr', phone: '06 12 34 56 09', birthDate: '1992-09-08', leaveDays: 33 },
        { id: 10, firstName: 'Maxime', lastName: 'GARCIA', position: 'Commercial', department: 'Commercial', contractType: 'CDI', startDate: '2019-05-01', email: 'maxime.garcia@entreprise.fr', phone: '06 12 34 56 10', birthDate: '1990-08-11', leaveDays: 35 },
        { id: 11, firstName: 'Sarah', lastName: 'DAVID', position: 'Stagiaire Marketing', department: 'Marketing', contractType: 'Stage', startDate: '2023-09-01', email: 'sarah.david@entreprise.fr', phone: '06 12 34 56 11', birthDate: '1997-09-08', leaveDays: 28 },
        { id: 12, firstName: 'Julien', lastName: 'BERTRAND', position: 'DRH', department: 'Ressources Humaines', contractType: 'CDI', startDate: '2015-03-01', email: 'julien.bertrand@entreprise.fr', phone: '06 12 34 56 12', birthDate: '1985-09-08', leaveDays: 40 },
        { id: 13, firstName: 'Manon', lastName: 'ROUX', position: 'Développeur Front-End', department: 'Développement', contractType: 'CDI', startDate: '2021-12-01', email: 'manon.roux@entreprise.fr', phone: '06 12 34 56 13', birthDate: '1993-11-09', leaveDays: 32 },
        { id: 14, firstName: 'Pierre', lastName: 'VINCENT', position: 'Responsable Marketing', department: 'Marketing', contractType: 'CDI', startDate: '2018-07-01', email: 'pierre.vincent@entreprise.fr', phone: '06 12 34 56 14', birthDate: '1988-04-06', leaveDays: 37 },
        { id: 15, firstName: 'Chloé', lastName: 'FOURNIER', position: 'Chargée de Communication', department: 'Marketing', contractType: 'CDI', startDate: '2023-02-01', email: 'chloe.fournier@entreprise.fr', phone: '06 12 34 56 15', birthDate: '1995-09-08', leaveDays: 30 },
        { id: 16, firstName: 'Théo', lastName: 'GIRARD', position: 'Développeur Mobile', department: 'Développement', contractType: 'CDI', startDate: '2019-09-01', email: 'theo.girard@entreprise.fr', phone: '06 12 34 56 16', birthDate: '1991-05-06', leaveDays: 34 },
        { id: 17, firstName: 'Lucie', lastName: 'BONNET', position: 'Chargée de Recrutement', department: 'Ressources Humaines', contractType: 'CDI', startDate: '2022-06-01', email: 'lucie.bonnet@entreprise.fr', phone: '06 12 34 56 17', birthDate: '1994-09-08', leaveDays: 31 },
        { id: 18, firstName: 'Nicolas', lastName: 'DUPONT', position: 'Commercial Senior', department: 'Commercial', contractType: 'CDI', startDate: '2017-11-01', email: 'nicolas.dupont@entreprise.fr', phone: '06 12 34 56 18', birthDate: '1987-09-08', leaveDays: 38 },
        { id: 19, firstName: 'Inès', lastName: 'LAMBERT', position: 'Assistante Marketing', department: 'Marketing', contractType: 'CDD', startDate: '2023-03-01', email: 'ines.lambert@entreprise.fr', phone: '06 12 34 56 19', birthDate: '1996-06-10', leaveDays: 29 },
        { id: 20, firstName: 'Quentin', lastName: 'FONTAINE', position: 'DevOps Engineer', department: 'Développement', contractType: 'CDI', startDate: '2019-01-01', email: 'quentin.fontaine@entreprise.fr', phone: '06 12 34 56 20', birthDate: '1989-09-08', leaveDays: 36 },
        { id: 21, firstName: 'Émilie', lastName: 'ROUSSEAU', position: 'Responsable Recrutement', department: 'Ressources Humaines', contractType: 'CDI', startDate: '2021-04-01', email: 'emilie.rousseau@entreprise.fr', phone: '06 12 34 56 21', birthDate: '1992-02-11', leaveDays: 33 },
        { id: 22, firstName: 'Arthur', lastName: 'BLANC', position: 'Développeur Python', department: 'Développement', contractType: 'CDI', startDate: '2020-08-01', email: 'arthur.blanc@entreprise.fr', phone: '06 12 34 56 22', birthDate: '1990-09-08', leaveDays: 35 },
        { id: 23, firstName: 'Laura', lastName: 'GUERIN', position: 'Chargée Marketing Digital', department: 'Marketing', contractType: 'CDI', startDate: '2022-10-01', email: 'laura.guerin@entreprise.fr', phone: '06 12 34 56 23', birthDate: '1995-09-08', leaveDays: 30 },
        { id: 24, firstName: 'Baptiste', lastName: 'MULLER', position: 'Commercial', department: 'Commercial', contractType: 'CDI', startDate: '2018-05-01', email: 'baptiste.muller@entreprise.fr', phone: '06 12 34 56 24', birthDate: '1988-09-08', leaveDays: 37 },
        { id: 25, firstName: 'Océane', lastName: 'HENRY', position: 'Développeur Full-Stack', department: 'Développement', contractType: 'CDI', startDate: '2022-01-01', email: 'oceane.henry@entreprise.fr', phone: '06 12 34 56 25', birthDate: '1993-08-12', leaveDays: 32 },
        { id: 26, firstName: 'Mathis', lastName: 'ROUSSEL', position: 'Chef de Projet IT', department: 'Développement', contractType: 'CDI', startDate: '2020-06-01', email: 'mathis.roussel@entreprise.fr', phone: '06 12 34 56 26', birthDate: '1991-09-08', leaveDays: 34 },
        { id: 27, firstName: 'Clara', lastName: 'MARTINEZ', position: 'Analyste de Données', department: 'Développement', contractType: 'CDI', startDate: '2021-09-01', email: 'clara.martinez@entreprise.fr', phone: '06 12 34 56 27', birthDate: '1994-05-15', leaveDays: 31 },
        { id: 28, firstName: 'Louis', lastName: 'MERCIER', position: 'Chef de Projet Commercial', department: 'Commercial', contractType: 'CDI', startDate: '2019-03-01', email: 'louis.mercier@entreprise.fr', phone: '06 12 34 56 28', birthDate: '1990-11-20', leaveDays: 35 },
        { id: 29, firstName: 'Sophie', lastName: 'BARBIER', position: 'Responsable Formation', department: 'Ressources Humaines', contractType: 'CDI', startDate: '2020-01-01', email: 'sophie.barbier@entreprise.fr', phone: '06 12 34 56 29', birthDate: '1992-07-08', leaveDays: 34 },
        { id: 30, firstName: 'Thomas', lastName: 'RENARD', position: 'Développeur Senior', department: 'Développement', contractType: 'CDI', startDate: '2017-02-01', email: 'thomas.renard@entreprise.fr', phone: '06 12 34 56 30', birthDate: '1989-03-25', leaveDays: 37 }
    ],
    leaveRequests: [
        // Congés approuvés
        { id: 1, employeeId: 1, startDate: '2025-02-10', endDate: '2025-02-14', type: 'Congés payés', status: 'approved', days: 5 },
        { id: 2, employeeId: 2, startDate: '2025-01-20', endDate: '2025-01-24', type: 'Congés payés', status: 'approved', days: 5 },
        { id: 3, employeeId: 4, startDate: '2025-03-03', endDate: '2025-03-07', type: 'Congés payés', status: 'approved', days: 5 },
        { id: 4, employeeId: 6, startDate: '2025-02-17', endDate: '2025-02-21', type: 'Congés payés', status: 'approved', days: 5 },
        { id: 5, employeeId: 8, startDate: '2025-04-07', endDate: '2025-04-18', type: 'Congés payés', status: 'approved', days: 10 },
        { id: 6, employeeId: 12, startDate: '2025-05-26', endDate: '2025-06-06', type: 'Congés payés', status: 'approved', days: 10 },
        { id: 7, employeeId: 14, startDate: '2025-03-10', endDate: '2025-03-14', type: 'RTT', status: 'approved', days: 5 },
        { id: 8, employeeId: 16, startDate: '2025-06-16', endDate: '2025-06-27', type: 'Congés payés', status: 'approved', days: 10 },
        { id: 9, employeeId: 18, startDate: '2025-07-07', endDate: '2025-07-18', type: 'Congés payés', status: 'approved', days: 10 },
        { id: 10, employeeId: 20, startDate: '2025-08-04', endDate: '2025-08-15', type: 'Congés payés', status: 'approved', days: 10 },
        { id: 11, employeeId: 22, startDate: '2025-04-14', endDate: '2025-04-18', type: 'RTT', status: 'approved', days: 5 },
        { id: 12, employeeId: 25, startDate: '2025-05-12', endDate: '2025-05-16', type: 'Congés payés', status: 'approved', days: 5 },
        { id: 13, employeeId: 28, startDate: '2025-06-02', endDate: '2025-06-06', type: 'RTT', status: 'approved', days: 5 },
        { id: 14, employeeId: 30, startDate: '2025-07-21', endDate: '2025-08-01', type: 'Congés payés', status: 'approved', days: 10 },
        
        // Congés en attente
        { id: 15, employeeId: 3, startDate: '2025-02-03', endDate: '2025-02-07', type: 'Congés payés', status: 'pending', days: 5 },
        { id: 16, employeeId: 5, startDate: '2025-03-17', endDate: '2025-03-21', type: 'RTT', status: 'pending', days: 5 },
        { id: 17, employeeId: 7, startDate: '2025-04-21', endDate: '2025-04-25', type: 'Congés payés', status: 'pending', days: 5 },
        { id: 18, employeeId: 9, startDate: '2025-05-05', endDate: '2025-05-09', type: 'Congés payés', status: 'pending', days: 5 },
        { id: 19, employeeId: 10, startDate: '2025-06-09', endDate: '2025-06-13', type: 'RTT', status: 'pending', days: 5 },
        { id: 20, employeeId: 13, startDate: '2025-07-14', endDate: '2025-07-25', type: 'Congés payés', status: 'pending', days: 10 },
        { id: 21, employeeId: 15, startDate: '2025-08-18', endDate: '2025-08-22', type: 'Congés payés', status: 'pending', days: 5 },
        { id: 22, employeeId: 17, startDate: '2025-09-01', endDate: '2025-09-05', type: 'RTT', status: 'pending', days: 5 },
        { id: 23, employeeId: 19, startDate: '2025-09-15', endDate: '2025-09-19', type: 'Congés payés', status: 'pending', days: 5 },
        { id: 24, employeeId: 21, startDate: '2025-10-06', endDate: '2025-10-10', type: 'Congés payés', status: 'pending', days: 5 },
        { id: 25, employeeId: 23, startDate: '2025-10-20', endDate: '2025-10-24', type: 'RTT', status: 'pending', days: 5 },
        { id: 26, employeeId: 26, startDate: '2025-11-03', endDate: '2025-11-07', type: 'Congés payés', status: 'pending', days: 5 },
        
        // Congés refusés
        { id: 27, employeeId: 11, startDate: '2025-02-24', endDate: '2025-02-28', type: 'Congés payés', status: 'rejected', days: 5 },
        { id: 28, employeeId: 24, startDate: '2025-03-24', endDate: '2025-03-28', type: 'RTT', status: 'rejected', days: 5 },
        { id: 29, employeeId: 27, startDate: '2025-04-28', endDate: '2025-05-02', type: 'Congés payés', status: 'rejected', days: 5 },
        { id: 30, employeeId: 29, startDate: '2025-05-19', endDate: '2025-05-23', type: 'Congés payés', status: 'rejected', days: 5 },
        
        // Congés maladie
        { id: 31, employeeId: 1, startDate: '2024-12-18', endDate: '2024-12-20', type: 'Congé maladie', status: 'approved', days: 3 },
        { id: 32, employeeId: 9, startDate: '2025-01-08', endDate: '2025-01-10', type: 'Congé maladie', status: 'approved', days: 3 },
        { id: 33, employeeId: 15, startDate: '2024-11-25', endDate: '2024-11-27', type: 'Congé maladie', status: 'approved', days: 3 }
    ],
    absences: [
        { id: 1, employeeId: 2, date: '2024-12-10', type: 'Maladie', days: 1 },
        { id: 2, employeeId: 5, date: '2024-12-05', type: 'Formation', days: 2 },
        { id: 3, employeeId: 8, date: '2024-11-20', type: 'Maladie', days: 3 },
        { id: 4, employeeId: 12, date: '2024-10-15', type: 'Congé exceptionnel', days: 1 },
        { id: 5, employeeId: 14, date: '2024-11-08', type: 'Formation', days: 5 },
        { id: 6, employeeId: 18, date: '2024-09-25', type: 'Maladie', days: 2 },
        { id: 7, employeeId: 21, date: '2024-10-30', type: 'Formation', days: 3 },
        { id: 8, employeeId: 25, date: '2024-11-12', type: 'Congé exceptionnel', days: 1 },
        { id: 9, employeeId: 28, date: '2024-12-02', type: 'Maladie', days: 1 },
        { id: 10, employeeId: 30, date: '2024-09-18', type: 'Formation', days: 4 }
    ],
    alternants: [
        { 
            id: 1, 
            firstName: 'Lucas', 
            lastName: 'Dupont', 
            type: 'alternance', 
            formation: 'Master SIRH',
            pattern: 'weekly',
            daysWork: 3,
            daysSchool: 2,
            startDate: '2024-09-01',
            endDate: '2025-08-31',
            workStart: '09:00',
            workEnd: '17:00',
            lunchBreak: '12:00 - 13:00',
            notes: '3 jours en entreprise (Lun-Mer), 2 jours à l\'école (Jeu-Ven)'
        },
        { 
            id: 2, 
            firstName: 'Emma', 
            lastName: 'Petit', 
            type: 'alternance', 
            formation: 'License Pro RH',
            pattern: 'monthly',
            weeksWork: 3,
            weeksSchool: 1,
            startDate: '2024-09-15',
            endDate: '2025-09-14',
            workStart: '08:30',
            workEnd: '16:30',
            lunchBreak: '12:00 - 13:00',
            notes: '3 semaines en entreprise, 1 semaine à l\'école'
        },
        { 
            id: 3, 
            firstName: 'Hugo', 
            lastName: 'Martin', 
            type: 'stage', 
            formation: 'Master 2 GRH',
            pattern: 'monthly',
            weeksWork: 4,
            weeksSchool: 0,
            startDate: '2025-01-06',
            endDate: '2025-06-30',
            workStart: '09:00',
            workEnd: '17:30',
            lunchBreak: '12:30 - 13:30',
            notes: 'Stage de fin d\'études - Temps plein'
        }
    ],
    alternantAbsences: [
        {
            id: 1,
            alternantId: 1, // Lucas Dupont
            type: 'maladie',
            startDate: '2024-10-15',
            endDate: '2024-10-16',
            days: 2,
            reason: 'Grippe'
        },
        {
            id: 2,
            alternantId: 1, // Lucas Dupont
            type: 'conge',
            startDate: '2024-12-24',
            endDate: '2024-12-28',
            days: 5,
            reason: 'Congés de Noël'
        },
        {
            id: 3,
            alternantId: 2, // Emma Petit
            type: 'maladie',
            startDate: '2024-11-05',
            endDate: '2024-11-05',
            days: 1,
            reason: 'Rendez-vous médical'
        }
    ]
};

// ==================== INITIALIZATION ====================
window.onload = function() {
    checkAuth();
};

// No global company settings loading - loaded per company on login

// ==================== AUTHENTICATION ====================
function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isDemoMode = false;
        loadData();
        showApp();
    }
}

// Simple hash function for password (NOT production-ready)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// Generate unique access code for alternant/stagiaire
function generateAccessCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// ==================== LANDING PAGE FUNCTIONS ====================
function startDemo() {
    // Redirect to manager demo by default
    startDemoManager();
}

function startDemoManager() {
    isDemoMode = true;
    currentUser = { 
        name: 'Manager RH Démo', 
        email: 'manager@sirh.fr', 
        userId: 'demo-manager',
        role: 'admin',
        department: null,
        companyId: 'demo',
        companyName: 'Entreprise Démo',
        companyCode: 'DEMO00'
    };
    employees = JSON.parse(JSON.stringify(demoData.employees));
    leaveRequests = JSON.parse(JSON.stringify(demoData.leaveRequests));
    absences = JSON.parse(JSON.stringify(demoData.absences));
    alternants = JSON.parse(JSON.stringify(demoData.alternants));
    alternantCalendars = {}; // Empty for demo - manager can edit
    alternantAbsences = JSON.parse(JSON.stringify(demoData.alternantAbsences));
    showApp();
    document.getElementById('demoBanner').classList.add('active');
    document.getElementById('logoutText').textContent = 'Quitter la démo';
}

function startDemoEmployee() {
    isDemoMode = true;
    // Use Emma ROBERT as the demo employee
    currentUser = { 
        name: 'Emma ROBERT', 
        email: 'emma.robert@entreprise.fr', 
        userId: 1,
        role: 'employee',
        department: 'Développement',
        companyId: 'demo',
        companyName: 'Entreprise Démo',
        companyCode: 'DEMO00'
    };
    employees = JSON.parse(JSON.stringify(demoData.employees));
    leaveRequests = JSON.parse(JSON.stringify(demoData.leaveRequests));
    absences = JSON.parse(JSON.stringify(demoData.absences));
    alternants = JSON.parse(JSON.stringify(demoData.alternants));
    alternantCalendars = {};
    alternantAbsences = JSON.parse(JSON.stringify(demoData.alternantAbsences));
    showApp();
    document.getElementById('demoBanner').classList.add('active');
    document.getElementById('logoutText').textContent = 'Quitter la démo';
}

function showLogin() {
    document.getElementById('authContainer').classList.add('active');
    switchToLogin();
}

function showRegister() {
    document.getElementById('authContainer').classList.add('active');
    switchToRegister();
}

function closeAuth() {
    document.getElementById('authContainer').classList.remove('active');
}

function switchToLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('alternantAccessForm').style.display = 'none';
    document.getElementById('authTitle').textContent = 'Connexion';
    document.getElementById('authSubtitle').textContent = 'Accédez à votre espace RH';
    clearAlert();
}

function switchToAlternantAccess() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('alternantAccessForm').style.display = 'block';
    document.getElementById('authTitle').textContent = 'Accès Alternant/Stagiaire';
    document.getElementById('authSubtitle').textContent = 'Connectez-vous avec votre code d\'accès';
    clearAlert();
}

function switchToRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('alternantAccessForm').style.display = 'none';
    document.getElementById('authTitle').textContent = 'Créer un compte';
    document.getElementById('authSubtitle').textContent = 'Rejoignez SIRH Pro gratuitement';
    clearAlert();
    
    // Add event listener for role change
    const roleSelect = document.getElementById('registerRole');
    if (roleSelect && !roleSelect.hasAttribute('data-listener')) {
        roleSelect.addEventListener('change', function() {
            const deptGroup = document.getElementById('departmentGroup');
            if (this.value === 'manager') {
                deptGroup.style.display = 'block';
                document.getElementById('registerDepartment').required = true;
            } else {
                deptGroup.style.display = 'none';
                document.getElementById('registerDepartment').required = false;
            }
        });
        roleSelect.setAttribute('data-listener', 'true');
    }
    
    // Update role options based on self-service setting (only for join mode)
    updateRoleOptions();
}

// Toggle company fields based on create/join selection
function toggleCompanyFields() {
    const mode = document.getElementById('companyMode').value;
    const createFields = document.getElementById('createCompanyFields');
    const joinFields = document.getElementById('joinCompanyFields');
    const roleGroup = document.getElementById('roleGroup');
    const companyName = document.getElementById('companyName');
    const companyCode = document.getElementById('companyCode');
    const registerRole = document.getElementById('registerRole');
    
    if (mode === 'create') {
        // Creating new company - automatically admin
        createFields.style.display = 'block';
        joinFields.style.display = 'none';
        roleGroup.style.display = 'none'; // Hidden, will be set to admin
        companyName.required = true;
        companyCode.required = false;
        registerRole.value = 'admin'; // Automatically admin
    } else if (mode === 'join') {
        // Joining existing company - choose role
        createFields.style.display = 'none';
        joinFields.style.display = 'block';
        roleGroup.style.display = 'block';
        companyName.required = false;
        companyCode.required = true;
        registerRole.required = true;
        registerRole.value = ''; // Reset role selection
        updateRoleOptions(); // Update available roles
    } else {
        // No selection
        createFields.style.display = 'none';
        joinFields.style.display = 'none';
        roleGroup.style.display = 'none';
        companyName.required = false;
        companyCode.required = false;
    }
}

function updateRoleOptions() {
    const roleSelect = document.getElementById('registerRole');
    if (!roleSelect) return;
    
    const mode = document.getElementById('companyMode')?.value;
    
    // Get current options
    const employeeOption = roleSelect.querySelector('option[value="employee"]');
    
    // Only filter if joining existing company
    if (mode === 'join') {
        // Check company settings (we'll validate code first during submit)
        if (!companySettings.selfServiceEnabled) {
            if (employeeOption) {
                employeeOption.style.display = 'none';
                employeeOption.disabled = true;
            }
        } else {
            if (employeeOption) {
                employeeOption.style.display = 'block';
                employeeOption.disabled = false;
            }
        }
    } else {
        // Creating company - no restrictions
        if (employeeOption) {
            employeeOption.style.display = 'block';
            employeeOption.disabled = false;
        }
    }
}

// ==================== ALERT SYSTEM ====================
function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

function clearAlert() {
    document.getElementById('alertContainer').innerHTML = '';
}

// ==================== LOGIN ====================
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === simpleHash(password));

    if (user) {
        isDemoMode = false;
        currentUser = { 
            email: user.email, 
            name: user.name, 
            userId: user.userId,
            role: user.role,
            department: user.department || null,
            companyId: user.companyId,
            companyName: user.companyName,
            companyCode: user.companyCode
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Load company settings
        companySettings = getCompanySettings(currentUser.companyId);
        
        closeAuth();
        loadData();
        showApp();
    } else {
        showAlert('Email ou mot de passe incorrect');
    }
});

// ==================== REGISTER ====================
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const companyMode = document.getElementById('companyMode').value;
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const department = document.getElementById('registerDepartment').value;

    if (!companyMode) {
        showAlert('Veuillez sélectionner si vous créez ou rejoignez une entreprise');
        return;
    }

    if (password !== passwordConfirm) {
        showAlert('Les mots de passe ne correspondent pas');
        return;
    }

    if (password.length < 6) {
        showAlert('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        showAlert('Cet email est déjà utilisé');
        return;
    }

    let company, role;

    if (companyMode === 'create') {
        // Creating new company
        const companyName = document.getElementById('companyName').value;
        if (!companyName) {
            showAlert('Veuillez entrer le nom de votre entreprise');
            return;
        }
        
        company = createCompany(companyName);
        role = 'admin'; // Creator is automatically admin
        
        showAlert(`Entreprise créée ! Code: ${company.code}`, 'success');
    } else if (companyMode === 'join') {
        // Joining existing company
        const companyCode = document.getElementById('companyCode').value;
        role = document.getElementById('registerRole').value;
        
        if (!companyCode) {
            showAlert('Veuillez entrer le code d\'entreprise');
            return;
        }
        
        if (!role) {
            showAlert('Veuillez sélectionner votre rôle');
            return;
        }
        
        company = getCompanyByCode(companyCode);
        
        if (!company) {
            showAlert('Code d\'entreprise invalide. Vérifiez auprès de votre RH.');
            return;
        }
        
        // Check if employee registration is allowed
        if (role === 'employee' && !company.settings.selfServiceEnabled) {
            showAlert('L\'accès employé est actuellement désactivé dans cette entreprise. Contactez votre administrateur RH.');
            return;
        }
    }

    const newUser = {
        userId: Date.now().toString(),
        name,
        email,
        password: simpleHash(password),
        role,
        department: role === 'manager' ? department : null,
        companyId: company.id,
        companyName: company.name,
        companyCode: company.code
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Initialize with demo data for new companies
    if (companyMode === 'create') {
        const companyKey = `sirh_${company.id}_`;
        localStorage.setItem(companyKey + 'employees', JSON.stringify(demoData.employees));
        localStorage.setItem(companyKey + 'leaves', JSON.stringify(demoData.leaveRequests));
        localStorage.setItem(companyKey + 'absences', JSON.stringify(demoData.absences));
        localStorage.setItem(companyKey + 'alternants', JSON.stringify(demoData.alternants));
    }
    
    showAlert('Compte créé avec succès ! Connexion en cours...', 'success');
    setTimeout(() => {
        isDemoMode = false;
        currentUser = { 
            email: newUser.email, 
            name: newUser.name, 
            userId: newUser.userId,
            role: newUser.role,
            department: newUser.department,
            companyId: newUser.companyId,
            companyName: newUser.companyName,
            companyCode: newUser.companyCode
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeAuth();
        loadData();
        showApp();
    }, 1500);
});

// Alternant Access Form Submit
document.getElementById('alternantAccessForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const accessCode = document.getElementById('alternantAccessCode').value.trim().toUpperCase();
    
    // Find employee with this access code
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    let foundEmployee = null;
    let companyId = null;
    
    // Search in all companies
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    for (const company of companies) {
        const companyKey = `sirh_${company.id}_`;
        const companyEmployees = JSON.parse(localStorage.getItem(companyKey + 'employees') || '[]');
        foundEmployee = companyEmployees.find(e => e.accessCode === accessCode);
        if (foundEmployee) {
            companyId = company.id;
            break;
        }
    }
    
    if (!foundEmployee) {
        showAlert('Code d\'accès invalide. Vérifiez avec votre responsable RH.');
        return;
    }
    
    // Check if calendar is already configured
    if (!foundEmployee.calendarConfigured) {
        // Redirect to calendar configuration
        customAlert(
            `Bienvenue ${foundEmployee.firstName} ${foundEmployee.lastName} !\n\nVous allez maintenant configurer votre calendrier scolaire.`,
            'success',
            'Connexion réussie'
        ).then(() => {
            // Set current user as alternant
            currentUser = {
                email: foundEmployee.email,
                name: `${foundEmployee.firstName} ${foundEmployee.lastName}`,
                userId: foundEmployee.id.toString(),
                role: 'alternant',
                employeeId: foundEmployee.id,
                companyId: companyId,
                accessCode: accessCode,
                calendarConfigured: false
            };
            isDemoMode = false;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Load company data
            loadData();
            closeAuth();
            
            // Show calendar configuration view
            showView('alternants');
            showCalendarSetupForAlternant(foundEmployee);
        });
    } else if (!foundEmployee.hasAccess) {
        // Calendar configured but access not yet granted
        customAlert(
            'Votre calendrier a été configuré.\n\nVotre accès est en attente de validation par votre responsable RH.',
            'info',
            'En attente de validation'
        );
    } else {
        // Full access granted
        currentUser = {
            email: foundEmployee.email,
            name: `${foundEmployee.firstName} ${foundEmployee.lastName}`,
            userId: foundEmployee.id.toString(),
            role: 'alternant',
            employeeId: foundEmployee.id,
            companyId: companyId,
            accessCode: accessCode,
            calendarConfigured: true,
            hasAccess: true
        };
        isDemoMode = false;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadData();
        closeAuth();
        showApp();
    }
});

// ==================== LOGOUT ====================
function logout() {
    if (isDemoMode) {
        customConfirm('Voulez-vous quitter la démonstration ?', 'Quitter la démo').then((confirmed) => {
            if (confirmed) {
                isDemoMode = false;
                currentUser = null;
                document.getElementById('appContainer').classList.remove('active');
                document.getElementById('landingPage').style.display = 'flex';
                document.getElementById('demoBanner').classList.remove('active');
            }
        });
    } else {
        customConfirm('Êtes-vous sûr de vouloir vous déconnecter ?', 'Déconnexion').then((confirmed) => {
            if (confirmed) {
                localStorage.removeItem('currentUser');
                currentUser = null;
                document.getElementById('appContainer').classList.remove('active');
                document.getElementById('landingPage').style.display = 'flex';
            }
        });
    }
}

// ==================== APP DISPLAY ====================
function showApp() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('currentUserName').textContent = currentUser.name;
    document.getElementById('currentUserEmail').textContent = currentUser.email;
    
    // Display user role
    const roleLabel = ROLES[currentUser.role]?.label || currentUser.role;
    document.getElementById('currentUserRole').textContent = roleLabel;
    
    // Show/hide navigation buttons based on role
    const settingsBtn = document.getElementById('navSettings');
    const absencesBtn = document.getElementById('navAbsences');
    const employeesBtn = document.getElementById('navEmployees');
    
    if (currentUser.role === 'admin') {
        settingsBtn.style.display = 'flex';
        absencesBtn.style.display = 'flex';
        employeesBtn.style.display = 'flex';
        loadSettingsView();
    } else if (currentUser.role === 'manager') {
        settingsBtn.style.display = 'none';
        absencesBtn.style.display = 'flex';
        employeesBtn.style.display = 'flex';
    } else if (currentUser.role === 'employee') {
        // Employee view - limited navigation
        settingsBtn.style.display = 'none';
        absencesBtn.style.display = 'none';
        employeesBtn.style.display = 'flex'; // Can see themselves
    }
    
    // Hide add/export buttons for employees
    hideButtonsForEmployees();
    
    document.getElementById('appContainer').classList.add('active');
    renderAll();
    updateDashboard();
}

// ==================== SETTINGS VIEW ====================
function hideButtonsForEmployees() {
    if (currentUser.role === 'employee') {
        // Hide add employee button
        const btnAddEmployee = document.getElementById('btnAddEmployee');
        const btnExportEmployees = document.getElementById('btnExportEmployees');
        if (btnAddEmployee) btnAddEmployee.style.display = 'none';
        if (btnExportEmployees) btnExportEmployees.style.display = 'none';
        
        // Hide add document button
        const btnAddDocument = document.getElementById('btnAddDocument');
        if (btnAddDocument) btnAddDocument.style.display = 'none';
        
        // Hide add alternant button
        const btnAddAlternant = document.getElementById('btnAddAlternant');
        if (btnAddAlternant) btnAddAlternant.style.display = 'none';
    } else {
        // Show buttons for admin/manager
        const btnAddEmployee = document.getElementById('btnAddEmployee');
        const btnExportEmployees = document.getElementById('btnExportEmployees');
        if (btnAddEmployee) btnAddEmployee.style.display = 'inline-flex';
        if (btnExportEmployees) btnExportEmployees.style.display = 'flex';
        
        const btnAddDocument = document.getElementById('btnAddDocument');
        if (btnAddDocument) btnAddDocument.style.display = 'inline-flex';
        
        const btnAddAlternant = document.getElementById('btnAddAlternant');
        if (btnAddAlternant) btnAddAlternant.style.display = 'inline-flex';
    }
}

function loadSettingsView() {
    // Display company information
    document.getElementById('companyNameDisplay').textContent = currentUser.companyName || '-';
    document.getElementById('companyCodeDisplay').textContent = currentUser.companyCode || '------';
    
    // Load company settings
    companySettings = getCompanySettings(currentUser.companyId);
    
    // Update toggle state
    const toggle = document.getElementById('selfServiceToggle');
    if (toggle) {
        toggle.checked = companySettings.selfServiceEnabled;
    }
    
    updateSettingsStatus();
    updateUserStats();
}

function copyCompanyCode() {
    const code = currentUser.companyCode;
    navigator.clipboard.writeText(code).then(() => {
        alert(`Code ${code} copié dans le presse-papier !`);
    }).catch(() => {
        alert(`Code d'entreprise: ${code}\n\nVeuillez le copier manuellement.`);
    });
}

function updateSettingsStatus() {
    const statusDiv = document.getElementById('selfServiceStatus');
    if (!statusDiv) return;
    
    if (companySettings.selfServiceEnabled) {
        statusDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: rgba(16, 185, 129, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">✓</div>
                <div>
                    <div style="font-weight: 600; color: #10b981; margin-bottom: 4px;">Self-Service Activé</div>
                    <div style="font-size: 14px; color: #94a3b8;">Les employés peuvent créer un compte et demander leurs congés.</div>
                </div>
            </div>
        `;
        statusDiv.style.background = 'rgba(16, 185, 129, 0.1)';
        statusDiv.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    } else {
        statusDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: rgba(239, 68, 68, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">✗</div>
                <div>
                    <div style="font-weight: 600; color: #ef4444; margin-bottom: 4px;">Self-Service Désactivé</div>
                    <div style="font-size: 14px; color: #94a3b8;">Seuls les Managers RH et Managers peuvent accéder au système.</div>
                </div>
            </div>
        `;
        statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        statusDiv.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    }
}

function updateUserStats() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Filter users by company
    const companyUsers = users.filter(u => u.companyId === currentUser.companyId);
    
    const admins = companyUsers.filter(u => u.role === 'admin').length;
    const managers = companyUsers.filter(u => u.role === 'manager').length;
    const employees = companyUsers.filter(u => u.role === 'employee').length;
    
    document.getElementById('statsAdmins').textContent = admins;
    document.getElementById('statsManagers').textContent = managers;
    document.getElementById('statsEmployees').textContent = employees;
}

function toggleSelfService() {
    const toggle = document.getElementById('selfServiceToggle');
    companySettings.selfServiceEnabled = toggle.checked;
    saveCompanySettings(currentUser.companyId, companySettings);
    updateSettingsStatus();
    
    // Show confirmation
    const action = toggle.checked ? 'activé' : 'désactivé';
    customAlert(`Self-Service ${action} avec succès !`, 'success', 'Paramètres mis à jour');
}

// ==================== DATA MANAGEMENT ====================
function getUserKey(key) {
    // Data is now scoped by company
    return `sirh_${currentUser.companyId}_${key}`;
}

function loadData() {
    if (isDemoMode) return; // Demo data already loaded
    
    employees = JSON.parse(localStorage.getItem(getUserKey('employees')) || '[]');
    leaveRequests = JSON.parse(localStorage.getItem(getUserKey('leaves')) || '[]');
    absences = JSON.parse(localStorage.getItem(getUserKey('absences')) || '[]');
    documents = JSON.parse(localStorage.getItem(getUserKey('documents')) || '[]');
    alternants = JSON.parse(localStorage.getItem(getUserKey('alternants')) || '[]');
    alternantCalendars = JSON.parse(localStorage.getItem(getUserKey('alternantCalendars')) || '{}');
}

function saveData(type) {
    if (isDemoMode) return; // Don't save in demo mode
    
    if (type === 'employees') {
        localStorage.setItem(getUserKey('employees'), JSON.stringify(employees));
    } else if (type === 'leaves') {
        localStorage.setItem(getUserKey('leaves'), JSON.stringify(leaveRequests));
    } else if (type === 'absences') {
        localStorage.setItem(getUserKey('absences'), JSON.stringify(absences));
    } else if (type === 'documents') {
        localStorage.setItem(getUserKey('documents'), JSON.stringify(documents));
    } else if (type === 'alternants') {
        localStorage.setItem(getUserKey('alternants'), JSON.stringify(alternants));
    } else if (type === 'alternantCalendars') {
        localStorage.setItem(getUserKey('alternantCalendars'), JSON.stringify(alternantCalendars));
    }
}

// ==================== PERMISSIONS ====================
function canApproveLeave(leave) {
    if (!currentUser) return false;
    
    // Admin can approve all
    if (currentUser.role === 'admin') return true;
    
    // Manager can approve their team's leaves
    if (currentUser.role === 'manager') {
        const employee = employees.find(e => e.id === leave.employeeId);
        return employee && employee.department === currentUser.department;
    }
    
    // Employees cannot approve
    return false;
}

function canManageEmployee(employee) {
    if (!currentUser) return false;
    
    // Admin can manage all
    if (currentUser.role === 'admin') return true;
    
    // Manager can manage their team
    if (currentUser.role === 'manager') {
        return employee.department === currentUser.department;
    }
    
    // Employees cannot manage others
    return false;
}

// ==================== NAVIGATION ====================
function showView(view) {
    currentView = view;
    
    // Update nav buttons - find all nav buttons and remove active class
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    if (event && event.target) {
        const clickedBtn = event.target.closest('.nav-btn');
        if (clickedBtn) {
            clickedBtn.classList.add('active');
        }
    }
    
    // Update views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(view + 'View').classList.add('active');
    
    // Hide buttons for employees
    hideButtonsForEmployees();
    
    // If settings view, reload settings
    if (view === 'settings') {
        loadSettingsView();
    } else {
        renderAll();
    }
}

// ==================== RENDERING ====================
function renderAll() {
    renderEmployeesTable();
    renderLeavesTable();
    renderAbsencesTable();
    renderDocumentsTable();
    renderAlternantsTable();
    updateDashboard();
}

// Dashboard
function updateDashboard() {
    if (currentUser.role === 'employee') {
        // Show employee dashboard
        document.getElementById('employeeDashboard').style.display = 'block';
        document.getElementById('managerDashboard').style.display = 'none';
        updateEmployeeDashboard();
    } else {
        // Show manager/admin dashboard
        document.getElementById('employeeDashboard').style.display = 'none';
        document.getElementById('managerDashboard').style.display = 'block';
        updateManagerDashboard();
    }
}

// Employee Dashboard
function updateEmployeeDashboard() {
    // Welcome message
    document.getElementById('empWelcomeName').textContent = currentUser.name;
    
    // Find employee data (looking for employee with matching email)
    const myEmployeeData = employees.find(e => e.email === currentUser.email);
    const myLeaveDays = myEmployeeData?.leaveDays || 25;
    
    // My leave requests
    const myLeaveRequests = leaveRequests.filter(l => {
        const emp = employees.find(e => e.id === l.employeeId);
        return emp?.email === currentUser.email;
    });
    
    const myPending = myLeaveRequests.filter(l => l.status === 'pending').length;
    const myApproved = myLeaveRequests.filter(l => l.status === 'approved' && new Date(l.startDate) > new Date()).length;
    
    // Calculate used leave days
    const usedDays = myLeaveRequests
        .filter(l => l.status === 'approved')
        .reduce((sum, l) => sum + l.days, 0);
    const remainingDays = myLeaveDays - usedDays;
    
    document.getElementById('empLeaveDays').textContent = remainingDays;
    document.getElementById('empPendingLeaves').textContent = myPending;
    document.getElementById('empApprovedLeaves').textContent = myApproved;
    
    // My upcoming leaves
    const myUpcoming = myLeaveRequests
        .filter(l => l.status === 'approved' && new Date(l.startDate) > new Date())
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 3);
    
    const upcomingHtml = myUpcoming.length > 0 
        ? myUpcoming.map(leave => `
            <div class="list-item" style="border-left: 3px solid #10b981">
                <div class="list-item-title">${leave.type}</div>
                <div class="list-item-subtitle">
                    Du ${formatDate(leave.startDate)} au ${formatDate(leave.endDate)} (${leave.days} jours)
                </div>
            </div>
        `).join('')
        : '<div class="empty-state">Aucun congé prévu<br><small style="font-size: 13px;">Cliquez sur le bouton ci-dessous pour en demander</small></div>';
    
    document.getElementById('empUpcomingLeaves').innerHTML = upcomingHtml;
    
    // Team absences today
    const today = new Date().toISOString().split('T')[0];
    const todayAbsences = leaveRequests
        .filter(l => {
            const emp = employees.find(e => e.id === l.employeeId);
            return l.status === 'approved' && 
                   emp?.email !== currentUser.email && // Not me
                   new Date(l.startDate) <= new Date(today) && 
                   new Date(l.endDate) >= new Date(today);
        })
        .slice(0, 5);
    
    const teamAbsencesHtml = todayAbsences.length > 0
        ? todayAbsences.map(leave => {
            const emp = employees.find(e => e.id === leave.employeeId);
            return `
                <div class="list-item" style="border-left: 3px solid #f59e0b">
                    <div class="list-item-title">${emp?.firstName} ${emp?.lastName}</div>
                    <div class="list-item-subtitle">
                        ${leave.type} - Retour le ${formatDate(leave.endDate)}
                    </div>
                </div>
            `;
        }).join('')
        : '<div class="empty-state">Toute l\'équipe est présente aujourd\'hui ! 🎉</div>';
    
    document.getElementById('empTeamAbsences').innerHTML = teamAbsencesHtml;
}

// Manager Dashboard
function updateManagerDashboard() {
    const totalEmployees = employees.length;
    const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;
    const totalAbsences = absences.reduce((sum, abs) => sum + abs.days, 0);
    const absenceRate = totalEmployees > 0 ? ((totalAbsences / (totalEmployees * 20)) * 100).toFixed(1) : 0;

    document.getElementById('totalEmployees').textContent = totalEmployees;
    document.getElementById('pendingLeaves').textContent = pendingLeaves;
    document.getElementById('absenceRate').textContent = absenceRate + '%';

    // Upcoming leaves
    const upcomingLeaves = leaveRequests
        .filter(l => l.status === 'approved' && new Date(l.startDate) > new Date())
        .slice(0, 5);

    const upcomingHtml = upcomingLeaves.length > 0 
        ? upcomingLeaves.map(leave => {
            const emp = employees.find(e => e.id === leave.employeeId);
            return `
                <div class="list-item" style="border-left: 3px solid #10b981">
                    <div class="list-item-title">${emp?.firstName} ${emp?.lastName}</div>
                    <div class="list-item-subtitle">
                        Du ${formatDate(leave.startDate)} au ${formatDate(leave.endDate)}
                    </div>
                </div>
            `;
        }).join('')
        : '<div class="empty-state">Aucun congé prévu</div>';

    document.getElementById('upcomingLeaves').innerHTML = upcomingHtml;

    // Recent absences
    const recentAbsences = absences.slice(-5).reverse();
    const absencesHtml = recentAbsences.length > 0
        ? recentAbsences.map(absence => {
            const emp = employees.find(e => e.id === absence.employeeId);
            return `
                <div class="list-item" style="border-left: 3px solid #ef4444">
                    <div class="list-item-title">${emp?.firstName} ${emp?.lastName}</div>
                    <div class="list-item-subtitle">
                        ${absence.type} - ${formatDate(absence.date)} (${absence.days} jour${absence.days > 1 ? 's' : ''})
                    </div>
                </div>
            `;
        }).join('')
        : '<div class="empty-state">Aucune absence enregistrée</div>';

    document.getElementById('recentAbsences').innerHTML = absencesHtml;
}

// Employees Table
function renderEmployeesTable() {
    const tbody = document.getElementById('employeesTableBody');
    
    // Filter employees based on role
    let employeesToShow = employees;
    if (currentUser.role === 'employee') {
        // Employees only see themselves
        employeesToShow = employees.filter(e => e.email === currentUser.email);
    }
    
    if (employeesToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Aucun employé enregistré</td></tr>';
        return;
    }

    tbody.innerHTML = employeesToShow.map(emp => {
        const canManage = canManageEmployee(emp);
        
        return `
        <tr>
            <td data-label="Nom Complet" style="font-weight: 600">${emp.firstName} ${emp.lastName}</td>
            <td data-label="Poste">${emp.position}</td>
            <td data-label="Type de contrat"><span class="status-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">${emp.contractType || 'CDI'}</span></td>
            <td data-label="Département">${emp.department}</td>
            <td data-label="Date d'entrée">${formatDate(emp.startDate)}</td>
            <td data-label="Email" style="color: #94a3b8; font-size: 14px">${emp.email}</td>
            <td data-label="Actions">
                ${canManage ? `
                    <button class="btn-icon btn-edit" onclick="editEmployee(${emp.id})" title="Modifier">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteEmployee(${emp.id})" title="Supprimer">🗑️</button>
                ` : `
                    <span style="color: #64748b; font-size: 12px; font-style: italic;">Consultation uniquement</span>
                `}
            </td>
        </tr>
    `}).join('');
}

// Leaves Table
function renderLeavesTable() {
    const tbody = document.getElementById('leavesTableBody');
    
    // Filter leaves based on role
    let leavesToShow = leaveRequests;
    if (currentUser.role === 'employee') {
        // Employees only see their own leaves
        leavesToShow = leaveRequests.filter(l => {
            const emp = employees.find(e => e.id === l.employeeId);
            return emp?.email === currentUser.email;
        });
    }
    
    if (leavesToShow.length === 0) {
        const message = currentUser.role === 'employee' 
            ? 'Vous n\'avez aucune demande de congé<br><small>Cliquez sur "Nouvelle demande" pour en créer une</small>'
            : 'Aucune demande de congé';
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">${message}</td></tr>`;
        return;
    }

    tbody.innerHTML = leavesToShow.map(leave => {
        const emp = employees.find(e => e.id === leave.employeeId);
        const statusText = leave.status === 'pending' ? 'En attente' : 
                         leave.status === 'approved' ? 'Approuvé' : 'Refusé';
        
        // Check if current user can approve this leave
        const canApprove = canApproveLeave(leave);
        
        return `
            <tr>
                <td data-label="Employé" style="font-weight: 600">${emp?.firstName} ${emp?.lastName}</td>
                <td data-label="Type">${leave.type}</td>
                <td data-label="Date début">${formatDate(leave.startDate)}</td>
                <td data-label="Date fin">${formatDate(leave.endDate)}</td>
                <td data-label="Jours">${leave.days}</td>
                <td data-label="Statut"><span class="status-badge status-${leave.status}">${statusText}</span></td>
                <td data-label="Actions">
                    ${leave.status === 'pending' && canApprove ? `
                        <button class="btn-icon btn-success" onclick="updateLeaveStatus(${leave.id}, 'approved')" title="Approuver">✓</button>
                        <button class="btn-icon btn-danger" onclick="updateLeaveStatus(${leave.id}, 'rejected')" title="Refuser">✗</button>
                    ` : ''}
                    ${(currentUser.role === 'admin' || canApprove) && leave.status === 'pending' ? `
                        <button class="btn-icon btn-danger" onclick="deleteLeave(${leave.id})" title="Supprimer">🗑️</button>
                    ` : ''}
                    ${currentUser.role === 'employee' && leave.status === 'pending' ? `
                        <button class="btn-icon btn-danger" onclick="deleteLeave(${leave.id})" title="Annuler ma demande">🗑️</button>
                    ` : ''}
                    ${!canApprove && leave.status === 'pending' && currentUser.role !== 'employee' ? `
                        <span style="color: #64748b; font-size: 12px; font-style: italic;">En attente d'approbation</span>
                    ` : ''}
                    ${leave.status !== 'pending' && currentUser.role === 'employee' ? `
                        <span style="color: #64748b; font-size: 12px; font-style: italic;">Traité</span>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

// Absences Table
function renderAbsencesTable() {
    const tbody = document.getElementById('absencesTableBody');
    if (absences.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Aucune absence enregistrée</td></tr>';
        return;
    }

    tbody.innerHTML = absences.map(absence => {
        const emp = employees.find(e => e.id === absence.employeeId);
        return `
            <tr>
                <td data-label="Employé" style="font-weight: 600">${emp?.firstName} ${emp?.lastName}</td>
                <td data-label="Type">${absence.type}</td>
                <td data-label="Date">${formatDate(absence.date)}</td>
                <td data-label="Durée">${absence.days} jour${absence.days > 1 ? 's' : ''}</td>
                <td data-label="Actions">
                    <button class="btn-icon btn-danger" onclick="deleteAbsence(${absence.id})">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Render Documents Table
function renderDocumentsTable() {
    const tbody = document.getElementById('documentsTableBody');
    if (!tbody) return;
    
    if (documents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Aucun document enregistré</td></tr>';
        return;
    }

    tbody.innerHTML = documents.map(doc => {
        const emp = employees.find(e => e.id === doc.employeeId);
        return `
            <tr>
                <td data-label="Nom du document" style="font-weight: 600">${doc.name}</td>
                <td data-label="Employé">${emp?.firstName} ${emp?.lastName}</td>
                <td data-label="Type">${doc.type}</td>
                <td data-label="Date">${formatDate(doc.date)}</td>
                <td data-label="Actions">
                    <button class="btn-icon btn-primary" onclick="window.open('${doc.url}', '_blank')" title="Voir le document">👁️</button>
                    <button class="btn-icon btn-danger" onclick="deleteDocument(${doc.id})" title="Supprimer">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

function deleteDocument(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
        documents = documents.filter(d => d.id !== id);
        saveData('documents');
        renderAll();
    }
}

// ==================== MODAL FUNCTIONS ====================
function openModal(type, item = null) {
    modalType = type;
    editingItem = item;
    
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (type === 'employee') {
        modalTitle.textContent = item ? 'Modifier l\'employé' : 'Nouvel employé';
        modalBody.innerHTML = `
            <div class="form-group">
                <label>Prénom</label>
                <input type="text" id="firstName" required value="${item?.firstName || ''}">
            </div>
            <div class="form-group">
                <label>Nom</label>
                <input type="text" id="lastName" required value="${item?.lastName || ''}">
            </div>
            <div class="form-group">
                <label>Poste</label>
                <input type="text" id="position" required value="${item?.position || ''}">
            </div>
            <div class="form-group">
                <label>Département</label>
                <select id="department" required>
                    <option value="">Sélectionner...</option>
                    <option value="Ressources Humaines" ${item?.department === 'Ressources Humaines' ? 'selected' : ''}>Ressources Humaines</option>
                    <option value="IT" ${item?.department === 'IT' ? 'selected' : ''}>IT</option>
                    <option value="Marketing" ${item?.department === 'Marketing' ? 'selected' : ''}>Marketing</option>
                    <option value="Finance" ${item?.department === 'Finance' ? 'selected' : ''}>Finance</option>
                    <option value="Commercial" ${item?.department === 'Commercial' ? 'selected' : ''}>Commercial</option>
                    <option value="Production" ${item?.department === 'Production' ? 'selected' : ''}>Production</option>
                </select>
            </div>
            <div class="form-group">
                <label>Type de contrat</label>
                <select id="contractType" required>
                    <option value="">Sélectionner...</option>
                    <option value="CDI" ${item?.contractType === 'CDI' ? 'selected' : ''}>CDI</option>
                    <option value="CDD" ${item?.contractType === 'CDD' ? 'selected' : ''}>CDD</option>
                    <option value="Stage" ${item?.contractType === 'Stage' ? 'selected' : ''}>Stage</option>
                    <option value="Alternance" ${item?.contractType === 'Alternance' ? 'selected' : ''}>Alternance</option>
                    <option value="Intérim" ${item?.contractType === 'Intérim' ? 'selected' : ''}>Intérim</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date d'entrée</label>
                <input type="date" id="startDate" required value="${item?.startDate || ''}">
            </div>
            <div class="form-group">
                <label>Téléphone</label>
                <input type="tel" id="phone" value="${item?.phone || ''}" placeholder="06 12 34 56 78">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="email" required value="${item?.email || ''}">
            </div>
            <div class="form-group">
                <label>Adresse</label>
                <input type="text" id="address" value="${item?.address || ''}" placeholder="12 rue de Paris, 75001 Paris">
            </div>
            <div class="form-group">
                <label>Date de naissance</label>
                <input type="date" id="birthDate" value="${item?.birthDate || ''}">
            </div>
        `;
    } else if (type === 'leave') {
        modalTitle.textContent = 'Nouvelle demande de congé';
        
        // For employees, automatically select themselves
        let employeeSelectHtml = '';
        if (currentUser.role === 'employee') {
            const myEmployee = employees.find(e => e.email === currentUser.email);
            if (myEmployee) {
                employeeSelectHtml = `
                    <div class="form-group">
                        <label>Employé</label>
                        <input type="text" value="${myEmployee.firstName} ${myEmployee.lastName}" disabled style="background: rgba(148, 163, 184, 0.1); cursor: not-allowed;">
                        <input type="hidden" id="employeeId" value="${myEmployee.id}">
                    </div>
                `;
            }
        } else {
            // For managers/admin, show dropdown
            const employeeOptions = employees.map(emp => 
                `<option value="${emp.id}">${emp.firstName} ${emp.lastName}</option>`
            ).join('');
            
            employeeSelectHtml = `
                <div class="form-group">
                    <label>Employé</label>
                    <select id="employeeId" required>
                        <option value="">Sélectionner...</option>
                        ${employeeOptions}
                    </select>
                </div>
            `;
        }
        
        modalBody.innerHTML = `
            ${employeeSelectHtml}
            <div class="form-group">
                <label>Type de congé</label>
                <select id="leaveType" required>
                    <option value="">Sélectionner...</option>
                    <option value="Congés payés">Congés payés</option>
                    <option value="RTT">RTT</option>
                    <option value="Congé sans solde">Congé sans solde</option>
                    <option value="Congé maladie">Congé maladie</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date de début</label>
                <input type="date" id="startDate" required>
            </div>
            <div class="form-group">
                <label>Date de fin</label>
                <input type="date" id="endDate" required>
            </div>
            <div class="form-group">
                <label>Nombre de jours</label>
                <input type="number" id="days" required min="1">
            </div>
        `;
    } else if (type === 'absence') {
        modalTitle.textContent = 'Déclarer une absence';
        const employeeOptions = employees.map(emp => 
            `<option value="${emp.id}">${emp.firstName} ${emp.lastName}</option>`
        ).join('');
        
        modalBody.innerHTML = `
            <div class="form-group">
                <label>Employé</label>
                <select id="employeeId" required>
                    <option value="">Sélectionner...</option>
                    ${employeeOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Type d'absence</label>
                <select id="absenceType" required>
                    <option value="">Sélectionner...</option>
                    <option value="Maladie">Maladie</option>
                    <option value="Congé maternité">Congé maternité</option>
                    <option value="Congé paternité">Congé paternité</option>
                    <option value="Formation">Formation</option>
                    <option value="Accident de travail">Accident de travail</option>
                    <option value="Congé exceptionnel">Congé exceptionnel</option>
                    <option value="Autre">Autre</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date de début</label>
                <input type="date" id="absenceDate" required>
            </div>
            <div class="form-group">
                <label>Date de fin</label>
                <input type="date" id="absenceEndDate" required>
            </div>
            <div class="form-group">
                <label>Durée (jours)</label>
                <input type="number" id="days" required min="1">
            </div>
            <div class="form-group">
                <label>Raison (optionnel)</label>
                <textarea id="absenceReason" rows="3" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-family: inherit;"></textarea>
            </div>
        `;
    } else if (type === 'document') {
        modalTitle.textContent = 'Nouveau document';
        const employeeOptions = employees.map(emp => 
            `<option value="${emp.id}">${emp.firstName} ${emp.lastName}</option>`
        ).join('');
        
        modalBody.innerHTML = `
            <div class="form-group">
                <label>Employé</label>
                <select id="employeeId" required>
                    <option value="">Sélectionner...</option>
                    ${employeeOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Nom du document</label>
                <input type="text" id="docName" required placeholder="Ex: Contrat de travail">
            </div>
            <div class="form-group">
                <label>Type de document</label>
                <select id="docType" required>
                    <option value="">Sélectionner...</option>
                    <option value="Contrat">Contrat de travail</option>
                    <option value="Attestation">Attestation</option>
                    <option value="Fiche de paie">Fiche de paie</option>
                    <option value="Certificat">Certificat</option>
                    <option value="Autre">Autre</option>
                </select>
            </div>
            <div class="form-group">
                <label>Lien/URL du document</label>
                <input type="url" id="docUrl" required placeholder="https://drive.google.com/...">
            </div>
        `;
    } else if (type === 'alternant') {
        modalTitle.textContent = item ? 'Modifier l\'alternant' : 'Nouvel alternant';
        
        modalBody.innerHTML = `
            <div class="form-group">
                <label>Prénom</label>
                <input type="text" id="firstName" required value="${item?.firstName || ''}">
            </div>
            <div class="form-group">
                <label>Nom</label>
                <input type="text" id="lastName" required value="${item?.lastName || ''}">
            </div>
            <div class="form-group">
                <label>Type de contrat</label>
                <select id="contractType" required>
                    <option value="">Sélectionner...</option>
                    <option value="alternance" ${item?.type === 'alternance' ? 'selected' : ''}>Alternance</option>
                    <option value="stage" ${item?.type === 'stage' ? 'selected' : ''}>Stage</option>
                </select>
            </div>
            <div class="form-group">
                <label>Formation</label>
                <input type="text" id="formation" required value="${item?.formation || ''}" placeholder="Ex: Master SIRH">
            </div>
            <div class="form-group">
                <label>Pattern d'alternance</label>
                <select id="pattern" required onchange="togglePatternFields()" ${item ? `data-initial="${item.pattern}"` : ''}>
                    <option value="">Sélectionner...</option>
                    <option value="weekly" ${item?.pattern === 'weekly' ? 'selected' : ''}>Hebdomadaire (jours entreprise/école)</option>
                    <option value="monthly" ${item?.pattern === 'monthly' ? 'selected' : ''}>Mensuel (semaines entreprise/école)</option>
                </select>
            </div>
            
            <!-- Weekly Pattern Fields -->
            <div id="weeklyFields" style="display: none;">
                <div class="form-group">
                    <label>Jours en entreprise par semaine</label>
                    <input type="number" id="daysWork" min="1" max="5" value="${item?.daysWork || 3}">
                </div>
                <div class="form-group">
                    <label>Jours à l'école par semaine</label>
                    <input type="number" id="daysSchool" min="1" max="5" value="${item?.daysSchool || 2}">
                </div>
            </div>
            
            <!-- Monthly Pattern Fields -->
            <div id="monthlyFields" style="display: none;">
                <div class="form-group">
                    <label>Semaines en entreprise</label>
                    <input type="number" id="weeksWork" min="1" value="${item?.weeksWork || 3}">
                </div>
                <div class="form-group">
                    <label>Semaines à l'école</label>
                    <input type="number" id="weeksSchool" min="1" value="${item?.weeksSchool || 1}">
                </div>
            </div>
            
            <div class="form-group">
                <label>Date de début</label>
                <input type="date" id="startDate" required value="${item?.startDate || ''}">
            </div>
            <div class="form-group">
                <label>Date de fin</label>
                <input type="date" id="endDate" required value="${item?.endDate || ''}">
            </div>
            <div class="form-group">
                <label>Horaire d'arrivée</label>
                <input type="time" id="workStart" value="${item?.workStart || '09:00'}">
            </div>
            <div class="form-group">
                <label>Horaire de départ</label>
                <input type="time" id="workEnd" value="${item?.workEnd || '17:00'}">
            </div>
            <div class="form-group">
                <label>Pause déjeuner</label>
                <input type="text" id="lunchBreak" value="${item?.lunchBreak || '12:00 - 13:00'}" placeholder="Ex: 12:00 - 13:00">
            </div>
            <div class="form-group">
                <label>Notes (optionnel)</label>
                <textarea id="notes" rows="3" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-family: inherit;">${item?.notes || ''}</textarea>
            </div>
        `;
        
        // Show appropriate fields based on pattern
        setTimeout(() => {
            togglePatternFields();
        }, 0);
    }

    modal.classList.add('active');
}

// Toggle Pattern Fields for Alternants
function togglePatternFields() {
    const pattern = document.getElementById('pattern').value;
    const weeklyFields = document.getElementById('weeklyFields');
    const monthlyFields = document.getElementById('monthlyFields');
    
    if (pattern === 'weekly') {
        weeklyFields.style.display = 'block';
        monthlyFields.style.display = 'none';
    } else if (pattern === 'monthly') {
        weeklyFields.style.display = 'none';
        monthlyFields.style.display = 'block';
    } else {
        weeklyFields.style.display = 'none';
        monthlyFields.style.display = 'none';
    }
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    editingItem = null;
}

// Modal Form Submit
document.getElementById('modalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (modalType === 'employee') {
        const data = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            position: document.getElementById('position').value,
            department: document.getElementById('department').value,
            contractType: document.getElementById('contractType').value,
            startDate: document.getElementById('startDate').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            birthDate: document.getElementById('birthDate').value
        };

        if (editingItem) {
            const index = employees.findIndex(e => e.id === editingItem.id);
            employees[index] = { ...employees[index], ...data };
        } else {
            const newEmployee = { id: Date.now(), ...data, leaveDays: 25 };
            
            // Generate access code for Stage/Alternance
            if (data.contractType === 'Stage' || data.contractType === 'Alternance') {
                newEmployee.accessCode = generateAccessCode();
                newEmployee.hasAccess = false; // Manager needs to approve
                newEmployee.calendarConfigured = false;
                
                // Show access code to manager
                customAlert(
                    `Code d'accès généré pour ${data.firstName} ${data.lastName}:\n\n${newEmployee.accessCode}\n\nEnvoyez ce code au stagiaire/alternant pour qu'il puisse se connecter et configurer son calendrier.`,
                    'success',
                    'Code d\'accès créé'
                );
            }
            
            employees.push(newEmployee);
        }
        saveData('employees');
    } else if (modalType === 'leave') {
        const data = {
            id: Date.now(),
            employeeId: parseInt(document.getElementById('employeeId').value),
            type: document.getElementById('leaveType').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            days: parseInt(document.getElementById('days').value),
            status: 'pending'
        };
        leaveRequests.push(data);
        saveData('leaves');
    } else if (modalType === 'absence') {
        const data = {
            id: Date.now(),
            employeeId: parseInt(document.getElementById('employeeId').value),
            type: document.getElementById('absenceType').value,
            date: document.getElementById('absenceDate').value,
            endDate: document.getElementById('absenceEndDate').value,
            days: parseInt(document.getElementById('days').value),
            reason: document.getElementById('absenceReason').value
        };
        absences.push(data);
        saveData('absences');
    } else if (modalType === 'document') {
        const data = {
            id: Date.now(),
            employeeId: parseInt(document.getElementById('employeeId').value),
            name: document.getElementById('docName').value,
            type: document.getElementById('docType').value,
            url: document.getElementById('docUrl').value,
            date: new Date().toISOString().split('T')[0]
        };
        documents.push(data);
        saveData('documents');
    } else if (modalType === 'alternant') {
        const pattern = document.getElementById('pattern').value;
        const data = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            type: document.getElementById('contractType').value,
            formation: document.getElementById('formation').value,
            pattern: pattern,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            workStart: document.getElementById('workStart').value,
            workEnd: document.getElementById('workEnd').value,
            lunchBreak: document.getElementById('lunchBreak').value,
            notes: document.getElementById('notes').value
        };
        
        if (pattern === 'weekly') {
            data.daysWork = parseInt(document.getElementById('daysWork').value);
            data.daysSchool = parseInt(document.getElementById('daysSchool').value);
        } else {
            data.weeksWork = parseInt(document.getElementById('weeksWork').value);
            data.weeksSchool = parseInt(document.getElementById('weeksSchool').value);
        }
        
        if (editingItem) {
            updateAlternant(editingItem.id, data);
        } else {
            addAlternant(data);
        }
    }

    closeModal();
    renderAll();
});

// ==================== CRUD OPERATIONS ====================
function editEmployee(id) {
    const employee = employees.find(e => e.id === id);
    if (!canManageEmployee(employee)) {
        alert('Vous n\'avez pas la permission de modifier cet employé.');
        return;
    }
    openModal('employee', employee);
}

function deleteEmployee(id) {
    const employee = employees.find(e => e.id === id);
    if (!canManageEmployee(employee)) {
        alert('Vous n\'avez pas la permission de supprimer cet employé.');
        return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
        employees = employees.filter(e => e.id !== id);
        saveData('employees');
        renderAll();
    }
}

function updateLeaveStatus(id, status) {
    const leave = leaveRequests.find(l => l.id === id);
    if (!canApproveLeave(leave)) {
        alert('Vous n\'avez pas la permission d\'approuver cette demande de congé.');
        return;
    }
    
    leave.status = status;
    saveData('leaves');
    renderAll();
    
    // Show confirmation message
    const statusText = status === 'approved' ? 'approuvée' : 'refusée';
    const emp = employees.find(e => e.id === leave.employeeId);
    alert(`Demande de congé ${statusText} pour ${emp?.firstName} ${emp?.lastName}`);
}

function deleteLeave(id) {
    const leave = leaveRequests.find(l => l.id === id);
    if (!canApproveLeave(leave) && currentUser.role !== 'admin') {
        alert('Vous n\'avez pas la permission de supprimer cette demande.');
        return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
        leaveRequests = leaveRequests.filter(l => l.id !== id);
        saveData('leaves');
        renderAll();
    }
}

function deleteAbsence(id) {
    if (currentUser.role === 'employee') {
        alert('Vous n\'avez pas la permission de supprimer des absences.');
        return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette absence ?')) {
        absences = absences.filter(a => a.id !== id);
        saveData('absences');
        renderAll();
    }
}

// ==================== ALTERNANTS MANAGEMENT ====================

// Render Alternants Table
// Get total absence days for an alternant
function getAlternantTotalAbsences(alternantId) {
    if (!alternantAbsences || alternantAbsences.length === 0) return 0;
    
    const alternantAbsencesList = alternantAbsences.filter(a => a.alternantId === alternantId);
    return alternantAbsencesList.reduce((total, absence) => total + (absence.days || 0), 0);
}

function renderAlternantsTable() {
    const tbody = document.getElementById('alternantsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = alternants.map(alt => {
        const statusNow = getAlternantStatusNow(alt);
        const statusBadge = statusNow === 'entreprise' 
            ? '<span class="badge badge-success"> En entreprise</span>'
            : '<span class="badge badge-info">À l\'école</span>';
        
        const patternText = alt.pattern === 'weekly' 
            ? `${alt.daysWork}j entreprise / ${alt.daysSchool}j école`
            : `${alt.weeksWork} semaines entreprise / ${alt.weeksSchool} semaines école`;
        
        const totalAbsences = getAlternantTotalAbsences(alt.id);
        const absenceBadge = totalAbsences > 0 
            ? `<span style="color: #ef4444; font-weight: 600;">${totalAbsences} jours</span>`
            : '<span style="color: #64748b;">0 jour</span>';
        
        return `
            <tr>
                <td data-label="Nom" style="font-weight: 600;">${alt.firstName} ${alt.lastName}</td>
                <td data-label="Type">${alt.type === 'alternance' ? 'Alternance' : 'Stage'}</td>
                <td data-label="Formation">${alt.formation}</td>
                <td data-label="Pattern">${patternText}</td>
                <td data-label="Statut actuel">${statusBadge}</td>
                <td data-label="Jours d'absence" style="text-align: center;">${absenceBadge}</td>
                <td data-label="Actions">
                    <button class="btn-icon" onclick="editAlternant(${alt.id})" title="Modifier">✏️</button>
                    <button class="btn-icon" onclick="deleteAlternant(${alt.id})" title="Supprimer">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
    
    updateAlternantsStats();
    updateAlternantSelector();
}

// Update Alternants Statistics
function updateAlternantsStats() {
    const total = alternants.length;
    const present = alternants.filter(alt => getAlternantStatusNow(alt) === 'entreprise').length;
    const school = total - present;
    
    const totalEl = document.getElementById('totalAlternants');
    const presentEl = document.getElementById('alternantsPresent');
    const schoolEl = document.getElementById('alternantsSchool');
    
    if (totalEl) totalEl.textContent = total;
    if (presentEl) presentEl.textContent = present;
    if (schoolEl) schoolEl.textContent = school;
}

// Update Alternant Selector
function updateAlternantSelector() {
    const select = document.getElementById('selectedAlternant');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Choisir un alternant --</option>' + 
        alternants.map(alt => `<option value="${alt.id}">${alt.firstName} ${alt.lastName}</option>`).join('');
    select.value = currentValue;
}

// Get Alternant Status at Current Date
function getAlternantStatusNow(alternant) {
    return getAlternantStatusAtDate(alternant, new Date());
}

// Get Alternant Status at Specific Date
function getAlternantStatusAtDate(alternant, date) {
    const dateKey = formatDateKey(date);
    
    // Check if there's a custom status for this day
    if (alternantCalendars[alternant.id] && alternantCalendars[alternant.id][dateKey]) {
        return alternantCalendars[alternant.id][dateKey];
    }
    
    // Check if weekend
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend';
    
    // Default pattern if set
    if (alternant.pattern === 'weekly') {
        const startDate = new Date(alternant.startDate);
        const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
        const cycleLength = alternant.daysWork + alternant.daysSchool;
        const dayInCycle = daysDiff % cycleLength;
        return dayInCycle < alternant.daysWork ? 'entreprise' : 'ecole';
    } else if (alternant.pattern === 'monthly') {
        const startDate = new Date(alternant.startDate);
        const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
        const weeksDiff = Math.floor(daysDiff / 7);
        const cycleLength = alternant.weeksWork + alternant.weeksSchool;
        const weekInCycle = weeksDiff % cycleLength;
        return weekInCycle < alternant.weeksWork ? 'entreprise' : 'ecole';
    }
    
    // Default to entreprise if no pattern
    return 'entreprise';
}

// Format date as YYYY-MM-DD
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Set Alternant Status for a specific date
function setAlternantDayStatus(alternantId, date, status) {
    if (!alternantCalendars[alternantId]) {
        alternantCalendars[alternantId] = {};
    }
    
    const dateKey = formatDateKey(date);
    alternantCalendars[alternantId][dateKey] = status;
    
    saveData('alternantCalendars');
    renderAlternantCalendar();
    updateAlternantsStats();
}

// Render Alternant Calendar
function renderAlternantCalendar() {
    const selectEl = document.getElementById('selectedAlternant');
    if (!selectEl) return;
    
    const alternantId = parseInt(selectEl.value);
    if (!alternantId) {
        document.getElementById('alternantCalendar').style.display = 'none';
        return;
    }
    
    selectedAlternantId = alternantId;
    const alternant = alternants.find(a => a.id === alternantId);
    if (!alternant) return;
    
    document.getElementById('alternantCalendar').style.display = 'block';
    
    // Update month display
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    document.getElementById('calendarMonth').textContent = 
        `${monthNames[currentCalendarMonth.getMonth()]} ${currentCalendarMonth.getFullYear()}`;
    
    // Generate calendar grid
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    let html = '';
    
    // Day headers
    const dayHeaders = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    dayHeaders.forEach(day => {
        html += `<div style="text-align: center; font-weight: 600; padding: 8px; color: #64748b;">${day}</div>`;
    });
    
    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div></div>';
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dateKey = formatDateKey(currentDate);
        const status = getAlternantStatusAtDate(alternant, currentDate);
        
        let bgColor = '#e5e7eb'; // default grey for weekend
        let textColor = '#64748b';
        let statusEmoji = '';
        
        if (status === 'entreprise') {
            bgColor = '#10b981';
            textColor = 'white';
            // statusEmoji = '🏢';
        } else if (status === 'ecole') {
            bgColor = '#3b82f6';
            textColor = 'white';
            // statusEmoji = '📚';
        } else if (status === 'conge') {
            bgColor = '#f59e0b';
            textColor = 'white';
            // statusEmoji = '🌴';
        } else if (status === 'absent') {
            bgColor = '#ef4444';
            textColor = 'white';
            // statusEmoji = '❌';
        }
        
        const isToday = new Date().toDateString() === currentDate.toDateString();
        const border = isToday ? 'border: 3px solid #f59e0b;' : '';
        
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const clickable = !isWeekend ? 'cursor: pointer;' : '';
        const onclickAttr = !isWeekend ? `onclick="handleCalendarDayClick(${alternant.id}, '${dateKey}', event)"` : '';
        
        html += `
            <div ${onclickAttr} style="
                aspect-ratio: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: ${bgColor};
                color: ${textColor};
                border-radius: 8px;
                font-weight: 600;
                ${border}
                ${clickable}
                position: relative;
                transition: transform 0.2s, box-shadow 0.2s;
            " ${!isWeekend ? 'onmouseenter="this.style.transform=\'scale(1.05)\'; this.style.boxShadow=\'0 4px 12px rgba(0,0,0,0.15)\';" onmouseleave="this.style.transform=\'scale(1)\'; this.style.boxShadow=\'none\';"' : ''}>
                <div style="font-size: 1.2rem;">${day}</div>
                ${statusEmoji ? `<div style="font-size: 0.8rem; margin-top: 2px;">${statusEmoji}</div>` : ''}
            </div>
        `;
    }
    
    document.getElementById('calendarGrid').innerHTML = html;
    
    // Render horaires
    renderAlternantHoraires(alternant);
}

// Open Period Modifier - Modify a range of days
function openPeriodModifier() {
    if (!selectedAlternantId) return;
    
    // Remove any existing menu
    const existingMenu = document.getElementById('periodModifierMenu');
    if (existingMenu) existingMenu.remove();
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'periodModifierMenu';
    modal.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        padding: 24px;
        max-width: 500px;
        width: 90%;
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'Modifier une période';
    title.style.cssText = 'margin: 0 0 20px 0; color: #1e293b; font-size: 20px;';
    content.appendChild(title);
    
    // Date début
    const startGroup = document.createElement('div');
    startGroup.style.cssText = 'margin-bottom: 16px;';
    const startLabel = document.createElement('label');
    startLabel.textContent = 'Date de début';
    startLabel.style.cssText = 'display: block; color: #1e293b; font-weight: 600; margin-bottom: 8px;';
    const startInput = document.createElement('input');
    startInput.type = 'date';
    startInput.id = 'periodStartDate';
    startInput.style.cssText = 'width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;';
    // Set default to current month's first day
    const firstDay = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), 1);
    startInput.value = formatDateKey(firstDay);
    startGroup.appendChild(startLabel);
    startGroup.appendChild(startInput);
    content.appendChild(startGroup);
    
    // Date fin
    const endGroup = document.createElement('div');
    endGroup.style.cssText = 'margin-bottom: 20px;';
    const endLabel = document.createElement('label');
    endLabel.textContent = 'Date de fin';
    endLabel.style.cssText = 'display: block; color: #1e293b; font-weight: 600; margin-bottom: 8px;';
    const endInput = document.createElement('input');
    endInput.type = 'date';
    endInput.id = 'periodEndDate';
    endInput.style.cssText = 'width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;';
    // Set default to current month's last day
    const lastDay = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 0);
    endInput.value = formatDateKey(lastDay);
    endGroup.appendChild(endLabel);
    endGroup.appendChild(endInput);
    content.appendChild(endGroup);
    
    // Status selector
    const statusGroup = document.createElement('div');
    statusGroup.style.cssText = 'margin-bottom: 20px;';
    const statusLabel = document.createElement('label');
    statusLabel.textContent = 'Statut à appliquer';
    statusLabel.style.cssText = 'display: block; color: #1e293b; font-weight: 600; margin-bottom: 12px;';
    statusGroup.appendChild(statusLabel);
    
    const statuses = [
        { value: 'entreprise', label: ' Entreprise', color: '#10b981' },
        { value: 'ecole', label: ' École/Cours', color: '#3b82f6' },
        { value: 'conge', label: ' Congé', color: '#f59e0b' },
        { value: 'absent', label: ' Absent', color: '#ef4444' }
    ];
    
    let selectedStatus = 'entreprise';
    
    statuses.forEach(status => {
        const option = document.createElement('div');
        option.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            border-radius: 8px;
            font-weight: 500;
            margin-bottom: 8px;
            border: 2px solid transparent;
            transition: all 0.2s;
        `;
        option.textContent = status.label;
        option.dataset.status = status.value;
        
        if (status.value === selectedStatus) {
            option.style.borderColor = status.color;
            option.style.background = status.color + '20';
        }
        
        option.onclick = () => {
            selectedStatus = status.value;
            // Update all options
            statusGroup.querySelectorAll('div[data-status]').forEach(opt => {
                const st = statuses.find(s => s.value === opt.dataset.status);
                if (opt.dataset.status === selectedStatus) {
                    opt.style.borderColor = st.color;
                    opt.style.background = st.color + '20';
                } else {
                    opt.style.borderColor = 'transparent';
                    opt.style.background = 'transparent';
                }
            });
        };
        
        statusGroup.appendChild(option);
    });
    
    content.appendChild(statusGroup);
    
    // Buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.cssText = 'display: flex; gap: 12px;';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Annuler';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.style.cssText = 'flex: 1;';
    cancelBtn.onclick = () => modal.remove();
    
    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Appliquer';
    applyBtn.className = 'btn btn-primary';
    applyBtn.style.cssText = 'flex: 1;';
    applyBtn.onclick = () => {
        const startDate = startInput.value;
        const endDate = endInput.value;
        
        if (!startDate || !endDate) {
            alert('Veuillez sélectionner les deux dates');
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            alert('La date de début doit être avant la date de fin');
            return;
        }
        
        applyStatusToPeriod(startDate, endDate, selectedStatus);
        modal.remove();
    };
    
    buttonsDiv.appendChild(cancelBtn);
    buttonsDiv.appendChild(applyBtn);
    content.appendChild(buttonsDiv);
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close on click outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

// Apply status to a period (date range)
function applyStatusToPeriod(startDateStr, endDateStr, status) {
    if (!selectedAlternantId) return;
    
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Initialize calendar for this alternant if not exists
    if (!alternantCalendars[selectedAlternantId]) {
        alternantCalendars[selectedAlternantId] = {};
    }
    
    // Apply status to all days in range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        
        // Skip weekends
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            const dateKey = formatDateKey(currentDate);
            alternantCalendars[selectedAlternantId][dateKey] = status;
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Save and re-render
    saveData('alternantCalendars');
    renderAlternantCalendar();
    updateAlternantsStats();
}

// Handle calendar day click
function handleCalendarDayClick(alternantId, dateKey, event) {
    event.stopPropagation();
    showStatusMenu(alternantId, dateKey, event);
}

// Show Status Selection Menu
function showStatusMenu(alternantId, dateKey, event) {
    event.stopPropagation();
    
    // Remove any existing menu
    const existingMenu = document.getElementById('statusMenu');
    if (existingMenu) existingMenu.remove();
    
    // Create menu
    const menu = document.createElement('div');
    menu.id = 'statusMenu';
    menu.style.cssText = `
        position: fixed;
        left: ${event.pageX}px;
        top: ${event.pageY}px;
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        padding: 8px;
        min-width: 180px;
    `;
    
    const statuses = [
        { value: 'entreprise', label: ' Entreprise', color: '#10b981' },
        { value: 'ecole', label: ' École/Cours', color: '#3b82f6' },
        { value: 'conge', label: ' Congé', color: '#f59e0b' },
        { value: 'absent', label: ' Absent', color: '#ef4444' }
    ];
    
    statuses.forEach(status => {
        const option = document.createElement('div');
        option.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            border-radius: 8px;
            font-weight: 500;
            margin-bottom: 4px;
            transition: background 0.2s;
        `;
        option.textContent = status.label;
        option.onmouseenter = () => option.style.background = status.color + '20';
        option.onmouseleave = () => option.style.background = 'transparent';
        option.onclick = () => {
            const date = new Date(dateKey);
            setAlternantDayStatus(alternantId, date, status.value);
            menu.remove();
        };
        menu.appendChild(option);
    });
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        });
    }, 0);
}

// Render Alternant Working Hours
function renderAlternantHoraires(alternant) {
    const horaireEl = document.getElementById('alternantHoraires');
    if (!horaireEl) return;
    
    horaireEl.innerHTML = `
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                <div>
                    <div style="font-weight: 600; margin-bottom: 8px;">⏰ Horaires de travail</div>
                    <div style="color: #64748b;">${alternant.workStart || '09:00'} - ${alternant.workEnd || '17:00'}</div>
                </div>
                <div>
                    <div style="font-weight: 600; margin-bottom: 8px;">☕ Pause déjeuner</div>
                    <div style="color: #64748b;">${alternant.lunchBreak || '12:00 - 13:00'}</div>
                </div>
                <div>
                    <div style="font-weight: 600; margin-bottom: 8px;">📅 Date de début</div>
                    <div style="color: #64748b;">${formatDate(alternant.startDate)}</div>
                </div>
                <div>
                    <div style="font-weight: 600; margin-bottom: 8px;">📅 Date de fin</div>
                    <div style="color: #64748b;">${formatDate(alternant.endDate)}</div>
                </div>
            </div>
            
            ${alternant.notes ? `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                    <div style="font-weight: 600; margin-bottom: 8px;">📝 Notes</div>
                    <div style="color: #64748b;">${alternant.notes}</div>
                </div>
            ` : ''}
        </div>
    `;
}

// Change Calendar Month
function changeMonth(direction) {
    currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + direction);
    renderAlternantCalendar();
}

// Add Alternant
function addAlternant(alternantData) {
    alternants.push({
        id: Date.now(),
        ...alternantData
    });
    saveData('alternants');
    renderAll();
}

// Edit Alternant
function editAlternant(id) {
    const alternant = alternants.find(a => a.id === id);
    if (alternant) {
        openModal('alternant', alternant);
    }
}

// Update Alternant
function updateAlternant(id, alternantData) {
    const index = alternants.findIndex(a => a.id === id);
    if (index !== -1) {
        alternants[index] = { ...alternants[index], ...alternantData };
        saveData('alternants');
        renderAll();
    }
}

// Delete Alternant
async function deleteAlternant(id) {
    const confirmed = await customConfirm(
        'Êtes-vous sûr de vouloir supprimer cet alternant ? Cette action est irréversible.',
        'Supprimer l\'alternant'
    );
    
    if (confirmed) {
        alternants = alternants.filter(a => a.id !== id);
        saveData('alternants');
        renderAll();
        customAlert('Alternant supprimé avec succès', 'success', 'Suppression confirmée');
    }
}

// ==================== UTILITIES ====================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Close modal on outside click
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});