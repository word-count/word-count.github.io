let clearTextAreaBtn = document.getElementById('clearTextAreaBtn');
let totalWordCount = document.getElementById('totalWordCount');
let characterCount = document.getElementById('characterCount');
let textAreaInput = document.getElementById('textAreaInput');
let fileInput = document.getElementById('fileInput');
let searchWordsInput = document.getElementById('searchWords');
let wordOccurancesCountDiv = document.getElementById('wordOccurancesCount');
let renderTextAndSearch = document.getElementById('renderTextAndSearch');


textAreaInput.addEventListener('input', updateButtonText);
updateButtonText();

function updateButtonText() {
  if (textAreaInput.value.trim() !== '') {
    clearTextAreaBtn.innerText = 'Clear Text';
  } else {
    clearTextAreaBtn.innerText = '';
  }
}

clearTextAreaBtn.addEventListener("click", clearEverything);

function clearEverything() {
  fileInput.value = "";
  renderTextAndSearch.innerHTML = "";
  wordOccurancesCountDiv.innerHTML = "";
  searchWordsInput.value = "";
  textAreaInput.value = "";
  clearTextAreaBtn.innerText = '';
  totalWordCount.innerText = "";
  characterCount.innerText = "";
}



function clearFileText(){
  fileInput.value = "";
  renderTextAndSearch.innerHTML = "";
  wordOccurancesCountDiv.innerHTML = "";
  searchWordsInput.value = "";
  totalWordCount.innerText = "";
  characterCount.innerText = "";
}

// if user uploads .txt file reset values
fileInput.addEventListener('change', function() {
  if (fileInput.files.length > 0) {
    textAreaInput.value = "";
    renderTextAndSearch.innerHTML = "";
    wordOccurancesCountDiv.innerHTML = "";
    searchWordsInput.value = "";
    clearTextAreaBtn.innerText = "";
    totalWordCount.innerText = "";
    characterCount.innerText = "";
  }
});


function highlightSearchWords() {
  renderTextAndSearch.innerHTML = '';
  wordOccurancesCountDiv.innerHTML = '';
  
  if (fileInput.files[0]) {
    renderTextAndSearch.innerHTML = '';
    wordOccurancesCountDiv.innerHTML = '';
  }

  const searchWords = searchWordsInput.value.split(',').map(keyword => keyword.trim());

  let content;

  if (fileInput.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function (e) {
      content = e.target.result;
      processContent(content, renderTextAndSearch, searchWords);
    };

    reader.readAsText(fileInput.files[0]);
  } else if (textAreaInput.value.trim() !== '') {
    content = textAreaInput.value;

    totalWordCount.innerText = `Total words: ${content.split(/\s+/).length}`;

    characterCount.innerText = `Characters: ${content.split(/\s+/).join('').length} (${content.length} with spaces)`;
    
    if (searchWords.length === 0 || searchWords.every(word => word === '')) {
    renderTextAndSearch.innerHTML = '<p class="text-red-300 text-sm">No search word/s detected</p>';
      return;
    }
    processContent(content, renderTextAndSearch, searchWords);

  } else {
    alert('No file or text input.');
    return;
  }
}


function processContent(content, element, searchWords) {
  element.textContent = limitTextLength(content, 10000);
  const keywordCounts = highlightKeywordsInText(element, searchWords);
  displayKeywordCounts(keywordCounts);
}


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightKeywordsInText(element, searchWords) {
  const keywordCounts = {};

  searchWords.forEach(keyword => {
    const escapedKeyword = escapeRegExp(keyword);
    const regex = new RegExp('\\b' + escapedKeyword + '\\b', 'gi');
    const matches = element.innerText.match(regex);

    if (matches && matches.length > 0) {
      element.innerHTML = element.innerHTML.replace(regex, match => `<span class="highlight">${match}</span>`);

      keywordCounts[keyword] = matches.length;
      
    } else {
      keywordCounts[keyword] = 0;
    }
  });

  return keywordCounts;
}



function displayKeywordCounts(keywordCounts) {

  wordOccurancesCountDiv.innerHTML += `<div>
      <table class="w-[100%]">
        <thead>
          <tr>
            <th><span class="bg-black text-white px-4 py-0 w-fit">Search Word</span></th>
            <th><span class="bg-black text-white px-4 py-0 w-fit">Occurrences</span></th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(keywordCounts).map(([keyword, count]) => `
            <tr>
              <td class="bg-[#83E2FC99] px-4 py-2 border-white border-r-4 border-b-4 text-center w-1/2">${keyword}</td>
              <td class="bg-[#83E2FC77] border-b-4 border-white px-4 py-2 text-center rounded">${keyword.length > 0 ? count : count / 2}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function limitTextLength(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}
