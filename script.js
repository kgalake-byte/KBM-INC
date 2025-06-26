// Sample data for the application
let users = [
    { id: 1, username: 'operator1', password: 'secure123', name: 'kgalake mabotja', role: 'operator' },
    { id: 2, username: 'supervisor1', password: 'secure123', name: 'Ben Mabotja', role: 'supervisor' }
];

let customers = [
    { id: 1, name: 'Acme Corporation', address: '123 Main St, Anytown', phone: '555-123-4567', email: 'contact@acme.com', alarmType: 'commercial', monitoringPlan: 'premium', notes: 'VIP client', active: true },
    { id: 2, name: 'Smith Residence', address: '456 Oak Ave, Somewhere', phone: '555-987-6543', email: 'john.smith@email.com', alarmType: 'residential', monitoringPlan: 'standard', notes: 'Frequent false alarms', active: true },
    { id: 3, name: 'Downtown Mall', address: '789 Center Blvd, Downtown', phone: '555-456-7890', email: 'security@downtownmall.com', alarmType: 'commercial', monitoringPlan: 'premium', notes: '24/7 monitoring required', active: true }
];

let alarms = [
    { id: 1, customerId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 5), type: 'burglar', zone: 'Front Door', priority: 'high', status: 'active', acknowledged: false, notes: 'Motion detected at front entrance' },
    { id: 2, customerId: 2, timestamp: new Date(Date.now() - 1000 * 60 * 15), type: 'fire', zone: 'Kitchen', priority: 'critical', status: 'active', acknowledged: false, notes: 'Smoke detector triggered' },
    { id: 3, customerId: 3, timestamp: new Date(Date.now() - 1000 * 60 * 60), type: 'panic', zone: 'Manager Office', priority: 'critical', status: 'active', acknowledged: true, notes: 'Panic button pressed' }
];

let responseUnits = [
    { id: 1, name: 'Alpha-1', type: 'armed', operator: 'Officer Johnson', status: 'available', location: 'HQ', assignedAlarm: null, notes: 'Primary response vehicle' },
    { id: 2, name: 'Bravo-2', type: 'patrol', operator: 'Officer Smith', status: 'available', location: 'North Sector', assignedAlarm: null, notes: 'Secondary patrol unit' },
    { id: 3, name: 'Charlie-3', type: 'armed', operator: 'Officer Williams', status: 'dispatched', location: 'En route to 123 Main St', assignedAlarm: 1, notes: 'Dispatched to Acme Corporation' }
];

let dispatchHistory = [
    { id: 1, alarmId: 1, unitId: 3, timestamp: new Date(Date.now() - 1000 * 60 * 10), status: 'en route', priority: 'high', notes: 'Burglar alarm activation' }
];

// Current user
let currentUser = null;

// DOM Elements
const loginContainer = document.getElementById('login-container');
const loginForm = document.getElementById('login-form');
const dashboard = document.getElementById('dashboard');
const currentTimeElement = document.getElementById('current-time');
const currentUserElement = document.getElementById('current-user');
const logoutBtn = document.getElementById('logout-btn');
const tabLinks = document.querySelectorAll('.sidebar li');
const tabContents = document.querySelectorAll('.tab-content');

// Alarm Monitor Elements
const alarmGrid = document.getElementById('alarm-grid');
const silenceAllBtn = document.getElementById('silence-all-btn');
const ackAllBtn = document.getElementById('ack-all-btn');

// Customer Management Elements
const customerTableBody = document.getElementById('customer-table-body');
const addCustomerBtn = document.getElementById('add-customer-btn');
const customerSearch = document.getElementById('customer-search');
const customerModal = document.getElementById('customer-modal');
const customerForm = document.getElementById('customer-form');
const saveCustomerBtn = document.getElementById('save-customer-btn');
const cancelCustomerBtn = document.getElementById('cancel-customer-btn');

// Dispatch Elements
const addUnitBtn = document.getElementById('add-unit-btn');
const dispatchHistoryBtn = document.getElementById('dispatch-history-btn');
const unitTableBody = document.getElementById('unit-table-body');
const unitModal = document.getElementById('unit-modal');
const unitForm = document.getElementById('unit-form');
const saveUnitBtn = document.getElementById('save-unit-btn');
const cancelUnitBtn = document.getElementById('cancel-unit-btn');

