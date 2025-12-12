document.addEventListener('DOMContentLoaded', function(){
  // Make page visible with animations
  const page = document.querySelector('.page');
  if (page) requestAnimationFrame(()=> page.classList.add('visible'));

  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e){
      e.preventDefault();
      window.location.href = '../index.html';
    });
  }

  // Google Books API integration for ISBN lookup (includes cover)
  const isbnInput = document.getElementById('addBookId');
  const bookDetailsDiv = document.getElementById('addBookDetails');

  if (isbnInput && bookDetailsDiv) {
    isbnInput.addEventListener('input', async function(e) {
      const isbn = e.target.value.trim();
      
      // Clear previous details if input is empty
      if (!isbn) {
        bookDetailsDiv.innerHTML = '';
        bookDetailsDiv.dataset.cover = '';
        bookDetailsDiv.dataset.isbn = '';
        return;
      }

      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const book = data.items[0].volumeInfo;
          
          // Extract book information
          const title = book.title || 'N/A';
          const authors = book.authors ? book.authors.join(', ') : 'Unknown Author';
          const categories = book.categories ? book.categories.join(', ') : 'N/A';
          const language = book.language || 'N/A';
          const publishedDate = book.publishedDate || 'N/A';
          const pageCount = book.pageCount || 'N/A';
          const coverRaw = book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '';
          const cover = coverRaw ? coverRaw.replace('http://', 'https://') : '';

          // Persist fetched data for later use when adding
          bookDetailsDiv.dataset.cover = cover;
          bookDetailsDiv.dataset.isbn = isbn;

          // Populate the book details with cover
          bookDetailsDiv.innerHTML = `
            <div class="book-hero">
              ${cover ? `<img class="cover" src="${cover}" alt="Cover for ${title}">` : `<div class="cover-placeholder">No cover</div>`}
              <div class="book-copy">
                <div class="bt">${title}</div>
                <div class="ba">by <strong>${authors}</strong></div>
                <div class="meta"><span>Genre: <strong>${categories}</strong></span></div>
                <div class="meta"><span>Language: <strong>${language}</strong></span></div>
                <div class="meta"><span>Year: <strong>${publishedDate}</strong></span></div>
                <div class="meta"><span>Number of Pages: <strong>${pageCount}</strong></span></div>
              </div>
            </div>
          `;
        } else {
          bookDetailsDiv.dataset.cover = '';
          bookDetailsDiv.dataset.isbn = '';
          bookDetailsDiv.innerHTML = '<div style="color: #e74c3c; font-size: 14px;">Book not found. Please check the ISBN.</div>';
        }
      } catch (error) {
        console.error('Error fetching book data:', error);
        bookDetailsDiv.dataset.cover = '';
        bookDetailsDiv.dataset.isbn = '';
        bookDetailsDiv.innerHTML = '<div style="color: #e74c3c; font-size: 14px;">Error fetching book information.</div>';
      }
    });
  }

  // Add book confirmation handler
  const confirmAdd = document.getElementById('confirmAdd');
  const addedList = document.getElementById('addedList');

  if (confirmAdd && addedList) {
    confirmAdd.addEventListener('click', function() {
      const title = document.querySelector('.book-details .bt')?.textContent || 'Untitled';
      const author = document.querySelector('.book-details .ba')?.textContent || 'Unknown';
      const isbn = (document.getElementById('addBookId')?.value || '').trim();
      const cover = bookDetailsDiv?.dataset.cover || '';

      if (!isbn || !title || title === 'Untitled') {
        alert('Please search for a valid book first.');
        return;
      }

      const id = 'b-' + Date.now();
      const node = document.createElement('div');
      node.className = 'borrowed-item';
      node.dataset.id = id;
      node.innerHTML = `
        <div class="borrowed-text">
          <div class="thumb ${cover ? '' : 'thumb-empty'}">${cover ? `<img src="${cover}" alt="Cover for ${title}">` : '<span>No cover</span>'}</div>
          <div class="btext">
            <div class="btitle">${title}</div>
            <div class="bmeta">${author}</div>
            <div class="bmeta small">ISBN: ${isbn || 'N/A'}</div>
          </div>
        </div>
        <button class="returnBtn" title="Remove" aria-label="Remove book">⤺</button>`;
      addedList.prepend(node);

      // Add remove functionality to the new button
      const removeBtn = node.querySelector('.returnBtn');
      removeBtn.addEventListener('click', function() {
        node.remove();
      });

      // Clear form
      document.getElementById('addBookId').value = '';
      bookDetailsDiv.innerHTML = '';
      bookDetailsDiv.dataset.cover = '';
      bookDetailsDiv.dataset.isbn = '';
      document.getElementById('quantity').value = '';
      document.getElementById('shelf').value = '';
    });
  }

  // keep other handlers for the issue page (these will no-op on the regular librarian page)
  const borrowedList = document.getElementById('borrowedList');
  borrowedList?.addEventListener('click', function(e){
    const ret = e.target.closest('.returnBtn');
    if (!ret) return;
    const item = ret.closest('.borrowed-item');
    if (!item) return;
    item.remove();
  });

  const confirm = document.getElementById('confirmIssue');
  confirm?.addEventListener('click', function(){
    const title = document.querySelector('.book-details .bt')?.textContent || 'Untitled';
    const user = (document.getElementById('userId')?.value || 'Unknown').trim() || 'Unknown';
    const id = 'b-' + Date.now();
    const node = document.createElement('div');
    node.className = 'borrowed-item';
    node.dataset.id = id;
    node.innerHTML = `<div class="borrowed-text"><div class="btitle">${title}</div><div class="bmeta">Borrowed by : ${user}</div></div><button class="returnBtn" title="Return" aria-label="Return book">⤺</button>`;
    borrowedList?.prepend(node);
    confirm.textContent = 'Confirmed';
    setTimeout(()=> confirm.textContent = 'Confirm', 900);
  });

  const actions = document.querySelectorAll('.sidebar .actions .action[data-page]');
  if (!actions || actions.length === 0) return;

  const currentFile = (location.pathname.split('/').pop() || 'librarian.html').toLowerCase();

  actions.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = (a.dataset.page || '').toLowerCase();
      if (!target) return;

      // if clicking the link that points to the page we're already on -> go back to main librarian page
      if (currentFile === target) {
        // if already at main page, navigate to target; otherwise toggle back to librarian.html
        if (currentFile === 'librarian.html') {
          window.location.href = target;
        } else {
          window.location.href = 'librarian.html';
        }
      } else {
        window.location.href = target;
      }
    });
  });
});

