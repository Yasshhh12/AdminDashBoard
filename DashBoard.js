let users = [];
let currentPage = 1;

fetch(
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
)
  .then((response) => response.json())
  .then((data) => {
    users = data;
    renderTable();
    renderPagination();
  });

function renderTable() {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const displayedUsers = users.slice(startIndex, endIndex);

  displayedUsers.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td><input type="checkbox" class="checkbox" data-userid="${user.id}"></td>
      <td contenteditable="false" class="editable">${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="edit" onclick="editRow(${user.id})"><img src="images/file-edit.png"</button>
        <button class="delete" onclick="deleteRow(${user.id})"><img src="images/trash-2.png"</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  updateSelectAllCheckboxState();
}

function renderPagination() {
  const paginationContainer = document.querySelector("#pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(users.length / 10);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.addEventListener("click", () => {
      currentPage = i;
      renderTable();
    });
    paginationContainer.appendChild(button);
  }
}

function search() {
  const searchTerm = document.querySelector("#searchInput").value.toLowerCase();
  users = users.filter((user) => {
    return (
      user.id.toLowerCase().includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
  });
  currentPage = 1;
  renderTable();
  renderPagination();
}

function editRow(userId) {
  const rowIndex = (currentPage - 1) * 10 + userId - 1;
  const row = document.querySelector(`#userTable tbody tr:nth-child(${userId})`);
  const editableCell = row.querySelector(".editable");
  const isEditing = editableCell.getAttribute("contenteditable") === "true";

  if (isEditing) {
    editableCell.setAttribute("contenteditable", "false");
    const newName = editableCell.textContent;
    users[rowIndex].name = newName;
  } else {
    editableCell.setAttribute("contenteditable", "true");
    const input = document.createElement("input");
    input.value = editableCell.textContent;
    editableCell.innerHTML = "";
    editableCell.appendChild(input);
    input.focus();
    input.addEventListener("blur", () => {
      editableCell.setAttribute("contenteditable", "false");
      const newName = input.value;
      editableCell.textContent = newName;
      users[rowIndex].name = newName;
    });
  }
}

function deleteRow(userId) {
  users = users.filter((user) => user.id !== userId.toString());
  renderTable();
  renderPagination();
}

function selectAll() {
  const selectAllCheckbox = document.querySelector("#selectAllCheckbox");
  const isSelected = selectAllCheckbox.checked;
  const checkboxes = document.querySelectorAll(".checkbox");

  checkboxes.forEach((checkbox) => {
    checkbox.checked = isSelected;
    const userId = checkbox.getAttribute("data-userid");
    const row = document.querySelector(
      `#userTable tbody tr:nth-child(${userId})`
    );

    if (row) {
      row.classList.toggle("selected", isSelected);
    }
  });

  updateSelectAllCheckboxState();
}

function deleteSelected() {
  const selectedCheckboxes = document.querySelectorAll(".checkbox:checked");

  selectedCheckboxes.forEach((checkbox) => {
    const userId = checkbox.getAttribute("data-userid");
    users = users.filter((user) => user.id !== userId.toString());
  });

  renderTable();
  renderPagination();
}

function updateSelectAllCheckboxState() {
  const selectAllCheckbox = document.querySelector("#selectAllCheckbox");
  const displayedCheckboxes = document.querySelectorAll(".checkbox");

  const allSelected = Array.from(displayedCheckboxes).every(
    (checkbox) => checkbox.checked
  );
  const someSelected = Array.from(displayedCheckboxes).some(
    (checkbox) => checkbox.checked
  );

  if (allSelected) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else if (someSelected) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  }
}