// Alarm Details Modal
const alarmDetailsModal = document.getElementById('alarm-details-modal');
const alarmModalTitle = document.getElementById('alarm-modal-title');
const alarmModalBody = document.getElementById('alarm-modal-body');
const dispatchUnitBtn = document.getElementById('dispatch-unit-btn');
const ackAlarmBtn = document.getElementById('ack-alarm-btn');
const falseAlarmBtn = document.getElementById('false-alarm-btn');

// Dispatch Modal
const dispatchModal = document.getElementById('dispatch-modal');
const dispatchAlarmId = document.getElementById('dispatch-alarm-id');
const dispatchCustomer = document.getElementById('dispatch-customer');
const dispatchAddress = document.getElementById('dispatch-address');
const dispatchUnitSelect = document.getElementById('dispatch-unit');
const dispatchPriority = document.getElementById('dispatch-priority');
const dispatchNotes = document.getElementById('dispatch-notes');
const confirmDispatchBtn = document.getElementById('confirm-dispatch-btn');
const cancelDispatchBtn = document.getElementById('cancel-dispatch-btn');

// Close modal buttons
const closeModalButtons = document.querySelectorAll('.close-modal');

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update time every second
    updateTime();
    setInterval(updateTime, 1000);

    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Tab switching
    tabLinks.forEach(link => {
        link.addEventListener('click', () => switchTab(link.dataset.tab));
    });
    
    // Alarm monitor
    silenceAllBtn.addEventListener('click', silenceAllAlarms);
    ackAllBtn.addEventListener('click', acknowledgeAllAlarms);
    
    // Customer management
    addCustomerBtn.addEventListener('click', () => openCustomerModal());
    customerSearch.addEventListener('input', filterCustomers);
    saveCustomerBtn.addEventListener('click', saveCustomer);
    cancelCustomerBtn.addEventListener('click', () => closeModal(customerModal));
    
    // Dispatch management
    addUnitBtn.addEventListener('click', () => openUnitModal());
    saveUnitBtn.addEventListener('click', saveUnit);
    cancelUnitBtn.addEventListener('click', () => closeModal(unitModal));
    
    // Alarm details
    dispatchUnitBtn.addEventListener('click', openDispatchModal);
    ackAlarmBtn.addEventListener('click', acknowledgeAlarm);
    falseAlarmBtn.addEventListener('click', markAsFalseAlarm);
    
    // Dispatch modal
    confirmDispatchBtn.addEventListener('click', confirmDispatch);
    cancelDispatchBtn.addEventListener('click', () => closeModal(dispatchModal));
    
    // Close modal buttons
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Initialize with login screen
    showLoginScreen();
});

// Show login screen
function showLoginScreen() {
    loginContainer.style.display = 'flex';
    dashboard.style.display = 'none';
    loginForm.reset();
}

// Show dashboard
function showDashboard() {
    loginContainer.style.display = 'none';
    dashboard.style.display = 'block';
    
    // Load data
    renderAlarms();
    renderCustomers();
    renderResponseUnits();
    
    // Activate first tab
    switchTab('alarm-monitor');
}

// Update current time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    currentTimeElement.textContent = `${dateString} ${timeString}`;
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        currentUserElement.textContent = user.name;
        showDashboard();
    } else {
        alert('Invalid username or password');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    showLoginScreen();
}

