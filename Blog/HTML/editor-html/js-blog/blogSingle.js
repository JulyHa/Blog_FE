function startBlogSingle() {
    getTags();
    getLatestBlogs();
    checkLogin();
    getBlogDetails();
    getTagsByBlog();
    getTagsbyBLogId();
    getAllCommentsByBLogId()
    event.preventDefault();
}

function getTagsByBlog() {
    $.ajax({
        type: "GET",
    })
}

function getBlogDetails() {
    let id = sessionStorage.getItem("blogId");
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/blogs/" + id,
        dataType: "json",
        success: function (data) {
            displayBlogDetails(data);
        }
    })
    event.preventDefault();
}

function displayBlogDetails(blog) {
    let totalComment = getTotalCommentsEachBLog(blog.id) + " comments";
    let date = new Date(blog.createdDate);
    let month = date.toLocaleString('default', {month: 'short'});
    let day = date.getUTCDate();
    let year = date.getFullYear();
    let formattedDate = month + " " + day + " , " + year;
    let blogImage = `<img src="${blog.image}" alt="blog-image">`
    let authorAvatar = `<img alt="Johnny Doe" src="${blog.user.avatar}" class="avatar">`


    $("#blogTitle").text(blog.title);
    $("#blogtCreatedDate").text(formattedDate);
    $("#blogtTotalComments1").text(totalComment);
    $("#bloggAuthor").html(blog.user.username);
    $("#bloggImage").html(blogImage);
    $("#bloggContentt").html(blog.content);
    $("#totalCommentsResponArea").text(totalComment);
    $("#authorrImage").html(authorAvatar);
    $("#authorBloggName").text(blog.user.username)


    event.preventDefault();
}

function getTags() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/labels/getAll",
        dataType: "JSON",
        success: function (data) {
            $('#tagCloudSideBar').empty();
            $.each(data.content, (i, tag) => {
                let tagSidebar = `<a href="#" style="font-size: 22pt;">${tag.name}</a>`;
                $('#tagCloudSideBar').append(tagSidebar);
            })

            $('#tagCloudFooter').empty();
            $.each(data.content, (i, tag) => {
                let tagSidebar = `<a href="#" style="font-size: 22pt;">${tag.name}</a>`;
                $('#tagCloudFooter').append(tagSidebar);
                return i < 3;
            })
        }
    })
}

function getLatestBlogs() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/blogs/latestBlog",
        dataType: "json",
        success: function (data) {
            displayLatestBlogs(data.content);
        }
    })
    event.preventDefault()
}

function checkLogin() {
    let content = "";
    if (sessionStorage.getItem("userId") == null) {
        $("#respondd").hide();
        content = `<img alt="" src="images/site/default-avatar.jpg"
                             class="avatar avatar-44 photo"
                             height="35" width="35" style="border-radius: 50%">
                        <ul>
                            <li><a href="login-register.html">Login/Register</a></li>
                        </ul>`
    } else {
        let userAvatarr = findAvatarUserByUserId(sessionStorage.getItem("userId"));
        let userNamee = findUserNameByUserId(sessionStorage.getItem("userId"));
        if (sessionStorage.getItem("userRole") == 1) {
            content = `<img alt="" src="${userAvatarr}"
                             class="avatar avatar-44 photo"
                             height="35" width="35" style="border-radius: 50%">
                        <ul>
                 
                            <li><a >Hi ${userNamee}</a></li>
                            <li><a href="post-blog.html">Post New Blog</a></li>
                            <li><a href="blog-simple.html">Profile</a></li>
                            <li><a href="user-manage-post.html"">Manage Post</a></li>
                            <li><a href="" onclick="logOut()">Logout</a></li>
                        </ul>`
        } else {
            content = `<img alt="" src="${userAvatarr}"
                             class="avatar avatar-44 photo"
                             height="35" width="35" style="border-radius: 50%">
                        <ul>
                            <li><a href="" onclick="toAdminPage()">Go to Admin Page</a></li>
                            <li><a href="" onclick="logOut()">Logout</a></li>
                        </ul>`
        }

    }
    $("#checkLogin").html(content);
}

function getTotalCommentsEachBLog(blogId) {
    let totalComment = 0;
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/comments/" + blogId,
        dataType: "JSON",
        async: false,
        success: function (data) {
            totalComment = data.totalElements;
        }
    })
    return totalComment;
}

function logOut() {
    sessionStorage.removeItem("userId");
    window.location.href = "index.html";
    event.preventDefault();
}

function toAdminPage() {
    event.preventDefault();
    window.location.href = "../default/ltr/admin-user.html";
}

function toUserPage() {
    window.location.href = "../default/ltr/admin-blog-manager.html";
    event.preventDefault();
}

function displayLatestBlogs(blog) {
    $('.recentPostSmellCode').empty();
    $.each(blog, (i, data) => {
        let content = `<li><a href="" onclick="readBlogDetail(${data.id})">${data.title}</a></li>`;
        $('.recentPostSmellCode').append(content);
    })
}

function readBlogDetail(blogId) {
    sessionStorage.setItem("blogId", blogId);
    window.location.href = "blog-single.html";
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

function findUserNameByUserId(id) {
    let nameee = null;
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/users/" + id,
        dataType: "json",
        async: false,
        success: function (data) {
            nameee = data.username;
        }
    })
    return nameee;
}

function getTagsbyBLogId() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/labels/blog/" + sessionStorage.getItem("blogId"),
        dataType: "json",
        success: function (data) {
            displayTagsForBLog(data.content)
        }
    })

    function displayTagsForBLog(tags) {
        $("#tagCloudOfBloggs").empty();
        $.each(tags, (i, tag) => {
            tagNameName = `<a rel="tag">${tag.name}</a>`;
            $("#tagCloudOfBloggs").append(tagNameName);
        })

    }
}

function getAllCommentsByBLogId() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/comments/" + sessionStorage.getItem("blogId"),
        dataType: "json",
        success: function (data) {
            displayComments(data.content);
        }
    })

    function displayComments(comments) {
        $("#commentListtt").empty();
        $.each(comments, (i, comment) => {
            let content = `<ol class="commentlist">
                                <li class="comment even thread-even depth-1">

                                    <!-- #comment-## -->
                                    <article class="comment">

                                        <!-- .comment-meta -->
                                        <header class="comment-meta comment-author vcard">
                                            <img alt="" src="${comment.user.avatar}" class="avatar" height="75"
                                                 width="75">
                                            <cite class="fn"><a rel="external nofollow" class="url">${comment.user.username}</a></cite>
                                            <span class="comment-date">${comment.date}</span>
                                        </header>
                                        <!-- .comment-meta -->

                                        <!-- .comment-content -->
                                        <section class="comment-content comment">
                                            <p>${comment.content}</p>
                                        </section>
                                        <!-- .comment-content -->
                                    </article>
                                    <!-- #comment-## -->
                                </li>
                                <!-- .comment depth-1 -->
                            </ol>
<hr>`;
            $("#commentListtt").append(content);
        })
    }
}

function submitComment() {
    let contentComment = $("#comment").val();
    let userId = sessionStorage.getItem("userId");
    let blogId = sessionStorage.getItem("blogId")

    if (contentComment !== "") {
        let newComment = {
            content: contentComment,
            user: {
                id: userId
            },
            blog: {
                id: blogId
            }
        };

        $.ajax({
            header: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            type: "POST",
            data: JSON.stringify(newComment),
            contentType: 'application/json',
            dataType: 'json',
            url: "http://localhost:8080/comments",
            success: function () {
                $("#comment").val("");
                startBlogSingle();
            }
        })
    }
    event.preventDefault();
}
