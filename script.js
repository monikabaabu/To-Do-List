document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumber = document.getElementById('numbers');

    const toggleEmptyState = () => {
        todosContainer.style.width = taskList.children.length > 0 ? '80%' : '50%';
    };

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%`: '0%';
        progressNumber.textContent = `${completedTasks} / ${totalTasks}`;

        if(checkCompletion && totalTasks > 0 && completedTasks === totalTasks){
            Confetti();
        }
    };

    const saveTasksToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text : li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
          localStorage.setItem('tasks', JSON.stringify(tasks));
    }; 

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({text, completed})=> addTask(text, completed, false));
        toggleEmptyState();
        updateProgress();
    };

    const addTask = (text, completed = false, checkCompletion = true) => {
        
        const taskText = text || taskInput.value.trim();
        if(!taskText){
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
        <input type = "checkbox" class = "checkbox" ${completed ? 'checked' : ''}/>
        <span>${taskText}</span>
        <div class="task-buttons">
        <button class="edit-btn"><i class = " fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class = " fa-solid fa-trash"></i></button>
        </div>
        `;
        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        if(completed){
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = 0.4;
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            if(isChecked){
            editBtn.disabled = true;
            editBtn.style.opacity =  0.4 ;
            editBtn.style.pointerEvents = 'none';
            }
            else{
                editBtn.disabled = false;
            editBtn.style.opacity = 1;
            editBtn.style.pointerEvents = 'auto';
            }
            updateProgress();
            saveTasksToLocalStorage();
        });

        editBtn.addEventListener('click', () => {
            if(!checkbox.checked){
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTasksToLocalStorage();

            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTasksToLocalStorage();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTasksToLocalStorage();
    };
    addTaskBtn.addEventListener('click',() => addTask());
    taskInput.addEventListener('keypress',(e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            addTask();
        }
    }) ;
    loadTasksFromLocalStorage();

});
 const Confetti =() => {
const duration = 15 * 1000,
  animationEnd = Date.now() + duration;

let skew = 1;

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

(function frame() {
  const timeLeft = animationEnd - Date.now(),
    ticks = Math.max(200, 500 * (timeLeft / duration));

  skew = Math.max(0.8, skew - 0.001);

  confetti({
    particleCount: 1,
    startVelocity: 0,
    ticks: ticks,
    origin: {
      x: Math.random(),
      // since particles fall down, skew start toward the top
      y: Math.random() * skew - 0.2,
    },
    colors: ["#ffffff"],
    shapes: ["circle"],
    gravity: randomInRange(0.4, 0.6),
    scalar: randomInRange(0.4, 1),
    drift: randomInRange(-0.4, 0.4),
  });

  if (timeLeft > 0) {
    requestAnimationFrame(frame);
  }
})();
 }
