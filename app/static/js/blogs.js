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
            let data = {"id":idPost,
            "title_post":titleInput.value,
            "author_post":authorInput.value,
            "image_post":ImageInput.value,
            "content_post":tinyMCE.activeEditor.getContent()};

            makeRequest('blog/edit_post', JSON.stringify(data), ()=>{
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
        makeRequest('blog/get_posts','',() => {
            removePostsTable();

            if(httpRequest.readyState === XMLHttpRequest.DONE){
                if(httpRequest.status === 200){
                    var encoded_json_data = JSON.parse(httpRequest.responseText);
                    for(let i=0; i< encoded_json_data.length; i++){
                        addPostsToList(encoded_json_data[i].id,encoded_json_data[i].title_post);
                    }

                    attachedDeleteEventToButtons();
                    attachedEditEventToButtons();
                }
            }
        });
    });

    // add subjects to list
    function addPostsToList(id, name){

        let editBtn = document.createElement('button');
        editBtn.className = "uk-button uk-button-primary editPost";
        editBtn.type = "button";
        editBtn.innerHTML = "تعديل المقالة";

        let deleteBtn = document.createElement('button');
        deleteBtn.className = "uk-button uk-button-primary deletePost";
        deleteBtn.type = "button";
        deleteBtn.innerHTML = "حذف المقالة";

        let TableDataElement = [document.createElement('td')
        ,document.createElement('td'),document.createElement('td'),document.createElement('td')];
        TableDataElement[0].textContent = id;
        TableDataElement[1].textContent = name;
        TableDataElement[2].appendChild(editBtn);
        TableDataElement[3].appendChild(deleteBtn);

        let TableRowElement = document.createElement('tr');
        TableRowElement.className = "rowSubject";
        TableRowElement.appendChild(TableDataElement[0]);
        TableRowElement.appendChild(TableDataElement[1]);
        TableRowElement.appendChild(TableDataElement[2]);
        TableRowElement.appendChild(TableDataElement[3]);

        let TableBodyElement = document.getElementsByTagName('tbody');
        TableBodyElement[0].appendChild(TableRowElement);
    }

    // remove posts
    function removePostsTable(){
        document.getElementsByTagName('tbody')[0].innerHTML = "";
    }

    // attach events to the buttons
    function attachedDeleteEventToButtons(){
        let btn = document.getElementsByClassName('deletePost');
        for(let i=0; i < btn.length; i++){
            btn[i].addEventListener('click', () => {
                let id = btn[i].parentNode.parentNode.querySelectorAll('td')[0].outerText;

                let data = {"id": id};
                makeRequest('blog/delete_post', JSON.stringify(data), () => {
                    if(httpRequest.readyState === httpRequest.DONE){
                        if(httpRequest.status === 200){
                            let responedJSON = JSON.parse(httpRequest.responseText);
                            if(responedJSON.status){
                                UIkit.modal.alert(responedJSON.messages);
                            }else{
                                UIkit.modal.alert(responedJSON.messages);
                            }
                        }
                    }
                });

                let tBodyElement = document.getElementsByTagName('tbody')[0];
                tBodyElement.removeChild(btn[i].parentNode.parentNode);
            });
        }
    }

    function attachedEditEventToButtons(){
        let btn = document.getElementsByClassName('editPost');
        for(let i=0; i < btn.length; i++){
            btn[i].addEventListener('click', () => {
                let id = btn[i].parentNode.parentNode.querySelectorAll('td')[0].outerText;

                let data = {"id_post": id};
                makeRequest('blog/get_post', JSON.stringify(data),() => {

                    if(httpRequest.readyState === XMLHttpRequest.DONE){
                        if(httpRequest.status === 200){
                            let encoded_json_data = JSON.parse(httpRequest.responseText);
                            console.log(encoded_json_data);
                            idPost = encoded_json_data.id;
                            titleInput.value = encoded_json_data.title_post;
                            authorInput.value = encoded_json_data.author_post;
                            ImageInput.value = encoded_json_data.image_post;
                            tinymce.activeEditor.setContent(encoded_json_data.content_post);

                            PostBtn.innerText = "تعديل المقالة";
                        }
                    }

                });
            });
        }
    }

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
})();