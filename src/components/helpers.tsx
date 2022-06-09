import { findUniqueJs  } from "./helper"
import { sortArrayByJs  } from "./helper"



export async function restCallToBackendAsync(url:string, token:string, loggingMessage = "Generic Call")
{
    const options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: token // token.access
        },
    };

  let response = await fetch(url, options)
  let data = await response.json()
  return data;
}

// 

// export const shuffleItems = ( list ) => {
//     return shuffle(list)
// }

// export const sumArray = ( list, key ) => {
//     // return reduce( list, function(memo, num){ return memo + num[key]; }, 0);
//     let sum = 0;
//     list.map( (item, index)  => { sum += item[key] } )
//     return sum

// }

export const sortArrayBy = <T,>( items : T[] , sortByKey : string = 'rating', ascending:boolean=true) : T[] => {

    return items = sortArrayByJs(items, sortByKey, ascending); // .slice(0, 5);
}

export interface GenericGroup<Type>{
    
    value: string,
    count: number,
    listitems: Type[]    
  }

// const item = {
//     value: key,
//     count: groups[key].length,
//     listitems: groups[key]
// }

export const findUnique  = <T,>( list : T[], group: string, sortByCount:boolean = true, limit:number =50 ) : GenericGroup<T>[]  => {
 
    const returnVal : GenericGroup<T>[] = findUniqueJs( list, group, sortByCount, limit )
    return returnVal;
}  
