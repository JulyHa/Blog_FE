// let userId = sessionStorage.getItem("userId");
// function changePasssss() {
//     let newPass = $('#newPass').val();
//     let confirmPass = $('#newRePass').val();
//
//     let changePassUser = {
//         newPass: newPass,
//         confirmPass: confirmPass
//     }
//
//     $.ajax({
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json"
//         },
//         type: "PUT",
//         url: "http://localhost:8080/users/change-password/" + userId,
//         data: JSON.stringify(changePassUser),
//         datatype: 'json',
//
//         success: function () {
//             alert("Change password success");
//         },
//         error: function (xhr) {
//             if (xhr.responseText === "New password can not same current password") {
//                 alert(xhr.responseText);
//             }
//             if (xhr.responseText === "Wrong re-password") {
//                 alert(xhr.responseText)
//             }
//         }
//     });
// }