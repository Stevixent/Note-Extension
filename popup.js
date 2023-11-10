// Retrieve the textarea and buttons
const noteTextarea = document.getElementById('note-content');
const saveButton = document.getElementById('save-button');
const clearButton = document.getElementById('clear-button');
const noteList = document.getElementById('note-list');

// Function to save a note to local storage
function saveNote(noteText) {
    chrome.storage.sync.get(['notes'], function(result) {
      let notes = result.notes || [];
      notes.push(noteText);
      chrome.storage.sync.set({ notes: notes }, function() {
        // After saving, update the UI to display the saved note
        const noteElement = document.createElement('div');
        noteElement.textContent = noteText;
        noteList.appendChild(noteElement);
        noteTextarea.value = '';
      });
    });
  }

// Add an event listener to the Save button
saveButton.addEventListener('click', () => {
  const noteText = noteTextarea.value;
  if (noteText) {
    saveNote(noteText);
  }
});

const boldButton = document.getElementById('bold-button');
boldButton.addEventListener('click', () => {
  // Apply bold formatting to the selected text or the current line in the textarea
  document.execCommand('bold', false, null);
});


// Add an event listener to the Clear button
clearButton.addEventListener('click', () => {
  noteTextarea.value = '';
});

// Initialize the UI by loading and displaying previously saved notes
chrome.storage.sync.get(['notes'], function(result) {
    let notes = result.notes || [];
    for (let note of notes) {
      const noteElement = document.createElement('div');
      noteElement.textContent = note;
      noteList.appendChild(noteElement);
    }
  });

  