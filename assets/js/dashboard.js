let token = window.sessionStorage.getItem("token");

if(!token){
    window.location = '/';
}

let posts = [];
fillInUserDetails(window.localStorage.getItem("name"),window.localStorage.getItem("email"));
getPosts();

function fillInUserDetails(name,email){
    $(".userEmail").text(email);
    $(".userName").text(name);

    $(".userEmail").val(email);
    $(".userName").val(name);
}

function getPosts(){
    submitForm('GET','/api/post',null,(err,response) => {
        console.log(err,response);
        if(!err && response){
            if(response.success){
                posts = [...response.data ];
                for(let post of response.data){
                    let postContent = `<div class="col-md-4 mb-4 mb-md-0">
                    <div class="card card-style">
                        <h5 class="card-header py-4">{{title}}</h5>
                            <div class="card-body">
                                <h5 class="card-title">{{subtitle}}</h5>
                                <p class="card-text">{{body}}</p>
                                <div class="text-muted" style="float:right;">
                                    {{timeAgo}}
                                </div>
                                <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#editPostModal" data-post={{post}} onclick="fillInEditPostModal(this)">Edit</a>
                                <button class="btn btn-danger deletePostButton" data-post={{post}} onclick="deletePost(this)">Delete</button>
                            </div>
                        </div>
                    </div>`
                .replace("{{title}}",post.title)
                .replace("{{subtitle}}",post.subtitle)
                .replace("{{body}}",post.body)
                .replace("{{post}}",post._id)
                .replace("{{timeAgo}}",moment(post.createdAt).fromNow(true));

                    $("#postsContainer").append(postContent);
                }
                if(!posts.length){
                    $("#postsContainer").append(`
                    <div class="col-md-5 mb-4 mb-md-0 alert alert-primary" style="text:center;">
                        <h4>You have no posts yet. Click the new post button to start blogging now!</h4>
                    </div>
                    `);
                }
            } else {
                showErrorMessage(err);
            }
        } else {
            showErrorMessage(err);
        }
    })
}


function deletePost(event){
    let postId = event.getAttribute("data-post");

    submitForm("DELETE",`/api/post/${postId}`,null,(err,response) => {
        if(!err && response){
            if(response.success){
                Swal.fire("Success","Post deleted","success");
                window.location.reload();
            } else {
                showErrorMessage(err);
            }
        } else {
            showErrorMessage(err);
        }
    });
}


function fillInEditPostModal(event){
    let postToEdit = event.getAttribute("data-post");

    let postData = posts.find((post) => {
        return post._id == postToEdit;
    });

    $("#editPostForm .title").val(postData.title);
    $("#editPostForm .subtitle").val(postData.subtitle);
    $("#editPostForm .body").text(postData.body);
    $("#editPostForm").attr("data-post",postData._id);
}
