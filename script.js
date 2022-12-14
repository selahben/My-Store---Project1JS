import { Contact } from "./mods/contactClass.js";
import { Store } from "./mods/storeClass.js";
import { User } from "./mods/userClass.js";

//Mobile Menu
document.getElementById("mobileBurger").addEventListener("click", () => {
  let theMenu = document.getElementById("mainMenu");
  if (theMenu.style.display == "flex") {
    theMenu.style.display = "none";
  } else {
    theMenu.style.display = "flex";
  }
});

//Store Init
//----------
let myStore = new Store("My Store");
//Add Top Contact Icons
myStore.addContact(
  "facebook",
  "https://www.facebook.com",
  "<i class='fa-brands fa-facebook-f'></i>"
);
myStore.addContact(
  "instagram",
  "https://www.instagram.com",
  "<i class='fa-brands fa-instagram'></i>"
);
myStore.addContact(
  "phone",
  "tel:0505555555",
  "<i class='fa-solid fa-phone'></i>"
);
myStore.addContact(
  "email",
  "mailto:office@mystore.com",
  "<i class='fa-solid fa-envelope'></i>"
);

//Sign In/Up/Out Functionality
//----------------------------

//Opening/Closing/Changing Frame
document.getElementById("userSignIn").addEventListener("click", displaySignIn);
document
  .getElementById("signInChange")
  .addEventListener("click", displaySignIn);
document.getElementById("userSignUp").addEventListener("click", displaySignUp);
document
  .getElementById("signUpChange")
  .addEventListener("click", displaySignUp);

function displaySignIn() {
  document.getElementById("signInForm").style.display = "block";
  document.getElementById("signUpForm").style.display = "none";
  document.getElementById("outerSignFrame").style.display = "block";
}
function displaySignUp() {
  document.getElementById("signUpForm").style.display = "block";
  document.getElementById("signInForm").style.display = "none";
  document.getElementById("outerSignFrame").style.display = "block";
}
document.getElementById("closeSignFrameBTN").addEventListener("click", () => {
  document.getElementById("outerSignFrame").style.display = "none";
});

//Sign In
document.getElementById("signInSubmit").addEventListener("click", signInFunc);
async function signInFunc() {
  let theEmail = document.getElementById("signInEmail").value;
  let thePassword = document.getElementById("signInPass").value;
  let messagesP = document.getElementById("signInMessages");
  if (theEmail && thePassword) {
    let fetchedUser = await fetch(
      `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users?search=${theEmail}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    if (fetchedUser.length == 0) {
      messagesP.innerHTML = "No such EMAIL..";
    } else if (thePassword !== fetchedUser[0].password) {
      messagesP.innerHTML = "The password you entered is WRONG!";
    } else {
      localStorage.setItem("storeCurrentUser", fetchedUser[0].id);
      myStore.setCurrentUser(
        new User(
          fetchedUser[0].id,
          fetchedUser[0].name,
          fetchedUser[0].email,
          fetchedUser[0].password,
          fetchedUser[0].level
        )
      );
      myStore.getAndSetUserCart(fetchedUser[0].id);

      document.getElementById("noLoginP").style.display = "none";
      document.getElementById("theUserName").innerHTML = fetchedUser[0].name;
      document.getElementById("signInMessages").innerHTML = "";

      document.getElementById("loginP").style.display = "inline-block";
      document.getElementById("outerSignFrame").style.display = "none";
      if (fetchedUser[0].level == "admin") {
        myStore.doAdmin();
      }
    }
  } else {
    messagesP.innerHTML = "Please enter all The details NEEDED!";
  }
}

//Sign Up
document.getElementById("signUpSubmit").addEventListener("click", signUpFunc);
async function signUpFunc() {
  let theName = document.getElementById("signUpName").value;
  let theEmail = document.getElementById("signUpEmail").value;
  let thePassword = document.getElementById("signUpPass").value;
  let theLevel = document.getElementById("signUpLevel").value;
  let messagesP = document.getElementById("signUpMessages");
  if (theName && theEmail && thePassword && theLevel) {
    let fetchedUser = await fetch(
      `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users?search=${theEmail}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    if (fetchedUser.length != 0) {
      messagesP.innerHTML = "EMAIL already EXISTS! ";
    } else {
      let newUser = await fetch(
        "https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "name": theName,
            "email": theEmail,
            "password": thePassword,
            "level": theLevel,
          }),
        }
      ).then((response) => response.json());
      let newUserCart = await fetch(
        `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users/${newUser.id}/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "userId": newUser.id,
          }),
        }
      ).then((response) => response.json());

      localStorage.setItem("storeCurrentUser", newUser.id);
      myStore.setCurrentUser(
        new User(
          newUser.id,
          newUser.name,
          newUser.email,
          newUser.password,
          newUser.level
        )
      );
      document.getElementById("noLoginP").style.display = "none";
      document.getElementById("theUserName").innerHTML = newUser.name;
      document.getElementById("loginP").style.display = "inline-block";
      document.getElementById("outerSignFrame").style.display = "none";
      document.getElementById("signUpMessages").innerHTML = "";

      if (theLevel == "admin") {
        myStore.doAdmin();
      }
    }
  } else {
    messagesP.innerHTML = "Please enter all The details NEEDED!";
  }
}

//Log Out
document.getElementById("userSignOut").addEventListener("click", () => {
  if (myStore.getTheUser().getLevel() == "admin") {
    document.querySelectorAll(".editBTN").forEach((editBTN) => {
      editBTN.remove();
    });
    document.getElementById("createNewProductDiv").remove();
  }
  //Reset Cart
  document.getElementById("cartProducts").innerHTML = "";
  document.getElementById("cartProductsNum").innerHTML = "0";
  document.getElementById("cartTotalSumNum").innerHTML = "0";

  //Reset sign in/up
  document.getElementById("loginP").style.display = "none";
  document.getElementById("theUserName").innerHTML = "";
  document.getElementById("noLoginP").style.display = "inline-block";
  localStorage.removeItem("storeCurrentUser");
  document.getElementById("editProductBtnP").innerHTML = "";
  document.getElementById("deleteProductBtnP").innerHTML = "";
  document.getElementById("signInMessages").innerHTML = "";
});

//Products frame close button
//---------------------------
document
  .getElementById("closeProductFrameBTN")
  .addEventListener("click", () => {
    document.getElementById("outerProductFrame").style.display = "none";
  });
document
  .getElementById("closeNewProductFrameBTN")
  .addEventListener("click", () => {
    document.getElementById("outerNewProductFrame").style.display = "none";
  });

//Cart button
//---------------------------
let theCartButton = document.getElementById("myCart");
let theCartDiv = document.getElementById("cartDiv");
theCartDiv.style.display = "none";

theCartButton.addEventListener("click", () => {
  if (theCartDiv.style.display == "none") {
    theCartDiv.style.display = "block";
  } else {
    theCartDiv.style.display = "none";
  }
});

console.log(myStore);

// myStore.deleteProductFromAllCarts(103);

// async function getUsersCarts() {
//   let allUsers = await fetch(
//     `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   ).then((response) => response.json());
//   console.log(allUsers);
//   allUsers.forEach((user) => getCart(user));
// }
// async function getCart(user) {
//   let cart = await fetch(
//     `https://6387afc7d9b24b1be3f7825a.mockapi.io/api/myStore/users/${user.id}/cart/${user.id}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   ).then((response) => response.json());
//   console.log(cart);
// }
// getUsersCarts();
