import Swal from "sweetalert2";
export async function Order(userId, propertyId, bidAmount, token, order, type) {
  try {
    const response = await fetch(`http://localhost:8000/api/${order}order`, {
      method: order == "limit" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(token.access),
      },
      body: JSON.stringify({
        action: type,
        user_id: userId, // Replace with the actual user ID
        property_id: propertyId, // Replace with the actual property ID
        price: +bidAmount, // Send the bid amount to the API
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: order + " order " + type + " failed",
        text: `Failed to submit bid: ${data.error}`,
      });
      throw new Error(data.error);
    }
    // Handle JSON response
    Swal.fire({
      icon: "success",
      title: `${order} order` + type + " Successful",
      text: `Bid of ${bidAmount} submitted successfully!`,
    });
  } catch (error) {
    console.error("Error placing " + `${order} order` + ":", error);
    // Show error message
  }
}
