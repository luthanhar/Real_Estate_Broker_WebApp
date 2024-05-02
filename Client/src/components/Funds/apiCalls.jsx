// API calls
export const fetchCurrentFunds = async (userId, token) => {
  try {
    const response = await fetch(`http://localhost:8000/api/funds/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(token.access),
      },
    });
    if (!response.ok) {
      throw new Error("");
    }
    const data = await response.json();
    return data.funds;
  } catch (error) {
    console.error("Error fetching funds:", error);
  }
};

export const fetchUsername = async (userId, token) => {
  try {
    const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(token.access),
      },
    });

    if (!response.ok) {
      throw new Error("");
    }
    const data = await response.json();

    return data.name;
  } catch (error) {
    console.error("Error fetching username:", error);
  }
};

export const addFunds = async (userId, token, addAmount) => {
  try {
    const response = await fetch(`http://localhost:8000/api/funds/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(token.access),
      },
      body: JSON.stringify({
        action: "add",
        amount: parseFloat(addAmount),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }
    return data.funds;
  } catch (error) {
    console.error("Error adding funds:", error);
  }
};

export const withdrawFunds = async (userId, token, withdrawAmount) => {
  try {
    const response = await fetch(`http://localhost:8000/api/funds/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(token.access),
      },
      body: JSON.stringify({
        action: "withdraw",
        amount: parseFloat(withdrawAmount),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }
    return data.funds;
  } catch (error) {
    console.error("Error adding funds:", error);
  }
};
