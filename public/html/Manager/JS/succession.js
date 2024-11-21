document.getElementById("successionForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const currentPosition = document.getElementById("currentPosition").value;
    const successorId = document.getElementById("successor").value;
  
    const response = await fetch("http://localhost:5000/api/employees/succession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPosition, successorId }),
    });
  
    const data = await response.json();
    alert(data.message);
  });
  