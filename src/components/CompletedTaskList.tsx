import { Droppable } from "@hello-pangea/dnd";
import { CompletedTaskListProps } from "../types";
import Task from "../components/Task";

export default function CompletedTaskList({
  allTasks,
  allLabels,
  allUsers,
}: CompletedTaskListProps) {
  const currentNumberOfTasks = allTasks.filter(
    (task) => task.is_completed
  ).length;

  return (
    <Droppable droppableId="20000">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="w-[350px] py-3 px-1"
        >
          <div className="flex justify-between items-center m-2 mb-5">
            <h4 className="font-bold flex items-center gap-2 px-4">
              <span className="text-gray-700 text-lg ">Completed Tasks</span>{" "}
              <span className="text-gray-400 text-md">
                ({currentNumberOfTasks})
              </span>
            </h4>
          </div>
          <div className="max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full px-2">
            {allTasks
              .filter((singleTask) => singleTask.is_completed)
              .sort((a, b) => b.position - a.position)
              .map((singleTask, index) => {
                return (
                  <Task
                    key={singleTask.id}
                    {...singleTask}
                    allLabels={allLabels}
                    users={allUsers}
                    index={index}
                  />
                );
              })}
          </div>
          <button className="px-6 text-violet-700 font-bold mt-2 outline-none capitalize">
            View completed tasks
          </button>
        </div>
      )}
    </Droppable>
  );
}
