const API_BASE = '/api';

// State
let customers = [];
let allTags = [];

// DOM Elements
const customersList = document.getElementById('customersList');
const searchInput = document.getElementById('searchInput');
const platformFilter = document.getElementById('platformFilter');
const sellerFilter = document.getElementById('sellerFilter');
const minOrdersFilter = document.getElementById('minOrdersFilter');
const tagFilter = document.getElementById('tagFilter');
const applyFiltersBtn = document.getElementById('applyFilters');
const clearFiltersBtn = document.getElementById('clearFilters');
const addCustomerBtn = document.getElementById('addCustomerBtn');
const addOrderBtn = document.getElementById('addOrderBtn');

// Modals
const customerModal = document.getElementById('customerModal');
const orderModal = document.getElementById('orderModal');
const detailsModal = document.getElementById('detailsModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
    loadTags();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    applyFiltersBtn.addEventListener('click', loadCustomers);
    clearFiltersBtn.addEventListener('click', clearFilters);
    addCustomerBtn.addEventListener('click', () => openCustomerModal());
    addOrderBtn.addEventListener('click', () => openOrderModal());

    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Forms
    document.getElementById('customerForm').addEventListener('submit', handleCustomerSubmit);
    document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);
}

// API Calls
async function loadCustomers() {
    try {
        const params = new URLSearchParams();

        if (searchInput.value) params.append('search', searchInput.value);
        if (platformFilter.value) params.append('platform', platformFilter.value);
        if (sellerFilter.checked) params.append('is_seller', 'true');
        if (minOrdersFilter.value) params.append('min_orders', minOrdersFilter.value);
        if (tagFilter.value) params.append('tag', tagFilter.value);

        const response = await fetch(`${API_BASE}/customers?${params}`);
        customers = await response.json();
        renderCustomers();
    } catch (error) {
        console.error('Failed to load customers:', error);
        customersList.innerHTML = '<div class="empty-state">Failed to load customers</div>';
    }
}

async function loadTags() {
    try {
        const response = await fetch(`${API_BASE}/tags`);
        allTags = await response.json();
        renderTagFilter();
    } catch (error) {
        console.error('Failed to load tags:', error);
    }
}

async function loadCustomerDetails(id) {
    try {
        const response = await fetch(`${API_BASE}/customers/${id}`);
        const customer = await response.json();
        renderCustomerDetails(customer);
        detailsModal.style.display = 'block';
    } catch (error) {
        console.error('Failed to load customer details:', error);
    }
}

async function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
        await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
        loadCustomers();
    } catch (error) {
        console.error('Failed to delete customer:', error);
        alert('Failed to delete customer');
    }
}

