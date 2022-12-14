import { Contact } from "./contactClass.js";
import { User } from "./userClass.js";
import { Product } from "./productClass.js";

export class Store {
  #name;
  #contactButtons;
  #products;
  #currentUser;
  #categories;
  constructor(name) {
    this.#name = name;
    this.#contactButtons = [];
    this.#products = [];
    this.#currentUser;
    this.#categories = [
      { "class": "AllProducts", "name": "All Products" },
      { "class": "FruitsAndVegetables", "name": "Fruits And Vegetables" },
      { "class": "Dairy", "name": "Dairy" },
      { "class": "Bakery", "name": "Bakery" },
      { "class": "Meats", "name": "Meats" },
      { "class": "DryFood", "name": "Dry Food" },
    ];
    this.getProducts();
    // this.getCurrentUser();

    this.buildMainMenu();
    // this.createProductForm("edit", 101);
  }
  buildMainMenu() {
    let mainMenuUL = document.getElementById("mainMenu");
    this.#categories.forEach((category) => {
      let categoryLI = document.createElement("li");
      categoryLI.setAttribute("class", "menuItemLI");
      let categoryLink = document.createElement("a");
      categoryLink.setAttribute("class", `menuItem`);
      categoryLink.innerHTML = category.name;
      categoryLink.addEventListener("click", () => {
        let filteredProducts = [];
        if (category.class != "AllProducts") {
          this.#products.forEach((product) => {
            if (product.category == category.class) {
              filteredProducts.push(product);
            }
          });
        } else {
          filteredProducts = this.#products;
        }
        if (
          getComputedStyle(document.getElementById("mobileBurger")).display ==
          "block"
        ) {
          document.getElementById("mainMenu").style.display = "none";
        }
        this.renderProducts(filteredProducts);
      });

      categoryLI.appendChild(categoryLink);
      mainMenuUL.appendChild(categoryLI);
    });
  }
  getTheUser() {
    return this.#currentUser;
  }
  setCurrentUser(user) {
    this.#currentUser = user;
  }
  async getCurrentUser() {
    let theCurrentUserId = localStorage.getItem("storeCurrentUser");
    if (theCurrentUserId) {
      let fetchedUser = await fetch(
        "https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users/" +
          theCurrentUserId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response) => response.json());

      this.#currentUser = new User(
        fetchedUser.id,
        fetchedUser.name,
        fetchedUser.email,
        fetchedUser.password,
        fetchedUser.level
      );

      this.getAndSetUserCart(this.#currentUser.getId());

      document.getElementById("noLoginP").style.display = "none";
      document.getElementById("theUserName").innerHTML =
        this.#currentUser.getName();
      document.getElementById("loginP").style.display = "inline-block";

      if (this.#currentUser.getLevel() == "admin") {
        this.doAdmin();
      }
    } else {
    }
  }
  async getAndSetUserCart(userId) {
    let fetchedUserCart = await fetch(
      `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users/${userId}/cart/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());

    this.#currentUser.myCart.theCart = fetchedUserCart.cartProducts;

    this.#currentUser.myCart.renderCart();
  }

  doAdmin() {
    document.querySelectorAll(".productDiv").forEach((product) => {
      let editBTN = document.createElement("a");
      editBTN.setAttribute("class", "editBTN");
      editBTN.innerHTML =
        '<i class="fa-solid fa-pen-to-square"></i>  Edit Product';
      editBTN.addEventListener("click", (e) => {
        let editParent = e.target.parentElement;
        let editParentID = editParent.id;
        let productSN = editParentID.slice(7);
        this.createEditProductForm("edit", productSN);
        document.getElementById("outerProductFrame").style.display = "block";
      });
      product.appendChild(editBTN);
    });
    if (document.getElementById("createNewProductDiv") == undefined) {
      let createNewProductDiv = document.createElement("div");
      createNewProductDiv.setAttribute("id", "createNewProductDiv");
      let createNewProduct = document.createElement("a");
      createNewProduct.setAttribute("id", "createNewProduct");
      createNewProduct.innerHTML =
        '<i class="fa-solid fa-plus"></i> Create New Product';
      createNewProduct.addEventListener("click", (e) => {
        this.createNewProductForm();
        document.getElementById("outerNewProductFrame").style.display = "block";
      });
      createNewProductDiv.appendChild(createNewProduct);
      document.getElementById("main").prepend(createNewProductDiv);
    }
    // createNewProduct.appendChild(editBTN);
  }
  async getProducts() {
    this.#products = [];
    let fetchedProducts = await fetch(
      "https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/products",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());

    fetchedProducts.forEach((product) => {
      let newProduct = new Product(
        product.sn,
        product.name,
        product.category,
        product.image,
        product.price,
        product.unit,
        product.id,
        product.description
      );
      this.#products.push(newProduct);
    });
    this.renderProducts(this.#products);
  }
  renderProducts(allProducts) {
    this.getCurrentUser();
    if (allProducts.length != 0) {
      let allProductsDiv = document.getElementById("products");
      allProductsDiv.innerHTML = "";
      allProducts.forEach((theProduct) => {
        //Every product's DIV
        let productDiv = document.createElement("div");
        productDiv.setAttribute("id", "product" + theProduct.sn);
        productDiv.setAttribute("class", `productDiv ${theProduct.category}`);

        //Product's Title
        let productTitle = document.createElement("h3");
        productTitle.setAttribute("class", "productTitle");
        productTitle.innerHTML = theProduct.name;

        //Product's Image
        let productImage = document.createElement("img");
        productImage.setAttribute("class", "productImg");
        productImage.setAttribute("src", theProduct.image);

        //Product's Description
        let productDesc = document.createElement("p");
        productDesc.setAttribute("class", "productDesc");
        productDesc.innerHTML = theProduct.description;

        //Product's Price
        let productPrice = document.createElement("p");
        productPrice.setAttribute("class", "productPrice");
        productPrice.innerHTML = `Price: ${theProduct.price}$ for 1 ${theProduct.unit}`;

        //Product's Amount Paragraph
        let productAmount = document.createElement("p");
        productAmount.setAttribute("class", "productAmount");
        productAmount.innerHTML = `Amount: `;

        //Product's Amount Input
        let productAmountInput = document.createElement("input");
        productAmountInput.setAttribute("type", "number");
        productAmountInput.setAttribute(
          "id",
          `productAmountInput${theProduct.sn}`
        );
        productAmountInput.setAttribute("class", "productAmountInput");
        productAmountInput.setAttribute("min", "0");
        productAmountInput.setAttribute("max", "5");
        productAmountInput.setAttribute(
          "step",
          `${theProduct.unit == "KG" ? 0.5 : 1}`
        );
        productAmountInput.setAttribute("placeholder", "0");
        productAmountInput.setAttribute("value", "0");

        productAmount.appendChild(productAmountInput);
        productAmount.innerHTML += ` ${theProduct.unit}`;

        //Product's Add To Cart Button Paragraph
        let addProductP = document.createElement("p");
        addProductP.setAttribute("class", "addProductP");

        //Product's Add To Cart Button
        let addProduct = document.createElement("input");
        addProduct.setAttribute("type", "submit");
        addProduct.setAttribute("id", `addProduct${theProduct.sn}`);
        addProduct.setAttribute("class", "addProduct");
        addProduct.setAttribute("value", "Add to Cart");
        addProduct.addEventListener("click", (e) =>
          this.#currentUser.myCart.addToCart(
            theProduct,
            document.getElementById(`productAmountInput${theProduct.sn}`).value
          )
        );

        addProductP.appendChild(addProduct);

        productDiv.appendChild(productTitle);
        productDiv.appendChild(productImage);
        productDiv.appendChild(productDesc);
        productDiv.appendChild(productPrice);
        productDiv.appendChild(productAmount);
        productDiv.appendChild(addProductP);

        allProductsDiv.appendChild(productDiv);
      });
    } else {
      document.getElementById("products").innerHTML =
        "There are no products in this category yet..";
    }

    // this.createProductForm("edit", 101);
  }
  addContact(type, link, iconElement) {
    this.#contactButtons.push(new Contact(type, link, iconElement));
    this.renderContacts();
  }
  renderContacts() {
    let contactsUL = document.getElementById("contactList");
    contactsUL.innerHTML = "";
    this.#contactButtons.forEach((icon) => {
      let contactListItem = document.createElement("li");
      let contactLink = document.createElement("a");
      contactLink.setAttribute("href", icon.link);
      contactLink.setAttribute("title", icon.type);
      contactLink.innerHTML = icon.iconElement;
      contactListItem.appendChild(contactLink);
      contactsUL.appendChild(contactListItem);
    });
  }
  createNewProductForm() {
    let theSN = document.getElementById("newProductSNInput");
    let theName = document.getElementById("newProductNameInput");
    let theDesc = document.getElementById("newProductDescInput");
    let theImage = document.getElementById("newProductImgInput");
    let thePrice = document.getElementById("newProductPriceInput");
    let theUnit = document.getElementById("newProductUnitInput");
    let theCategories = document.getElementById("newProductCategoryInput");
    theSN.value = "";
    theName.value = "";
    theDesc.value = "";
    theImage.value = "";
    thePrice.value = "";
    theCategories.innerHTML = "";
    this.#categories.forEach((category) => {
      if (category.class == "AllProducts") {
      } else {
        let catOption = document.createElement("option");
        catOption.setAttribute("value", category.class);
        catOption.innerHTML = category.name;
        theCategories.appendChild(catOption);
      }
    });
    let newProductBtnP = document.getElementById("createNewProductBtnP");
    let newProductBTN = document.createElement("input");
    newProductBTN.setAttribute("type", "submit");
    newProductBTN.setAttribute("class", "newProductBTN");
    newProductBTN.setAttribute("value", "Add your Product");
    newProductBTN.addEventListener("click", async () => {
      if (
        theSN.value &&
        theName.value &&
        theDesc.value &&
        theImage.value &&
        thePrice.value
      ) {
        let findIfSNExists = await fetch(
          `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/products?search=${theSN.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((response) => response.json());
        if (findIfSNExists.length == 0) {
          this.addProduct(
            new Product(
              theSN.value,
              theName.value,
              theCategories.value,
              theImage.value,

              thePrice.value,
              theUnit.value,
              "",
              theDesc.value
            )
          );
        } else {
          document.getElementById("newProductFormMessages").innerHTML =
            "The SERIAL NUMBER you entered already exists. Enter a different one.";
        }
      } else {
        document.getElementById("newProductFormMessages").innerHTML =
          "Please Fill In ALL the REQUIRED Fields!";
      }
    });
    newProductBtnP.innerHTML = "";
    newProductBtnP.appendChild(newProductBTN);
  }
  createEditProductForm(theType, productSN) {
    let theForm = document.getElementById("ProductFormDiv");
    let productFormHeader = document.getElementById("productFormHeader");
    let theSN = document.getElementById("productSNInput");
    let theName = document.getElementById("productNameInput");
    let theDesc = document.getElementById("productDescInput");
    let theImage = document.getElementById("productImgInput");
    let thePrice = document.getElementById("productPriceInput");
    let theUnit = document.getElementById("productUnitInput");
    let theCategories = document.getElementById("productCategoryInput");

    let theProduct = "";
    this.#products.forEach((product) => {
      if (Number(product.sn) == Number(productSN)) {
        theProduct = product;

        productFormHeader.innerHTML = "Edit Product";
        theSN.setAttribute("value", theProduct.sn);
        theSN.setAttribute("readonly", "");
        theName.setAttribute("value", theProduct.name);
        theDesc.setAttribute("value", theProduct.description);
        theImage.setAttribute("value", theProduct.image);
        thePrice.setAttribute("value", theProduct.price);
        theUnit.querySelectorAll("option").forEach((option) => {
          if (option.value == theProduct.unit) {
            option.setAttribute("selected", "");
          }
        });
        theCategories.innerHTML = "";
        this.#categories.forEach((category) => {
          if (category.class == "AllProducts") {
          } else if (category.class == theProduct.category) {
            let catSelectedOption = document.createElement("option");
            catSelectedOption.setAttribute("value", category.class);
            catSelectedOption.setAttribute("selected", "");
            catSelectedOption.innerHTML = category.name;
            theCategories.appendChild(catSelectedOption);
          } else {
            let catOption = document.createElement("option");
            catOption.setAttribute("value", category.class);
            catOption.innerHTML = category.name;
            theCategories.appendChild(catOption);
          }
        });
        let editProductBtnP = document.getElementById("editProductBtnP");
        let editProductBTN = document.createElement("input");
        editProductBTN.setAttribute("type", "submit");
        editProductBTN.setAttribute("class", "editProductBTN");
        editProductBTN.setAttribute("value", "Save Changes");
        editProductBTN.addEventListener("click", () => {
          if (
            theName.value &&
            theDesc.value &&
            theImage.value &&
            thePrice.value
          ) {
            let editedProduct = new Product(
              theSN.value,
              theName.value,
              theCategories.value,
              theImage.value,
              thePrice.value,
              theUnit.value,
              theProduct.id,
              theDesc.value
            );
            this.saveInfo(editedProduct);
          } else {
            document
              .getElementById("productFormMessages")
              .innerHTML("Please enter ALL the necessary information!");
          }
        });
        let deleteProductBtnP = document.getElementById("deleteProductBtnP");
        let deleteProductBTN = document.createElement("input");
        deleteProductBTN.setAttribute("type", "submit");
        deleteProductBTN.setAttribute("class", "deleteProductBTN");
        deleteProductBTN.setAttribute("value", "Delete Product");
        deleteProductBTN.addEventListener("click", () => {
          this.deleteProduct(theProduct.sn);
        });
        editProductBtnP.innerHTML = "";
        editProductBtnP.appendChild(editProductBTN);
        // theForm.appendChild(editProductBtnP);
        deleteProductBtnP.innerHTML = "";
        deleteProductBtnP.appendChild(deleteProductBTN);
        // theForm.appendChild(deleteProductBtnP);
      }
    });
  }
  async saveInfo(productToSave) {
    console.log(productToSave);
    let toChange = await fetch(
      `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/products?sn=${productToSave.sn}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());

    let toChangeID = toChange[0].id;

    let changedProduct = await fetch(
      `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/products/${toChangeID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "name": productToSave.name,
          "description": productToSave.description,
          "price": productToSave.price,
          "unit": productToSave.unit,
          "image": productToSave.image,
          "category": productToSave.category,
        }),
      }
    ).then((response) => response.json());

    document.getElementById("productFormMessages").innerHTML =
      "Changes to the Product has been SAVED.";
    setTimeout(() => {
      document.getElementById("outerProductFrame").style.display = "none";
      document.getElementById("productFormMessages").innerHTML = "";
      this.getProducts();
    }, 1500);

    this.deleteProductFromAllCarts(productToSave.sn);
  }

  async deleteProduct(someProductSN) {
    let toDelete = await fetch(
      `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/products?sn=${someProductSN}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());

    let productIdToDelete = toDelete[0].id;

    let deletion = await fetch(
      `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/products/${productIdToDelete}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    this.getProducts();
    document.getElementById("outerProductFrame").style.display = "none";

    this.deleteProductFromAllCarts(toDelete[0].sn);
  }
  async deleteProductFromAllCarts(someProductSN) {
    //Getting all users
    let allUsers = await fetch(
      `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    console.log(allUsers);
    allUsers.forEach((user) => getCart(user.id));

    //Getting user cart and deleting product if found
    async function getCart(userID) {
      console.log(userID);
      await fetch(
        `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users/${userID}/cart/${userID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((cart) => {
          console.log(cart.cartProducts);
          if (cart.cartProducts.length > 0) {
            cart.cartProducts.forEach((cartProduct, index) => {
              if (cartProduct[0].sn == someProductSN) {
                console.log(
                  `Deleting product ${JSON.stringify(
                    cart.cartProducts[index]
                  )} from cart..`
                );
                console.log(cart.cartProducts);
                cart.cartProducts.splice(index, 1);

                updateCartProducts(cart.cartProducts);

                async function updateCartProducts(newCartProducts) {
                  console.log(
                    `Updating cart products of user ${userID} to ${JSON.stringify(
                      newCartProducts
                    )}`
                  );
                  let changedCart = await fetch(
                    `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users/${userID}/cart/${userID}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        "cartProducts": newCartProducts,
                      }),
                    }
                  ).then((response) => response.json());
                }
              } else {
                console.log("product does not exist in cart");
              }
            });
          }
        });
    }
  }
  async addProduct(aProduct) {
    let newProduct = await fetch(
      "https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "sn": aProduct.sn,
          "name": aProduct.name,
          "description": aProduct.description,
          "price": aProduct.price,
          "unit": aProduct.unit,
          "image": aProduct.image,
          "category": aProduct.category,
        }),
      }
    ).then((response) => response.json());
    document.getElementById("newProductFormMessages").innerHTML =
      "The New Product has been ADDED to the store.";
    setTimeout(() => {
      document.getElementById("outerNewProductFrame").style.display = "none";
      document.getElementById("newProductFormMessages").innerHTML = "";
      // document.querySelectorAll(".productInput").forEach((pInput) => {
      //   pInput.value = "";
      // });
      this.getProducts();
    }, 1500);
  }
}
