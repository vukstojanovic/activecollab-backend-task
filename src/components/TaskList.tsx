import { Droppable } from "@hello-pangea/dnd";
import dots from "../assets/trotacka.svg";
import { TaskListProps } from "../types";
import Task from "../components/Task";
import { useState } from "react";

export default function TaskList({
  id,
  name,
  open_tasks,
  allTasks,
  allLabels,
  allUsers,
  allTaskLists,
  setSelectedTaskListId,
  setTaskLists,
  setTasks,
  openTaskModal,
}: TaskListProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentNumberOfTasks = allTasks.filter(
    (task) => task.task_list_id === id && !task.is_completed
  ).length;

  function openSelectedTaskModal() {
    setSelectedTaskListId(id);
    openTaskModal();
  }

  function completeTaskList() {
    const changedTaskLists = allTaskLists.map((tl) => {
      if (tl.id === id) {
        tl.is_completed = true;
        return tl;
      }
      return tl;
    });
    setTaskLists(changedTaskLists);
    const changedTasks = allTasks.map((oneTask) => {
      if (oneTask.task_list_id === id) {
        oneTask.is_completed = true;
        return oneTask;
      }
      return oneTask;
    });
    setTasks(changedTasks);
  }

  function deleteTaskList() {
    const changedTaskLists = allTaskLists.map((tl) => {
      if (tl.id === id) {
        tl.is_trashed = true;
        return tl;
      }
      return tl;
    });
    setTaskLists(changedTaskLists);
  }

  return (
    <Droppable droppableId={id.toString()}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="w-[350px] py-3 px-1"
        >
          <div
            className="flex justify-between items-center m-2 mb-5 relative"
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <h4 className="font-bold flex items-center gap-2 px-4">
              <span className="text-gray-700 text-lg ">{name}</span>{" "}
              <span className="text-gray-400 text-md">
                ({currentNumberOfTasks})
              </span>
            </h4>
            <img
              src={dots}
              alt="dots"
              className="cursor-pointer"
              onMouseOver={() => setIsDropdownOpen(true)}
            />
            {isDropdownOpen && (
              <div className="bg-slate-100 border-slate-200 text-slate-400 border-2 p-2 rounded-lg min-w-[200px] absolute top-7 left-72">
                <p
                  className="p-2 cursor-pointer hover:bg-gray-200 hover:rounded-md"
                  onClick={completeTaskList}
                >
                  Complete
                </p>
                <p
                  className="p-2 cursor-pointer hover:bg-gray-200 hover:rounded-md"
                  onClick={deleteTaskList}
                >
                  Move to Trash
                </p>
              </div>
            )}
          </div>
          <div className="max-h-[80vh]  scrollbar-thin scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full px-2">
            {allTasks
              .filter(
                (singleTask) =>
                  singleTask.task_list_id === id && !singleTask.is_completed
              )
              .sort((a, b) => a.position - b.position)
              .map((singleTask, index) => {
                return (
                  <Task
                    key={`${singleTask.id + index}`}
                    {...singleTask}
                    allLabels={allLabels}
                    users={allUsers}
                    index={index}
                  />
                );
              })}
          </div>

          <button
            className="px-6 text-violet-700 font-bold mt-2 outline-none"
            onClick={openSelectedTaskModal}
          >
            + Add task
          </button>
        </div>
      )}
    </Droppable>
  );
}
