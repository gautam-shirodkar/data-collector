import axios from 'axios';

export const DataService = data => (
    axios.get('http://localhost:4000/allData')
        .then(res => res)
)

export const DeleteEntry = d => {
    return axios.delete('http://localhost:4000/deleteEntry/' + d)
        .then(res => res);
}