// Switch between tabs
function switchTab(tabId) {
    // Update active tab in sidebar
    tabLinks.forEach(link => {
        if (link.dataset.tab === tabId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Show corresponding content
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Render alarms in the alarm grid
function renderAlarms() {
    alarmGrid.innerHTML = '';
    
    // Sort alarms by priority (critical first) and then by time (newest first)
    const sortedAlarms = [...alarms].sort((a, b) => {
        const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.timestamp - a.timestamp;
    });
    
    sortedAlarms.forEach(alarm => {
        if (alarm.status === 'active') {
            const customer = customers.find(c => c.id === alarm.customerId);
            if (!customer) return;
            
            const alarmCard = document.createElement('div');
            alarmCard.className = `alarm-card ${alarm.priority}`;
            alarmCard.dataset.alarmId = alarm.id;
            
            const timeString = alarm.timestamp.toLocaleTimeString();
            const dateString = alarm.timestamp.toLocaleDateString();
            
            alarmCard.innerHTML = `
                <div class="alarm-card-header">
                    <span class="alarm-card-id">Alarm #${alarm.id}</span>
                    <span class="alarm-card-time">${dateString} ${timeString}</span>
                </div>
                <div class="alarm-card-customer">${customer.name}</div>
                <div class="alarm-card-address">${customer.address}</div>
                <div class="alarm-card-type">${alarm.type.toUpperCase()} - ${alarm.priority.toUpperCase()}</div>
                <div class="alarm-card-zone">Zone: ${alarm.zone}</div>
                <div class="alarm-card-notes">${alarm.notes}</div>
                <div class="alarm-card-actions">
                    <button class="btn btn-sm" data-action="view">View Details</button>
                    ${alarm.acknowledged ? '' : '<button class="btn btn-sm" data-action="ack">Acknowledge</button>'}
                </div>
            `;
            
            alarmCard.querySelector('[data-action="view"]').addEventListener('click', () => openAlarmDetails(alarm.id));
            if (!alarm.acknowledged) {
                alarmCard.querySelector('[data-action="ack"]').addEventListener('click', (e) => {
                    e.stopPropagation();
                    acknowledgeAlarm(alarm.id);
                });
            }
            
            alarmGrid.appendChild(alarmCard);
        }
    });
}

// Open alarm details modal
function openAlarmDetails(alarmId) {
    const alarm = alarms.find(a => a.id === alarmId);
    if (!alarm) return;
    
    const customer = customers.find(c => c.id === alarm.customerId);
    if (!customer) return;
    
    const timeString = alarm.timestamp.toLocaleTimeString();
    const dateString = alarm.timestamp.toLocaleDateString();
    
    alarmModalTitle.textContent = `Alarm #${alarm.id} Details`;
    
    alarmModalBody.innerHTML = `
        <div class="alarm-detail">
            <label>Customer:</label>
            <span>${customer.name}</span>
        </div>
        <div class="alarm-detail">
            <label>Address:</label>
            <span>${customer.address}</span>
        </div>
        <div class="alarm-detail">
            <label>Phone:</label>
            <span>${customer.phone}</span>
        </div>
        <div class="alarm-detail">
            <label>Time:</label>
            <span>${dateString} ${timeString}</span>
        </div>
        <div class="alarm-detail">
            <label>Type:</label>
            <span>${alarm.type}</span>
        </div>
        <div class="alarm-detail">
            <label>Zone:</label>
            <span>${alarm.zone}</span>
        </div>
        <div class="alarm-detail">
            <label>Priority:</label>
            <span class="priority-${alarm.priority}">${alarm.priority.toUpperCase()}</span>
        </div>
        <div class="alarm-detail">
            <label>Status:</label>
            <span>${alarm.status}</span>
        </div>
        <div class="alarm-detail">
            <label>Acknowledged:</label>
            <span>${alarm.acknowledged ? 'Yes' : 'No'}</span>
        </div>
        <div class="alarm-detail">
            <label>Notes:</label>
            <p>${alarm.notes}</p>
        </div>
    `;
    
    // Store current alarm ID in modal for reference
    alarmDetailsModal.dataset.alarmId = alarmId;
    
    // Update dispatch button based on whether a unit is already dispatched
    const isDispatched = responseUnits.some(unit => unit.assignedAlarm === alarmId);
    dispatchUnitBtn.disabled = isDispatched;
    dispatchUnitBtn.textContent = isDispatched ? 'Unit Dispatched' : 'Dispatch Unit';
    
    // Update acknowledge button
    ackAlarmBtn.disabled = alarm.acknowledged;
    ackAlarmBtn.textContent = alarm.acknowledged ? 'Acknowledged' : 'Acknowledge';
    
    openModal(alarmDetailsModal);
}

// Acknowledge a specific alarm
function acknowledgeAlarm(alarmId = null) {
    if (!alarmId) {
        alarmId = alarmDetailsModal.dataset.alarmId;
    }
    
    const alarmIndex = alarms.findIndex(a => a.id === parseInt(alarmId));
    if (alarmIndex !== -1) {
        alarms[alarmIndex].acknowledged = true;
        renderAlarms();
        
        if (alarmDetailsModal.style.display === 'flex') {
            ackAlarmBtn.disabled = true;
            ackAlarmBtn.textContent = 'Acknowledged';
        }
    }
}

// Mark alarm as false alarm
function markAsFalseAlarm() {
    const alarmId = alarmDetailsModal.dataset.alarmId;
    const alarmIndex = alarms.findIndex(a => a.id === parseInt(alarmId));
    
    if (alarmIndex !== -1) {
        alarms[alarmIndex].status = 'false alarm';
        renderAlarms();
        closeModal(alarmDetailsModal);
    }
}

// Acknowledge all alarms
function acknowledgeAllAlarms() {
    alarms.forEach(alarm => {
        if (alarm.status === 'active') {
            alarm.acknowledged = true;
        }
    });
    renderAlarms();
}

// Silence all alarms (for demo purposes)
function silenceAllAlarms() {
    // In a real system, this would send a command to the alarm panels
    alert('Silence command sent to all active alarms');
}

// Render customers in the table
function renderCustomers() {
    customerTableBody.innerHTML = '';
    
    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.address}</td>
            <td>${customer.phone}</td>
            <td>${customer.alarmType}</td>
            <td>
                <button class="action-btn edit-customer" data-id="${customer.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete delete-customer" data-id="${customer.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        row.querySelector('.edit-customer').addEventListener('click', () => openCustomerModal(customer.id));
        row.querySelector('.delete-customer').addEventListener('click', () => deleteCustomer(customer.id));
        
        customerTableBody.appendChild(row);
    });
}

// Filter customers based on search input
function filterCustomers() {
    const searchTerm = customerSearch.value.toLowerCase();
    const rows = customerTableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const address = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const phone = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || address.includes(searchTerm) || phone.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Open customer modal for adding/editing
function openCustomerModal(customerId = null) {
    customerForm.reset();
    
    if (customerId) {
        // Editing existing customer
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
            document.getElementById('customer-modal-title').textContent = 'Edit Customer';
            document.getElementById('customer-id').value = customer.id;
            document.getElementById('customer-name').value = customer.name;
            document.getElementById('customer-phone').value = customer.phone;
            document.getElementById('customer-address').value = customer.address;
            document.getElementById('customer-email').value = customer.email;
            document.getElementById('customer-alarm-type').value = customer.alarmType;
            document.getElementById('customer-monitoring-plan').value = customer.monitoringPlan;
            document.getElementById('customer-notes').value = customer.notes || '';
            document.getElementById('customer-active').checked = customer.active;
        }
    } else {
        // Adding new customer
        document.getElementById('customer-modal-title').textContent = 'Add New Customer';
        document.getElementById('customer-id').value = '';
        document.getElementById('customer-active').checked = true;
    }
    
    openModal(customerModal);
}

// Save customer (add new or update existing)
function saveCustomer() {
    const id = document.getElementById('customer-id').value;
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const email = document.getElementById('customer-email').value;
    const alarmType = document.getElementById('customer-alarm-type').value;
    const monitoringPlan = document.getElementById('customer-monitoring-plan').value;
    const notes = document.getElementById('customer-notes').value;
    const active = document.getElementById('customer-active').checked;
    
    if (!name || !phone || !address || !alarmType || !monitoringPlan) {
        alert('Please fill in all required fields');
        return;
    }
    
    const customerData = {
        id: id ? parseInt(id) : Math.max(...customers.map(c => c.id), 0) + 1,
        name,
        phone,
        address,
        email,
        alarmType,
        monitoringPlan,
        notes,
        active
    };
    
    if (id) {
        // Update existing customer
        const index = customers.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            customers[index] = customerData;
        }
    } else {
        // Add new customer
        customers.push(customerData);
    }
    
    renderCustomers();
    closeModal(customerModal);
}

