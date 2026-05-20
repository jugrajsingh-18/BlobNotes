export interface Todo{
id:string,
todoText:string,
todoDesc:string,
completedOrNot:boolean
}  

export interface TodoSection{
    id:string,
    sectionName:string,
    color:string,
    ListType:SectionType
    folder:FolderType
    viewType:ViewType
    subSections:SubTodoSection[]
    
}
export interface SubTodoSection{
    id:string,
    subTodoSectionName:string,
    subSectionTodos:Todo[]

}
export interface User{
id:string,
name:string,
email:string,
password:string,
TodoSectionArray:TodoSection[]
}

export type SectionType = 'Task List' | 'Note List' | 'Habit List';
export type FolderType = 'None' | 'Work' | 'Personal';
export type ViewType = "list" | "board";