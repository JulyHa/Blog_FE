const LOCAL_URL_PROFILE = "http://localhost:8080/users/"
let userId = sessionStorage.getItem("userId");
function showInformation() {
    $.ajax({
        type: "GET",
        url: LOCAL_URL_PROFILE + userId,
        success: function (data) {
            $("#nameUser").val(data.name);
            $("#emailUser").val(data.email);
            $("#phoneUser").val(data.phoneNumber);
            $("#addressUser").val(data.address);
            $("#usernameUser").val(data.username);
        }
    })
    event.preventDefault();
}

function updateInformation() {
    let name =  $("#nameUser").val();
    let phoneNumber =  $("#phoneUser").val();
    let address =  $("#addressUser").val();

    let updateUser = {
        name: name,
        phoneNumber: phoneNumber,
        address: address,
        avatar: ""
    };

    let formmm = new FormData;
    formmm.append("file", $('#avatarUser')[0].files[0]);
    formmm.append("user", new Blob([JSON.stringify(updateUser)],
        {type: 'application/json'}))

    $.ajax({
        header: {},
        contentType: false,
        processData: false,
        type: "PUT",
        url: LOCAL_URL_PROFILE + userId,
        data: formmm,
        success: function () {
            Swal.fire(
                'Update succeeded!'
            )
            drawNavigationBarr();
        }
    });
    event.preventDefault();
}

function findAvatarUserByUserId(id) {
    let avatar = null;
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/users/" + id,
        dataType: "json",
        async: false,
        success: function (data) {
            avatar = data.avatar;
        }
    })
    return avatar;
}

function changePasssss() {
    let newPass = $('#newPass').val();
    let confirmPass = $('#newRePass').val();

    let changePassUser = {
        newPass: newPass,
        confirmPass: confirmPass
    }
    if (newPass.length < 6 || newPass.length > 8) {
        Swal.fire({
            icon: 'error',
            title: 'Password must be 6 to 8 characters',
        })
    } else {
        $.ajax({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            type: "PUT",
            url: "http://localhost:8080/users/change-password/" + userId,
            data: JSON.stringify(changePassUser),
            datatype: 'json',

            success: function () {
                Swal.fire(
                    'Change password success!'
                )
                sessionStorage.clear();

                setTimeout(function(){
                    window.location.href = "./login-register.html"
                }, 2000);

            },
            error: function (xhr) {
                if (xhr.responseText === "New password can not same current password") {
                    Swal.fire({
                        icon: 'error',
                        title: xhr.responseText,
                    })                }
                if (xhr.responseText === "Wrong re-password") {
                    Swal.fire({
                        icon: 'error',
                        title: xhr.responseText,
                    })
                }
                if (xhr.responseText === "All fields can not be blank") {
                    Swal.fire({
                        icon: 'error',
                        title: xhr.responseText,
                    })
                }
            }
        });
    }

}