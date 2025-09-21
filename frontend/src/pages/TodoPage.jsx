import TodoTable from "../components/TodoTable";
import { TodoProvider } from "../context/TodoContext";

export default function TodoPage() {
  return (
    <TodoProvider>
      <TodoTable />
    </TodoProvider>
  );
}