// Delete customer
function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer?')) {
        customers = customers.filter(c => c.id !== customerId);
        renderCustomers();
    }
}

// Render response units in the table
function renderResponseUnits() {
    unitTableBody.innerHTML = '';
    
    responseUnits.forEach(unit => {
        const row = document.createElement('tr');
        
        // Get assigned alarm details if any
        let assignedTo = '';
        if (unit.assignedAlarm) {
            const alarm = alarms.find(a => a.id === unit.assignedAlarm);
            if (alarm) {
                const customer = customers.find(c => c.id === alarm.customerId);
                if (customer) {
                    assignedTo = `Alarm #${alarm.id} - ${customer.name}`;
                }
            }
        }
        
        row.innerHTML = `
            <td>${unit.name}</td>
            <td class="unit-status-${unit.status}">${unit.status}</td>
            <td>${unit.location}</td>
            <td>${assignedTo}</td>
            <td>
                <button class="action-btn edit-unit" data-id="${unit.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn dispatch-unit" data-id="${unit.id}"><i class="fas fa-car"></i></button>
            </td>
        `;
        
        row.querySelector('.edit-unit').addEventListener('click', () => openUnitModal(unit.id));
        row.querySelector('.dispatch-unit').addEventListener('click', () => dispatchUnit(unit.id));
        
        unitTableBody.appendChild(row);
    });
}

