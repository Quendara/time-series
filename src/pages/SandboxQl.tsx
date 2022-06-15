import React, { useState, useEffect } from 'react';
import { useGetTodos } from "../hooks/useGetTodos"
import { useGetTodo } from "../hooks/useGetTodo"

interface  Props {
   
}

export const SandboxQl = ( props : Props ) => {

   
    const todos1 = useGetTodos( "1" );
    const todos2 = useGetTodos( "2" );
    const todos23 = useGetTodos( "23" );

    const todo = useGetTodo( "1645803055693" );

    return ( 
    <><h1>Hello</h1>
    <h2>List 1  - #{todos1.length}</h2>
    <h2>List 2  - #{todos2.length}</h2>
    <h2>List 23 - #{todos23.length}</h2>
    <h2>{todo?.name}</h2>

    
    </>
    )
 }