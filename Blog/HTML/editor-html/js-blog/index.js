function startIndexPage() {
    getTags();
    getLatestBlogs();
    checkLogin();
    getBlogs(0);
    $("#data-search-table").hide();
    $("#alerttt").hide();

    event.preventDefault();
}

function checkLogin() {
    drawNavigationBarr();
    event.preventDefault();
}

function drawNavigationBarr() {
    let content = "";
    if (sessionStorage.getItem("userId") == null) {
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
                            <li><a href="update-profile.html">Profile</a></li>
                            <li><a href="user-manage-post.html">Manage Post</a></li>
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

function toAdminPage() {
    event.preventDefault();
    window.location.href = "../default/ltr/admin-user.html";
}

function toUserPage() {
    window.location.href = "../default/ltr/admin-blog-manager.html";
    event.preventDefault();
}

function logOut() {
    // alert("1")
    sessionStorage.removeItem("userId");
    window.location.href = "index.html";
    event.preventDefault();
    // alert("2")
}

function getBlogs(pageNumber) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/blogs/public?page=" + pageNumber + "&size=5",
        dataType: "json",
        success: function (data) {
            displayBlogs(data.content);
            displayGetOlderPost(pageNumber);
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                $('.navigation').hide();
            }
        }
    })
    event.preventDefault();
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

function displayGetOlderPost(pageNumber) {
    let getMorePost = `<div class="nav-previous">
<a href=" " onclick="getOlderPost(${pageNumber})">
<span class="meta-nav">←</span> Older posts</a></div>`
    document.getElementById("getMorePosts").innerHTML = getMorePost;
}

function getOlderPost(page) {
    event.preventDefault();
    getBlogs(page + 1);
}

function displayBlogs(data) {
    $.each(data, (i, blog) => {
        let totalComment = getTotalCommentsEachBLog(blog.id);
        let date = new Date(blog.createdDate);
        let month = date.toLocaleString('default', {month: 'short'});
        let day = date.getUTCDate();
        let year = date.getFullYear();
        let formattedDate = month + " " + day + " , " + year;

        let blogRow = `<article class="hentry post">

                                <header class="entry-header">
                                    <h1 class="entry-title"><a href="" onclick="readBlogDetail(${blog.id})">${blog.title}</a></h1>
                                   
                                    <div class="entry-meta">
                                        <span class="entry-date">
                                        <time class="entry-date"
                                                  datetime="2014-07-13T04:34:10+00:00">${formattedDate}</time>
                                        </span>
                                        <span class="comment-link">
                                            ${totalComment} comments
                                        </span>
                                        <span class="cat-links">
                                            <a rel="category tag">${blog.user.username}</a>
                                        </span>
                                    </div>
                                    
                                </header>
                                
                                <div class="featured-image">
                                    <a href="" onclick="readBlogDetail(${blog.id})">
                                        <img src="${blog.image}" alt="blog-image">
                                    </a>
                                </div>
                                
                                <div class="entry-content">
                                    <p>${blog.description}</p>
                                    <p>
                                        <span class="more">
                                            <a href="" onclick="readBlogDetail(${blog.id})" class="more-link">Continue reading <span
                                                    class="meta-nav">→</span></a>
                                        </span>
                                    </p>
                                </div>
                                <!-- .entry-content -->
                            </article>
                            <!-- .hentry -->`;
        $('#data-table').append(blogRow);
    })
}

function readBlogDetail(blogId) {
    sessionStorage.setItem("blogId", blogId);
    window.location.href = "blog-single.html";
    event.preventDefault();
}

function displayLatestBlogs(blog) {
    $('.recentPostSmellCode').empty();
    $.each(blog, (i, data) => {
        let content = `<li><a href="" onclick="readBlogDetail(${data.id})">${data.title}</a></li>`;
        $('.recentPostSmellCode').append(content);
    })
}

