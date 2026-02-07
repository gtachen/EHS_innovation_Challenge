const API_URL = "https://beanstreet.me/items";
let user = "";
let cache = [];

function navigateTo(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'view-items') fetchListings();
}

function handleLogin() {
    user = document.getElementById('user-input').value;
    if (user) {
        document.getElementById('user-greeting').innerText = `Welcome, ${user}!`;
        navigateTo('dashboard');
    }
}

async function submitToApi() {
    const name = document.getElementById('name-input').value;
    const cost = document.getElementById('cost-input').value;
    const type = document.getElementById('type-input').value;

    if (!name || !cost) return alert("Fill all fields");

    const payload = {
        item_data: { seller_name: user, item_name: name, item_cost: parseInt(cost), rent_or_sell: type }
    };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert("Success!");
        navigateTo('view-items');
    }
}

async function fetchListings() {
    const res = await fetch(API_URL);
    cache = await res.json();
    render(cache);
}

function render(items) {
    const list = document.getElementById('items-list');
    list.innerHTML = items.map(entry => {
        const i = entry.item_data;
        return `
            <div class="card">
                <h4>${i.item_name}</h4>
                <p>$${i.item_cost} | ${i.rent_or_sell}</p>
                <small>Seller: ${i.seller_name}</small>
                ${i.seller_name === user ? `<button class="del-btn" onclick="deleteItem('${entry.id}')">Delete</button>` : ''}
            </div>
        `;
    }).join('');
}

async function deleteItem(id) {
    if (confirm("Delete this?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchListings();
    }
}

function filterListings() {
    const q = document.getElementById('search-bar').value.toLowerCase();
    const filtered = cache.filter(e => e.item_data.item_name.toLowerCase().includes(q));
    render(filtered);
}
