import { useAuth } from "../Authorisation/Auth";
export async function getWatchlist(userId, token) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/watchlist/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token.access),
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get watchlist");
    }
    const data = await response.json();
    return data.watchlist;
  } catch (error) {
    console.error("Error getting watchlist:", error);
    return null;
  }
}

export async function getPortlist(userId, token) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/portfolio/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token.access),
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get portfolio");
    }
    const data = await response.json();
    return data.portfolio;
  } catch (error) {
    console.error("Error getting portfolio:", error);
    return null;
  }
}

export async function getPropertyById(propertyId) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/getproperties/${propertyId}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get property");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error fetching property details for ID",
      propertyId,
      ":",
      error
    );
    return null;
  }
}

export async function actionFromWatchlist(
  userId,
  propertyId,
  token,
  actionType
) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/watchlist/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token.access),
        },
        body: JSON.stringify({
          action: actionType,
          property_id: propertyId,
        }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        "Failed to " + actionType + " from watchlist: ",
        data.error
      );
    }
    return data.watchlist;
  } catch (error) {
    console.error("Error " + actionType + "ing from watchlist:", error);
    return null;
  }
}

export const fetchOrder = async (orderType, propertyId) => {
  // Fetch top buy orders
  try {
    const Response = await fetch(
      `http://localhost:8000/api/orders/${orderType}/${propertyId}`
    );
    if (!Response.ok) {
      throw new Error("Failed to fetch " + orderType + " orders");
    }
    const Data = await Response.json();
    const BidsArray = Data.map((order) => order.price);
    return BidsArray;
  } catch (error) {
    console.error("Error: ", error);
  }
};
