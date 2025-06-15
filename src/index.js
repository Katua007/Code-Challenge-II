// DOM Elements
const guestForm = document.getElementById('guest-form');
const guestInput = document.getElementById('guest-input');
const guestList = document.getElementById('guest-list');
const guestCategory = document.getElementById('guest-category');

const MAX_GUESTS = 10;
let guests = [];

// Helper: create timestamp string
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
}

// Helper: render guest list
function renderGuests() {
  guestList.innerHTML = '';
  guests.forEach((guest, idx) => {
    const li = document.createElement('li');
    li.className = 'guest-item';

    // Guest info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'guest-info';

    // Name or editable input
    if (guest.isEditing) {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = guest.name;
      editInput.size = 15;
      editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveEdit(idx, editInput.value);
        }
      });
      infoDiv.appendChild(editInput);

      // Save on blur
      editInput.addEventListener('blur', () => saveEdit(idx, editInput.value));
      editInput.focus();
    } else {
      const span = document.createElement('span');
      span.textContent = guest.name;
      infoDiv.appendChild(span);
    }

    // Category tag
    const catSpan = document.createElement('span');
    catSpan.className = `category ${guest.category}`;
    catSpan.textContent = guest.category;
    infoDiv.appendChild(catSpan);

    // Timestamp
    const timeSpan = document.createElement('span');
    timeSpan.className = 'timestamp';
    timeSpan.textContent = guest.time;
    infoDiv.appendChild(timeSpan);

    li.appendChild(infoDiv);

    // RSVP Button
    const rsvpBtn = document.createElement('button');
    rsvpBtn.className = `rsvp ${guest.rsvp ? 'attending' : 'not-attending'}`;
    rsvpBtn.textContent = guest.rsvp ? 'Attending' : 'Not Attending';
    rsvpBtn.title = 'Toggle RSVP status';
    rsvpBtn.addEventListener('click', () => toggleRSVP(idx));
    li.appendChild(rsvpBtn);

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.title = 'Edit guest name';
    editBtn.addEventListener('click', () => startEdit(idx));
    li.appendChild(editBtn);

    // Remove Button
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'Remove';
    delBtn.title = 'Remove guest';
    delBtn.addEventListener('click', () => removeGuest(idx));
    li.appendChild(delBtn);

    guestList.appendChild(li);
  });
}

// Add guest
guestForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = guestInput.value.trim();
  const category = guestCategory.value;

  if (!name) return;
  if (guests.length >= MAX_GUESTS) {
    alert('Guest list limit reached (10 people max).');
    return;
  }

  guests.push({
    name,
    rsvp: false,
    category,
    time: getCurrentTime(),
    isEditing: false
  });
  guestInput.value = '';
  renderGuests();
});

// Remove guest
function removeGuest(idx) {
  guests.splice(idx, 1);
  renderGuests();
}

// Toggle RSVP
function toggleRSVP(idx) {
  guests[idx].rsvp = !guests[idx].rsvp;
  renderGuests();
}

// Edit guest
function startEdit(idx) {
  guests.forEach(g => g.isEditing = false); // Only one at a time
  guests[idx].isEditing = true;
  renderGuests();
}

function saveEdit(idx, newName) {
  guests[idx].name = newName.trim() || guests[idx].name;
  guests[idx].isEditing = false;
  renderGuests();
}

// Initial render
renderGuests();

