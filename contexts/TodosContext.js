import {createContext, useState} from 'react'

/**
 * @type {React.Context<*[]>}
 */
export const TodosContext = createContext([])

export const TodosProvider = ({children}) => {
    const [todos, setTodos] = useState([])

    const refreshTodos = async () => {
        try {
            const res = await fetch('/api/todos')
            const latestTodos = await res.json()
            setTodos(latestTodos)
        } catch (err) {
            console.error(err)
        }
    }

    const addTodo = async (description) => {
        try {
            const res = await fetch('/api/todos', {
                method: 'POST',
                body: JSON.stringify(description),
                headers: {'Content-Type': 'application/json'}
            })
            const newTodo = await res.json()
            setTodos((prevTodos) => {
                return [newTodo, ...prevTodos]
            })
        } catch (err) {
            console.error(err)
        }
    }

    const updateTodo = async (updatedTodo) => {
        try {
            const res = await fetch('/api/todos', {
                method: 'PUT',
                body: JSON.stringify(updatedTodo),
                headers: {'Content-Type': 'application/json'},
            })
            await res.json()
            setTodos((prevTodos) => {
                const existingTodos = [...prevTodos]
                const existingTodo = existingTodos.find((todo) => todo.id === updatedTodo.id)
                existingTodo.fields = updatedTodo.fields
                return existingTodos
            })

        } catch (err) {
            console.error(err)
        }
    }

    const deleteTodo = async (id) => {
        try {
            const res = await fetch('/api/todos', {
                method: 'DELETE',
                body: JSON.stringify({id}),
                headers: {'Content-Type': 'application/json'},
            })
            await res.json()
            setTodos((prevTodos) => {
                return prevTodos.filter((x) => x.id !== id)
            })
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <TodosContext.Provider
            value={{
                todos,
                setTodos,
                refreshTodos,
                updateTodo,
                deleteTodo,
                addTodo,
            }}>
            {children}
        </TodosContext.Provider>)
}