
export interface TodoItem {
    id: string;
    listid: string;
    name: string;
    checked: boolean;
    group: string;
    description: string;
    link: string; 
  }

  export const createEmptyTodoItem = () : TodoItem => {
    return {  
        id: "666",
        listid: "string",
        name: "string",
        checked: false,
        group: "undefined",
        description: "",
        link: ""
      } 
  }

  export interface TodoUpdateItem {
    id: string;
    listid?: number;
    name?: string;
    checked?: boolean;
    group?: string;
    description?: string;
    link?: string; 
  }  

  export interface TodoMainItem {
    id: string;
    listid: string;
    component: string;
    icon: string;
    owner: string;
    name: string;
    navbar: boolean;
    group: string;
    render: string;
  } 

  // export const createEmptyTodoMainItem = () : TodoItem => {
  //   return {  
  //     id: "";
  //     listid: "";
  //     component: "";
  //     icon: "";
  //     owner: "";
  //     name: "string";
  //     navbar: "boolean";
  //     group: string;
  //     render: string;
  //     } 
  // }

  // export interface TodoMainUpdateItem {
  //   id: string;
  //   listid?: number;
  //   component?: string;
  //   icon?: string;
  //   owner?: string;
  //   name?: string; 
  //   navbar?: boolean;
  //   group?: string;
  //   render?: string;
  // }  

//   export class TodoMainItemUpdate implements TodoMainItem  {
//     id: string;
//     listid: number;
//     component: string;
//     icon: string;
//     owner: string;
//     name: string;
//     navbar: boolean;
//     group: string;
//     render: string;
    
//     constructor(id: string ) {
//         this.id = id;
//         // this.listid = null;
//         // this.component = null;
//         // this.icon = null;
//         // this.owner = null;
//         // this.name = null;
//         // this.navbar = null;
//         // this.group = null;
//         // this.render = null;
//     }

//     setShowInNavbar( v: boolean ) : void {
//       this.navbar = v
//     }
//     setName( name: string ) : void {
//       this.name = name
//     }
//     setGroup( group: string ) : void {
//       this.group = group
//     }


 
//     // getSalary(): number {
//     //     return this.salary;
//     // }
// }