function getTotalCommentsEachBLog(blogId) {
    let totalComment = null;
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


function getTags() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/labels/getAll",
        dataType: "JSON",
        success: function (data) {
            $('#tagCloudSideBar').empty();
            $.each(data.content, (i, tag) => {
                let tagSidebar = `<a href="" onclick="getBlogsByLabelIdd(${tag.id},'${tag.name}')" style="font-size: 22pt;">${tag.name}</a>`;
                $('#tagCloudSideBar').append(tagSidebar);
            })

            $('#tagCloudFooter').empty();
            $.each(data.content, (i, tag) => {
                let tagSidebar = `<a href="" onclick="getBlogsByLabelIdd(${tag.id})" style="font-size: 22pt;">${tag.name}</a>`;
                $('#tagCloudFooter').append(tagSidebar);
                return i < 3;
            })
        }
    })
    event.preventDefault();
}

function getBlogsByLabelIdd(id, namee) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/labels/" + id + "/blogs",
        dataType: "json",
        success: function (data) {
            $("#data-table").hide();
            $("#getMorePosts").hide();
            // $("html, body").animate({scrollTop: 0}, 1000)
            window.scrollTo(0, 0);
            showResultFilterByBlogId(data.totalElements, namee)
            $('#data-search-table').show();
            displayBlogsFindByLabelId(data.content);
        }
    })
    event.preventDefault();
}

function showResultFilterByBlogId(number, tagNaem) {
    $("#alerttt").empty();
    let content = `<div class="alert success">"There are  ${number} results with  ${tagNaem}"</div>`
    $("#alerttt").append(content);
    $("#alerttt").show();
    event.preventDefault();
}

function displayBlogsFindByLabelId(data) {
    $('#data-search-table').empty();
    $.each(data, (i, blog) => {
        let totalComment = getTotalCommentsEachBLog(blog.id);
        let date = new Date(blog.createdDate);
        let month = date.toLocaleString('default', {month: 'short'});
        let day = date.getUTCDate();
        let year = date.getFullYear();
        let formattedDate = month + " " + day + " , " + year;

        let blogRow = `<article class="hentry post">

                                <header class="entry-header">
                                    <h1 class="entry-title"><a href="" onclick="readBlogDetail(${blog.id})">${blog.title}</a></h1>
                                   
                                    <div class="entry-meta">
                                        <span class="entry-date">
                                        <time class="entry-date"
                                                  datetime="2014-07-13T04:34:10+00:00">${formattedDate}</time>
                                        </span>
                                        <span class="comment-link">
                                            ${totalComment} comments
                                        </span>
                                        <span class="cat-links">
                                            <a rel="category tag">${blog.user.username}</a>
                                        </span>
                                    </div>
                                    
                                </header>
                                
                                <div class="featured-image">
                                    <a href="../blog-single.html">
                                        <img src="${blog.image}" alt="blog-image">
                                    </a>
                                </div>
                                
                                <div class="entry-content">
                                    <p>${blog.description}</p>
                                    <p>
                                        <span class="more">
                                            <a href="" onclick="readBlogDetail(${blog.id})" class="more-link">Continue reading <span
                                                    class="meta-nav">→</span></a>
                                        </span>
                                    </p>
                                </div>
                                <!-- .entry-content -->
                            </article>
                            <!-- .hentry -->`;
        $('#data-search-table').append(blogRow);
    })
    event.preventDefault();
}

function searchBlogs() {
    if(event.keyCode == 13) {
        let keyword = $("#getKeywordToSearch").val();
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/blogs/search?q=" + keyword,
            success: function (data) {
                window.scrollTo(0, 0);
                $('#data-table').empty();
                $("#alerttt").empty();
                let content = `<div class="alert success">"There are  ${data.totalElements} results with  ${keyword}"</div>`
                $("#alerttt").append(content);
                $("#alerttt").show();
                displayBlogs(data.content);
                $('#getKeywordToSearch').val('');
                $('.navigation').hide();
            }
        })
    }
}

function searchBlogss() {
    if(event.keyCode == 13) {
        let keyword = $("#search-field").val();
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/blogs/search?q=" + keyword,
            success: function (data) {
                window.scrollTo(0, 0);
                $('#data-table').empty();
                $("#alerttt").empty();
                let content = `<div class="alert success">"There are  ${data.totalElements} results with  ${keyword}"</div>`
                $("#alerttt").append(content);
                $("#alerttt").show();
                $(".search-toggle").trigger("click");
                $( "#search-field" ).val("");
                displayBlogs(data.content);
                $('#getKeywordToSearch').val('');
                $('.navigation').hide();
            }
        })
    }
}