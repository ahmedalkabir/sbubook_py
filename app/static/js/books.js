(function(){

    // Attach Event to Selector Department and Option Elements
    (function AttachEventToSelectorDepartment(){
        let DepartmentSelector = document.getElementsByName("department");
        let NumberOfDepartment = ((DepartmentSelector.length) / 3);
        let ADDSubjectSelector = document.getElementsByClassName('ADDactivitySelector');
        let EDITSubjectSelector = document.getElementsByClassName('EDITactivitySelector');
        let DELETESubjectSelector = document.getElementsByClassName('DELETEactivitySelector');
        let AddBtn = document.getElementById('addBook');
        let EditBtn = document.getElementById('editBook');
        let bookSelector = document.getElementsByClassName('bookSelector')[0];

        // for adding book
        for(let i=0; i < NumberOfDepartment; i++){
            DepartmentSelector[i].addEventListener('change', () => {
                RemoveOldElement('ADDactivitySelector');
                GetSubject(DepartmentSelector[i].value, 'ADDactivitySelector');
            });
        }

        // for deleting book
        for(let i=0; i < NumberOfDepartment; i++){
            DepartmentSelector[i+(NumberOfDepartment)].addEventListener('change', () => {
                RemoveOldElement('DELETEactivitySelector');
                GetSubject(DepartmentSelector[i+(NumberOfDepartment)].value, 'DELETEactivitySelector');
            });
        }

        // for editing book
        for(let i=0; i < NumberOfDepartment; i++){
            DepartmentSelector[i+(NumberOfDepartment*2)].addEventListener('change', () => {
                RemoveOldElement('EDITactivitySelector');
                GetSubject(DepartmentSelector[i+(NumberOfDepartment*2)].value, 'EDITactivitySelector');
            });
        }

        // for adding book
        ADDSubjectSelector[0].addEventListener('change', () =>{
            let book_inputs = document.getElementsByClassName('book_input');
            if(ADDSubjectSelector[0].value != 0){
                for(let i=0; i < book_inputs.length; i++){
                    book_inputs[i].disabled = false;
                }
            }else{
                for(let i=0; i < book_inputs.length; i++){
                    book_inputs[i].disabled = true;
                }
            }
        });

        // for deleting book
        DELETESubjectSelector[0].addEventListener('change', () => {

            makeRequest('books/get_books',
            JSON.stringify({"code_subject": DELETESubjectSelector[0].value}), () => {
                if(httpRequest.readyState === XMLHttpRequest.DONE){
                    if(httpRequest.status === 200){
                        let respondedJSON = JSON.parse(httpRequest.responseText);
                        removeBooksTable();
                        for(let i=0; i < respondedJSON.length ; i++){
                            addBooksToList(respondedJSON[i].id, respondedJSON[i].name_book);
                        }
                        attachedEventToButtons();
                    }
                }
            });
        });

        // for editing book
        EDITSubjectSelector[0].addEventListener('change', () => {

            let SelectEl = document.getElementsByClassName('bookSelector')[0];


            makeRequest('books/get_books',JSON.stringify({"code_subject": EDITSubjectSelector[0].value}),() => {
                if(httpRequest.readyState === XMLHttpRequest.DONE){
                    if(httpRequest.status === 200){
                        RemoveOldBooksElement();
                        let encoded_json_data = JSON.parse(httpRequest.responseText);
                        for(let i=0;i < encoded_json_data.length; i++){

                            let OptEl = document.createElement('option');
                            OptEl.className = "editBook";
                            OptEl.value = encoded_json_data[i].id;
                            OptEl.innerText = encoded_json_data[i].name_book;
                            SelectEl.appendChild(OptEl);
                        }
                    }
                }
            });

        });

        // continue to editing book
        bookSelector.addEventListener('change', () => {
            let editInput = document.getElementsByClassName('edit_book');
            makeRequest('books/get_books',JSON.stringify({"code_subject": EDITSubjectSelector[0].value, "id":bookSelector.value}),() => {
                if(httpRequest.readyState === XMLHttpRequest.DONE){
                    if(httpRequest.status === 200){
                        let respondedData = JSON.parse(httpRequest.responseText);
                        editInput[0].value = respondedData[0].name_book;
                        editInput[1].value = respondedData[0].type_of_book;
                        editInput[2].value = respondedData[0].size_of_book;
                        editInput[3].value = respondedData[0].url_of_book;
                    }
                }
            });
        });

        // for adding book
        AddBtn.addEventListener('click', () =>{
            let book_inputs = document.getElementsByClassName('book_input');

            if((book_inputs[0].value !== "") && (book_inputs[3].value !== "")){
                let data = {"code_subject": ADDSubjectSelector[0].value,
                            "name_book": book_inputs[0].value,
                            "type_of_book": book_inputs[1].value,
                            "size_of_book": book_inputs[2].value,
                            "url_of_book":  book_inputs[3].value};

                makeRequest('books/add_book',JSON.stringify(data), () =>{
                    for(let i=0; i < book_inputs.length; i++){
                        book_inputs[i].value = "";
                    }
                });
            }
        });

        EditBtn.addEventListener('click', () =>{
            let book_inputs = document.getElementsByClassName('edit_book');
            let SubjectSelector = document.getElementsByClassName('activitySelector');
            let bookSelector = document.getElementsByClassName('bookSelector')[0];

            if((book_inputs[0].value !== "") && (book_inputs[3].value !== "")){
                let data = {"code_subject": EDITSubjectSelector[0].value,
                            "id": bookSelector.value,
                            "name_book": book_inputs[0].value,
                            "type_of_book": book_inputs[1].value,
                            "size_of_book": book_inputs[2].value,
                            "url_of_book":  book_inputs[3].value};

                makeRequest('books/edit_book',JSON.stringify(data), () =>{
                    if(httpRequest.readyState === XMLHttpRequest.DONE){
                        if(httpRequest.status === 200){
                            UIkit.modal.alert('تم التعديل');
                        }
                    }
                });
            }
        });

    })();

    // request subjects based on department
    // and retrive it fromt the server
    // and add it to option element
    function GetSubject(departmentCode, option_box){
        let data = {"departmentSubject": departmentCode};
        let SelectEl = document.getElementsByClassName(option_box)[0];

        makeRequest('subjects/get_subjects',JSON.stringify(data),() => {
            if(httpRequest.readyState === XMLHttpRequest.DONE){
                if(httpRequest.status === 200){
                    let encoded_json_data = JSON.parse(httpRequest.responseText);
                    for(let i=0;i < encoded_json_data.length; i++){

                        let OptEl = document.createElement('option');
                        OptEl.className = "addBook";
                        OptEl.value = encoded_json_data[i].code_subject;
                        OptEl.innerText = encoded_json_data[i].name_subject;
                        SelectEl.appendChild(OptEl);
                    }
                }
            }
        });
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

    // Remove Old Option Elements
    function RemoveOldElement(option_box){
        let firstNode = document.getElementsByClassName(option_box)[0];
        let nextNode = firstNode.childNodes[3];
        if(nextNode != null){
            while(nextNode != null){
                nextNode.remove();
                nextNode = firstNode.childNodes[3];
            }
        }
    }
    // Remove Old Option Elements For Books
    function RemoveOldBooksElement(){
        let firstNode = document.getElementsByClassName('bookSelector')[0];
        let nextNode = firstNode.childNodes[3];
        if(nextNode != null){
            while(nextNode != null){
                nextNode.remove();
                nextNode = firstNode.childNodes[3];
            }
        }
    }

    // add subjects to list
    function addBooksToList(code, name){

        let CheckInput = document.createElement('button');
        CheckInput.className = "uk-button uk-button-primary deleteBook";
        CheckInput.type = "button";
        CheckInput.innerHTML = "حذف الكتاب";

        let TableDataElement = [document.createElement('td')
        ,document.createElement('td'),document.createElement('td')];
        TableDataElement[0].appendChild(CheckInput);
        TableDataElement[1].textContent = code;
        TableDataElement[2].textContent = name;

        let TableRowElement = document.createElement('tr');
        TableRowElement.className = "rowSubject";
        TableRowElement.appendChild(TableDataElement[0]);
        TableRowElement.appendChild(TableDataElement[1]);
        TableRowElement.appendChild(TableDataElement[2]);

        let TableBodyElement = document.getElementsByTagName('tbody');
        TableBodyElement[0].appendChild(TableRowElement);
    }


    // remove All Books
    function removeBooksTable(){
        document.getElementsByTagName('tbody')[0].innerHTML = "";
    }

    // attach event to delete buttons
    function attachedEventToButtons(){
        let btn = document.getElementsByClassName('deleteBook');
        for(let i=0; i < btn.length; i++){
            btn[i].addEventListener('click', () => {
                let id_book = btn[i].parentNode.parentNode.querySelectorAll('td')[1].outerText;
                let DepartmentSelector = document.getElementsByName("department");
                let SubjectSelector = document.getElementsByClassName('DELETEactivitySelector')[0];

                for(let o=2; o < DepartmentSelector.length; o++){
                    if(DepartmentSelector[o].checked == true){
                        // remove subject section
                        let data = {"code_subject": SubjectSelector.value,
                        "id": id_book};

                        makeRequest('books/delete_book', JSON.stringify(data));
                    }
                }
                let tBodyElement = document.getElementsByTagName('tbody')[0];
                tBodyElement.removeChild(btn[i].parentNode.parentNode);
            });
        }
    }
})();