// Render Functions
function renderCustomers() {
    if (customers.length === 0) {
        customersList.innerHTML = '<div class="empty-state">No customers found. Add your first customer to get started!</div>';
        return;
    }

    customersList.innerHTML = customers.map(customer => `
        <div class="customer-card">
            <div class="customer-header">
                <div class="customer-name">${customer.name}</div>
                <div class="customer-badges">
                    <span class="badge badge-platform">${customer.platform}</span>
                    ${customer.is_seller ? '<span class="badge badge-seller">Seller</span>' : ''}
                </div>
            </div>
            <div class="customer-info">
                ${customer.email ? `<p>Email: ${customer.email}</p>` : ''}
                ${customer.phone ? `<p>Phone: ${customer.phone}</p>` : ''}
            </div>
            <div class="customer-stats">
                <div class="stat-box">
                    <div class="stat-value">${customer.total_orders}</div>
                    <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">$${customer.total_spent.toFixed(2)}</div>
                    <div class="stat-label">Total Spent</div>
                </div>
                ${customer.last_purchase_date ? `
                    <div class="stat-box">
                        <div class="stat-value">${formatDate(customer.last_purchase_date)}</div>
                        <div class="stat-label">Last Purchase</div>
                    </div>
                ` : ''}
            </div>
            <div class="customer-actions">
                <button class="btn btn-info" onclick="loadCustomerDetails(${customer.id})">View Details</button>
                <button class="btn btn-danger" onclick="deleteCustomer(${customer.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderTagFilter() {
    tagFilter.innerHTML = '<option value="">All Tags</option>';
    allTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

function renderCustomerDetails(customer) {
    document.getElementById('customerDetails').innerHTML = `
        <div class="details-header">
            <h2>${customer.name}</h2>
            <div class="customer-badges">
                <span class="badge badge-platform">${customer.platform}</span>
                ${customer.is_seller ? '<span class="badge badge-seller">Seller</span>' : ''}
            </div>
            <div class="customer-info" style="margin-top: 15px;">
                ${customer.email ? `<p>Email: ${customer.email}</p>` : ''}
                ${customer.phone ? `<p>Phone: ${customer.phone}</p>` : ''}
            </div>
        </div>

        <div class="details-section">
            <h3>Order History (${customer.orders.length})</h3>
            ${customer.orders.length > 0 ? customer.orders.map(order => `
                <div class="order-item">
                    <div><strong>${order.platform}</strong> - ${formatDate(order.order_date)}</div>
                    ${order.order_number ? `<div>Order #${order.order_number}</div>` : ''}
                    <div>Items: ${order.items}</div>
                    <div><strong>Amount: $${order.total_amount.toFixed(2)}</strong></div>
                    ${order.notes ? `<div style="margin-top: 10px; font-style: italic;">${order.notes}</div>` : ''}
                </div>
            `).join('') : '<p>No orders yet</p>'}
        </div>

        <div class="details-section">
            <h3>Notes & Feedback</h3>
            <button class="btn btn-primary" onclick="addNote(${customer.id}, 'satisfaction')">Add Satisfaction Note</button>
            <button class="btn btn-primary" onclick="addNote(${customer.id}, 'deal')">Add Deal/Promotion</button>
            <button class="btn btn-primary" onclick="addNote(${customer.id}, 'general')">Add General Note</button>
            <div style="margin-top: 15px;">
                ${customer.notes.length > 0 ? customer.notes.map(note => `
                    <div class="note-item">
                        <div class="note-type">${note.note_type}</div>
                        <div>${note.content}</div>
                        <div style="font-size: 12px; color: #718096; margin-top: 5px;">${formatDate(note.created_at)}</div>
                    </div>
                `).join('') : '<p>No notes yet</p>'}
            </div>
        </div>

        <div class="details-section">
            <h3>Tags</h3>
            <button class="btn btn-primary" onclick="addTag(${customer.id})">Add Tag</button>
            <div class="tags-container" style="margin-top: 10px;">
                ${customer.tags.length > 0 ? customer.tags.map(tag =>
                    `<span class="tag">${tag}</span>`
                ).join('') : '<p>No tags yet</p>'}
            </div>
        </div>
    `;
}

// Modal Functions
function openCustomerModal() {
    document.getElementById('customerForm').reset();
    document.getElementById('customerModalTitle').textContent = 'Add Customer';
    customerModal.style.display = 'block';
}

async function openOrderModal() {
    // Load customers for dropdown
    const response = await fetch(`${API_BASE}/customers`);
    const allCustomers = await response.json();

    const select = document.getElementById('orderCustomer');
    select.innerHTML = '<option value="">Select a customer...</option>';
    allCustomers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = customer.name;
        select.appendChild(option);
    });

    document.getElementById('orderForm').reset();
    document.getElementById('orderDate').valueAsDate = new Date();
    orderModal.style.display = 'block';
}

function closeAllModals() {
    customerModal.style.display = 'none';
    orderModal.style.display = 'none';
    detailsModal.style.display = 'none';
}

// Form Handlers
async function handleCustomerSubmit(e) {
    e.preventDefault();

    const customer = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value || null,
        phone: document.getElementById('customerPhone').value || null,
        platform: document.getElementById('customerPlatform').value,
        is_seller: document.getElementById('customerIsSeller').checked,
        total_orders: 0,
        total_spent: 0,
    };

    try {
        await fetch(`${API_BASE}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer),
        });

        closeAllModals();
        loadCustomers();
    } catch (error) {
        console.error('Failed to create customer:', error);
        alert('Failed to create customer');
    }
}

async function handleOrderSubmit(e) {
    e.preventDefault();

    const order = {
        customer_id: parseInt(document.getElementById('orderCustomer').value),
        order_number: document.getElementById('orderNumber').value || null,
        platform: document.getElementById('orderPlatform').value,
        order_date: document.getElementById('orderDate').value,
        items: document.getElementById('orderItems').value,
        total_amount: parseFloat(document.getElementById('orderAmount').value),
        notes: document.getElementById('orderNotes').value || null,
    };

    try {
        await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });

        closeAllModals();
        loadCustomers();
    } catch (error) {
        console.error('Failed to create order:', error);
        alert('Failed to create order');
    }
}

async function addNote(customerId, noteType) {
    const content = prompt(`Enter ${noteType} note:`);
    if (!content) return;

    try {
        await fetch(`${API_BASE}/customers/${customerId}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note_type: noteType, content }),
        });

        loadCustomerDetails(customerId);
    } catch (error) {
        console.error('Failed to add note:', error);
        alert('Failed to add note');
    }
}

async function addTag(customerId) {
    const tag = prompt('Enter tag:');
    if (!tag) return;

    try {
        await fetch(`${API_BASE}/customers/${customerId}/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag }),
        });

        loadCustomerDetails(customerId);
        loadTags();
    } catch (error) {
        console.error('Failed to add tag:', error);
        alert('Failed to add tag');
    }
}

// Utility Functions
function clearFilters() {
    searchInput.value = '';
    platformFilter.value = '';
    sellerFilter.checked = false;
    minOrdersFilter.value = '';
    tagFilter.value = '';
    loadCustomers();
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
