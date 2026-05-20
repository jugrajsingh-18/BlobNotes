import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import type { Todo } from "../../Types/UserAndTodo";
import { toast } from "sonner";

interface TodoDetailDialogProps {
  todo: Todo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggle: (id: string) => void;
  ListId: string | undefined;
  subSectionId: string;
  updateTodoDesc: (ListId: string | undefined, subSectionId: string, todoId: string, TodoDesc: string) => {status:number,message:string};
}

export function TodoDetailDialog({
  todo,
  open,
  onOpenChange,
  onToggle,
  ListId,
  subSectionId,
  updateTodoDesc,
}: TodoDetailDialogProps) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setNotes(todo?.todoDesc ?? "");
  }, [todo]);

  if (!todo) return null;

  const handleNotesBlur = () => {
    if (notes === (todo.todoDesc ?? "")) return;
    const resonse = updateTodoDesc(ListId, subSectionId, todo.id, notes);
    if(resonse.status ==200){
      toast('Description saved successfully.')
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          padding: 0,
          maxWidth: 420,
          borderRadius: 16,
          overflow: "hidden",
          gap: 0,
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              checked={todo.completedOrNot}
              onChange={() => onToggle(todo.id)}
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px 12px", minHeight: 220 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                margin: 0,
                textDecoration: todo.completedOrNot ? "line-through" : "none",
                color: todo.completedOrNot ? "#94a3b8" : "#1e293b",
              }}
            >
              {todo.todoText}
            </h2>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
            style={{
              width: "100%",
              minHeight: 120,
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 14,
              color: "#475569",
              background: "transparent",
              fontFamily: "inherit",
              lineHeight: 1.6,
              boxSizing: "border-box",
            }}
            onBlur={handleNotesBlur}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}