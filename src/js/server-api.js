import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/?key=38620453-9ed76997a091b5a30ef6f5aa5';


export async function fetchImages(q, page, perPage) {
    const url = `${BASE_URL}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data;          
};









  
