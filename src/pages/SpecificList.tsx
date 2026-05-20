import VerticalSection from "../components/Section/VerticalSection"
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { SubTodoSection } from "../Types/UserAndTodo";
import { useParams } from "react-router-dom";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import HorizontalSection from "../components/Section/HorizontalSection";

export default function SpecificList() {
  const { ListId } = useParams()
  const { currentUser, addSection } = useAuth()
  let viewType
  const fetchSubSection = () => {
    const data = currentUser?.TodoSectionArray.find(
      (section: SubTodoSection) => section.id === ListId
    );
    viewType = data.viewType
    return data?.subSections || [];
  };
  const [view, setView] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const subTodoSection: SubTodoSection[] = fetchSubSection();
  const handleAddSubTodoSection = () => {
    if (name.length < 1) {
      toast.warning("New section name must be valid.")
      return
    }
    const subSection = {
      id: Date.now().toString(),
      subTodoSectionName: name,
      subSectionTodos: []
    }
    const response = addSection(ListId, subSection)
    if (response.status == 200) {
      console.log(response);
      setName('')
      setView(false)
      // setSubTodoSection((prev)=>[...prev, subSection])
      toast.success(`New section with name ${name} created.`)
    }

  }
  const handleView = () => {

    setView(true)
  }
  return (
    <div className="h-full overflow-hidden flex flex-col ">

      {/* Fixed Top Button */}
      <div className="p-4 bg-white shadow shrink-0 ">

        {view ? <Input className="w-[25%]" autoFocus onBlur={() => setView(false)} type="text" placeholder="New Section" onChange={(e) => setName(e.target.value)} onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddSubTodoSection();
          }
        }} /> : <></>}

        {view ? <></> : <Button onClick={handleView} className="ml-5  text-white px-4 py-2 rounded-lg cursor-pointer">
          + New Section
        </Button>}
      </div>

      {/* Horizontal Scroll Only Here */}
      {viewType == 'list' ?
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin p-5">
          <div className="flex h-full gap-x-4 gap-y-2 w-max">
            {subTodoSection.map((section) => (
              <VerticalSection ListId={ListId} subSectionId={section.id} title={section.subTodoSectionName} />
            ))}
          </div>
        </div>
        : <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin p-5">
          <div className="flex flex-col h-full gap-y-3 w-full">
            {subTodoSection.map((section) => (
              <HorizontalSection
                key={section.id}
                ListId={ListId}
                subSectionId={section.id}
                title={section.subTodoSectionName}
              />
            ))}
          </div>
        </div>}

    </div>
  );
}
