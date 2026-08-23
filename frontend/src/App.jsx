import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles")
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Car Dealership</h1>

      {vehicles.map((car) => (
        <div key={car.id}>
          <h2>{car.make} {car.model}</h2>
          <p>Category: {car.category}</p>
          <p>Price: ₹{car.price}</p>
          <p>Available: {car.quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default App;