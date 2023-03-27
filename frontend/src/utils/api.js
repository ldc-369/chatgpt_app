import axios from 'axios';


const BASE_URL = 'http://localhost:4000';
const params = {
    headers: {
        "Content-Type": "application/json"
    }
}


export const fetchDataBotResponse = async(input)=>{ 
    try {
        const {data} = await axios.post(BASE_URL, {input}, {params});   
        return data;
    } catch(err) {
        console.log(err);
        return err;
    }
}