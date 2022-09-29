import axios from "../helpers/axios"
import { productConstants } from "./constants";

export const getProductsBySlug = (slug) => {
    return async dispatch => {
        const res = await axios.get(`/products/${slug}`);

        if (res.status === 200) {
            dispatch({
                type: productConstants.GET_PRODUCTS_BY_SLUG,
                payload: res.data
            })
        } else {

        }
    }
}

export const getProductsPage = (payload) => {
    return async dispatch => {
        try {
            const { cid, type } = payload.params;
            dispatch({
                type: productConstants.GET_PRODUCTS_PAGE_REQUEST
            });
            const res = await axios.get(`/page/${cid}/${type}`);
            console.log(res);
            if (res.status === 200) {
                const { page } = res.data;
                dispatch({
                    type: productConstants.GET_PRODUCTS_PAGE_SUCCESS,
                    payload: {
                        page
                    }
                });
            } else {
                const { error } = res.data;
                dispatch({
                    type: productConstants.GET_PRODUCTS_PAGE_FAILURE,
                    payload: {
                        error
                    }
                });
            }
        } catch (error) {
            dispatch({
                type: productConstants.GET_PRODUCTS_PAGE_FAILURE,
                payload: {
                    error
                }
            });
        }

    }
}

export const getProductDetailsById = (payload) => {
    return async dispatch => {
        try {
            const { productId } = payload.params;
            dispatch({
                type: productConstants.GET_PRODUCT_DETAILS_BY_ID_REQUEST
            });
            const res = await axios.get(`/product/${productId}`);
            if (res.status === 200) {
                const { product } = res.data;
                dispatch({
                    type: productConstants.GET_PRODUCT_DETAILS_BY_ID_SUCCESS,
                    payload: {
                        productDetails: product
                    }
                });
            } else {
                const { error } = res.data;
                dispatch({
                    type: productConstants.GET_PRODUCT_DETAILS_BY_ID_FAILURE,
                    payload: {
                        error
                    }
                });
            }
        } catch (error) {
            dispatch({
                type: productConstants.GET_PRODUCT_DETAILS_BY_ID_FAILURE,
                payload: {
                    error
                }
            });
        }

    }
}