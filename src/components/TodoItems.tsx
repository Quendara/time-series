
export interface TodoItem {
    id: string;
    listid: number;
    name: string;
    checked: boolean;
    group: string;
    description: string;
    link: string; 
  }

  export interface TodoMainItem {
    id: string;
    listid: number;
    component: string;
    icon: string;
    owner: string;
    name: string;
    navbar: boolean;
  }