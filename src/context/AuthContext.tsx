import { createContext, useContext, useEffect, useState } from "react";
import type { SubTodoSection, Todo, TodoSection, User } from "../Types/UserAndTodo";
const AuthContext = createContext<any>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("currentUser");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [users, setUsers] = useState<User[]>(() => {
        const storedUsers = localStorage.getItem("allUsers");
        return storedUsers ? JSON.parse(storedUsers) : [];
    });

  useEffect(() => {
    localStorage.setItem("allUsers", JSON.stringify(users));
  }, [users]);

    useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
    
  }, [currentUser]);
const loginUser = (user: User) => {
  console.log(user);
  
    const LoginUserData = users.find(u => u.email == user.email && u.password == user.password);
    if (!LoginUserData) {
      return { status: 404, message: "User with this credentials not found." }
    }
    setCurrentUser(LoginUserData);
    return { status: 200, message: "Login successful!" }


  };
  
  const registerUser = (userData: User) => {
    if (users.find(u => u.email == userData.email)) {
      return { status: 409, message: "Email is already registered!" }
    }
    const newUser = {
      ...userData,
      TodoSectionArray: [],
    };

    setUsers((prev) => [...prev, newUser]);

    setCurrentUser(newUser);
    return { status: 200, message: "User registered successfully!" }
  };
  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
  }
  const addList = (list:TodoSection) => {
    if (!currentUser) {
      return { status: 400, message: "Unauthorized,please login." }
    };



let updatedUser;

  
  updatedUser = {
    ...currentUser,
    TodoSectionArray: [...currentUser.TodoSectionArray, list],
  };


setCurrentUser(updatedUser);
setUsers((prev) =>
  prev.map((u) =>
    u.id == currentUser.id ? updatedUser : u
  )
);
  }


const updateList = (
  ListId: string,
  updatedListData: TodoSection
) => {
  if (!currentUser) {
    return {
      status: 400,
      message: "Unauthorized, please login.",
    };
  }

  const updatedSections =
    currentUser.TodoSectionArray.map((section) => {
      if (section.id === ListId) {
        return {
          ...section,
          ...updatedListData,
        };
      }

      return section;
    });

  const updatedUser: User = {
    ...currentUser,
    TodoSectionArray: updatedSections,
  };

  // Update current logged user
  setCurrentUser(updatedUser);

  // Update users array
  setUsers((prev) =>
    prev.map((u) =>
      u.id === currentUser.id
        ? updatedUser
        : u
    )
  );

  return {
    status: 200,
    message: "List updated successfully",
  };
};

const deleteList = (ListId: string) => {
  if (!currentUser) {
    return {
      status: 400,
      message: "Unauthorized, please login.",
    };
  }

  // Remove the list
  const updatedSections =
    currentUser.TodoSectionArray.filter(
      (section) => section.id !== ListId
    );

  const updatedUser: User = {
    ...currentUser,
    TodoSectionArray: updatedSections,
  };

  // Update current logged user
  setCurrentUser(updatedUser);

  // Update users array
  setUsers((prev) =>
    prev.map((u) =>
      u.id === currentUser.id
        ? updatedUser
        : u
    )
  );

  return {
    status: 200,
    message: "List deleted successfully",
  };
};

 const addSection = (
  ListId: string,
  subSection: SubTodoSection
) => {
  if (!currentUser) {
    return {
      status: 400,
      message: "Unauthorized, please login.",
    };
  }

  const updatedSections = currentUser.TodoSectionArray.map(
    (section) => {
      if (section.id === ListId) {
        return {
          ...section,
          subSections: [
            ...section.subSections,
            subSection,
          ],
        };
      }

      return section;
    }
  );

  const updatedUser: User = {
    ...currentUser,
    TodoSectionArray: updatedSections,
  };

  setCurrentUser(updatedUser);
setUsers((prev) =>
  prev.map((u) =>
    u.id == currentUser.id ? updatedUser : u
  )
);
  return {
    status: 200,
    message: "Sub section added successfully",
  };
};

