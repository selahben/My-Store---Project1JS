fetch("https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/products", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((response) => console.log(response));
