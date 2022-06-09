import { sortBy, groupBy, shuffle, reduce } from "underscore";

export const shuffleItems = ( list ) => {
    return shuffle(list)
}

export const sumArray = ( list, key ) => {
    // return reduce( list, function(memo, num){ return memo + num[key]; }, 0);
    let sum = 0;
    list.map( (item, index)  => { sum += item[key] } )
    return sum

}

export const sortArrayByJs = (items, sortByKey = 'rating', ascending=true) => {
    items = sortBy(items, sortByKey);
    if( !ascending ){
        items = items.reverse()
    }
    return items; // .slice(0, 5);
}



export const findUniqueJs = ( list, group, sortByCount = true, limit=50 ) => {
    let groups = groupBy(list, group);
    let uniqueItems = []
    for (var key in groups) {
        if (groups.hasOwnProperty(key)) {
            // console.log(key + " - " + groups[key]);

            const item = {
                value: key,
                count: groups[key].length,
                listitems: groups[key]
            }
            uniqueItems.push(item)
        }
    }
    // 

    // console.log("uniqueItems : ", uniqueItems);

    let sortByCriteria = 'value'
    if( sortByCount ){ sortByCriteria='count'}

    uniqueItems = sortBy(uniqueItems, sortByCriteria ); // sort (str) is ascending 
    // uniqueItems = uniqueItems.reverse() // to reverse the order, of course replace with better impl

    // console.log("uniqueItems (SORTED) : ", uniqueItems);
    return uniqueItems.slice(0, limit) // reduce
}  

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
 
export async function restCallToBackendAsync(url, token, loggingMessage = "Generic Call")
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


export const leadingZeros = (num, size=2) => {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
