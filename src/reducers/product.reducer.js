import { productConstants } from "../actions/constants"

const initState = {
    error: null,
    loading: false,
    products: [],
    productsByPrice: {},
    priceRange: {},
    page: {},
    productDetails:{},
    pageRequest: false
};

export default (state = initState, action) => {
    switch (action.type) {
        case productConstants.GET_PRODUCTS_BY_SLUG:
            state = {
                ...state,
                priceRange: action.payload.priceRange,
                products: action.payload.products,
                productsByPrice: { ...action.payload.productByPrice }
            }
            break;
        case productConstants.GET_PRODUCTS_PAGE_REQUEST:
            state = {
                ...state,
                pageRequest: true
            }
            break;
        case productConstants.GET_PRODUCTS_PAGE_SUCCESS:
            state = {
                ...state,
                page: action.payload.page,
                pageRequest: false
            }
            break;
        case productConstants.GET_PRODUCTS_PAGE_FAILURE:
            state = {
                ...state,
                error: action.payload.error,
                pageRequest: false
            }
            break;

            case productConstants.GET_PRODUCT_DETAILS_BY_ID_REQUEST:
                state = {
                    ...state,
                    loading: true
                }
                break;
            case productConstants.GET_PRODUCT_DETAILS_BY_ID_SUCCESS:
                state = {
                    ...state,
                    productDetails: action.payload.productDetails,
                    loading: false
                }
                break;
            case productConstants.GET_PRODUCT_DETAILS_BY_ID_FAILURE:
                state = {
                    ...state,
                    error: action.payload.error,
                    loading: false
                }
                break;
    }
    return state;
}