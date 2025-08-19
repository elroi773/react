import axios from 'axios';
import { useEffect,useState } from 'react';
import './App.css';
import { div } from 'three/tsl';
import VillagerList from './VillagerList';

function App(){
  const [data,setData] = useState([]);
  const[loading, setLoading] = useState(true);
  const[error,setError] = useState(null);

  const fetchData = async () =>{
    const URL = "https://api/nookipedia.com/villagers";

    try{
      setLoading(true);
      const response = await axios.get(URL,{
        headers:{
          "X-API-KEY": process.env.REACT_APP_API_KEY,
          "Accept-Version" : "1.0.0",
        },
      });
      setData(response.data);
      console.log(response);
    }catch(error){
      setError(error.message);
    }finally{
      setLoading(false);
    }
  }
  useEffect(()=>{
    fetchData();
  },[]);

  if(loading) return <p>Loading...</p>
  if(error) return <p>Error : {error}</p>

  return(
    <div className="container">
      <h1>Animal Crossing</h1>
      <VillagerList />
    </div>
  )
}