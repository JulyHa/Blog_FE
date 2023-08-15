const LOCAL_URL = "http://localhost:8080/admin/";

function run123() {
    showListUsers();
}




function showListUsers() {
    $.ajax({
        type: "GET",
        url: LOCAL_URL,
        success: function (data) {
            let count = 1;
            let content = `<thead>
                                    <tr>
                                        <th class="checkbox-column text-center"> Record Id </th>
                                        <th class="align-center">Avatar</th>
                                        <th>Full name</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Phone number</th>
                                        <th>Role</th>
                                        <th class="align-center">Status</th>
                                    </tr>
                                    </thead>`
            $('#customer-info-detail-3 tbody').empty();
            $.each(data.content, (i, user) => {
                let html = user.status ? `<span class="shadow-none badge badge-success">${user.status}</span>` : `<span class="shadow-none badge badge-danger">${user.status}</span>`
                let userRow = `<tr>
        <td class="checkbox-column text-center"> ${count++} </td>
        <td class="align-center">
            <span><img src="assets/img/90x90.jpg" class="" alt="profile"></span>
        </td>
        <td>${user.name}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phoneNumber}</td>
        <td>${user.role.name}</td>
        <td class="align-center">
            <button style="background-color: transparent; border: none" onclick="setStatus(${user.id})">` + html + `</button>
        </td>
    </tr>`;
                $('#customer-info-detail-3 tbody').append(userRow);
            })

            drawDT()
        }
    })
    // Event.preventDefault();
}

function setStatus(id) {
    $.ajax({
        type: "POST",
        url: LOCAL_URL + id,
        success: function () {
            // location.reload();
            showListUsers();
            drawDT();
        }
    })
    // Event.preventDefault();
}

function drawDT() {
    let c3 = $('#customer-info-detail-3').DataTable({
        "lengthMenu": [5, 10, 20, 50, 100],
        "language": {
            "paginate": {
                "previous": "<i class='flaticon-arrow-left-1'></i>",
                "next": "<i class='flaticon-arrow-right'></i>"
            },
            "info": "Showing page _PAGE_ of _PAGES_"
        },
        retrieve: true,
    });
    multiCheck(c3);
}