// Mock Airbnb listings data
const listings = [
    { id: 1, title: 'Cozy Beach House', location: 'Goa, India', price: 2500, rating: 4.8, reviews: 124, type: 'house', bedrooms: 2, beds: 3, baths: 1, guests: 4, image: '🏖️', images: ['🏖️', '🏠', '🛏️'], desc: 'Relax in this beautiful beachfront home with stunning ocean views and direct beach access.' },
    { id: 2, title: 'Modern Apartment', location: 'Mumbai, India', price: 1800, rating: 4.9, reviews: 89, type: 'apartment', bedrooms: 1, beds: 2, baths: 1, guests: 2, image: '🏢', images: ['🏢', '🛋️', '🍳'], desc: 'Stylish apartment in the heart of the city, perfect for business travelers.' },
    { id: 3, title: 'Private Room in Villa', location: 'Jaipur, India', price: 1200, rating: 4.7, reviews: 203, type: 'room', bedrooms: 1, beds: 1, baths: 1, guests: 1, image: '🏛️', images: ['🏛️', '🛏️'], desc: 'Charming private room in a traditional Rajasthani villa.' },
    { id: 4, title: 'Luxury Villa', location: 'Bangalore, India', price: 4500, rating: 4.95, reviews: 67, type: 'house', bedrooms: 4, beds: 6, baths: 3, guests: 8, image: '🏰', images: ['🏰', '🏊', '🌳'], desc: 'Spacious luxury villa with pool and garden, perfect for family vacations.' },
    { id: 5, title: 'City Studio', location: 'Delhi, India', price: 1500, rating: 4.6, reviews: 156, type: 'apartment', bedrooms: 0, beds: 1, baths: 1, guests: 2, image: '🏙️', images: ['🏙️', '🛋️'], desc: 'Compact studio apartment in a vibrant neighborhood.' }
];

// State
let filteredListings = [...listings];
let sortByPrice = false;
let filters = {
    priceMin: 50,
    priceMax: 300,
    types: [],
    bedrooms: false,
    beds: false
};

// DOM elements
const listingsGrid = document.getElementById('listingsGrid');
const listingCount = document.getElementById('listingCount');
const modal = document.getElementById('propertyModal');
let selectedListing = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderListings();
    initFilters();
    updatePriceSliders();
});

function renderListings() {
    listingsGrid.innerHTML = filteredListings.map(listing => `
        <div class="property-card" onclick="openModal(${listing.id})">
            <div class="property-image">${listing.image}</div>
            <div class="property-info">
                <div class="property-badge">${listing.type}</div>
                <h3 class="property-title">${listing.title}</h3>
                <div class="property-location">${listing.location}</div>
                <div class="property-details">
                    <span>${listing.beds} beds</span>
                    <span>${listing.baths} bath</span>
                    <span>${listing.guests} guests</span>
                </div>
                <div class="property-price">₹${listing.price.toLocaleString()} night</div>
            </div>
        </div>
    `).join('');
    
    listingCount.textContent = `${filteredListings.length} stays`;
}

function applyFilters() {
    filteredListings = listings.filter(listing => {
        // Price filter
        if (listing.price < filters.priceMin || listing.price > filters.priceMax) return false;
        
        // Type filter
        if (filters.types.length > 0 && !filters.types.includes(listing.type)) return false;
        
        // Bedrooms filter
        if (filters.bedrooms && listing.bedrooms < 2) return false;
        
        // Beds filter
        if (filters.beds && listing.beds < 3) return false;
        
        return true;
    });
    
    // Sort by price
    if (sortByPrice) {
        filteredListings.sort((a, b) => a.price - b.price);
    }
    
    renderListings();
}

function initFilters() {
    // Price sliders
    document.getElementById('priceMin').addEventListener('input', (e) => {
        filters.priceMin = parseInt(e.target.value);
        updatePriceSliders();
        applyFilters();
    });
    
    document.getElementById('priceMax').addEventListener('input', (e) => {
        filters.priceMax = parseInt(e.target.value);
        updatePriceSliders();
        applyFilters();
    });
    
    // Type checkboxes
    document.querySelectorAll('input[data-filter^="type"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const type = e.target.dataset.filter.replace('type-', '');
            if (e.target.checked) {
                filters.types.push(type);
            } else {
                filters.types = filters.types.filter(t => t !== type);
            }
            applyFilters();
        });
    });
    
    // Bedroom/Bed checkboxes
    document.querySelectorAll('input[data-filter^="bedrooms"], input[data-filter^="beds"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const filterKey = e.target.dataset.filter;
            filters[filterKey] = e.target.checked;
            applyFilters();
        });
    });
}

function updatePriceSliders() {
    document.getElementById('priceMinVal').textContent = `₹${filters.priceMin}`;
    document.getElementById('priceMaxVal').textContent = `₹${filters.priceMax}`;
}

function toggleSort() {
    sortByPrice = !sortByPrice;
    applyFilters();
}

function clearFilters() {
    filters = { priceMin: 50, priceMax: 300, types: [], bedrooms: false, beds: false };
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('priceMin').value = 50;
    document.getElementById('priceMax').value = 300;
    updatePriceSliders();
    filteredListings = [...listings];
    renderListings();
}

// Modal functions
function openModal(id) {
    selectedListing = listings.find(l => l.id === id);
    if (!selectedListing) return;
    
    document.getElementById('modalMainImage').textContent = selectedListing.image;
    document.getElementById('modalTitle').textContent = selectedListing.title;
    document.getElementById('modalRating').textContent = selectedListing.rating;
    document.getElementById('modalRooms').textContent = `${selectedListing.beds} beds`;
    document.getElementById('modalBathrooms').textContent = `${selectedListing.baths} bath`;
    document.getElementById('modalGuests').textContent = `${selectedListing.guests} guests`;
    document.getElementById('modalDescription').textContent = selectedListing.desc;
    document.getElementById('modalPrice').textContent = `₹${selectedListing.price.toLocaleString()}`;
    document.getElementById('modalTotal').textContent = `₹${(selectedListing.price * 3).toLocaleString()} total`;
    
    document.getElementById('modalThumbnails').innerHTML = selectedListing.images.map(img => 
        `<div class="thumbnail">${img}</div>`
    ).join('');
    
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}
// Debounce filter updates
