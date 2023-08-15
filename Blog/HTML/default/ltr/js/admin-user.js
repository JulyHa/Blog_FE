
function getUsers(page) {
    const URL_SHOW = "http://localhost:8080/admin/";
    let search = $('#searchUser').val();
    if (search === "") {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/admin?page=" + page + "&size=5",
            success: function (data) {
                showUsers(data)
            }
        })
    } else {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/admin/search?q=" + search + "&page=" + page + "&size=5",
            success: function (data) {
                showUsers(data)
            },
            error: function (xhr) {

                Swal.fire({
                    icon: 'error',
                    title: xhr.responseText,
                })

                // alert(xhr.responseText);
            }
        })
    }

}

function setStatus(id) {
    let confirmText;
    let successText = "";
    let confirmBtn;
    if (checkStatusUser(id)) {
        confirmText = "Do you really want to block this user?"
        successText = "Block succeed!"
        confirmBtn = "block"
    } else {
        confirmText = "Do you really want to unblock this user?";
        successText = "Unblock succeed!";
        confirmBtn = "unblock"
    }
    Swal.fire({
        title: 'Are you sure?',
        text: confirmText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, ' + confirmBtn + ' this user!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/admin/" + id,
                success: function () {
                    Swal.fire(
                        successText,
                    )
                    getUsers();
                }
            })

        }
    })
}

function checkStatusUser(id) {
    let check = false;
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/users/" + id,
        async: false,
        success: function (data) {
            if (data.status) {
                check = true;
            }
        }
    })
    return check;
}

//hàm hiển thị phần chuyển page
function displayPage(data){
    let content = `<button class="btn btn-info  hvr-icon-back" id="backup" onclick="isPrevious(${data.pageable.pageNumber})">Previous</button>
    <span>${data.pageable.pageNumber+1} | ${data.totalPages}</span>
    <button class="btn btn-info hvr-icon-forward" id="next" onclick="isNext(${data.pageable.pageNumber})">Next</button>`
    document.getElementById('page').innerHTML = content;
}

//hàm lùi page
function isPrevious(pageNumber) {
    getUsers(pageNumber-1)
}

//hàm tiến page
function isNext(pageNumber) {
    getUsers(pageNumber+1)
}



function showUsers(data) {
    let count = 1;
    $('#getUsers tbody').empty();

    $.each(data.content, (i, user) =>{
        let status = user.status ? `<span class="shadow-none badge badge-success" style="width: 80px">Active</span>` : `<span class="shadow-none badge badge-danger" style="width: 80px">Blocked</span>`
        let userRow =`<tr>
                    <td class="text-center">${count++}</td>
                    <td class="align-center">
                        <span><img src="../../../../Blog/HTML/editor-html/${user.avatar}" width="90px" height="90px" class="" alt="profile"></span>
                    </td>
                    <td>${user.name}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.phoneNumber}</td>
                    <td>${user.address}</td>
                    <td class="text-center">${user.role.name}</td>
                    <td class="text-center">
                        <button style="background-color: transparent; border: none;" onclick="setStatus(${user.id})">` +
            status +
            `</button>
                    </td>
                </tr>
            `
        $('#getUsers tbody').append(userRow);
    });
    displayPage(data)
    //điều kiện bỏ nút previous
    if (data.pageable.pageNumber === 0) {
        document.getElementById("backup").hidden = true
    }
    //điều kiện bỏ nút next
    if (data.pageable.pageNumber + 1 === data.totalPages) {
        document.getElementById("next").hidden = true
    }
}

function logoutBtn(){
    sessionStorage.clear();
    window.location.href = "../../../../Blog/HTML/editor-html/index.html"
}