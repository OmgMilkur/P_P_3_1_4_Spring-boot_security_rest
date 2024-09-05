$(async function () {
    await getTableWithUsers();
    await getAuthUserInfo();
    await addNewUser();
    await editModalWindow();
    await deleteModalWindow();
    await putEditUser();
    await checkAuth();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/users'),
    saveUser: async (user) => await fetch('api/new', {
        method: 'POST',
        headers: userFetchService.head,
        body: user
    })
        .then(response => {
            if (response.ok) {
                location.reload()
            }
            return response.json();
        })
        .catch(error => console.error('Error:', error)),
    deleteUser: async (id) => await fetch(`api/deleteUser/${id}`, {
        method: 'DELETE',
        headers: userFetchService.head,
    }).then(response => {
        if (response.ok) {
            $('#deleteModal').modal('hide');
            location.reload();
        }
        return response.json();
    }),
    getUserInfo: async () => await fetch('api/user'),
    getUserByID: async (id) => await fetch(`api/getUser/${id}`),
    editUser: async (user) => await fetch('api/edit', {
        method: 'PUT',
        headers: userFetchService.head,
        body: user
    })
        .then(response => {
            if (response.ok) {
                $('#editModal').modal('hide');
                location.reload();
            }
            return response.json();
        })
        .catch(error => console.error('Error:', error))
}

async function checkAuth() {
    userFetchService.getUserInfo()
        .then(res => res.json())
        .then(user => {
            if (user.roles.length == 1 && user.roles[0].name == 'ROLE_USER') {
                let element = document.getElementById('link-user');
                let elementUserPanel = document.getElementById('user-panel');
                element.classList.add('active');
                elementUserPanel.classList.add('show');
                elementUserPanel.classList.add('active');
            } else {
                let element = document.getElementById('link-admin');
                element.classList.add('active');
            }
        })
}

async function putEditUser() {
    $('#edit-user-form').submit(function (event) {
        event.preventDefault();

        let formData = JSON.stringify({
            id: $('#editId').val(),
            firstName: $('#editFirstName').val(),
            lastName: $('#editLastName').val(),
            age: $('#editAge').val(),
            email: $('#editEmail').val(),
            password: $('#editPassword').val(),
            roles: $('#editRoles').val()
        });
        userFetchService.editUser(formData);
    })
}

async function editModalWindow() {
    $('#editModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget);
        let userID = button.attr('data-userid');
        let data = userFetchService.getUserByID(userID);
        data.then(res => res.json())
            .then(user => {
                    document.getElementById('editId').value = user.id;
                    document.getElementById('editFirstName').value = user.firstName;
                    document.getElementById('editLastName').value = user.lastName;
                    document.getElementById('editAge').value = user.age;
                    document.getElementById('editEmail').value = user.email;
                    document.getElementById('editPassword').value = user.password;
                }
            )

        $('#close-edit-button').click(event => {
            location.reload()
        })
    })
}

async function deleteModalWindow() {
    $('#deleteModal').on('show.bs.modal', function (event) {
        let delSelect = $('#deleteRole');
        let button = $(event.target);
        let userID = button.data('userid');
        let data = userFetchService.getUserByID(userID);
        data.then(res => res.json())
            .then(user => {
                    document.getElementById('deleteId').value = user.id;
                    document.getElementById('deleteFirstName').value = user.firstName;
                    document.getElementById('deleteLastName').value = user.lastName;
                    document.getElementById('deleteAge').value = user.age;
                    document.getElementById('deleteEmail').value = user.email;
                    user.roles.forEach(role => {
                        let option = `$(<option>${role.name.substring(5)}</option>)`;
                        delSelect.append(option);
                    });
                }
            )
        delSelect.empty();
        console.log(userID)

        $('#delete-button').click(event => {
            userFetchService.deleteUser(userID);
        })

        $('#close-delete-button').click(event => {
            location.reload()
        })
    })
}

async function addNewUser() {
    $('#new-user-form').submit(function (event) {
        event.preventDefault();

        let formData = JSON.stringify({
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            age: $('#age').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            roles: $('#roles').val()
        });
        userFetchService.saveUser(formData);
    });
}

async function getAuthUserInfo() {
    let table = $('#user-info-table tbody');
    table.empty();

    await userFetchService.getUserInfo()
        .then(res => res.json())
        .then(user => {
            let tableFilling = `$(
                    <tr>
                        <th scope="row">${user.id}</th>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${Object.values(user.roles).map(role => role.name.substring(5)).join(' ')}</td>
                    </tr>)`;
            table.append(tableFilling);
        })
}

async function getTableWithUsers() {
    let table = $('#users-table tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <th scope="row">${user.id}</th>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>    
                            <td>${user.email}</td>
                            <td>${Object.values(user.roles).map(role => role.name.substring(5)).join(' ')}</td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info" 
                                data-bs-toggle="modal" data-bs-target="#editModal" id="editButton">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#deleteModal" id="deleteButton">Delete</button>
                            </td> 
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    $("#users-table").find('button').on('click', (event) => {
        let userEditModal = $('#editModal');
        let userDeleteModal = $('#deleteModal')

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        if (buttonAction == 'edit') {
            userEditModal.attr('data-userid', buttonUserId);
            userEditModal.attr('data-action', buttonAction);
            userEditModal.modal('show');
        } else {
            userDeleteModal.attr('data-userid', buttonUserId);
            userDeleteModal.attr('data-action', buttonAction);
            userDeleteModal.modal('show');
        }
    })
}


