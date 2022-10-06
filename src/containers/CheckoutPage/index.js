import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, getAddress, getCartItems, makePayment } from "../../actions";
import Layout from "../../components/Layout";
import {
  Anchor,
  MaterialButton,
  MaterialInput,
} from "../../components/MaterialUI";
import PriceDetails from "../../components/PriceDetails";
import Card from "../../components/UI/Card";
import CartPage from "../CartPage";
import AddressForm from "./AddressForm";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";
/**
 * @author
 * @function CheckoutPage
 **/

const CheckoutStep = (props) => {
  return (
    <div className="checkoutStep">
      <div
        onClick={props.onClick}
        className={`checkoutHeader ${props.active && "active"}`}
      >
        <div>
          <span className="stepNumber">{props.stepNumber}</span>
          <span className="stepTitle">{props.title}</span>
        </div>
      </div>
      {props.body && props.body}
    </div>
  );
};

const Address = ({
  adr,
  selectAddress,
  enableAddressEditForm,
  confirmDeliveryAddress,
  onAddressSubmit,
}) => {
  return (
    <div className="flexRow addressContainer">
      <div>
        <input name="address" onClick={() => selectAddress(adr)} type="radio" />
      </div>
      <div className="flexRow sb addressinfo">
        {!adr.edit ? (
          <div style={{ width: "100%" }}>
            <div className="addressDetail">
              <div>
                <span className="addressName">{adr.name}</span>
                <span className="addressType">{adr.addressType}</span>
                <span className="addressMobileNumber">{adr.mobileNumber}</span>
              </div>
              {adr.selected && (
                <Anchor
                  name="EDIT"
                  onClick={() => enableAddressEditForm(adr)}
                  style={{
                    fontWeight: "500",
                    color: "#2874f0",
                  }}
                />
              )}
            </div>
            <div className="fullAddress">
              {adr.address} <br /> {`${adr.state} - ${adr.pinCode}`}
            </div>
            {adr.selected && (
              <MaterialButton
                title="DELIVERY HERE"
                onClick={() => confirmDeliveryAddress(adr)}
                style={{
                  width: "200px",
                  margin: "10px 0",
                }}
              />
            )}
          </div>
        ) : (
          <AddressForm
            withoutLayout={true}
            onSubmitForm={onAddressSubmit}
            initialData={adr}
            onCancel={() => {}}
          />
        )}
      </div>
    </div>
  );
};

