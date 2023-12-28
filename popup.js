const noteTextarea = document.getElementById('note-content');
const saveButton = document.getElementById('save-button');
const clearButton = document.getElementById('clear-button');
const noteList = document.getElementById('note-list');
const messageElement = document.getElementById('message');
const characterCountElement = document.getElementById('character-count');
const modeSwitchButton = document.getElementById('mode-switch');
let isDarkMode = false;

function saveNoteSync(noteText) {
  displayMessage('Saving note...');
  chrome.storage.sync.get({ notes: [] }, function(result) {
    const notes = [...result.notes, noteText];
    chrome.storage.sync.set({ notes }, function() {
      updateUIAfterSave(noteText);
      displayMessage('Note saved successfully.');
    });
  });
}

function updateUIAfterSave(noteText) {
  const noteElement = document.createElement('div');
  noteElement.textContent = noteText;
  noteList.appendChild(noteElement);
  noteTextarea.value = '';
  updateCharacterCount();
}

function retrieveNotesSync() {
  displayMessage('Retrieving notes...');
  chrome.storage.sync.get({ notes: [] }, function(result) {
    const notes = result.notes || [];
    notes.forEach(note => {
      const noteElement = document.createElement('div');
      noteElement.textContent = note;
      noteList.appendChild(noteElement);
    });
    displayMessage('Notes retrieved successfully.');
  });
}

function clearNotes() {
  chrome.storage.sync.set({ notes: [] }, function() {
    noteList.innerHTML = '';
    displayMessage('Notes cleared successfully.');
  });
}

function updateCharacterCount() {
  const characterCount = noteTextarea.value.length;
  characterCountElement.textContent = `${characterCount} characters`;
}

function displayMessage(message) {
  messageElement.textContent = message;
  characterCountElement.textContent = '';
  setTimeout(() => {
    messageElement.textContent = '';
  }, 3000);
}

function toggleMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  document.querySelector('.container').classList.toggle('dark-mode-container', isDarkMode);
  modeSwitchButton.textContent = isDarkMode ? '' : '';
}

saveButton.addEventListener('click', () => {
  const noteText = noteTextarea.value;
  if (noteText) {
    saveNoteSync(noteText);
  }
});

clearButton.addEventListener('click', () => {
  clearNotes();
});

noteTextarea.addEventListener('input', () => {
  updateCharacterCount();
});

modeSwitchButton.addEventListener('click', () => {
  toggleMode();
});

retrieveNotesSync();
