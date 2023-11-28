// Retrieve the textarea and buttons
const noteTextarea = document.getElementById('note-content');
const saveButton = document.getElementById('save-button');
const clearButton = document.getElementById('clear-button');
const noteList = document.getElementById('note-list');
const messageElement = document.getElementById('message');

// Function to save a note to sync storage
function saveNoteSync(noteText) {
  // Display a message indicating that the note is being saved
  displayMessage('Saving note...');

  chrome.storage.sync.get(['notes'], function(result) {
    let notes = result.notes || [];
    notes.push(noteText);
    chrome.storage.sync.set({ notes: notes }, function() {
      // After saving, update the UI to display the saved note
      const noteElement = document.createElement('div');
      noteElement.textContent = noteText;
      noteList.appendChild(noteElement);
      noteTextarea.value = '';

      // Display a success message
      displayMessage('Note saved successfully.');
    });
  });
}

// Function to retrieve notes from sync storage
function retrieveNotesSync() {
  // Display a message indicating that notes are being retrieved
  displayMessage('Retrieving notes...');

  chrome.storage.sync.get(['notes'], function(result) {
    let notes = result.notes || [];
    // Display notes in the UI
    for (let note of notes) {
      const noteElement = document.createElement('div');
      noteElement.textContent = note;
      noteList.appendChild(noteElement);
    }

    // Display a success message
    displayMessage('Notes retrieved successfully.');
  });
}

// Function to clear notes
function clearNotes() {
  chrome.storage.sync.set({ notes: [] }, function() {
    // After clearing, update the UI to remove all notes
    noteList.innerHTML = '';
 
    // Display a success message
    displayMessage('Notes cleared successfully.');
  });
}

// Function to display messages to the user
function displayMessage(message) {
  messageElement.textContent = message;

  // Clear the message after a few seconds
  setTimeout(() => {
    messageElement.textContent = '';
  }, 3000);
}

// Add an event listener to the Save button
saveButton.addEventListener('click', () => {
  const noteText = noteTextarea.value;
  if (noteText) {
    saveNoteSync(noteText);
  }
});

// Add an event listener to the Clear button
clearButton.addEventListener('click', () => {
  clearNotes();
});

// Initialize the UI by loading and displaying previously saved notes
retrieveNotesSync();
