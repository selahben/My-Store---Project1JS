import { Cart } from "./cartClass.js";

export class User {
  #id;
  #name;
  #email;
  #password;
  #level;
  constructor(id, name, email, password, level) {
    this.#id = id;
    this.#name = name;
    this.#email = email;
    this.#password = password;
    this.#level = level;
    this.myCart = new Cart(this.#id);
  }
  getName() {
    return this.#name;
  }
  getLevel() {
    return this.#level;
  }
  getId() {
    return this.#id;
  }
}
