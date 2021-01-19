const API_URL = "http://localhost:3001/todos";


export async function GetTodosList(year, month){
    let response = null;
    if(year !== undefined && month !== undefined){
        response = await fetch(`${API_URL}?year=${year}&month=${month}`);
    }else{
        response  = await fetch(API_URL);
    }
    const json = await response.json();
    return json;
}