const deleteSubSection = (
  ListId: string,
  subSectionId: string
) => {
  if (!currentUser) {
    return {
      status: 400,
      message: "Unauthorized, please login.",
    };
  }

  const updatedSections =
    currentUser.TodoSectionArray.map((section) => {
      if (section.id === ListId) {
        return {
          ...section,

          // Remove subsection
          subSections:
            section.subSections.filter(
              (subSection) =>
                subSection.id !==
                subSectionId
            ),
        };
      }

      return section;
    });

  const updatedUser: User = {
    ...currentUser,
    TodoSectionArray: updatedSections,
  };

  // Update current logged user
  setCurrentUser(updatedUser);

  // Update users array
  setUsers((prev) =>
    prev.map((u) =>
      u.id === currentUser.id
        ? updatedUser
        : u
    )
  );

  return {
    status: 200,
    message:
      "Sub section deleted successfully",
  };
};

const updateSubSectionName = (
  ListId: string,
  subSectionId: string,
  newName: string
) => {
  if (!currentUser) {
    return {
      status: 400,
      message: "Unauthorized, please login.",
    };
  }

  if (!newName.trim()) {
    return {
      status: 400,
      message:
        "Section name cannot be empty.",
    };
  }

  const updatedSections =
    currentUser.TodoSectionArray.map(
      (section) => {
        if (section.id === ListId) {
          return {
            ...section,

            subSections:
              section.subSections.map(
                (subSection) => {
                  if (
                    subSection.id ===
                    subSectionId
                  ) {
                    return {
                      ...subSection,

                      subTodoSectionName:
                        newName,
                    };
                  }

                  return subSection;
                }
              ),
          };
        }

        return section;
      }
    );

  const updatedUser: User = {
    ...currentUser,
    TodoSectionArray: updatedSections,
  };

  // Update current user
  setCurrentUser(updatedUser);

  // Update users array
  setUsers((prev) =>
    prev.map((u) =>
      u.id === currentUser.id
        ? updatedUser
        : u
    )
  );

  return {
    status: 200,
    message:
      "Section name updated successfully",
  };
};

const addTodo = (
  ListId: string,
  subSectionId: string,
  todo: Todo
) => {
  if (!currentUser) {
    return {
      status: 400,
      message: "Unauthorized, please login.",
    };
  }

  const updatedSections =
    currentUser.TodoSectionArray.map((section) => {
      if (section.id === ListId) {
        return {
          ...section,

          subSections: section.subSections.map(
            (subSection) => {
              if (
                subSection.id === subSectionId
              ) {
                return {
                  ...subSection,

                  // Add new todo
                  subSectionTodos: [
                    ...subSection.subSectionTodos,
                    todo,
                  ],
                };
              }

              return subSection;
            }
          ),
        };
      }

      return section;
    });

  const updatedUser: User = {
    ...currentUser,
    TodoSectionArray: updatedSections,
  };

  // Update current logged user
  setCurrentUser(updatedUser);

  // Update users array
  setUsers((prev) =>
    prev.map((u) =>
      u.id === currentUser.id
        ? updatedUser
        : u
    )
  );

  return {
    status: 200,
    message: "Todo added successfully",
  };
};

const updateTodo = (
  ListId: string,
  subSectionId: string,
  todoId: string,
  updatedText: string
) => {
  if (!currentUser) {
    return {
      status: 400,
      message: "Unauthorized, please login.",
    };
  }

  const updatedSections =
    currentUser.TodoSectionArray.map((section) => {
      if (section.id === ListId) {
        return {
          ...section,

          subSections: section.subSections.map((subSection) => {
            if (subSection.id === subSectionId) {
              return {
                ...subSection,

                subSectionTodos:
                  subSection.subSectionTodos.map((todo) =>
                    todo.id === todoId
                      ? {
                          ...todo,
                          todoText: updatedText,
                        }
                      : todo
                  ),
              };
            }

            return subSection;
          }),
        };
      }

      return section;
    });

  const updatedUser: User = {
    ...currentUser,
    TodoSectionArray: updatedSections,
  };

  setCurrentUser(updatedUser);

  setUsers((prev) =>
    prev.map((u) =>
      u.id === currentUser.id
        ? updatedUser
        : u
    )
  );

  return {
    status: 200,
    message: "Todo updated successfully",
  };
};

