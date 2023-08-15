function hideLoginForm() {
    $('#dangNhap-div').show();
    $('#forgotpass-div').hide();
    $('#change-div').hide();
    $('#dangKy-div').hide();

    event.preventDefault()
}

function registerUser() {
    let username = $('#username').val();
    let email = $('#email').val();
    let pass = $('#password').val();
    let rePass = $('#rePass').val();

    let newUser = {
        username: username,
        email: email,
        pass: pass,
        rePass: rePass
    }
    if (email.length < 1 || pass.length < 1 || rePass.length < 1) {
        Swal.fire({
            icon: 'error',
            title: 'All fields can not be blank',
        })
    } else if (validateEmail(email)) {
        $.ajax({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            type: "POST",
            data: JSON.stringify(newUser),
            datatype: 'json',
            url: "http://localhost:8080/register",
            success: function (data) {
                Swal.fire(
                    'Registered!'
                )
                // alert("Registered")
                $("#dangKy-div").hide();
                $("#dangNhap-div").show();
                $("#login-username").val(data.username);
                $("#login-password").val(data.pass)
            },
            error: function (xhr) {
                if (xhr.responseText === "Username is existed") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Username is existed',
                    })
                }
                if (xhr.responseText === "Wrong re-pass") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Wrong re-pass',
                    })
                }
                if (xhr.responseText === "Email is existed") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Email is existed',
                    })
                }
                if (xhr.responseText === "Password must be 6 to 8 characters") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Password must be 6 to 8 characters',
                    })
                }
            }
        });
    } else {
        $('#emailValidEr').show();
        Swal.fire({
            icon: 'error',
            title: 'Email is not valid',
        })
    }

    event.preventDefault();
}

function loginUser(username, pass) {
    let loginInput = $("#login-username").val();
    let password = $("#login-password").val();
    let newUser = {
        loginInput: loginInput,
        password: password
    }

    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "POST",
        data: JSON.stringify(newUser),
        datatype: 'json',
        url: "http://localhost:8080/login",
        success: function (data) {

            // alert("Login success")
            Swal.fire(
                'Login success!'
            )
            sessionStorage.setItem("userId", data.id);
            sessionStorage.setItem("userRole", data.role.id)
            setTimeout(function(){
                window.location.href = "index.html"
            }, 1000);
            // window.location.href = "index.html"
        },
        error: function (xhr) {
            if (xhr.responseText === "All fields can not be blank") {
                Swal.fire({
                    icon: 'error',
                    title: xhr.responseText,
                })
            }
            if (xhr.responseText === "Account blocked" ||
                xhr.responseText === "Account not exist") {
                Swal.fire({
                    icon: 'error',
                    title: xhr.responseText,
                })
            }
            if (xhr.responseText === "Wrong password") {
                Swal.fire({
                    icon: 'error',
                    title: xhr.responseText,
                })
            }
        }
    });
}

function forgotPass() {
    let username = $('#forgot-username').val();
    let email = $('#forgot-email').val();
    let forgotUser = {
        username: username,
        email: email
    }
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "POST",
        data: JSON.stringify(forgotUser),
        datatype: 'json',
        url: "http://localhost:8080/users/forgot-password",
        success: function (data) {
            sessionStorage.setItem("userId", data.id);
            $('#dangNhap-div').hide();
            $('#forgotpass-div').hide();
            $('#change-div').show();
            $('#dangKy-div').hide();
        },
        error: function (xhr) {
            if (xhr.responseText === "Username not exist") {
                Swal.fire({
                    icon: 'error',
                    title: xhr.responseText,
                })
            }
            if (xhr.responseText === "Wrong email") {
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
    })
}

function changePass() {
    let id = sessionStorage.getItem("userId");
    let newPass = $('#changepass').val();
    let confirmPass = $('#repass-change').val();
    let user = {
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
        type: "POST",
        data: JSON.stringify(user),
        datatype: 'json',
        url: "http://localhost:8080/users/change-password/" + id,
        success: function (data) {
            sessionStorage.clear();
            Swal.fire(
                'Change password succeeded!'
            )
            $('#dangNhap-div').show();
            $('#forgotpass-div').hide();
            $('#change-div').hide();
            $('#dangKy-div').hide();
        },
        error: function (xhr) {
            if (xhr.responseText === "All fields can not be blank") {
                Swal.fire({
                    icon: 'error',
                    title: xhr.responseText,
                })
            }
            if (xhr.responseText === "Wrong confirm password") {
                Swal.fire({
                    icon: 'error',
                    title: xhr.responseText,
                })
            }
        }
    })
}

}

function showLoginForm() {
    $('#dangKy-div').hide();
    $('#dangNhap-div').show();
    $('#forgotpass-div').hide();
    $('#change-div').hide();
    event.preventDefault();
}

function forgotForm() {
    $('#dangKy-div').hide();
    $('#dangNhap-div').hide();
    $('#forgotpass-div').show();
    event.preventDefault();
}

function showRegisterForm() {
    $('#dangKy-div').show();
    $('#dangNhap-div').hide();
    $('#forgotpass-div').hide();
    $('#change-div').hide();
    event.preventDefault();
}

function hideError() {
    $('.errorText').hide();
}

const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};