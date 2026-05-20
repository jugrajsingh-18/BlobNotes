import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import type { SubTodoSection, Todo, TodoSection } from "../../Types/UserAndTodo";
import { useAuth } from "../../context/AuthContext";
import { TodoDetailDialog } from "../dialog/TodoDetailDialog";
import { toast } from "sonner";

interface HorizontalProps {
  title: string;
  subSectionId: string;
  ListId: string | undefined;
}

const colorMap: Record<string, string> = {
  none: "bg-gray-50 border-gray-200",
  red: "bg-red-50 border-red-200",
  orange: "bg-orange-50 border-orange-200",
  yellow: "bg-yellow-50 border-yellow-200",
  green: "bg-green-50 border-green-200",
  blue: "bg-blue-50 border-blue-200",
  indigo: "bg-indigo-50 border-indigo-200",
};

const accentMap: Record<string, string> = {
  none: "bg-gray-200",
  red: "bg-red-300",
  orange: "bg-orange-300",
  yellow: "bg-yellow-300",
  green: "bg-green-300",
  blue: "bg-blue-300",
  indigo: "bg-indigo-300",
};

export default function HorizontalSection({
  title,
  ListId,
  subSectionId,
}: HorizontalProps) {
  const {
    addTodo,
    currentUser,
    markTodoComplete,
    deleteSubSection,
    updateSubSectionName,
    updateTodo,
    deleteTodo,
    updateTodoDesc,
  } = useAuth();

  const color =
    currentUser.TodoSectionArray.find(
      (section: TodoSection) => section.id === ListId
    )?.color ?? "none";

  useEffect(() => {}, [ListId]);

  const fetchTodos = (): Todo[] => {
    const section = currentUser?.TodoSectionArray.find(
      (section: TodoSection) => section.id === ListId
    );
    const subSection = section?.subSections.find(
      (sub: SubTodoSection) => sub.id === subSectionId
    );
    return subSection?.subSectionTodos || [];
  };

  const todos: Todo[] = fetchTodos();

  const [showInput, setShowInput] = useState(false);
  const [task, setTask] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editTodo, setEditTodo] = useState<string>("");
  const [newTodo, setNewTodo] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  const toggleTodo = (todoId: string) => {
    markTodoComplete(ListId, subSectionId, todoId);
  };

  const activeTodos = todos.filter((todo) => !todo.completedOrNot);
  const completedTodos = todos.filter((todo) => todo.completedOrNot);

  const handleAddTodo = () => {
    if (task.length < 1) return;
    const todo = {
      id: Date.now().toString(),
      todoText: task,
      todoDesc: "",
      completedOrNot: false,
    };
    addTodo(ListId, subSectionId, todo);
    setTask("");
    setShowInput(false);
  };

  const deleteSection = () => {
    const response = deleteSubSection(ListId, subSectionId);
    if (response.status === 200) {
      toast.success(`${title} Subsection deleted successfully.`);
    }
  };

  const handleUpdateTitle = () => {
    if (!newTitle.trim()) return;
    updateSubSectionName(ListId, subSectionId, newTitle);
    setEditTitle(false);
  };

  const handleUpdateTodo = (todoId: string) => {
    if (!newTodo.trim()) return;
    updateTodo(ListId, subSectionId, todoId, newTodo);
    setEditTodo("");
  };

  const handleTodoDelete = (todoId: string) => {
    deleteTodo(ListId, subSectionId, todoId);
  };

  return (
    <div
      className={`w-full rounded-xl border ${colorMap[color]} overflow-hidden`}
    >
      {/* ── Row Header ── */}
      <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-inherit">
        <div className="flex items-center gap-3">
          {/* Accent strip */}
          <div className={`w-1 h-8 rounded-full shrink-0 ${accentMap[color]}`} />

          {/* Title + count */}
          <div className="flex items-center gap-2 group">
            {editTitle ? (
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleUpdateTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdateTitle();
                }}
                className="bg-transparent border-b border-gray-400 outline-none font-semibold text-base w-[150px]"
              />
            ) : (
              <h2 className="font-semibold text-base text-gray-800 ">{title}</h2>
            )}

            <span className="text-xs text-gray-400 font-medium">
              ({activeTodos.length})
            </span>

            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditTitle(true)}
                className="p-1 rounded text-gray-400 hover:text-black cursor-pointer"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={deleteSection}
                className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Add button ── */}
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white border border-dashed border-gray-300 hover:border-gray-400 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* ── Todos (vertical) ── */}
      <div className="flex flex-col gap-2 px-5 py-3">
        {activeTodos.map((todo) => (
          <div key={todo.id} className="group relative w-[450px]">
            <div className="bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-100 flex items-start gap-2">
              <input
                type="checkbox"
                checked={todo.completedOrNot}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
              />

              {editTodo === todo.id ? (
                <input
                  autoFocus
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onBlur={() => handleUpdateTodo(todo.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdateTodo(todo.id);
                  }}
                  className="bg-transparent border-b border-gray-400 outline-none text-sm font-medium flex-1"
                />
              ) : (
                <p
                  className="text-gray-800 text-sm whitespace-pre-wrap break-words flex-1 min-w-0 cursor-pointer leading-snug"
                  onClick={() => {
                    setSelectedTodo(todo);
                    setDetailOpen(true);
                  }}
                >
                  {todo.todoText}
                </p>
              )}

              {/* Card action buttons */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => {
                    setEditTodo(todo.id);
                    setNewTodo(todo.todoText);
                  }}
                  className="p-0.5 rounded text-gray-400 hover:text-black cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleTodoDelete(todo.id)}
                  className="p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* ── Inline add input ── */}
        {showInput && (
          <div className="bg-white rounded-xl border border-blue-500 px-3 py-2.5 shadow-sm">
            <input
              autoFocus
              onBlur={() => setShowInput(false)}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="+ Add task"
              className="w-full outline-none text-sm text-gray-700"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTodo();
              }}
            />
            <div className="flex justify-end mt-2 gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowInput(false);
                }}
                className="cursor-pointer text-xs h-7"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAddTodo();
                }}
                className="cursor-pointer text-xs h-7"
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Completed row (collapsible) ── */}
      {completedTodos.length > 0 && (
        <div className="px-5 py-2">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 mb-2 transition-colors"
          >
            {showCompleted ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            <span>Completed ({completedTodos.length})</span>
          </button>

          {showCompleted && (
            <div className="flex flex-col gap-2 pb-2">
              {completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-white/70 rounded-xl px-3 py-2.5 shadow-sm border border-gray-100 flex items-start gap-2 opacity-70 cursor-pointer"
                  onClick={() => {
                    setSelectedTodo(todo);
                    setDetailOpen(true);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                  />
                  <p className="text-gray-500 text-sm line-through whitespace-pre-wrap break-words flex-1 min-w-0 leading-snug">
                    {todo.todoText}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Single shared dialog */}
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