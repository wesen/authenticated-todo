import * as React from 'react';
import {TodosContext} from "../contexts/TodosContext";
import {useContext, useState} from "react";
import {useUser} from "@auth0/nextjs-auth0";

export function TodoForm() {
    const [todo, setTodo] = useState('')
    const {addTodo} = useContext(TodosContext)

    function handleSubmit(e) {
        e.preventDefault()
        addTodo(todo)
        setTodo('')
    }

    return (
        <form className="form my-6"
              onSubmit={handleSubmit}>
            <div className="flex flex-col text-sm mb-2">
                <label htmlFor="todo" className="font-bold mb-2 text-gray-800">Todo</label>
                <input type="text"
                       name="todo"
                       id="todo"
                       value={todo}
                       onChange={(e) => setTodo(e.target.value)}
                       className="border-gray-200 p-2 rounded-lg border
                       appearance-none focus:outline-none focus:border-gray-500"
                       placeholder="ex. Learn about authentication"
                />
                <button type="submit"
                        className="w-full rounded bg-blue-500 hover:bg-blue-600 text-white my-2 py-2 px-4">Submit
                </button>
            </div>

        </form>
    );
};