document.addEventListener('DOMContentLoaded', function(){
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e){
      e.preventDefault();
      window.location.href = '../index.html';
    });
  }

  // trigger page + sidebar entrance animations
  const page = document.querySelector('.page');
  if (page) requestAnimationFrame(()=> page.classList.add('visible'));

  // Issue Books interaction: open the dedicated issue page instead of toggling panels inline
  const issueBtn = Array.from(document.querySelectorAll('.action'))
    .find(a => /issue/i.test(a.textContent || ''));
  if (issueBtn) {
    issueBtn.addEventListener('click', function(e){
      e.preventDefault();
      // navigate to the issue page in the same folder
      window.location.href = 'librarianIssueBook.html';
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
});

