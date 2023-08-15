function startPostBlogPage() {
    // ClassicEditor
    //     .create(document.querySelector('#your-message'))
    //     .catch(error => {
    //         console.error(error);
    //     });

    // let editor;

    ClassicEditor
        .create( document.querySelector( '#your-message' ) )
        .then( newEditor => {
            editor = newEditor;
        } )
        .catch( error => {
            console.error( error );
        } );

    $("#alerttt").hide();

    let date = new Date().toDateString();
    $("#date").val(date);
}

let editor;



function getValueToCreateBog() {
    let privacy = true;
    if ($("input[name='privacy']:checked").val() === "false") {
        privacy = false;
    }

    let userId = sessionStorage.getItem("userId");
    let title = $("#title").val();
    let description = $("#description").val();
    let content = editor.getData();
    if (title === "") {
        $("#alerttt").empty();
        let content1 = `<h3 class="alert error"> Title cannot be blank!</h3>`
        $("#alerttt").append(content1);
        window.scrollTo(0, 0);
        $("#alerttt").show();
        setTimeout(function () {
            $('#alerttt').fadeOut('slow');
        }, 1000);
        // $("#formmmmm")[0].reset();
    } else if (content.length <= 300) {
        $("#alerttt").empty();
        let content1 = `<h3 class="alert error"> 300 characters must be minimum</h3>`
        $("#alerttt").append(content1);
        window.scrollTo(0, 0);
        $("#alerttt").show();
        setTimeout(function () {
            $('#alerttt').fadeOut('slow');
        }, 1000);
        // $("#formmmmm")[0].reset();
    } else {
        let newBlog = {
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
            type: "POST",
            url: "http://localhost:8080/blogs",
            data: formData,
            success: function () {
                $("#alerttt").empty();
                let content1 = `<h3 class="alert success"> New Blog Created Successfully ! </h3>`
                $("#alerttt").append(content1);
                $("#alerttt").show();
                window.scrollTo(0, 0);

                setTimeout(function () {
                    $('#alerttt').fadeOut('slow');
                }, 1500);

                setTimeout(function () {
                    window.location.href = "index.html";
                }, 2500);

                $("#formmmmm")[0].reset();
                editor.setData('');
            }
        })
    }
    event.preventDefault();
}

