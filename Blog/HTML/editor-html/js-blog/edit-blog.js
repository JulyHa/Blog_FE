function startEditBlogPage() {

    ClassicEditor
        .create(document.querySelector('#your-message'))
        .then(newEditor => {
            editorr = newEditor;
        })
        .catch(error => {
            console.error(error);
        });

    $("#alerttt").hide();

    getBlogToEdit(sessionStorage.getItem("blogId"));

    let date = new Date().toDateString();
    $("#date").val(date);

}
let editorr;

function getBlogToEdit(id) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/blogs/" + id,
        success: function (data) {
            displayBlogToEdit(data);
        }
    })
    event.preventDefault()
}

function displayBlogToEdit(blog) {
    $("#title").val(blog.title);
    $("#description").val(blog.description);
    let image = `<img src="${blog.image}" alt="" width="43%">`
    $("#blogImagge").append(image);
    editorr.setData(blog.content);
}

function getValueToCreateBogg() {
    let privacy = true;
    if ($("input[name='privacy']:checked").val() === "false") {
        privacy = false;
    }

    let userId = sessionStorage.getItem("userId");
    let blogId = sessionStorage.getItem("blogId");
    let title = $("#title").val();
    let description = $("#description").val();
    let content = editorr.getData();
    if (title === "") {
        $("#alerttt").empty();
        let content1 = `<h3 class="alert error"> Title cannot be blank!</h3>`
        $("#alerttt").append(content1);
        window.scrollTo(0, 0);
        $("#alerttt").show();
        setTimeout(function () {
            $('#alerttt').fadeOut('slow');
        }, 1000);
    } else if (content.length <= 300) {
        $("#alerttt").empty();
        let content1 = `<h3 class="alert error"> Minimum 300 characters is required</h3>`
        $("#alerttt").append(content1);
        window.scrollTo(0, 0);
        $("#alerttt").show();
        setTimeout(function () {
            $('#alerttt').fadeOut('slow');
        }, 1000);
    } else {
        let newBlog = {
            id: blogId,
            title: title,
            description: description,
            image: "",
            privacy: privacy,
            content: content,
            user: {
                id: userId
            }
        };
        let formData = new FormData;
        formData.append("file", $("#imageee")[0].files[0]);
        formData.append("blog", new Blob([JSON.stringify(newBlog)],
            {type: 'application/json'}))

        $.ajax({
            header: {},
            contentType: false,
            processData: false,
            type: "PUT",
            url: "http://localhost:8080/blogs/" + blogId ,
            data: formData,
            success: function () {
                $("#alerttt").empty();
                let content1 = `<h3 class="alert success"> Update Blog Successfully ! </h3>`
                $("#alerttt").append(content1);
                $("#alerttt").show();
                window.scrollTo(0, 0);

                setTimeout(function () {
                    $('#alerttt').fadeOut('slow');
                }, 1500);

                setTimeout(function () {
                    window.location.href = "index.html";
                }, 2500);

                editorr.setData('');
                $("#formmmmm")[0].reset();
            }
        })
    }
    event.preventDefault();
}


