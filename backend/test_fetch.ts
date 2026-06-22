async function run() {
  try {
    console.log("Fetching PesaPal...");
    const res = await fetch("https://pay.pesapal.com/v3/api/Auth/RequestToken", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ consumer_key: "", consumer_secret: "" })
    });
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("BODY:", text);
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
}
run();
