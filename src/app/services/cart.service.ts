import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];


  //Subject is part of the observable pattern, used to publish. BehaviorSubject is the buffered version, used because late initialisation shows empty or 0
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //Reference to web browser session storage, keeping cart contents upon refresh/login.

  //Session
  //storage: Storage = sessionStorage;

  //local
  storage: Storage = localStorage;

  constructor() {

    //read data from storage, JSON parsed into an object
    let data = JSON.parse(this.storage.getItem('cartItems'));

    //Check if null
    if (data != null) {
      this.cartItems = data;

      // compute totals based on data read from storage
      this.computeCartTotals();
    }
  }


  addtoCart(theCartItem: CartItem) {
    // Check if we have the item in the cart
    let alreadyexistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      // Find item in the cart based on id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // Check if we found it.
      alreadyexistsInCart = (existingCartItem != undefined);
    }

    if (alreadyexistsInCart) {
      //Increment quantity
      existingCartItem.quantity++;
    } else {
      // just add the item to the cart
      this.cartItems.push(theCartItem);
    }

    //Compute cart total price and total quantity
    this.computeCartTotals();
  }


  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);

    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {

      // Get index of the item in the array
      const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id == theCartItem.id);

      //if found remove the item form the array at the given index
      if (itemIndex > -1) {
        this.cartItems.splice(itemIndex, 1);
        this.computeCartTotals();
      }
    }


    computeCartTotals() {
      let totalPriceValue: number = 0;
      let totalQuantityValue: number = 0;

      for (let currentCartItem of this.cartItems) {
        totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
        totalQuantityValue += currentCartItem.quantity;
      }

      //publich new values... all subscribers will receive the new data.
      // .next --> publish
      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantityValue);

      //log cart data
      this.logCartData(totalPriceValue, totalQuantityValue);

      //persist cart data
      this.persistCartItems();
  }

    //Persist with 'key' and String of 'value'
    persistCartItems() {
      this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }


    logCartData(totalPriceValue: number, totalQuantityValue: number) {

      console.log(`Contents of the cart`);
      for (let tempCartItem of this.cartItems) {
        const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
        console.log(`name: ${tempCartItem.name},
                     quantity: ${tempCartItem.quantity},
                     unitPrice: ${tempCartItem.unitPrice} ,
                     subTotalPrice: ${subTotalPrice}`);
      }

      console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
      console.log(`---`);
  }


}
