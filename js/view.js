var view = function () {

    //Shows or hides the task form depending on the boolean passed
    function taskForm(show) {
        if (show === false) {
            $("#newTask").hide();
        }
        else {
            $("#newTask").show();
        }
    }

    //Checks the action form to determine whether it contains text
    function checkActionField() {
        var text = $("#action").val();
        if (text === "") {
            setIncompleteAction();
        }
        else {
            setCompleteAction();
        }
    }

    //Sets the background colour of an empty action form
    function setIncompleteAction() {
        $("#action").css("backgroundColor", "OrangeRed");
    }

    //Sets the background colour of a filled action form
    function setCompleteAction() {
        $("#action").css("backgroundColor", "White");
    }

    //Hides empty tasks by setting their display styles to 'none',
    //to prevent empty tasks flashing up on reload
    function hideEmptyTasks() {
        var tasks = document.getElementsByTagName("task");
        for (i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            var text = task.getElementsByTagName("text");
            var date = task.getElementsByTagName("date");
            if (text[0].innerHTML === "") {
                date[0].style.display ="none";
                var buttons = task.getElementsByTagName("button");
                buttons[0].style.display ="none";
                buttons[1].style.display ="none";
                var label = task.getElementsByTagName("label");
                label[0].style.display ='none';
                var input = task.getElementsByTagName("input");
                input[0].style.display ='none';
            }
        }
    }

    //Sets the background colour of tasks which have a date equal to or earlier than today
    function flagOverdueTasks() {
        var currentDate = moment();
        var tasks = document.getElementsByTagName("task");
        for (i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            var date = task.getElementsByTagName("date");
            if (date[0].innerHTML !== "Invalid date") {
                if ((moment(date[0].innerHTML)).isBefore(currentDate)) {
                    date[0].style.backgroundColor = "OrangeRed";
                }
            }

            var checkBox = task.getElementsByTagName("input");
            if (checkBox[0].checked) {
                var done = task.getElementsByTagName("label");
                done[0].style.backgroundColor = "LimeGreen";
            }
            else {
                done = task.getElementsByTagName("label");
                done[0].style.backgroundColor = "White";
            }
        }
    }

    //Fills in the edit form with the current values of the task to be edited
    function formatEditForm(action, done, date) {
        $("#newTask").show();
        $("#action").val(action);
        if (done) {
            $("#done").prop('checked', true);
        }
        else {
            $("#done").prop('checked', false);
        }
        if (date !== "Invalid date") {
            $("#dueDate").val(date);
        }
        else {
            $("#dueDate").val("");
        }
    }

    return {
        taskForm: taskForm,
        setIncompleteAction: setIncompleteAction,
        setCompleteAction: setCompleteAction,
        hideEmptyTasks: hideEmptyTasks,
        flagOverdueTasks: flagOverdueTasks,
        formatEditForm: formatEditForm,
        checkActionField: checkActionField
    }
}();