(function(){
    var codeEdit = document.getElementById('code');
    var nameEdit = document.getElementById('name');
    var addDepartBtn = document.getElementById('addDepartment');
    var editDepartBtn = document.getElementById('editDepartment');
    var refreshElement = document.getElementsByClassName('refresh');
    var departmentSelector = document.getElementsByClassName('departmentSelector');


    addDepartBtn.addEventListener('click', () => {
        if((codeEdit.value !== "") && (nameEdit.value !== "")){
            var data = {"code":codeEdit.value,
                        "name":nameEdit.value};
            makeRequest('departments/add_department',JSON.stringify(data), () => {
                if(httpRequest.readyState === XMLHttpRequest.DONE){
                    if(httpRequest.status === 200){
                        codeEdit.value = "";
                        nameEdit.value = "";
                    }
                }
            });
        }
    });

    // editing
    editDepartBtn.addEventListener('click', () => {
        var edit = document.getElementsByClassName('uk-input edit');
        if((edit[0].value !== "") && (edit[1].value !== "")){
            var data = {"id":departmentSelector[0].value,
                        "code":edit[0].value,
                        "name":edit[1].value};
            makeRequest('departments/edit_department',JSON.stringify(data), () => {
                if(httpRequest.readyState === XMLHttpRequest.DONE){
                    if(httpRequest.status === 200){
                        edit[0].value = "";
                        edit[1].value = "";
                        console.log("Done");
                    }
                }
            });
        }
    });

    // by click refresh buttons add department to the list
    refreshElement[0].addEventListener('click', () =>{
        makeRequest('departments/get_departments', '', () =>{
            if(httpRequest.readyState === XMLHttpRequest.DONE){
                if(httpRequest.status === 200){
                    //delete old element
                    removeBooksTable();

                    var json_data = JSON.parse(httpRequest.responseText);
                    for(let i=0;i<json_data.length; i++){
                        addDepartmentToList(json_data[i].code_department,json_data[i].name_department);
                    }
                    attachedEventToButtons();
                }
            }
        });
    });

    // add department to the selector
    (function(){
        var departmentSelector = document.getElementsByClassName('departmentSelector');
        makeRequest('departments/get_departments','',() => {
            if(httpRequest.readyState === XMLHttpRequest.DONE){
                if(httpRequest.status === 200){
                    var encoded_json_data = JSON.parse(httpRequest.responseText);
                    for(let i=0;i < encoded_json_data.length; i++){
                        
                        var OptEl = document.createElement('option');
                        OptEl.className = "addBook";
                        OptEl.value = encoded_json_data[i].id;
                        OptEl.innerText = encoded_json_data[i].name_department;
                        departmentSelector[0].appendChild(OptEl);
                    }
                }
            }
        });
    })();


    //for departmentSelctor
    departmentSelector[0].addEventListener('change', () => {
        var edit = document.getElementsByClassName('uk-input edit');
        makeRequest('departments/get_departments','',() => {
            if(httpRequest.readyState === XMLHttpRequest.DONE){
                if(httpRequest.status === 200){
                    var encoded_json_data = JSON.parse(httpRequest.responseText);
                    for(let i = 0;i < encoded_json_data.length; i++){
                        if(encoded_json_data[i].id == departmentSelector[0].value){
                            edit[0].value = encoded_json_data[i].code_department;
                            edit[1].value = encoded_json_data[i].name_department;
                        }
                    }
                }
            }
        });
    });

    // attach events to the buttons
    function attachedEventToButtons(){
        var btn = document.getElementsByClassName('deleteDepartment');
        for(let i=0; i < btn.length; i++){
            btn[i].addEventListener('click', () => {
                var code = btn[i].parentNode.parentNode.querySelectorAll('td')[1].outerText;

                var data = {"code": code};
                makeRequest('departments/delete_department', JSON.stringify(data));

                var tBodyElement = document.getElementsByTagName('tbody')[0];
                tBodyElement.removeChild(btn[i].parentNode.parentNode);
            });
        }
    }
    // add departments to the list
    function addDepartmentToList(code, name){
        
        var CheckInput = document.createElement('button');
        CheckInput.className = "uk-button uk-button-primary deleteDepartment";
        CheckInput.type = "button";
        CheckInput.innerHTML = "حذف القسم";

        var TableDataElement = [document.createElement('td')
        ,document.createElement('td'),document.createElement('td')];
        TableDataElement[0].appendChild(CheckInput);
        TableDataElement[1].textContent = code;
        TableDataElement[2].textContent = name;

        var TableRowElement = document.createElement('tr');
        TableRowElement.className = "rowSubject";
        TableRowElement.appendChild(TableDataElement[0]);
        TableRowElement.appendChild(TableDataElement[1]);
        TableRowElement.appendChild(TableDataElement[2]);

        var TableBodyElement = document.getElementsByTagName('tbody');
        TableBodyElement[0].appendChild(TableRowElement);
    }

    // remove All Books
    function removeBooksTable(){
        document.getElementsByTagName('tbody')[0].innerHTML = "";
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