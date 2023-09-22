const url = 'http://localhost:3000/users';
const addModalFrom = document.querySelector('.form-user');
const editModalFrom = document.querySelector('#myEditModal .form-user');
const tableUsers = document.querySelector('#table-user');
const searchInput = document.querySelector('#search-input');
let id = '';

fetch(url)
  .then(res => res.json())
  .then(data => {
    data.forEach(user => {
      renderUsers(user);
    });
  });

const renderUsers = (user) => {
  const output = `
    <tr data-id='${user.id}'>
      <td>${user.firstname}</td>
      <td>${user.lastname}</td>
      <td>${user.fullname}</td>
      <td>${user.phone}</td>
      <td><span>${user.email}</span></td>
      <td>
        <a class="btn-edit btn btn-primary btn-sm">Edit</a> |
        <a class="btn-del btn btn-danger btn-sm">Del</a>
      </td>
    </tr>
  `;
  tableUsers.insertAdjacentHTML('beforeend', output);

  // Delete
  const btndel = document.querySelector(`[data-id='${user.id}'] .btn-del`);
  btndel.addEventListener('click', (e) => {
    fetch(`${url}/${user.id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => location.reload());
  });

  // Edit
  const btnEdit = document.querySelector(`[data-id='${user.id}'] .btn-edit`);
  btnEdit.addEventListener('click', (e) => {
    e.preventDefault();
    id = user.id;
    $('#myEditModal').modal('show');
    editModalFrom.firstname.value = user.firstname;
    editModalFrom.lastname.value = user.lastname;
    editModalFrom.fullname.value = user.fullname;
    editModalFrom.phone.value = user.phone;
    editModalFrom.email.value = user.email;
  });
  
  // Search filter
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const userRow = document.querySelector(`[data-id='${user.id}']`);

    if (user.firstname.toLowerCase().includes(searchTerm) ||
        user.lastname.toLowerCase().includes(searchTerm)
        ) {
      userRow.style.display = 'table-row';
    } else {
      userRow.style.display = 'none';
    }
  });
}

// Add
addModalFrom.addEventListener('submit', (e) => {
  e.preventDefault();
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstname: addModalFrom.firstname.value,
      lastname: addModalFrom.lastname.value,
      fullname: addModalFrom.fullname.value,
      phone: addModalFrom.phone.value,
      email: addModalFrom.email.value
    })
  })
    .then(res => res.json())
    .then(data => {
      const dataArr = [];
      dataArr.push(data);
      renderUsers(dataArr);
    })
    .then(() => location.reload());
  addModalFrom.firstname.value = '';
  addModalFrom.lastname.value = '';
  addModalFrom.fullname.value = '';
  addModalFrom.phone.value = '';
  addModalFrom.email.value = '';
});

// Edit
editModalFrom.addEventListener('submit', (e) => {
  e.preventDefault();
  fetch(`${url}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstname: editModalFrom.firstname.value,
      lastname: editModalFrom.lastname.value,
      fullname: editModalFrom.fullname.value,
      phone: editModalFrom.phone.value,
      email: editModalFrom.email.value
    })
  })
    .then(res => res.json())
    .then(() => location.reload());

  // Clear input values
  editModalFrom.firstname.value = '';
  editModalFrom.lastname.value = '';
  editModalFrom.fullname.value = '';
  editModalFrom.phone.value = '';
  editModalFrom.email.value = '';
});
