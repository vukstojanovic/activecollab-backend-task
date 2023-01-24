import { useState } from "react";
import data from "./data.json";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import TaskList from "./components/TaskList";
import CompletedTaskList from "./components/CompletedTaskList";
import Prompt from "./components/Prompt";
import { SingleTask } from "./types";

function App() {
  const [taskLists, setTaskLists] = useState(data.task_lists);
  const tasksWithUniqueIds = data.tasks.map((t) => {
    t.id = Math.floor(Math.random() * 10000);
    return t;
  });
  const [tasks, setTasks] = useState<SingleTask[]>(tasksWithUniqueIds);
  const [labels] = useState(data.labels);
  const [users] = useState(data.users);
  const [isTaskModalOpened, setIsTaskModalOpened] = useState(false);
  const [isTaskListModalOpened, setIsTaskListModalOpened] = useState(false);
  const [selectedTaskListId, setSelectedTaskListId] =
    useState<null | number>(null);

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;
    const destinationIndex = destination.index;
    if (sourceId === destinationId) return;

    let destinationTasksIndex = 0;
    const modifiedTasks = tasks
      .map((t) => {
        if (t.id === Number(draggableId)) {
          if (destinationId === "20000") {
            t.is_completed = true;
          } else {
            t.is_completed = false;
          }
          t.task_list_id = Number(destinationId);
          t.position = destinationIndex;
          return t;
        }
        if (t.task_list_id === Number(destinationId)) {
          t.position = destinationTasksIndex;
          destinationTasksIndex++;
          return t;
        }
        return t;
      })
      .sort((a, b) => b.position - a.position);
    setTasks(modifiedTasks);
  }

  function closeTaskModal() {
    setIsTaskModalOpened(false);
  }

  function openTaskModal() {
    setIsTaskModalOpened(true);
  }

  function closeTaskListModal() {
    setIsTaskListModalOpened(false);
  }

  function openTaskListModal() {
    setIsTaskListModalOpened(true);
  }

  function addNewTask(taskName: string) {
    const maxId = Math.max(...tasks.map((task) => task.id));
    const maxPosition = Math.max(...tasks.map((task) => task.position));
    const newTask = {
      id: maxId + 1,
      name: taskName,
      is_completed: false,
      task_list_id: selectedTaskListId as number,
      position: maxPosition + 1,
      start_on: null,
      due_on: null,
      labels: [],
      open_subtasks: 0,
      comments_count: 0,
      assignee: [],
      is_important: false,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
  }

  function addNewTaskList(taskListName: string) {
    const maxId = Math.max(...taskLists.map((taskList) => taskList.id));
    const maxPosition = Math.max(
      ...taskLists.map((taskList) => taskList.position)
    );
    const newTaskList = {
      id: maxId + 1,
      name: taskListName,
      open_tasks: 0,
      completed_tasks: 0,
      position: maxPosition + 1,
      is_completed: false,
      is_trashed: false,
    };
    const updatedTaskLists = [...taskLists, newTaskList];
    setTaskLists(updatedTaskLists);
  }

  return (
    <div className="m-auto mt-10 w-fit">
      <div className="flex gap-3">
        <DragDropContext onDragEnd={handleDragEnd}>
          {taskLists
            .filter(
              (singleTaskList) =>
                !singleTaskList.is_trashed && !singleTaskList.is_completed
            )
            .sort((a, b) => a.position - b.position)
            .map((singleTaskList) => {
              return (
                <TaskList
                  key={singleTaskList.id}
                  {...singleTaskList}
                  allLabels={labels}
                  allUsers={users}
                  allTasks={tasks}
                  setTasks={setTasks}
                  setSelectedTaskListId={setSelectedTaskListId}
                  openTaskModal={openTaskModal}
                  setTaskLists={setTaskLists}
                  allTaskLists={taskLists}
                />
              );
            })}
          <div
            onClick={openTaskListModal}
            className="px-4 py-2 pt-1 text-3xl shadow-lg bg-slate-100 h-fit rounded-md flex justify-center items-center border-slate-200 text-slate-400 border-[1px] cursor-pointer"
          >
            <span>+</span>
          </div>
          <CompletedTaskList
            allLabels={labels}
            allTasks={tasks}
            allUsers={users}
          />
        </DragDropContext>
      </div>
      <Prompt
        title="Add new task"
        isOpen={isTaskModalOpened}
        closeFn={closeTaskModal}
        submitFn={addNewTask}
      />
      <Prompt
        title="Add new task list"
        isOpen={isTaskListModalOpened}
        closeFn={closeTaskListModal}
        submitFn={addNewTaskList}
      />
    </div>
  );
}

export default App;
