"use client";

import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { useEffect } from "react";
import { useTaskStore } from "@/store/TaskStore";
import Column from "../Column/page";

const Task = () => {
  const [taskBoard, getTaskBoard, setTaskBoard, updateTodoDB] = useTaskStore(
    (state) => [
      state.taskBoard,
      state.getTaskBoard,
      state.setTaskBoard,
      state.updateTodoDB,
    ]
  );
  useEffect(() => {
    getTaskBoard();
  }, [getTaskBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) result;

    if (type === "column") {
      const entries = Array.from(taskBoard.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination!.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setTaskBoard({
        ...taskBoard,
        columns: rearrangedColumns,
      });
    }
    const columns = Array.from(taskBoard.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const endColIndex = columns[Number(destination?.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };
    const endCol: Column = {
      id: endColIndex[0],
      todos: endColIndex[1].todos,
    };

    if (!startCol || !endCol) return;
    if (source.index === destination?.index && startCol === endCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === endCol.id) {
      // for same column drag
      newTodos.splice(destination!.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(taskBoard.columns);
      newColumns.set(startCol.id, newCol);
      //   update the db
      setTaskBoard({ ...taskBoard, columns: newColumns });
    } else {
      // for different column drag
      const endTodos = Array.from(endCol.todos);
      endTodos.splice(destination!.index, 0, todoMoved);
      const newColumns = new Map(taskBoard.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      newColumns.set(startCol.id, newCol);
      newColumns.set(endCol.id, {
        id: endCol.id,
        todos: endTodos,
      });
      //   update the db
      updateTodoDB(todoMoved, endCol.id);
      setTaskBoard({ ...taskBoard, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="task" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(taskBoard.columns.entries()).map(
              ([id, column], index) => (
                <Column key={id} id={id} index={index} todos={column.todos} />
              )
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Task;
