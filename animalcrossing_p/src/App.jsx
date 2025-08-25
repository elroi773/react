import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import VillagerList from './VillagerList.jsx';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const URL = "https://api.nookipedia.com/villagers";

    try {
      setLoading(true);
      const response = await axios.get(URL, {
        headers: {
          "X-API-KEY": "api key",
          "Accept-Version": "1.0.0",
        },
      });
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;

  return (
    <div className="container">
      <h1>Animal Crossing</h1>
      <VillagerList villagers={data} />
    </div>
  );
}

export default App;
