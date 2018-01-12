//Controller module containing event management and method calls
var controller = function () {
    //Global variable differentiating between uses of the newTask form for
    //creating new tasks and editing existing tasks
    var editTask;

    //Function called from the HTML script which is run when the DOM tree is loaded
    function init() {
        //Hides the new task form
        view.taskForm(false);

        //JQuery function which runs if the 'add' button is pressed
        $("#addNew").click(function () {
            //Shows the new task form
            view.taskForm(true);
            //Sets the value of the action field to an empty string
            $("#action").val("");
            //Sets the editTask variable to false as this is creating a new task
            editTask = false;
        });

        //For each task, creates the HTML for an empty task, and then adds the appropriate data to each task
        for (var i = 0; i < model.orderedTasks.length; i++) {
            model.addEmptyTask();
        }
        model.addTaskData();

        //Checks if there is any text in the action field, and changes the background color to red if none is found
        view.checkActionField();

        //On input to the action field, checks again is there is text
        $("#action").on('input', function() {
            view.checkActionField();
        });

        //Hides any empty tasks
        view.hideEmptyTasks();

        //Flags overdue tasks with a red background
        view.flagOverdueTasks();

        //When the submit button is clicked, calls the appropriate functions to store, order and display the tasks
        $("#submit").click(function(e) {
            //Checks that the task is a new task and not a current task being edited
            if (!editTask) {
                //Prevents the form from refreshing the page on submit click. This is obnoxious.
                e.preventDefault();
                //Uses the return value of storeTasks to check that the task is in an appropriate form
                if (model.storeTasks()) {
                    //Creates an empty task in the DOM, adds data to it, orders and displays it
                    model.addEmptyTask();
                    model.orderTasks();
                    model.addTaskData();
                    view.flagOverdueTasks();
                    //Hides the new task form again after use
                    view.taskForm(false);
                }
                //Alerts the user if a task is invalid
                else {
                    alert("Please enter a valid task");
                }
            }
            //Calls the method to replace an existing task with the edited version if editTask is true
            else {
                model.replaceEditedTask();
            }
        });
    }

    //Returns functions to make them available outside of the module
    return {
        init: init,
        setEditTask: function (change) {editTask = change}
    }
}();