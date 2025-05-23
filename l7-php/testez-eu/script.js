let offset = 0;
let isAdmin = false;
let filters = {};

function fetchEntries() {
  fetch('api.php?action=list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offset, filters })
  })
  .then(res => res.json())
  .then(entries => {
    const container = document.getElementById('entries');
    container.innerHTML = '';
    entries.forEach(e => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = `
        <b>${e.title}</b> by ${e.author_email}<br>
        <p>${e.comment}</p>
        <small>${e.date}</small>
      `;
      if (isAdmin) {
        const btns = document.createElement('div');
        btns.className = 'admin-controls';
        btns.innerHTML = `
          <button onclick="editEntry(${e.id}, '${e.title}', \`${e.comment}\`)" >Edit</button>
          <button onclick="deleteEntry(${e.id})">Delete</button>
        `;
        div.appendChild(btns);
      }
      container.appendChild(div);
    });
  });
}

function editEntry(id, title, comment) {
  const newTitle = prompt("Ce titlu vrei sa-i pui vere?", title);
  const newComment = prompt("Si commentu?", comment);
  if (newTitle && newComment) {
    fetch('api.php?action=update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title: newTitle, comment: newComment })
    }).then(() => fetchEntries());
  }
}

function deleteEntry(id) {
  if (confirm("Are you sure you want to delete this entry?")) {
    fetch('api.php?action=delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(() => fetchEntries());
  }
}

// TODO :  sa le faci poate jquery mai bn
document.getElementById('entry-form').addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  fetch('api.php?action=insert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => {
    e.target.reset();
    fetchEntries();
  });
});

document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const pass = new FormData(e.target).get('admin_pass');
  fetch('api.php?action=login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: pass })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      isAdmin = true;
      document.getElementById('filter-form').style.display = 'block';
      document.getElementById('logout-form').style.display = 'block';
      document.getElementById('login-form').style.display = 'none';
      fetchEntries();
    } else {
      alert("AAA te-am prins nu stii parola");
    }
  });
});

document.getElementById('logout-form').addEventListener('submit', e => {
  e.preventDefault();
  fetch('api.php?action=logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(() => {
    isAdmin = false;
    filters = {};
    document.getElementById('filter-form').style.display = 'none';
    document.getElementById('logout-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    fetchEntries();
  });
});

document.getElementById('filter-form').addEventListener('submit', e => {
  e.preventDefault();
  filters = Object.fromEntries(new FormData(e.target).entries());
  offset = 0;
  fetchEntries();
});

document.getElementById('prev').onclick = () => {
  offset = Math.max(0, offset - 4);
  fetchEntries();
};

document.getElementById('next').onclick = () => {
  offset += 4;
  fetchEntries();
};

fetchEntries();