const CheckoutPage = (props) => {
  const user = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth);
  const [newAddress, setNewAddress] = useState(false);
  const [address, setAddress] = useState([]);
  const [confirmAddress, setConfirmAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderSummary, setOrderSummary] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(false);
  const [paymentOption, setPaymentOption] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [paymentOptionValue, setPaymentOptionValue] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const onAddressSubmit = (addr) => {
    setSelectedAddress(addr);
    setConfirmAddress(true);
    setOrderSummary(true);
  };

  useEffect(() => {
    auth.authenticate && dispatch(getAddress());
    auth.authenticate && dispatch(getCartItems());
  }, [auth.authenticate]);

  useEffect(() => {
    const _address = user.address.map((adr) => ({
      ...adr,
      selected: false,
      edit: false,
    }));
    setAddress(_address);
  }, [user.address]);

  const onConfirmOrder = async () => {
    const totalAmount = Object.keys(cart.cartItems).reduce(
      (totalPrice, key) => {
        const { price, qty } = cart.cartItems[key];
        return totalPrice + price * qty;
      },
      0
    );
    const items = Object.keys(cart.cartItems).map((key) => ({
      productId: key,
      payablePrice: cart.cartItems[key].price,
      purchasedQty: cart.cartItems[key].qty,
    }));
    const payload = {
      addressId: selectedAddress._id,
      totalAmount,
      items,
      // paymentStatus: "pending",
      // paymentType: "cod",
    };
    console.log(paymentOptionValue);
    if (paymentOptionValue) {
      payload.paymentStatus = "pending";
      payload.paymentType = "cod";
      dispatch(addOrder(payload));
      setConfirmOrder(true);
    } else if (!paymentOptionValue) {
      let paymentPayload = {
        totalAmount,
      };
      dispatch(makePayment(paymentPayload)).then((result) => {
        console.log("result===========>", result);
        if (!result.isSuccess) {
          // dispatch(getAllCategory());
          // setDeleteCategoryModal(false);
          return;
        } else {
          payload.paymentStatus = "pending";
          payload.paymentType = "card";
          dispatch(addOrder(payload)).then((_result) => {
            if (_result.isSuccess) {
              const options = {
                key: process.env.key_id, // Enter the Key ID generated from the Dashboard
                amount: result?.paymentDetail?.data?.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: result?.paymentDetail?.data?.currency,
                // _id:auth.user._id
                name: "ISHAN Thakkar",
                description: result?.paymentDetail?.data?.notes?.desc,
                image:
                  "data:image/png;base64,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",
                order_id: result?.paymentDetail?.data?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
                handler: function (response) {
                  // alert(response.)
                  // setOrderId(response.razorpay_payment_id);
                  // setPaymentId(response.razorpay_order_id);
                  // setSignature(response.razorpay_signature);
                  // setPayment(true);
                  if (
                    response.razorpay_payment_id &&
                    response.razorpay_order_id &&
                    response.razorpay_signature
                  ) {
                    debugger
                    setConfirmOrder(true);
                  }
                },
                prefill: {
                  name: auth.user.firstName + " " + auth.user.lastName,
                  email: auth.user.email,
                  contact: "9265672375",
                },
                notes: {
                  address: "Razorpay Corporate Office",
                  actual_order_id: _result.order_id,
                },
                theme: {
                  color: "#3399cc",
                },
              };
              console.log("options ===> ", options);
              debugger;
              var rzp1 = new window.Razorpay(options);
              rzp1.open();
            }
          });
        }
      });
    }
  };

  const selectAddress = (addr) => {
    const updatedAddress = address.map((adr) =>
      adr._id === addr._id
        ? { ...adr, selected: true }
        : { ...adr, selected: false }
    );
    setAddress(updatedAddress);
  };

  const confirmDeliveryAddress = (addr) => {
    setConfirmAddress(true);
    setSelectedAddress(addr);
    setOrderSummary(true);
  };

  const enableAddressEditForm = (addr) => {
    const updatedAddress = address.map((adr) =>
      adr._id === addr._id ? { ...adr, edit: true } : { ...adr, edit: false }
    );
    setAddress(updatedAddress);
  };

  const userOrderConfirmation = () => {
    setOrderConfirmation(true);
    setOrderSummary(false);
    setPaymentOption(true);
  };

  useEffect(() => {
    if (confirmOrder) {
      // props.history.push(`/order_details/${user.placedOrderId}`);
      navigate(`/order_details/${user.placedOrderId}`, { replace: true });
    }
  }, [confirmOrder]);

  return (
    <Layout>
      <div className="cartContainer" style={{ alignItems: "flex-start" }}>
        <div className="checkoutContainer">
          {/* check if user logged in or not */}
          <CheckoutStep
            stepNumber={"1"}
            title={"LOGIN"}
            active={!auth.authenticate}
            body={
              auth.authenticate ? (
                <div className="loggedInId">
                  <span style={{ fontWeight: 500 }}>{auth.user.fullName}</span>
                  <span style={{ margin: "0 5px" }}>{auth.user.email}</span>
                </div>
              ) : (
                <div>
                  <MaterialInput label="Email" />
                </div>
              )
            }
          />

          <CheckoutStep
            stepNumber={"2"}
            title={"DELIVERY ADDRESS"}
            active={!confirmAddress && auth.authenticate}
            body={
              <>
                {confirmAddress ? (
                  <div className="stepCompleted">{`${selectedAddress.name} ${selectedAddress.address} - ${selectedAddress.pinCode}`}</div>
                ) : (
                  address.map((adr) => (
                    <Address
                      selectAddress={selectAddress}
                      enableAddressEditForm={enableAddressEditForm}
                      confirmDeliveryAddress={confirmDeliveryAddress}
                      onAddressSubmit={onAddressSubmit}
                      adr={adr}
                    />
                  ))
                )}
              </>
            }
          />

          {confirmAddress ? null : newAddress ? (
            <AddressForm onSubmitForm={onAddressSubmit} onCancel={() => {}} />
          ) : (
            <CheckoutStep
              stepNumber={"+"}
              title={"ADD NEW ADDRESS"}
              active={false}
              onClick={() => setNewAddress(true)}
            />
          )}

          <CheckoutStep
            stepNumber={"3"}
            title={"ORDER SUMMARY"}
            active={orderSummary}
            body={
              orderSummary ? (
                <CartPage onlyCartItems={true} />
              ) : orderConfirmation ? (
                <div className="stepCompleted">
                  {Object.keys(cart.cartItems).length} items
                </div>
              ) : null
            }
          />

          {orderSummary && (
            <Card
              style={{
                margin: "10px 0",
              }}
            >
              <div
                className="flexRow sb"
                style={{
                  padding: "20px",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "12px" }}>
                  Order confirmation email will be send to{" "}
                  <strong>{auth.user.email}</strong>
                </p>
                <MaterialButton
                  title="CONTINUE"
                  onClick={userOrderConfirmation}
                  style={{
                    width: "200px",
                  }}
                />
              </div>
            </Card>
          )}

          <CheckoutStep
            s
            tepNumber={"4"}
            title={"PAYMENT OPTIONS"}
            active={paymentOption}
            body={
              paymentOption && (
                <div>
                  <div
                    className="flexRow"
                    style={{
                      alignItems: "center",
                      padding: "20px",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentOption1"
                      checked={paymentOptionValue}
                      // value={paymentOptionValue}
                      onClick={() => setPaymentOptionValue(true)}
                    />
                    <div>Cash on delivery</div>
                    <input
                      type="radio"
                      name="paymentOption2"
                      checked={!paymentOptionValue}
                      // value={paymentOptionValue}
                      onClick={() => setPaymentOptionValue(false)}
                    />
                    <div>Online</div>
                  </div>
                  <MaterialButton
                    title="Confirm Order"
                    onClick={onConfirmOrder}
                    style={{
                      width: "200px",
                      margin: "0 0 20px 20px",
                    }}
                  />
                </div>
              )
            }
          />
        </div>

        {/* Price Component */}
        <PriceDetails
          totalItem={Object.keys(cart.cartItems).reduce(function (qty, key) {
            return qty + cart.cartItems[key].qty;
          }, 0)}
          totalPrice={Object.keys(cart.cartItems).reduce((totalPrice, key) => {
            const { price, qty } = cart.cartItems[key];
            return totalPrice + price * qty;
          }, 0)}
        />
      </div>
    </Layout>
  );
};

export default CheckoutPage;
