//Model module containing application state and logic
var model = function () {
    var orderedTasks;
    var editedTask;

    //Stores the data from the task for as an initially unordered array in LocalStorage
    function storeTasks() {
        //Uses JQuery calls to get the values of the form fields
        var action = $("#action").val();
        var done = $("#done:checked").val();
        var dueDate = $("#dueDate").val();

        //Sets the values to an array
        var newTask = [];
        newTask[0] = action;
        newTask[1] = (done === "on");
        newTask[2] = dueDate;

        //Checks that the task contains a description
        if (action !== "") {
            //Sets the array in localStorage, initially with the key as the description
            localStorage.setItem(action, JSON.stringify(newTask));
            //Returns a boolean to indicate whether the task was successfully stored
            return true;
        }
        else {
            return false;
        }
    }

    //Creates an array of all localStorage items
    function getTasks() {
        var keys = Object.keys(localStorage);
        var tasks = [];
        var i = keys.length;
        while (i--) {
            tasks.push(localStorage.getItem(keys[i]));
        }
        return tasks;
    }

    //Orders the tasks by date and returns an array of ordered tasks
    function orderTasks() {
        var tasks = getTasks();
        var definedDates = [];
        var undefinedDates = [];

        //Stores dates in defined and undefined arrays
        for (var i = 0; i < tasks.length; i++) {
            var tempArray = JSON.parse(tasks[i]);
            var tempDate = tempArray[2];
            //Stores defined dates
            if (tempDate !== "") {
                definedDates.push(tempArray);
            }
            //Stores undefined dates
            else {
                undefinedDates.push(tempArray);
            }
        }

        //Iterates through an unordered array of dated tasks
        //Finds the earliest date, pushes it to an array, then removes it and repeats
        orderedTasks = [];
        while (definedDates.length > 0) {
            var earliest = definedDates[0];
            for (i = 0; i < definedDates.length; i++) {
                tempArray = definedDates[i];
                if ((moment(tempArray[2])).isBefore(moment(earliest[2]))) {
                    earliest = tempArray;
                }
            }
            orderedTasks.push(earliest);
            var index = definedDates.indexOf(earliest);
            definedDates.splice(index, 1);
        }

        //Adds undefined dates to the end of the array
        for (i = 0; i < undefinedDates.length; i++) {
            orderedTasks.push(undefinedDates[i]);
        }

        //Replaces the data in localStorage with the ordered list of tasks
        localStorage.clear();
        for (i = 0; i < orderedTasks.length; i++) {
            var task = orderedTasks[i];
            localStorage.setItem(i, JSON.stringify(task));
        }
        //Returns the array of ordered tasks
        return orderedTasks;
    }

    //Appends the necessary HTML to the taskList element in the DOM to represent an empty task
    function addEmptyTask() {
        $("#taskList").append(
            "<task class=\"task\">" +
            "<text class=\"action\"></text> " +
            "<date class=\"action\"></date> " +
            "<button onclick='model.editTask(this)'>Edit</button> " +
            "<button onclick='model.deleteTask(this)'>Delete</button> " +
            "<label for=\"action\">Done</label> " +
            "<input class=\"checkBox\" onclick='model.updateTask(this)' type=\"checkbox\">" +
            "<br>" +
            "</task>"
        );
    }

    //Adds the data from the DOM tree to the tasks, updating current tasks and filling in new ones
    function addTaskData() {
        var tasks = document.getElementsByTagName("task");
        for (i = 0; i < tasks.length; i++) {
            var emptyTask = tasks[i];
            var text = emptyTask.getElementsByTagName("text");
            var dates = emptyTask.getElementsByTagName("date");
            var input = emptyTask.getElementsByTagName("input");
            var task = orderedTasks[i];
            text[0].innerHTML = task[0];
            if (!(task[2] === "")) {
                dates[0].innerHTML = task[2];
            }
            else {
                dates[0].innerHTML = "Invalid date";
            }
            input[0].checked = task[1];
        }
    }

    //Iterates through all tasks and checks whether their complete status is stored correctly in LocalStorage
    function updateCompleteTasks() {
        var tasks = document.getElementsByTagName("task");
        for (i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            var checkBox = task.getElementsByTagName("input");
            updateTask(checkBox[0]);
        }
    }

    //Updates the LocalStorage of a task, either on click of the check box
    //or when called from the updateCompleteTasks method
    function updateTask(checkBox) {
        var task = checkBox.closest("task");
        var text = task.getElementsByTagName("text");

        var keys = Object.keys(localStorage);
        var tasks = [];
        for (var i = 0; i < keys.length; i++) {
            tasks.push(localStorage.getItem(keys[i]));
        }
        for (i = 0; i < tasks.length; i++) {
            var storedTask = [];
            storedTask = JSON.parse(tasks[i]);
            if (text[0].innerHTML === storedTask[0]) {
                if (checkBox.checked !== storedTask[1]) {
                    storedTask[1] = checkBox.checked;
                    //Update local storage
                    localStorage.removeItem(i);
                    localStorage.setItem(i, JSON.stringify(storedTask));
                }
            }
        }
        view.flagOverdueTasks();
    }

    //Deletes a task from the DOM tree and from LocalStorage
    function deleteTask(deleteButton) {
        var task = deleteButton.closest("task");
        var tasks = document.getElementsByTagName("task");
        for (i = 0; i < tasks.length; i++) {
            var currentTask = tasks[i];
            if (currentTask === task) {
                localStorage.removeItem(i);
                task.parentNode.removeChild(task);
            }
        }
    }

    //Called on click of an edit button, this finds the task to be edited and displays the correct edit form
    function editTask(editButton) {
        controller.setEditTask("true");
        var task = editButton.closest("task");
        editedTask = task;
        var action = task.getElementsByTagName("text");
        var done = task.getElementsByTagName("input");
        var date = task.getElementsByTagName("date");
        view.formatEditForm(action[0].innerHTML, done[0].checked, date[0].innerHTML);
    }

    //Called from the controller module if the submit button is pressed on an edit form,
    //this replaces the task in LocalStorage and the DOM tree with the edited task
    function replaceEditedTask() {
        var tasks = document.getElementsByTagName("task");
        for (i = 0; i < tasks.length; i++) {
            var currentTask = tasks[i];
            if (currentTask === editedTask) {
                localStorage.removeItem(i);
                var action = $("#action").val();
                var done = $("#done:checked").val();
                var dueDate = $("#dueDate").val();
                var newTask = [];
                newTask[0] = action;
                newTask[1] = (done === "on");
                newTask[2] = dueDate;

                localStorage.setItem(i, JSON.stringify(newTask));
                addTaskData();
            }
        }
    }

    return {
        orderTasks: orderTasks,
        orderedTasks: orderTasks(),
        storeTasks: storeTasks,
        addEmptyTask: addEmptyTask,
        addTaskData: addTaskData,
        updateTask: updateTask,
        deleteTask: deleteTask,
        editTask: editTask,
        replaceEditedTask: replaceEditedTask,
    }
}();