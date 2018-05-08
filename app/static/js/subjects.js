(function(){
    let subjectSelector = document.getElementById('subjectSelector');
    let hold_subjects_array = {};
    // add Subject to database
    document.getElementById("addSubject").onclick =  () => {
        var data = {"code_department":getCheckedOne(),
                    "code_subject":document.getElementById("code").value,
                    "name_subject":document.getElementById("name").value,
                    "units_subject":document.getElementById("units").value,
                    "prerequisites":document.getElementById("prereq").value};
        if(CheckInputsNotEmpty()){
            makeRequest('subjects/add_subject',JSON.stringify(data), () => {
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
            // to empty edit boxes
            EmptyThisShitOut();
        }else{
            var x = document.getElementById('alert');
            x.style.display = 'block';
        }
    };

    (function SelectorEventHandlerAttached(){
        let departmentSelector = document.querySelectorAll('label input#deleteSubject');
        let departmentSelectorEditSection = document.querySelectorAll('label input#editSubject');
        let edit = document.getElementsByClassName('uk-input edit');


        for(let i=0;i< departmentSelector.length ; i++){
            departmentSelector[i].addEventListener('change', () => {
                if(departmentSelector[i].checked == true){

                    removeSubjectTable();
                    var data = {"departmentSubject":departmentSelector[i].value};

                    makeRequest('subjects/get_subjects',JSON.stringify(data),() => {
                        if(httpRequest.readyState === XMLHttpRequest.DONE){
                            if(httpRequest.status === 200){
                                var responsedJSON = JSON.parse(httpRequest.responseText);
                                for(let i=0;i < responsedJSON.length; i++){
                                    addSubjectsToList(responsedJSON[i].code_subject,responsedJSON[i].name_subject);
                                    // attach Events to buttons
                                }
                                attachedEventToButtons();
                            }else{
                                alert('There was a problem with th request.');
                            }
                        }
                    });
                }
            });
        }

        for(let i=0; i < departmentSelectorEditSection.length; i++){
            departmentSelectorEditSection[i].addEventListener('change', () => {
                // empty the edit fields
                for(let i=0;i < edit.length; i++){
                    edit[i].value = "";
                }

               if(departmentSelectorEditSection[i].checked == true){
                   let data = {"departmentSubject":departmentSelector[i].value};
                  makeRequest('subjects/get_subjects',JSON.stringify(data),() => {
                        if(httpRequest.readyState === XMLHttpRequest.DONE){
                            if(httpRequest.status === 200){
                                let responsedJSON = JSON.parse(httpRequest.responseText);
                                hold_subjects_array = responsedJSON;
                                // to delete older childs
                                while(subjectSelector.firstChild){
                                    subjectSelector.removeChild(subjectSelector.firstChild);
                                }
                                // you know, it will delete choice option we need it to trigger other events
                                let Opt = document.createElement('option');
                                Opt.className = "editSubject";
                                Opt.innerHTML = "أختار"
                                subjectSelector.appendChild(Opt);

                                for(let i=0; i < hold_subjects_array.length; i++){

                                    let OptEl = document.createElement('option');
                                    OptEl.className = "editSubject";
                                    OptEl.value = hold_subjects_array[i].id;
                                    OptEl.innerHTML = hold_subjects_array[i].name_subject;
                                    subjectSelector.appendChild(OptEl);
                                }
                            }else{
                                alert('There was a problem with th request.');
                            }
                        }
                    });
               }
            });
        }
    })();

    subjectSelector.addEventListener('change', () => {
        let edit = document.getElementsByClassName('uk-input edit');
        for(let i=0;i<hold_subjects_array.length; i++){
            if(hold_subjects_array[i].id == subjectSelector.value){
                edit[0].value = hold_subjects_array[i].code_subject;
                edit[1].value = hold_subjects_array[i].name_subject;
                edit[2].value = hold_subjects_array[i].units_subject;
                edit[3].value = hold_subjects_array[i].prerequisites;
            }
        }
    });

    // attach event to editButton
    document.getElementById('editSubjectButton').addEventListener('click', () => {
        let edit = document.getElementsByClassName('uk-input edit');
        let data = {"id": subjectSelector.value,
                    "code_subject":edit[0].value,
                    "name_subject": edit[1].value,
                    "units_subject": edit[2].value,
                    "prerequisties": edit[3].value};

        makeRequest('subjects/edit_subject',JSON.stringify(data), () => {
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
    });

    function getCheckedOne(){
        var elements = document.getElementsByName("department");
        for(var i=0; i < elements.length; i++){
            if(document.getElementsByName("department")[i].checked == true){
                return document.getElementsByName("department")[i].value;
            }
        }
    }

    function CheckInputsNotEmpty(){
        if((document.getElementById("code").value
        && document.getElementById("name").value
        && document.getElementById("units").value)  != ""){
            return true;
        }else{
            return false;
        }
    }

    function EmptyThisShitOut(){
        var EditBox = document.querySelectorAll('input.uk-input');
        for(let i=0;i < EditBox.length; i++){
            EditBox[i].value = "";
        }
    }


    // add subjects to list
    function addSubjectsToList(code, name){

        var CheckInput = document.createElement('button');
        CheckInput.className = "uk-button uk-button-primary deleteSubject";
        CheckInput.type = "button";
        CheckInput.innerHTML = "حذف المادة";

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

    // remove All Subjects
    function removeSubjectTable(){
        document.getElementsByTagName('tbody')[0].innerHTML = "";
    }

    function attachedEventToButtons(){
        let btn = document.getElementsByClassName('deleteSubject');
        for(let i=0; i < btn.length; i++){
            btn[i].addEventListener('click', () => {
                let subject = btn[i].parentNode.parentNode.querySelectorAll('td')[1].outerText;
                let department = document.querySelectorAll('label input#deleteSubject');

                for(let o=0; o < department.length; o++){
                    if(department[o].checked == true){
                        // remove subject section
                        let data = {"code_subject": subject};

                        makeRequest('subjects/delete_subject',JSON.stringify(data));
                    }
                }
                // TODE: make sure it will remove the childs when request response 200 OK
                let tBodyElement = document.getElementsByTagName('tbody')[0];
                tBodyElement.removeChild(btn[i].parentNode.parentNode);
            });
        }
    }


    function makeRequest(url, data, callback_1, callback_2){
        httpRequest = new XMLHttpRequest();

        if(!httpRequest){
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }
        httpRequest.onreadystatechange = callback_1;
        httpRequest.onloaded =  callback_2;
        httpRequest.open('POST',url, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json; charset=utf8');
        httpRequest.send(data);
    }
})();