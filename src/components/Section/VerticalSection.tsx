import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import type { SubTodoSection, Todo, TodoSection } from "../../Types/UserAndTodo";
import { useAuth } from "../../context/AuthContext";
import { TodoDetailDialog } from "../dialog/TodoDetailDialog";
import { toast } from "sonner";
interface VerticalProps {
  title: string;
  subSectionId: string;
  ListId: string | undefined;
}


const colorMap: Record<string, string> = {
  none: "bg-gray-50",
  red: "bg-red-100",
  orange: "bg-orange-100",
  yellow: "bg-yellow-100",
  green: "bg-green-100",
  blue: "bg-blue-100",
  indigo: "bg-indigo-100",
};

export default function VerticalSection({
  title,
  ListId,
  subSectionId
}: VerticalProps) {
  const { addTodo, currentUser, markTodoComplete, deleteSubSection, updateSubSectionName, updateTodo, deleteTodo,updateTodoDesc } = useAuth()
  const color = currentUser.TodoSectionArray.find(
    (section: TodoSection) => section.id == ListId
  )?.color;
  useEffect(() => {
  }, [ListId])
  const fetchTodos = () => {

    const section =
      currentUser?.TodoSectionArray.find(
        (section: TodoSection) =>
          section.id === ListId
      );

    const subSection =
      section?.subSections.find(
        (sub: SubTodoSection) =>
          sub.id === subSectionId
      );

    return subSection?.subSectionTodos || [];
  };
  const todos: Todo[] = fetchTodos()
  const [showInput, setShowInput] = useState(false);
  const [task, setTask] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editTodo, setEditTodo] = useState<string>('');
  const [newTodo, setNewTodo] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    setNewTitle(title);
  }, [title]);
  const toggleTodo = (todoId: string) => {
    const response = markTodoComplete(ListId, subSectionId, todoId)

  };

  const activeTodos = todos.filter((todo) => !todo.completedOrNot);
  const completedTodos = todos.filter((todo) => todo.completedOrNot);

  const handleAddTodo = () => {
    if (task.length < 1) return
    const todo = {
      id: Date.now().toString(),
      todoText: task,
      todoDesc: '',
      completedOrNot: false
    }
    const response = addTodo(ListId, subSectionId, todo)
    setTask('')
    setShowInput(false)


  }
  const deleteSection = () => {
    const response = deleteSubSection(ListId, subSectionId)
    if (response.status == 200) {
      toast.success(`${title} Subsection deleted successfully.`)
    }

  }
  const handleUpdateTitle = () => {
    if (!newTitle.trim()) return;

    const response = updateSubSectionName(
      ListId,
      subSectionId,
      newTitle
    );


    setEditTitle(false);
  };
  const handleUpdateTodo = (e: string) => {
    if (!newTodo.trim()) return
    const response = updateTodo(ListId, subSectionId, e, newTodo)
    if(response.status==200){
      toast.success('Todo updated successfully.')
    }
    setEditTodo('');


  }
  const handleTodoDelete = (e: string) => {
    const response = deleteTodo(ListId, subSectionId, e)
    if(response.status==200){
      toast.success('Todo deleted successfully.')
    }

  }
  return (
    <div
      className={`w-[320px] min-w-[220px] max-w-[600px] h-full rounded-xl p-4 shrink-0 resize-x overflow-auto ${colorMap[color]} scrollbar-none`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 group">

            {editTitle ? (
              <input
                autoFocus
                value={newTitle}
                onChange={(e) =>
                  setNewTitle(e.target.value)
                }
                onBlur={handleUpdateTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateTitle();
                  }
                }}
                className="bg-transparent border-b border-gray-400 outline-none text-lg font-semibold w-[180px]"
              />
            ) : (
              <h1 className="font-semibold text-lg">
                {title}
              </h1>
            )}

            <div className="flex items-center gap-0.5 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">

              <button
                onClick={() => {
                  setEditTitle(true);
                }}
                className="p-1 rounded text-gray-400 hover:text-black cursor-pointer"
              >
                <Pencil className="h-3 w-3" />
              </button>

              <button
                className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 cursor-pointer"
                onClick={deleteSection}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {activeTodos.length}
          </p>
        </div>

        <button
          onClick={() => setShowInput(true)}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white border border-dashed border-gray-300 hover:border-gray-400 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Add Todo */}
      {showInput && (
        <div className="bg-white rounded-2xl border border-blue-500 p-3 mb-4 shadow-sm">
          <input
            autoFocus
            onBlur={() => setShowInput(false)}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="+ Add task"
            className="w-full outline-none text-gray-700"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTodo();
            }}
          />

          <div className="flex justify-end mt-3 gap-2">
            <Button
              variant="outline"
              onMouseDown={(e) => { e.preventDefault(); setShowInput(false) }}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              onMouseDown={(e) => {
                e.preventDefault()
                handleAddTodo()
              }}
              className="cursor-pointer"
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Active Todos */}
      <div className="flex flex-col gap-3">
        {activeTodos.map((todo) => (
          <>
            <div
              key={todo.id}
              className="bg-white rounded-2xl p-4 break-words shadow-sm flex items-start gap-3 group"
            >
              <input
                type="checkbox"
                checked={todo.completedOrNot}
                onChange={() => {
                  toast.success('Todo completed successfully.')
                  toggleTodo(todo.id)}}
                className="w-5 h-5 mt-1 shrink-0 cursor-pointer"
              />

              {editTodo === todo.id ?
                <input
                  autoFocus
                  value={newTodo}
                  onChange={(e) =>
                    setNewTodo(e.target.value)
                  }
                  onBlur={() => {
                    handleUpdateTodo(todo.id)

                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateTodo(todo.id)
                    }
                  }}
                  className="bg-transparent border-b border-gray-400 outline-none text-lg font-semibold w-[180px]"
                /> :
                <p className="text-gray-800 whitespace-pre-wrap flex-1 min-w-0 cursor-pointer" onClick={() => { setSelectedTodo(todo); setDetailOpen(true); }}>
                  {todo.todoText}
                </p>
              }
              <div className="flex items-center gap-0.5 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 rounded text-gray-400 hover:text-black cursor-pointer"
                  onClick={() => {
                    setEditTodo(todo.id);
                    setNewTodo(todo.todoText);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </button>

                <button
                  className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 cursor-pointer"
                  onClick={() => handleTodoDelete(todo.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <TodoDetailDialog
              todo={selectedTodo}
              open={detailOpen}
              onOpenChange={setDetailOpen}
              onToggle={toggleTodo}
              ListId={ListId}
              subSectionId={subSectionId}
              updateTodoDesc={updateTodoDesc}
            />
          </>

        ))}
      </div>

      {/* Completed Section */}
      {completedTodos.length > 0 && (
        <div className="mt-6">
          <button

            onClick={() =>
              setShowCompleted(!showCompleted)
            }
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black mb-3 cursor-pointer"
          >
            {showCompleted ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}

            <span>
              Completed ({completedTodos.length})
            </span>
          </button>

          {showCompleted && (
            <div className="flex flex-col gap-3">
              {completedTodos.map((todo, index) => (
                <>
                  <div
                    key={todo.id}
                    className="bg-white/70 rounded-2xl p-4 break-words shadow-sm flex items-start gap-3 opacity-80 group"
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() =>
                        toggleTodo(todo.id)
                      }
                      className="w-5 h-5 mt-1 shrink-0 cursor-pointer"
                    />

                    <p className="text-gray-500 line-through whitespace-pre-wrap flex-1 min-w-0 cursor-pointer" onClick={() => { setSelectedTodo(todo); setDetailOpen(true); }}>
                      {todo.todoText}
                    </p>
                    <div className="flex items-center gap-0.5 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                

                <button
                  className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 cursor-pointer"
                  onClick={() => handleTodoDelete(todo.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
                  </div>
               
                </>
              ))}
            </div>
          )}
        </div>
      )}
         <TodoDetailDialog
                    todo={selectedTodo}
                    open={detailOpen}
                    onOpenChange={setDetailOpen}
                    onToggle={toggleTodo}
                    ListId={ListId}
                    subSectionId={subSectionId}
                    updateTodoDesc={updateTodoDesc}

                  />
    </div>
  );
}