

async function testCheckout() {
  console.log("Initiating checkout request to http://localhost:4000/api/store/checkout...");

  try {
    const response = await fetch("http://localhost:4000/api/store/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customer: {
          firstName: "Test",
          lastName: "User",
          email: "test@eliteagrisolution.com",
          phone: "0780000000"
        },
        billing: {
          firstName: "Test",
          lastName: "User",
          email: "test@eliteagrisolution.com",
          phone: "0780000000",
          addressLine1: "Kigali",
          city: "Kigali",
          country: "Rwanda"
        },
        shipping: {
          firstName: "Test",
          lastName: "User",
          phone: "0780000000",
          addressLine1: "Kigali",
          city: "Kigali",
          country: "Rwanda"
        },
        items: [
          { productId: 256, quantity: 1 }
        ],
        paymentMethodId: 5
      })
    });

    const data = await response.json();
    console.log("HTTP Status:", response.status);
    console.log("Response payload:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to connect or parse response:", err);
  }
}

testCheckout();
