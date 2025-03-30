import React, { useEffect, useState } from "react";
import "./App.css"; 

const API_URL = "https://api.thecatapi.com/v1/images/search?has_breeds=1";
const API_KEY = import.meta.env.VITE_CAT_API_KEY;

function App() {
  const [cat, setCat] = useState(null);
  const [banList, setBanList] = useState([]);

  const fetchCat = async () => {
    let tries = 0;
    let result = null;

    while (tries < 10) {
      const res = await fetch(API_URL, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const data = await res.json();
      const breed = data[0]?.breeds?.[0];

      if (!breed) {
        tries++;
        continue;
      }

      const attributes = [
        breed.name,
        breed.origin,
        breed.weight.metric + " lbs",
        breed.life_span + " years",
      ];

      const isBanned = attributes.some((attr) => banList.includes(attr));
      if (!isBanned) {
        result = {
          name: breed.name,
          origin: breed.origin,
          weight: breed.weight.metric + " lbs",
          lifespan: breed.life_span + " years",
          image: data[0].url,
          attributes,
        };
        break;
      }

      tries++;
    }

    setCat(result || null);
  };

  const toggleBan = (value) => {
    setBanList((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    fetchCat();
  }, []);

  return (
    <div className="page">
      <h1>CatExplorer</h1>
      <p>Discover cats!</p>
  
      <div className="layout">
        <div className="left">
          <div className="card">
            <h2>{cat?.name}</h2>
            <div className="tags">
              {cat?.attributes.map((attr) => (
                <button
                  key={attr}
                  onClick={() => toggleBan(attr)}
                  className="attribute"
                >
                  {attr}
                </button>
              ))}
            </div>
            <img src={cat?.image} alt={cat?.name} className="cat-image" />
          </div>
  
          <button onClick={fetchCat} className="discover-button">
            Discover!
          </button>
        </div>
  
        <div className="ban-list">
          <h3>Ban List</h3>
          {banList.length === 0 ? (
            <p>No bans yet</p>
          ) : (
            banList.map((attr) => (
              <button
                key={attr}
                onClick={() => toggleBan(attr)}
                className="ban-item"
              >
                {attr}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
  
  
}

export default App;
