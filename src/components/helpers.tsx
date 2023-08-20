import React, { } from "react";

import { findUniqueJs  } from "./helper"
import { sortArrayByJs  } from "./helper"


export const bull = <span style={{ "margin": "5px" }}>•</span>;


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

export function addLeadingZeros(num: number, totalLength: number): string {
    return String(num).padStart(totalLength, '0');
  }

// 

// export const shuffleItems = ( list ) => {
//     return shuffle(list)
// }

export const sumArray = ( list: any, key: string ) => {
    // return reduce( list, function(memo, num){ return memo + num[key]; }, 0);
    if( key.length === 0 ) return undefined

    try{
        let sum : number = 0.0;
        list.map( (item: any, index : number )  => { sum += parseFloat( item[key].replaceAll(',', '.') ) } )
        return sum    
    }
    catch( e ){
        return undefined;
    }


}

export const sortArrayBy = <T,>( items : T[] , sortByKey : string = 'rating', ascending:boolean=true) : T[] => {

    const output = sortArrayByJs(items, sortByKey, ascending); // .slice(0, 5);

    console.log( "in/out", items, output ) 

    return output
}

export interface GenericGroup<Type>{
    value: string,
    count: number,
    listitems: Type[]    
  }

export const findUnique  = <T,>( list : T[], group: string, sortByCount:boolean = true, limit:number =50 ) : GenericGroup<T>[]  => {
 
    const returnVal : GenericGroup<T>[] = findUniqueJs( list, group, sortByCount, limit )
    return returnVal;
}  

export function mapGenericToStringGroup<T>( group: GenericGroup<T>[] | undefined ){
    let retGroups : string[] = [];
    if( group !== undefined ){
        retGroups = group.map( (x : GenericGroup<T>) => { return x.value } )
    }
    return retGroups;
}

export interface CsvReturn{
    json: any[], 
    skippedLines: string[],
    headers: string[]
}

export const csvToJson = (csv: string, seperator : string ) : CsvReturn => {
    // Convert the data to String and
    // split it in an array
    var array = csv.toString().split("\n");

    // All the rows of the CSV will be
    // converted to JSON objects which
    // will be added to result in an array
    let result : CsvReturn = {
        json:[],
        skippedLines:[],
        headers:[]
    };

    // The array[0] contains all the
    // header columns so we store them
    // in headers array
    let headersT = array[0].split(seperator)

    result.headers = headersT.map( x => { return x.trim() } ) 

    // Since headers are separated, we
    // need to traverse remaining n-1 rows.
    for (let i = 1; i < array.length - 1; i++) {
        let obj: any = {}

        // Create an empty object to later add
        // values of the current row to it
        // Declare string str as current array
        // value to change the delimiter and
        // store the generated string in a new
        // string s
        let str = array[i]
        let s = ''

        // By Default, we get the comma separated
        // values of a cell in quotes " " so we
        // use flag to keep track of quotes and
        // split the string accordingly
        // If we encounter opening quote (")
        // then we keep commas as it is otherwise
        // we replace them with pipe |
        // We keep adding the characters we
        // traverse to a String s
        let flag = 0
        for (let ch of str) {
            if (ch === '"' && flag === 0) {
                flag = 1
            }
            else if (ch === '"' && flag == 1) flag = 0
            if (ch === seperator && flag === 0) ch = '|'
            if (ch !== '"') s += ch
        }

        // Split the string using pipe delimiter |
        // and store the values in a properties array
        let properties = s.split("|")

        if( properties.length !== result.headers.length ){

            result.skippedLines.push( "line length !== headers length : "  +  properties.length +" != " +  result.headers.length )
            result.skippedLines.push( str )
            continue
        }

        // For each header, if the value contains
        // multiple comma separated data, then we
        // store it in the form of array otherwise
        // directly the value is stored
        for (let j in result.headers) {
            if (properties[j].includes(seperator)) {
                obj[ result.headers[j]] = properties[j]
                    .split(seperator).map(item => item.trim())
            }
            else obj[ result.headers[j] ] = properties[j]
        }

        // Add the generated object to our
        // result array
        result.json.push(obj)
    }

    // Convert the resultant array to json and
    // generate the JSON output file.
    // let json = JSON.stringify(result);
    // console.log(result)
    return result
}
