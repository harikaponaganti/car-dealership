import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  const loadVehicles = () => {
    fetch("http://localhost:5000/api/vehicles")
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error(err));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("");
        setLoggedIn(true);
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage("Cannot connect to server");
    }
  };

  useEffect(() => {
    if (loggedIn) {
      loadVehicles();
    }
  }, [loggedIn]);

  const purchaseVehicle = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/vehicles/${id}/purchase`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setMessage("Vehicle purchased successfully!");
      loadVehicles();
    } else {
      setMessage(data.error || "Purchase failed");
    }
  };

  const restockVehicle = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/vehicles/${id}/restock`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setMessage("Vehicle restocked successfully!");
      loadVehicles();
    } else {
      setMessage(data.error || "Restock failed");
    }
  };

  if (loggedIn) {
    return (
      <div style={{ padding: "30px" }}>
        <h1>Car Dealership</h1>
        <h2>Available Vehicles</h2>

        {message && <p className="message">{message}</p>}

        {vehicles.length === 0 ? (
          <p>No vehicles available.</p>
        ) : (
          vehicles.map((car) => (
            <div key={car.id} className="vehicle-card">
              <h3>
                {car.make} {car.model}
              </h3>

              <p>Category: {car.category}</p>
              <p>Price: ₹{car.price}</p>

              <p>
                Stock: <strong>{car.quantity}</strong>
              </p>

              <button
                onClick={() => purchaseVehicle(car.id)}
                disabled={car.quantity === 0}
              >
                {car.quantity === 0 ? "Out of Stock" : "Purchase"}
              </button>

              <button onClick={() => restockVehicle(car.id)}>
                Restock
              </button>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Car Dealership</h1>

        <p className="subtitle">
          Welcome! Login to manage and purchase vehicles.
        </p>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;