// Open unit modal for adding/editing
function openUnitModal(unitId = null) {
    unitForm.reset();
    
    if (unitId) {
        // Editing existing unit
        const unit = responseUnits.find(u => u.id === unitId);
        if (unit) {
            document.getElementById('unit-modal-title').textContent = 'Edit Response Unit';
            document.getElementById('unit-id').value = unit.id;
            document.getElementById('unit-name').value = unit.name;
            document.getElementById('unit-type').value = unit.type;
            document.getElementById('unit-operator').value = unit.operator;
            document.getElementById('unit-status').value = unit.status;
            document.getElementById('unit-notes').value = unit.notes || '';
        }
    } else {
        // Adding new unit
        document.getElementById('unit-modal-title').textContent = 'Add Response Unit';
        document.getElementById('unit-id').value = '';
    }
    
    openModal(unitModal);
}

// Save unit (add new or update existing)
function saveUnit() {
    const id = document.getElementById('unit-id').value;
    const name = document.getElementById('unit-name').value;
    const type = document.getElementById('unit-type').value;
    const operator = document.getElementById('unit-operator').value;
    const status = document.getElementById('unit-status').value;
    const notes = document.getElementById('unit-notes').value;
    
    if (!name || !type || !operator || !status) {
        alert('Please fill in all required fields');
        return;
    }
    
    const unitData = {
        id: id ? parseInt(id) : Math.max(...responseUnits.map(u => u.id), 0) + 1,
        name,
        type,
        operator,
        status,
        location: 'HQ', // Default location
        assignedAlarm: null, // Not assigned by default
        notes
    };
    
    if (id) {
        // Update existing unit - preserve location and assigned alarm
        const existingUnit = responseUnits.find(u => u.id === parseInt(id));
        if (existingUnit) {
            unitData.location = existingUnit.location;
            unitData.assignedAlarm = existingUnit.assignedAlarm;
            
            const index = responseUnits.findIndex(u => u.id === parseInt(id));
            if (index !== -1) {
                responseUnits[index] = unitData;
            }
        }
    } else {
        // Add new unit
        responseUnits.push(unitData);
    }
    
    renderResponseUnits();
    closeModal(unitModal);
}

// Open dispatch modal for a specific alarm
function openDispatchModal() {
    const alarmId = alarmDetailsModal.dataset.alarmId;
    const alarm = alarms.find(a => a.id === parseInt(alarmId));
    if (!alarm) return;
    
    const customer = customers.find(c => c.id === alarm.customerId);
    if (!customer) return;
    
    // Populate dispatch modal
    dispatchAlarmId.value = alarm.id;
    dispatchCustomer.value = customer.name;
    dispatchAddress.value = customer.address;
    
    // Populate available units dropdown
    dispatchUnitSelect.innerHTML = '';
    const availableUnits = responseUnits.filter(unit => unit.status === 'available');
    
    if (availableUnits.length === 0) {
        dispatchUnitSelect.innerHTML = '<option value="">No available units</option>';
        dispatchUnitSelect.disabled = true;
    } else {
        availableUnits.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit.id;
            option.textContent = `${unit.name} (${unit.type}) - ${unit.operator}`;
            dispatchUnitSelect.appendChild(option);
        });
        dispatchUnitSelect.disabled = false;
    }
    
    // Set priority based on alarm priority
    dispatchPriority.value = alarm.priority === 'critical' ? 'high' : alarm.priority;
    
    // Close alarm details modal and open dispatch modal
    closeModal(alarmDetailsModal);
    openModal(dispatchModal);
}

