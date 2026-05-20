import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { GripHorizontal, List, Columns2 } from "lucide-react";
import type { FolderType, SectionType, TodoSection, ViewType } from "../../Types/UserAndTodo";
import {
  CheckSquare,
  NotebookPen,
  Repeat,
  Briefcase,
  User,
  Folder,
} from "lucide-react";
const LIST_COLORS = [
  { value: "none", label: "None", color: "" },
  { value: "red", label: "Red", color: "#ef4444" },
  { value: "orange", label: "Orange", color: "#f97316" },
  { value: "yellow", label: "Yellow", color: "#eab308" },
  { value: "green", label: "Green", color: "#22c55e" },
  { value: "blue", label: "Blue", color: "#3b82f6" },
  { value: "indigo", label: "Indigo", color: "#6366f1" },
];


interface AddListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingList?: TodoSection | null;
  onAdd?: (list: {
    name: string;
    color: string;
    viewType: ViewType;
    folder: FolderType;
    listType: SectionType;
    showInSmartList: string;
  }) => void;
}

export function AddListDialog({ open, onOpenChange, onAdd, editingList }: AddListDialogProps) {
   const [name, setName] = useState(editingList?.sectionName ?? "");
  const [selectedColor, setSelectedColor] = useState(editingList?.color ?? "none");
  const [viewType, setViewType] = useState<ViewType>(editingList?.viewType ?? "list");
  const [folder, setFolder] = useState<FolderType>(editingList?.folder ?? "None");
  const [listType, setListType] = useState<SectionType>(editingList?.ListType ?? "Task List");
  const [showInSmartList, setShowInSmartList] = useState("all");


   const handleReset = () => {
    setName("");
    setSelectedColor("none");
    setViewType("list");
    setFolder("None");
    setListType("Task List");  
    setShowInSmartList("all");
  };

  const handleAdd = () => {
    onAdd?.({ name, color: selectedColor, viewType, folder, listType, showInSmartList });
    handleReset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

 

  const getViewButtonStyle = (type: ViewType): React.CSSProperties => ({
    width: 36,
    height: 36,
    borderRadius: 6,
    border: viewType === type ? "1.5px solid #6366f1" : "1px solid #e2e8f0",
    background: viewType === type ? "#eef2ff" : "transparent",
    color: viewType === type ? "#6366f1" : "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  });

  return (
<Dialog
  open={open}
  onOpenChange={(val) => {
    if (!val) handleReset();
    onOpenChange(val);
  }}
>
      <DialogContent style={{ maxWidth: 420 }}>
        <DialogHeader>
         <DialogTitle style={{ textAlign: "center" }}>
  {editingList ? "Edit List" : "Add List"}
</DialogTitle>
        </DialogHeader>

        {/* Name Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1.5px solid #6366f1",
            borderRadius: 6,
            padding: "8px 12px",
          }}
        >
          <GripHorizontal style={{ width: 16, height: 16, color: "#94a3b8", flexShrink: 0 }} />
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              border: "none",
              padding: 0,
              height: "auto",
              boxShadow: "none",
              outline: "none",
            }}
          />
        </div>

        {/* List Color */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#64748b", minWidth: 110 }}>List Color</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {LIST_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedColor(c.value)}
                aria-label={c.label}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: selectedColor === c.value ? "2px solid #6366f1" : "2px solid transparent",
                  padding: 0,
                  cursor: "pointer",
                  background: "none",
                  transform: selectedColor === c.value ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.15s",
                }}
              >
                {c.value === "none" ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      border: "1px solid #cbd5e1",
                      color: "#94a3b8",
                    }}
                  >
                    <svg viewBox="0 0 16 16" style={{ width: 10, height: 10 }} fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8" cy="8" r="6" />
                      <line x1="3" y1="13" x2="13" y2="3" />
                    </svg>
                  </span>
                ) : c.value === "custom" ? (
                  <span
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "conic-gradient(red, orange, yellow, green, blue, violet, red)",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: c.color,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* View Type */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#64748b", minWidth: 110 }}>View Type</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => setViewType("list")} style={getViewButtonStyle("list")} aria-label="List view">
              <List style={{ width: 16, height: 16 }} />
            </button>
            <button onClick={() => setViewType("board")} style={getViewButtonStyle("board")} aria-label="Board view">
              <Columns2 style={{ width: 16, height: 16 }} />
            </button>
            
          </div>
        </div>

        {/* Folder */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#64748b", minWidth: 110 }}>Folder</span>
          <Select value={folder} onValueChange={(value) => setFolder(value as FolderType)}>
            <SelectTrigger style={{ flex: 1 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None <Folder/></SelectItem>
              <SelectItem value="Work">Work <Briefcase/></SelectItem>
              <SelectItem value="Personal">Personal <User/></SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* List Type */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#64748b", minWidth: 110 }}>List Type</span>
          <Select value={listType} onValueChange={(value) => setFolder(value as FolderType)}>
            <SelectTrigger style={{ flex: 1 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Task List">Task List <CheckSquare/></SelectItem>
              <SelectItem value="Note List">Note List <NotebookPen/> </SelectItem>
              <SelectItem value="Habit List">Habit List <Repeat/></SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
  onClick={handleAdd}
  disabled={!name.trim()}
  style={{ background: "#6366f1", color: "white" }}
>
  {editingList ? "Save" : "Add"}
</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}