const updateTodoDesc = (
  ListId: string,
  subSectionId: string,
  todoId: string,
  TodoDesc: string
) => {
  if (!currentUser) {
    return {
      status: 400,
      message: "Unauthorized, please login.",
    };
  }
console.log('Authcontext ',ListId,subSectionId,todoId,TodoDesc);

  const updatedSections =
    currentUser.TodoSectionArray.map((section) => {
      if (section.id === ListId) {
        return {
          ...section,

          subSections: section.subSections.map((subSection) => {
            if (subSection.id === subSectionId) {
              return {
                ...subSection,

                subSectionTodos:
                  subSection.subSectionTodos.map((todo) =>
                    todo.id === todoId
                      ? {
                          ...todo,
                          todoDesc: TodoDesc,
                        }
                      : todo
                  ),
              };
            }

            return subSection;
          }),
        };
      }

      return section;
    });

  const updatedUser: User = {
    ...currentUser,
    TodoSectionArray: updatedSections,
  };

  setCurrentUser(updatedUser);

  setUsers((prev) =>
    prev.map((u) =>
      u.id === currentUser.id
        ? updatedUser
        : u
    )
  );

  return {
    status: 200,
    message: "Todo updated successfully",
  };
};


const deleteTodo = (
  ListId: string,
  subSectionId: string,
  todoId: string
) => {
  if (!currentUser) {
    return {
      status: 400,
      message: "Unauthorized, please login.",
    };
  }

  const updatedSections =
    currentUser.TodoSectionArray.map((section) => {
      if (section.id === ListId) {
        return {
          ...section,

          subSections: section.subSections.map((subSection) => {
            if (subSection.id === subSectionId) {
              return {
                ...subSection,

                subSectionTodos:
                  subSection.subSectionTodos.filter(
                    (todo) => todo.id !== todoId
                  ),
              };
            }

            return subSection;
          }),
        };
      }

      return section;
    });

  const updatedUser: User = {
    ...currentUser,
    TodoSectionArray: updatedSections,
  };

  setCurrentUser(updatedUser);

  setUsers((prev) =>
    prev.map((u) =>
      u.id === currentUser.id
        ? updatedUser
        : u
    )
  );

  return {
    status: 200,
    message: "Todo deleted successfully",
  };
};

const markTodoComplete = (
  ListId: string,
  subSectionId: string,
  todoId: string
) => {
  if (!currentUser) {
    return {
      status: 400,
      message: "Unauthorized, please login.",
    };
  }

  const updatedSections =
    currentUser.TodoSectionArray.map((section) => {
      if (section.id === ListId) {
        return {
          ...section,

          subSections: section.subSections.map(
            (subSection) => {
              if (subSection.id === subSectionId) {
                return {
                  ...subSection,
                  subSectionTodos: subSection.subSectionTodos.map(
                    (todo)=>{
                      if(todo.id==todoId){
                        return {
                          ...todo,
                          completedOrNot:!todo.completedOrNot
                        }
                      }
                      return todo
                    }
                )
                };
              }

              return subSection;
            }
          ),
        };
      }

      return section;
    });

  const updatedUser: User = {
    ...currentUser,
    TodoSectionArray: updatedSections,
  };

  // Update current logged user
  setCurrentUser(updatedUser);

  // Update users array
  setUsers((prev) =>
    prev.map((u) =>
      u.id === currentUser.id
        ? updatedUser
        : u
    )
  );

  return {
    status: 200,
    message: "Todo completed successfully",
  };
};
    return (
        <AuthContext.Provider value={{
            currentUser,
            loginUser,
            registerUser,
            handleLogout,
            addList,
            addSection,
            addTodo,
            markTodoComplete,
            updateList,
            deleteList,
            deleteSubSection,
            updateSubSectionName,
            updateTodo,
            deleteTodo,
            updateTodoDesc
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;