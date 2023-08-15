function startUserBLogManager(page) {
    getBLogsByUserId(page);
    event.preventDefault();
}

let userID = sessionStorage.getItem("userId");

function getBLogsByUserId(page) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://localhost:8080/users/" + userID + "/blogs?page=" + page + "&size=5",
        success: function (data) {
            displayBlogsByUser(data.content);
            displayPage(data);

            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
            }
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
            }
        }
    })
    event.preventDefault();
}

function displayBlogsByUser(blogs) {
    if (blogs.length === 0) {
        $("#user-blog-data-table").hide();
        $("#paginationn").hide();
        let content = `  <!-- .entry-content -->
                          <div class="entry-content">
                
                                <!-- .project-action -->
                                <div class="project-action">
                                    <div class="row">
                                    <div class="col-md-4"></div>
                                    <div class="col-md-4">
                                            <a href="post-blog.html" class="button">Post the very first BLog ?<br>Click Here</a>
                                    </div>
                                    <div class="col-md-4"></div>
                                </div>
                                   
                                </div>
                                <!-- .project-action -->
            
                            </div>
                            <!-- entry-content --> `

        $("#veryFirstBLog").append(content);
    } else {
        $("#user-blog-data-table tbody").empty();
        let count = 1;
        $.each(blogs, (i, blog) => {
            let setPrivacy = `<a style="font-size: 9px" 
                            class="button green" href="" 
                            onclick="changePrivacy(${blog.id})">Public</a>`
            if (blog.privacy === false) {
                setPrivacy = `<a style="font-size: 9px" 
                            class="button" href="" 
                            onclick="changePrivacy(${blog.id})">Private</a>`
            }
            let totalComment = getTotalCommentsEachBLog(blog.id)
            let content = `<tr>
                            <td>${count++}</td>
                            <td><a href="" onclick="readBlogDetails(${blog.id})">${blog.title}</a> </td>
                            <td width="10%">${blog.createdDate}</td>
                            <td width="20%"><img src="${blog.image}" alt=""></td>
                            <td>${blog.description}></td>
                            <td>${totalComment}</td>
                            <td width="10%">` + setPrivacy + `</td>
                            <td>
                                <div class="nav-menu">
                                    <ul>
                                        <li><a style="font-size: 11px" 
                            class="button" href=""  
                         >Hover Here</a>
                                            <ul>
                                                <li><a href="" onclick="editBlog(${blog.id})">Edit</a></li>
                                                <li><a href="" onclick="deleteBlog(${blog.id})">Delete</a></li>
                                            </ul>
                                        </li>
                                      
                                    </ul>
                                </div>
                            </td>
                        </tr>`
            $("#user-blog-data-table tbody").append(content);
        })
    }

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

function readBlogDetails(blogId) {
    sessionStorage.setItem("blogId", blogId);
    window.location.href = "blog-single.html";
    event.preventDefault();
}

function changePrivacy(id) {
    $.ajax({
        type: "PUT",
        url: "http://localhost:8080/blogs/" + id + "/privacy",
        dataType: "json",
        success: function () {
            getBLogsByUserId(0);
        }
    })
    event.preventDefault();
}

//hàm hiển thị phần chuyển page
function displayPage(data) {
    let content = `<a href="" class="btn" id="backup" onclick="isPrevious(${data.pageable.pageNumber})">Previous</a>
    <span>${data.pageable.pageNumber + 1} / ${data.totalPages}</span>
    <a href="" class="btn" id="next" onclick="isNext(${data.pageable.pageNumber})">Next</a>`
    document.getElementById('paginationn').innerHTML = content;
}

function isPrevious(pageNumber) {
    getBLogsByUserId(pageNumber - 1);
    event.preventDefault();
}

function isNext(pageNumber) {
    getBLogsByUserId(pageNumber + 1);
    event.preventDefault();
}

// function deleteBlog(id) {
//
//     event.preventDefault();
// }

function deleteBlog(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "DELETE",
                url: `http://localhost:8080/blogs/` + id,
                success: function () {
                    Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Delete Successfully!',
                            showConfirmButton: false,
                            timer: 1000
                        }
                    );
                    getBLogsByUserId();
                }
            })
        }
    })
    event.preventDefault();
}

function editBlog(id) {
    sessionStorage.setItem("blogId", id);
    window.location.href = "edit-blog.html";
    event.preventDefault();
}

function searchBlogsss() {
    if (event.keyCode == 13) {
        let keyword = $("#search-field").val();
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/blogs/search/user?q=" + keyword + "&id=" + userID,
            success: function (data) {
                window.scrollTo(0, 0);
                // $('#user-blog-data-table').empty();
                $("#alertttt").empty();
                let content = `<h3 class="alert success">"There are  ${data.totalElements} results with  ${keyword}"</h3>`
                $("#alertttt").append(content);
                $("#alertttt").show();
                $(".search-toggle").trigger("click");
                $("#search-field").val("");
                displayBlogsByUserr(data.content);
                $('#getKeywordToSearch').val('');
                displayPage(data);

                if (data.pageable.pageNumber === 0) {
                    document.getElementById("backup").hidden = true
                }
                if (data.pageable.pageNumber + 1 === data.totalPages) {
                    document.getElementById("next").hidden = true
                }
            }
        })
    }
}

function displayBlogsByUserr(blogs) {
    $("#user-blog-data-table tbody").empty();
    let count = 1;
    $.each(blogs, (i, blog) => {
        let setPrivacy = `<a style="font-size: 9px" 
                            class="button green" href="" 
                            onclick="changePrivacy(${blog.id})">Public</a>`
        if (blog.privacy === false) {
            setPrivacy = `<a style="font-size: 9px" 
                            class="button" href="" 
                            onclick="changePrivacy(${blog.id})">Private</a>`
        }
        let totalComment = getTotalCommentsEachBLog(blog.id)
        let content = `<tr>
                            <td>${count++}</td>
                            <td><a href="" onclick="readBlogDetails(${blog.id})">${blog.title}</a> </td>
                            <td width="10%">${blog.createdDate}</td>
                            <td width="20%"><img src="${blog.image}" alt=""></td>
                            <td>${blog.description}></td>
                            <td>${totalComment}</td>
                            <td width="10%">` + setPrivacy + `</td>
                            <td>
                                <div class="nav-menu">
                                    <ul>
                                        <li><a style="font-size: 11px" 
                            class="button" href=""  
                         >Hover Here</a>
                                            <ul>
                                                <li><a href="" onclick="editBlog(${blog.id})">Edit</a></li>
                                                <li><a href="" onclick="deleteBlog(${blog.id})">Delete</a></li>
                                            </ul>
                                        </li>
                                      
                                    </ul>
                                </div>
                            </td>
                        </tr>`
        $("#user-blog-data-table tbody").append(content);
    })
}

