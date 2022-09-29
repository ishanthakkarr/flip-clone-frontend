import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import Card from "../../components/UI/Card";
import CartItem from "./CartItem";
import "./style.css";
import { addToCart, getCartItems, removeCartItem } from "../../actions";
import { MaterialButton } from "../../components/MaterialUI";
import { useNavigate } from "react-router-dom";
import PriceDetails from "../../components/PriceDetails";
/**
 * @author
 * @function CartPage
 **/

const CartPage = (props) => {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  // const cartItems = cart?.cartItems;
  const [cartItems, setCartItems] = useState(cart?.cartItems);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(cart.cartItems);
  }, [cart.cartItems]);

  useEffect(() => {
    if (auth.authenticate) {
      dispatch(getCartItems());
    }
  }, [auth.authenticate]);

  const onQuantityIncrement = (_id, qty) => {
    const { name, price, img } = cartItems[_id];
    dispatch(
      addToCart(
        {
          _id,
          name,
          price,
          img,
        },
        1
      )
    );
  };

  const onRemoveCartItem = (_id) => {
    debugger;
    dispatch(removeCartItem({ productId: _id }));
  };

  const onQuantityDecrement = (_id, qty) => {
    const { name, price, img } = cartItems[_id];
    dispatch(
      addToCart(
        {
          _id,
          name,
          price,
          img,
        },
        -1
      )
    );
  };

  if (props.onlyCartItems) {
    return (
      <>
        {Object.keys(cartItems).map((key, index) => (
          <CartItem
            key={index}
            cartItem={cartItems[key]}
            onQuantityInc={onQuantityIncrement}
            onQuantityDec={onQuantityDecrement}
            onRemoveCartItem={onRemoveCartItem}
          />
        ))}
      </>
    );
  }

  return (
    <div>
      <Layout>
        <div
          className="cartContainer"
          style={{
            alignItems: "flex-start",
          }}
        >
          <Card
            headerLeft={`My Cart`}
            headerRight={<div>Deliver to</div>}
            style={{
              width: "calc(100%-400px)",
              overflow: "hidden",
            }}
          >
            {Object.keys(cartItems).map((key, index) => (
              <CartItem
                key={index}
                cartItem={cartItems[key]}
                onQuantityInc={onQuantityIncrement}
                onQuantityDec={onQuantityDecrement}
                onRemoveCartItem={onRemoveCartItem}
              />
            ))}
            <div
              style={{
                width: "100%",
                display: "flex",
                background: "#ffffff",
                justifyContent: "flex-end",
                boxShadow: "0 0 10px 10px #eee",
                padding: "10px 0",
                boxSizing: "border-box",
              }}
            >
              <div style={{ width: "250px" }}>
                <MaterialButton
                  title="PLACE ORDER"
                  onClick={() => navigate("/checkout", { replace: true })}
                />
              </div>
            </div>
          </Card>
          {/* <Card
                        headerLeft={`Price`}
                        style={{
                            width: '380px'
                        }}>
                    </Card> */}
          <PriceDetails
            totalItem={Object.keys(cart.cartItems).reduce(function (qty, key) {
              return qty + cart.cartItems[key].qty;
            }, 0)}
            totalPrice={Object.keys(cart.cartItems).reduce(
              (totalPrice, key) => {
                const { price, qty } = cart.cartItems[key];
                return totalPrice + price * qty;
              },
              0
            )}
          />
        </div>
      </Layout>
    </div>
  );
};

export default CartPage;
