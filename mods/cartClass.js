export class Cart {
  constructor(userID) {
    this.theCart = [];
    this.currentUser = userID;
  }
  async addToCart(product, amount) {
    let foundInCart = -1;
    this.theCart.forEach((productInCart, index) => {
      if (productInCart[0].id == product.id) {
        foundInCart = index;
      }
    });
    if (foundInCart == -1 && amount != 0) {
      let tempCartProductArr = [product, amount];
      this.theCart.push(tempCartProductArr);
    } else {
      if (amount != 0) {
        this.theCart[foundInCart][1] = amount;
      } else {
        this.theCart.splice(foundInCart, 1);
      }
    }
    await fetch(
      `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users/${this.currentUser}/cart/${this.currentUser}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "cartProducts": this.theCart,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => console.log(response));

    this.renderCart();
  }
  renderCart() {
    let cartProducts = document.getElementById("cartProducts");
    cartProducts.innerHTML = "";
    let cartTotalSumNum = document.getElementById("cartTotalSumNum");
    cartTotalSumNum.innerHTML = 0;
    let cartProductsNum = document.getElementById("cartProductsNum");
    cartProductsNum.innerHTML = this.theCart.length;

    this.theCart.forEach((cartProduct, index) => {
      let cartProductDiv = document.createElement("div");
      cartProductDiv.setAttribute("class", "cartProduct");
      cartProductDiv.setAttribute("id", `cartProduct${cartProduct[0].sn}`);

      let cartProductImage = document.createElement("img");
      cartProductImage.setAttribute("class", "cartProductImg");
      cartProductImage.setAttribute("src", cartProduct[0].image);

      let cartProductTitle = document.createElement("h4");
      cartProductTitle.setAttribute("class", "cartProductTitle");
      cartProductTitle.innerHTML = `${cartProduct[0].name}:`;

      let cartProductPrice = document.createElement("span");
      cartProductPrice.setAttribute("class", "cartProductPrice");
      cartProductPrice.innerHTML = `${cartProduct[0].price}$`;

      let cartProductAmount = document.createElement("input");
      cartProductAmount.setAttribute("class", "cartProductAmount");
      cartProductAmount.setAttribute(
        "id",
        `cartProductAmount${cartProduct[0].sn}`
      );
      cartProductAmount.setAttribute("type", "number");
      cartProductAmount.setAttribute("min", "0");
      cartProductAmount.setAttribute("value", cartProduct[1]);
      cartProductAmount.setAttribute(
        "step",
        cartProduct[0].unit == "KG" ? 0.5 : 1
      );

      let cartProductTotalPrice = document.createElement("span");
      cartProductTotalPrice.setAttribute("class", "cartProductTotalPrice");
      cartProductTotalPrice.setAttribute(
        "id",
        `cartProductTotalPrice${cartProduct[0].sn}`
      );
      cartProductTotalPrice.innerHTML = `${
        Number(cartProduct[0].price) * Number(cartProduct[1])
      }$`;

      let cartProductDelete = document.createElement("a");
      cartProductDelete.setAttribute("class", "cartProductDelete");
      cartProductDelete.setAttribute(
        "id",
        `cartProductDelete${cartProduct[0].sn}`
      );
      cartProductDelete.innerHTML = "X";
      cartProductDelete.addEventListener("click", () => {
        console.log("deleting product");
        this.theCart.splice(index, 1);
        this.renderCart();
      });

      cartProductDiv.appendChild(cartProductImage);
      cartProductDiv.appendChild(cartProductTitle);
      cartProductDiv.appendChild(cartProductPrice);
      cartProductDiv.innerHTML += "*";
      cartProductDiv.appendChild(cartProductAmount);
      cartProductDiv.innerHTML += "=";
      cartProductDiv.appendChild(cartProductTotalPrice);
      cartProductDiv.appendChild(cartProductDelete);

      cartProducts.appendChild(cartProductDiv);

      cartTotalSumNum.innerHTML =
        Number(cartTotalSumNum.innerHTML) +
        Number(cartProduct[0].price) * Number(cartProduct[1]);
    });
    document
      .querySelectorAll(".cartProductAmount")
      .forEach((productAmountInput) => {
        productAmountInput.addEventListener("change", (e) => {
          let productSN = e.target.id.slice(17);
          let theProduct;
          this.theCart.forEach((cartProduct) => {
            if (cartProduct[0].sn == productSN) {
              theProduct = cartProduct[0];
            }
          });

          let theAmount = e.target.value;

          this.addToCart(theProduct, theAmount);
        });
      });
  }
}
