import { ID, database, storage } from "@/appwrite";

import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { create } from "zustand";

interface TaskBoardState {
  taskBoard: TaskBoard;
  getTaskBoard: () => void;
  setTaskBoard: (TaskBoard: TaskBoard) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIdx: number, todoId: Todo, id: TypedColumn) => void;

  updateTodoDB: (todo: Todo, columId: TypedColumn) => void;
  image: File | null;
  setImage: (image: File | null) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  newTask: string;
  setNewTask: (input: string) => void;
  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;
}
Map<TypedColumn, Column>;

export const useTaskStore = create<TaskBoardState>((set, get) => ({
  taskBoard: {
    columns: new Map<TypedColumn, Column>(),
  },

  searchString: "",
  newTask: "",
  newTaskType: "todo",
  image: null,

  setSearchString: (searchString) => set({ searchString }),

  getTaskBoard: async () => {
    const taskBoard = await getTodosGroupedByColumn();
    set({ taskBoard });
  },

  setTaskBoard: (taskBoard: any) => set({ taskBoard }),
  updateTodoDB: async (todo, columnId) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },

  deleteTask: async (taskIdx: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().taskBoard.columns);
    newColumns.get(id)?.todos.splice(taskIdx, 1);
    set({ taskBoard: { columns: newColumns } });
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  setNewTask: (input: string) =>
    set({
      newTask: input,
    }),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  setImage: (image: File | null) => set({ image }),

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }), // add image if exists
      }
    );

    set({ newTask: "" });

    set((state) => {
      const newColumns = new Map(state.taskBoard.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        taskBoard: {
          columns: newColumns,
        },
      };
    });
  },
}));
