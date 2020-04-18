
$("#signupForm").on('submit',(e) => {
    e.preventDefault();

    let accountData = {
        name : $("#signupForm .name").val(),
        password : $("#signupForm .password").val(),
        email : $("#signupForm .email").val()
    }
    submitForm('POST','/api/user/signup',accountData,(err,response) => {
        console.log(err,response);

        if(!err && response){
            if(response.success){
                authorizeUser(response);
            } else {
                Swal.fire("Error",response.message,'error');
            }
        } else {
            showErrorMessage(err);
        }
    })
});

$("#signinForm").on('submit',(e) => {
    e.preventDefault();

    let accountData = {
        password : $("#signinForm .password").val(),
        email : $("#signinForm .email").val()
    }
    console.log(accountData);
    submitForm('POST','/api/user/signin',accountData,(err,response) => {
        console.log(err,response);

        if(!err && response){
            if(response.success){
                authorizeUser(response);
            } else {
                Swal.fire("Error",response.message,'error');
            }
        } else {
            showErrorMessage(err);
        }
    })
});

$("#updateUserButton").on('click',(e) => {
    let data = {
        name : $("#updateUserForm .userName").val(),
        email : $("#updateUserForm .userEmail").val()
    }
    console.log(data);
    submitForm('PUT','/api/user/update',data,(err,response) => {
        if(!err && response){
            if(response.success){
                Swal.fire("Success",response.message,"success");
                window.localStorage.setItem("name",response.data.name);
                window.localStorage.setItem("email",response.data.email);
                window.location.reload();
            } else{
                Swal.fire("Error",response.message,"error");
            }
        } else {
            showErrorMessage(err);
        }
    })
});

$("#createPostForm").on('submit',(e) => {
    e.preventDefault();

    let postData = {
        title : $("#createPostForm .title").val(),
        subtitle : $("#createPostForm .subtitle").val(),
        body : $("#createPostForm .body").val()
    }
    submitForm('POST','/api/post/new',postData,(err,response) => {
        console.log(err,response);

        if(!err && response){
            if(response.success){
                Swal.fire("Success",response.message,"success");
                window.location.reload();
            } else {
                Swal.fire("Error",response.message,'error');
            }
        } else {
            showErrorMessage(err);
        }
    })
});

$("#editPostForm").on('submit',(e) => {
    e.preventDefault();

    let postId = e.target.getAttribute("data-post");
    let updatePostData = {
        title : $("#editPostForm .title").val(),
        subtitle : $("#editPostForm .subtitle").val(),
        body : $("#editPostForm .body").val()
    }
    submitForm("PUT",`/api/post/${postId}`,updatePostData,(err,response) => {
        console.log(err,response);
        if(!err && response){
            if(response.success){
                Swal.fire("Success","Post updated","success");
                window.location.reload();
            } else {
                showErrorMessage(err);
            }
        } else {
            showErrorMessage(err);
        }
    });
});


function authorizeUser(response){
    Swal.fire("Success",response.message,'success');
    window.sessionStorage.setItem("token",response.token);
    window.localStorage.setItem("name",response.data.name);
    window.localStorage.setItem("email",response.data.email);
    window.location = "/dashboard.html";
}
function submitForm(method,url,formData,cb){
    $.ajax({
        method : method,
        url : url,
        data : formData,
        headers : {
            token : `${window.sessionStorage.getItem("token")}`
        }
    })
    .done((response) => {
        return cb(null,response);
    })
    .catch((err) => {
        return cb(err,null);
    })
};

function showErrorMessage(err){
    let response = JSON.parse(err.responseText);
    return Swal.fire("Error",response.message,"error");
}


$(".signOutButton").on('click',(e) => {
    window.sessionStorage.clear();
    window.location = "/";
});