// Dispatch a specific unit (from unit table)
function dispatchUnit(unitId) {
    const unit = responseUnits.find(u => u.id === unitId);
    if (!unit) return;
    
    // For demo purposes, we'll just show a prompt to select an alarm
    const alarmOptions = alarms
        .filter(a => a.status === 'active')
        .map(a => {
            const customer = customers.find(c => c.id === a.customerId);
            return {
                id: a.id,
                text: `Alarm #${a.id} - ${customer?.name || 'Unknown'} (${a.type})`
            };
        });
    
    if (alarmOptions.length === 0) {
        alert('No active alarms to dispatch to');
        return;
    }
    
    const alarmId = prompt(`Select alarm to dispatch ${unit.name} to:\n${
        alarmOptions.map(a => `${a.id}: ${a.text}`).join('\n')
    }\nEnter alarm ID:`);
    
    if (!alarmId) return;
    
    const selectedAlarm = alarms.find(a => a.id === parseInt(alarmId));
    if (!selectedAlarm) {
        alert('Invalid alarm ID');
        return;
    }
    
    // Update unit status
    unit.status = 'dispatched';
    unit.assignedAlarm = selectedAlarm.id;
    unit.location = 'En route';
    
    // Add to dispatch history
    const customer = customers.find(c => c.id === selectedAlarm.customerId);
    dispatchHistory.push({
        id: Math.max(...dispatchHistory.map(d => d.id), 0) + 1,
        alarmId: selectedAlarm.id,
        unitId: unit.id,
        timestamp: new Date(),
        status: 'dispatched',
        priority: selectedAlarm.priority,
        notes: `Dispatched to ${customer?.name || 'Unknown'} for ${selectedAlarm.type} alarm`
    });
    
    renderResponseUnits();
    alert(`Unit ${unit.name} dispatched to Alarm #${selectedAlarm.id}`);
}

// Confirm dispatch from dispatch modal
function confirmDispatch() {
    const alarmId = parseInt(dispatchAlarmId.value);
    const unitId = parseInt(dispatchUnitSelect.value);
    const priority = dispatchPriority.value;
    const notes = dispatchNotes.value;
    
    if (!alarmId || !unitId) {
        alert('Please select a response unit');
        return;
    }
    
    const alarm = alarms.find(a => a.id === alarmId);
    const unit = responseUnits.find(u => u.id === unitId);
    const customer = customers.find(c => c.id === alarm.customerId);
    
    if (!alarm || !unit || !customer) {
        alert('Invalid alarm or unit');
        return;
    }
    
    // Update unit status
    unit.status = 'dispatched';
    unit.assignedAlarm = alarm.id;
    unit.location = `En route to ${customer.address}`;
    
    // Add to dispatch history
    dispatchHistory.push({
        id: Math.max(...dispatchHistory.map(d => d.id), 0) + 1,
        alarmId: alarm.id,
        unitId: unit.id,
        timestamp: new Date(),
        status: 'dispatched',
        priority: priority,
        notes: notes || `Dispatched to ${customer.name} for ${alarm.type} alarm`
    });
    
    // Acknowledge the alarm
    alarm.acknowledged = true;
    
    renderAlarms();
    renderResponseUnits();
    closeModal(dispatchModal);
    alert(`Unit ${unit.name} dispatched to ${customer.name}`);
}

// Open modal
function openModal(modal) {
    modal.style.display = 'flex';
}

// Close modal
function closeModal(modal) {
    modal.style.display = 'none';
}

// Generate sample alarms for demo purposes
function generateSampleAlarm() {
    if (customers.length === 0) return;
    
    const alarmTypes = ['burglar', 'fire', 'panic', 'medical', 'duress'];
    const zones = ['Front Door', 'Back Door', 'Living Room', 'Bedroom', 'Kitchen', 'Office', 'Garage'];
    const priorities = ['low', 'medium', 'high', 'critical'];
    
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomType = alarmTypes[Math.floor(Math.random() * alarmTypes.length)];
    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    
    const newAlarm = {
        id: Math.max(...alarms.map(a => a.id), 0) + 1,
        customerId: randomCustomer.id,
        timestamp: new Date(),
        type: randomType,
        zone: randomZone,
        priority: randomPriority,
        status: 'active',
        acknowledged: false,
        notes: `Auto-generated ${randomType} alarm at ${randomZone}`
    };
    
    alarms.push(newAlarm);
    renderAlarms();
    
    // Play alarm sound if not already playing
    if (!document.getElementById('alarm-sound')) {
        const audio = document.createElement('audio');
        audio.id = 'alarm-sound';
        audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3';
        audio.loop = true;
        document.body.appendChild(audio);
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

// For demo purposes - generate a sample alarm every 30-60 seconds
setInterval(() => {
    if (Math.random() > 0.7 && currentUser) { // 30% chance
        generateSampleAlarm();
    }
}, 30000);

// Also generate one immediately when dashboard loads (for demo)
window.addEventListener('load', () => {
    setTimeout(generateSampleAlarm, 2000);
});