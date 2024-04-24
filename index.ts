import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

interface TodoItemId {
  id: number;
  checked: boolean;
}

interface TodoItem {
  id: number;
  task: string;
  checked: boolean;
}

interface NewItem {
  task: string;
}

interface Call<T> {
  request: T;
}

interface Callback<T> {
  (error: Error | null, response: T): void;
}

const path = __dirname + "/todo.proto";
const packageDefinition = protoLoader.loadSync(path);
const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const fakeDb: TodoItem[] = [
  { id: 1, task: "Academia", checked: false },
  { id: 2, task: "leitura", checked: false },
];

function changeTaskStatus(id: number, checked: boolean): TodoItem {
  if (!id) throw new Error("Id is required");
  const task = fakeDb.find((task) => task.id === id);
  if (!task) throw new Error("Task not found");
  task.checked = !checked;
  return task;
}

function addNewTask(task: string): TodoItem {
  if (!task) throw new Error("Task is required");
  const id = fakeDb.length + 1;
  fakeDb.push({ id, task, checked: false });
  return { id, task, checked: false };
}

const todoService = {
  list: (_: Call<null>, callback: Callback<{ list: TodoItem[] }>) => {
    callback(null, { list: fakeDb });
  },
  insert: (call: Call<NewItem>, callback: Callback<TodoItem | null>) => {
    try {
      const response = addNewTask(call.request.task);
      callback(null, response);
    } catch (error) {
      if (error instanceof Error) callback(error, null);
    }
  },
  mark: (call: Call<TodoItemId>, callback: Callback<TodoItem | null>) => {
    try {
      const response = changeTaskStatus(call.request.id, call.request.checked);
      callback(null, response);
    } catch (error) {
      if (error instanceof Error) callback(error, null);
    }
  },
};

const server = new grpc.Server();
server.addService(proto.TodoService.service, todoService);
server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (err: Error | null) => {
    if (err) throw err;
    console.log("Server running at 127.0.0.1:50051");
  }
);
