export interface TodoItemId {
  id: number;
}

export interface TodoItem {
  id: number;
  task: string;
  checked: boolean;
}

export interface NewItem {
  task: string;
}

export interface TodoList {
  list: TodoItem[];
}

export interface Call<T> {
  request: T;
}

export interface Callback<T> {
  (error: Error | null, response: T): void;
}
