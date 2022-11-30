// fetch("https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/products", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     "name": "Tomato",
//     "description": "The Most tasty Tomato you'll find!",
//     "price": 10,
//     "unit": "KG",
//     "image":
//       "https://toppng.com/uploads/preview/tomato-transparent-11546976478ldvgdzvazt.png",
//     "categories": ["Fruits and Vegetables", "Vegetables"],
//   }),
// })
//   .then((response) => response.json())
//   .then((response) => console.log(response));

// fetch("https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/products", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     "name": "Cucumber",
//     "description": "The Greenest Cucumber ever!",
//     "price": 8,
//     "unit": "KG",
//     "image":
//       "https://www.clipartmax.com/png/middle/225-2258841_cucumber-clipart-transparent-background-cucumber-png.png",
//     "categories": ["Fruits and Vegetables", "Vegetables"],
//   }),
// })
//   .then((response) => response.json())
//   .then((response) => console.log(response));

fetch("https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/products", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((response) => console.log(response));
