
const apiUrl = "https://647a6c3fd2e5b6101db057b6.mockapi.io/users";
let userIdToEdit = "";
let pagination;

function fetchUsers() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            pagination = new Pagination(data,30);
            showUsers(pagination.getCurrentPageData());
            showPagination();
        });
}

function showUsers(users) {
    const tableBody = document.querySelector("#userTable tbody");
    tableBody.innerHTML = "";

    users.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td> 
            <td>
                <button onclick="openModal('${user.id}')">EDITAR</button>
                <button onclick="delteUser('${user.id}')">ELIMINAR</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
function addUser() {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    const newUser = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
    };

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    })
        .then((response) => response.json())
        .then((data) => {
            nameInput.value = "";
            emailInput.value = "";
            phoneInput.value = "";
            closeModal();
            fetchUsers();
        });
}

function delteUser(userId) {
    const confirmDelete = confirm(
        "¿Estás seguro de que deseas eliminar este usuario?"
    );

    if (confirmDelete) {
        fetch(`${apiUrl}/${userId}`, {
            method: "DELETE",
        }).then((response) => {
            if (response.ok) {
                fetchUsers();
            } else {
                alert("Ocurrió un error al eliminar el usuario.");
            }
        });
    }
}

function createUser() {
    const modal = document.getElementById("createUserModal");
    modal.style.display = "block";
}

function openModal(userId) {
    userIdToEdit = userId;

    fetch(`${apiUrl}/${userId}`)
        .then((response) => response.json())
        .then((user) => {
            const editNameInput = document.getElementById("editName");
            const editEmailInput = document.getElementById("editEmail");
            const editPhone = document.getElementById("editPhone");

            editNameInput.value = user.name;
            editEmailInput.value = user.email;
            editPhone.value = user.phone;

            const modal = document.getElementById("editModal");
            modal.style.display = "block";
        });
}

function closeModal() {
    const editModal = document.getElementById("editModal");
    const createModal = document.getElementById("createUserModal");

    if (editModal.style.display === "block") {
        editModal.style.display = "none";
    }

    if (createModal.style.display === "block") {
        createModal.style.display = "none";
    }
}


function storeChanges() {
    const editNameInput = document.getElementById("editName");
    const editEmailInput = document.getElementById("editEmail");
    const editPhone = document.getElementById("editPhone");

    const editedUser = {
        name: editNameInput.value,
        email: editEmailInput.value,
        phone: editPhone.value,
    };

    fetch(`${apiUrl}/${userIdToEdit}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
    })
        .then((response) => response.json())
        .then((data) => {
            closeModal();
            fetchUsers();
        });
}

function searchUsers() {
    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput.value.toLowerCase();

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const filteredUsers = data.filter((user) => {
                const userName = user.name.toLowerCase();
                return userName.includes(searchTerm);
            });

            pagination = new Pagination(filteredUsers, 30);
            showUsers(pagination.getCurrentPageData());
            showPagination();
        });
}

function showPagination() {
    const paginationContainer = document.getElementById("pagination");
    const totalPages = pagination.getTotalPages();

    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        if (i === pagination.currentPage) {
            button.classList.add("active");
        }
        button.addEventListener("click", () => {
            const users = pagination.goToPage(i);
            showUsers(users);
            showPagination();
        });
        paginationContainer.appendChild(button);
    }
}


const closeBtn = document.querySelector(".close");
closeBtn.addEventListener("click", closeModal);


fetchUsers();
