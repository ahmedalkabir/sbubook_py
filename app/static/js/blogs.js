(function(){
    let PostBtn = document.getElementById('addPost');
    let PostSelector = document.getElementsByName('opt');
    let titleInput = document.getElementById('title');
    let authorInput = document.getElementById('author');
    let ImageInput = document.getElementById('url_image');

    // global variable for editing selector
    let idPost = null;
    tinymce.init({
        selector:'textarea#trump'
        });

    PostBtn.addEventListener('click', () => {
        if((PostSelector[0].checked === true) && (titleInput.value !== "") && (authorInput.value !== "")){
            let data = {"title_post":titleInput.value,
            "author_post":authorInput.value,
            "image_post":ImageInput.value,
            "content_post":tinyMCE.activeEditor.getContent()};

            makeRequest('blog/add_post', JSON.stringify(data), () => {
                if(httpRequest.readyState === XMLHttpRequest.DONE){
                    if(httpRequest.status === 200){
                        let responedJSON = JSON.parse(httpRequest.responseText);
                        if(responedJSON.status === true){
                            alert(responedJSON.messages)
                        }else{
                            alert(responedJSON.messages)
                        }
                    }
                }
            });

        }else if((PostSelector[1].checked === true) && (titleInput.value !== "") && (authorInput.value !== "")){
            let data = {"id_post":idPost,
            "name_post":titleInput.value,
            "author_post":authorInput.value,
            "image_post":ImageInput.value,
            "content_post":tinyMCE.activeEditor.getContent()};

            makeRequest('posts/edit_post', JSON.stringify(data), ()=>{
                if(httpRequest.readyState === XMLHttpRequest.DONE){
                    if(httpRequest.status === 200){
                        UIkit.modal.alert('تم التعديل');
                    }
                }
            });
        }
    });


    // edit post selector
    PostSelector[1].addEventListener('change', () =>{
        makeRequest('posts/get_post','',() => {
            removePostsTable();

            if(httpRequest.readyState === XMLHttpRequest.DONE){
                if(httpRequest.status === 200){
                    var encoded_json_data = JSON.parse(httpRequest.responseText);
                    for(let i=0; i< encoded_json_data.length; i++){
                        addPostsToList(encoded_json_data[i].post_id,encoded_json_data[i].post_title);
                    }

                    attachedDeleteEventToButtons();
                    attachedEditEventToButtons();
                }
            }
        });
    });
    // Request function
    function makeRequest(url, data, callback){
        httpRequest = new XMLHttpRequest();

        if(!httpRequest){
            alert('Cannot create an XMLHTTP instance');
            return false;
        }
        httpRequest.onreadystatechange = callback;
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json; charset=utf8');
        httpRequest.send(data);
    }

    // add subjects to list
    function addPostsToList(id, name){

        var editBtn = document.createElement('button');
        editBtn.className = "uk-button uk-button-primary editPost";
        editBtn.type = "button";
        editBtn.innerHTML = "تعديل المقالة";

        var deleteBtn = document.createElement('button');
        deleteBtn.className = "uk-button uk-button-primary deletePost";
        deleteBtn.type = "button";
        deleteBtn.innerHTML = "حذف المقالة";

        var TableDataElement = [document.createElement('td')
        ,document.createElement('td'),document.createElement('td'),document.createElement('td')];
        TableDataElement[0].appendChild(editBtn);
        TableDataElement[1].appendChild(deleteBtn);
        TableDataElement[2].textContent = id;
        TableDataElement[3].textContent = name;

        var TableRowElement = document.createElement('tr');
        TableRowElement.className = "rowSubject";
        TableRowElement.appendChild(TableDataElement[0]);
        TableRowElement.appendChild(TableDataElement[1]);
        TableRowElement.appendChild(TableDataElement[2]);
        TableRowElement.appendChild(TableDataElement[3]);

        var TableBodyElement = document.getElementsByTagName('tbody');
        TableBodyElement[0].appendChild(TableRowElement);
    }

    // remove posts
    function removePostsTable(){
        document.getElementsByTagName('tbody')[0].innerHTML = "";
    }

    // attach events to the buttons
    function attachedDeleteEventToButtons(){
        var btn = document.getElementsByClassName('deletePost');
        for(let i=0; i < btn.length; i++){
            btn[i].addEventListener('click', () => {
                var id = btn[i].parentNode.parentNode.querySelectorAll('td')[2].outerText;

                var data = {"id_post": id};
                makeRequest('posts/delete_post', JSON.stringify(data));

                var tBodyElement = document.getElementsByTagName('tbody')[0];
                tBodyElement.removeChild(btn[i].parentNode.parentNode);
            });
        }
    }

    function attachedEditEventToButtons(){
        var btn = document.getElementsByClassName('editPost');
        for(let i=0; i < btn.length; i++){
            btn[i].addEventListener('click', () => {
                var id = btn[i].parentNode.parentNode.querySelectorAll('td')[2].outerText;

                var data = {"id_post": id};
                makeRequest('posts/get_post', JSON.stringify(data),() => {

                    if(httpRequest.readyState === XMLHttpRequest.DONE){
                        if(httpRequest.status === 200){
                            var encoded_json_data = JSON.parse(httpRequest.responseText);
                            idPost = encoded_json_data[0].post_id;
                            titleInput.value = encoded_json_data[0].post_title;
                            authorInput.value = encoded_json_data[0].post_user;
                            ImageInput.value = encoded_json_data[0].post_image;
                            tinymce.activeEditor.setContent(encoded_json_data[0].post_content);

                            PostBtn.innerText = "تعديل المقالة";
                        }
                    }

                });
            });
        }
    }
})();