const containerEl = document.querySelector('.container');
const input = document.querySelector('.input');
const baseUri = "https://todo-api-nxk1.onrender.com/todo";
function createTodoList(todoData, id) {
    return `
    <div class="todoItem posts">
        <div class="todoList">
            <input type="text" class="para todoText" name="task" value="${todoData}" data-task_id="${id}" readonly />
            <div class="checkInput">
                <span class="options">
                    <button class="edit bttn">Edit</button>
                    <button class="delete bttn">Delete</button>
                </span>
            </div>
        </div>
    </div>
    `;
}

async function createTodo(e) {
    try {
        const input = document.querySelector('.input');

        if(input.value === "") {
            alert('Enter todo item: input field should not be empty!!');
            return;
        }
        e.preventDefault();

        await fetch(baseUri, {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: input.value,
                isCompleted: false
            })
        });

        console.log("item added succesfully");

        containerEl.insertAdjacentHTML('beforeend',createTodoList(input.value));

        input.value = '';

    } catch (error) {

        console.log("Error", error);
    }
   
} 

const submitBtn = document.querySelector('#createTodo');
submitBtn?.addEventListener('click', createTodo);


// function to handle enter key.
 function handleEnterBtn() { 
    const textInput = document.querySelectorAll('.todoText');

    for(let item of textInput) {
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                console.log('hello');
                updateInputText(event);
            }
        });
    }
}

// update the todo list.
function removeReadOnly(e) {
    e.preventDefault();
    e.target.parentElement.parentElement.previousElementSibling.readOnly=false;
}

async function updateInputText(e) {
    try {

        e.preventDefault();

        const id = e.target.dataset.task_id;
       
        const url = baseUri + `${id}`;
        
        await fetch(url, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: e.target.value
            })
        });

        e.target.readOnly=true;

    } catch (error) {
        console.log(error);
    }
}

// handle delete function.

async function deleteTodoItem(e) {
    try {
    
        e.preventDefault();
        const id  = e.target.parentElement.parentElement.previousElementSibling.dataset.task_id;
        

        await fetch(baseUri + `${id}`, {
            method: "delete",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: e.target.value
            })
        });

        e.target.parentElement.parentElement.parentElement.style.display = "none";
        
    } catch (error) {
        console.log(error);
    }
}
// fetch data from database and show to the client page.

async function fetchTodoData() {
    const data = await fetch(baseUri);
    const todoDatas = await data.json();
    const [...res] = todoDatas.data;

    if(!res) {
        throw new Error('Data is not found.');
    }

    for (let i = 0; i < res.length; i++) {
        const task_id = res[i]._id;

        containerEl.insertAdjacentHTML('beforeend',createTodoList(res[i].task, task_id));
    }

    const editArr = document.querySelectorAll('.edit');

    for(let editBtn of editArr) {
        editBtn.addEventListener('click', removeReadOnly);
    }

    const delbtn = document.querySelectorAll('.delete');

    for(let delItem of delbtn) {
        delItem.addEventListener('click', deleteTodoItem);
    }

    handleEnterBtn();
}

fetchTodoData();


  