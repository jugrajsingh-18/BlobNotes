import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "./ui/sidebar";
import { AddListDialog } from "./dialog/AddListDialog";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { FolderType, SectionType, SubTodoSection, TodoSection, ViewType } from "../Types/UserAndTodo";
import { toast } from "sonner";
import {
  CheckSquare,
  NotebookPen,
  Repeat,
  Briefcase,
  User,
  Folder,
} from "lucide-react";
export function AppSidebar() {
  const {ListId} = useParams()
  const { currentUser, addList,updateList,deleteList } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lists, setLists] = useState<TodoSection[]>(currentUser.TodoSectionArray);
  const [editingId, setEditingId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const AddList = ({
    name,
    color,
    listType,
    folder,
    viewType,
  }: {
    name: string;
    color: string;
    listType: SectionType;
    folder: FolderType;
    viewType: ViewType;
  }) => {
    
    if (editingId) {
      const updatedList: Partial<TodoSection> = {
      sectionName: name,
      color,
      folder,
      viewType,
      ListType: listType,
    };
      const response = updateList(editingId,updatedList)
      if(response.status==200){

        setLists((prev) =>
    prev.map((list) =>
      list.id === editingId
        ? {
            ...list,
            ...updatedList,
          }
        : list
    )
  );
  toast.success("List updated successfully.")
      }
      
    }else{
   const newList: TodoSection = {
      id: Date.now().toString(),
      sectionName: name,
      color,
      folder,
      viewType,
      ListType: listType,
      subSections: [],
    };
    setLists((prev) => [...prev, newList]);

      addList(newList);
      toast.success(`New list named ${name} created successfully.`)
    }
    setIsOpen(true);
  };

 const validateDeleteList = () => {
  const section =
    currentUser?.TodoSectionArray.find(
      (section: TodoSection) =>
        section.id === ListId
    );

  if (!section) {
    return {
      status: 404,
      Message: "Section not found.",
    };
  }

  const hasPendingTodos =
    section.subSections.some(
      (subSection: SubTodoSection) =>
        subSection.subSectionTodos.some(
          (todo) =>
            !todo.completedOrNot
        )
    );

  if (hasPendingTodos) {
    return {
      status: 400,
      Message:
        "There are pending todos therefore cannot delete.",
    };
  }

  return {
    status: 200,
    Message: "Can Delete.",
  };
};
  const DeleteList = (e:string,name:string)=>{
    const Validate = validateDeleteList()
    if(Validate.status==400){
      toast.error(Validate.Message)
      return;
    }
    const response = deleteList(e)
    if(response.status==200){
      setLists((prev) =>
  prev.filter((list) => list.id !== e)
);
toast.success(`${name} list deleted successfully.`)
if(ListId==e){

  navigate('/dashboard')
}
    }
  }

  return (
    <SidebarProvider>
      <Sidebar className="pt-20">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex items-center justify-between px-2">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                    >
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span>Lists</span>
                    </button>

                    <button
                      onClick={() => setDialogOpen(true)}
                      className="rounded-md p-1 hover:bg-accent cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="ml-6 mt-2 space-y-1">
                      {lists.map((list) => {
                        const isActive = location.pathname === `/dashboard/${list.id}`;
                          
                        return (
                          <div
                            key={list.id}
                            className={`group flex items-center gap-1 rounded-md transition-colors ${isActive ? "bg-accent" : "hover:bg-gray-100"
                              }`}
                          >
                                <SidebarMenuButton
                                  className="flex-1 justify-start cursor-pointer bg-transparent hover:bg-transparent"
                                  onClick={() => navigate(`/dashboard/${list.id}`)}
                                >
                                  {list.ListType == "Task List" ?<CheckSquare/>:list.ListType=="Habit List"?<Repeat/>:<NotebookPen/>} {list.folder=="None"?<Folder/>:list.folder=="Work"?<Briefcase/>:<User/>} {list.sectionName}
                                </SidebarMenuButton>

                                <div className="flex items-center gap-0.5 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      setEditingId(list.id);
                                      setDialogOpen(true);
                                    }}
                                    className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 cursor-pointer"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </button>
                                  <button className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 cursor-pointer" onClick={()=>DeleteList(list.id,list.sectionName)}>
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                            
                          </div>
                        );
                      })}
                    </div>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

<AddListDialog
  key={dialogOpen ? (editingId ?? "new") : "closed"}
  open={dialogOpen}
  onOpenChange={(val) => {
    setDialogOpen(val);
    if (!val) setEditingId(null);
  }}
  onAdd={AddList}
  editingList={editingId ? lists.find((l) => l.id === editingId) ?? null : null}
/>

    </SidebarProvider>
  );
}