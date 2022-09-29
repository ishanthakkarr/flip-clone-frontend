import { categoryConstants } from "../actions/constants"

const initState = {
    error: null,
    loading: false,
    categories: []
};

// const buildNewCategories = (categories,category) => {
//     let myCategories = [];
//     console.log("buildNewCategories" + myCategories);
//     for(let cat of categories){
//         myCategories.push({
//             ...cat,
//             children:cat.children && cat.children.length > 0 ? buildNewCategories(cat.children,category):[]
//         });
//     }

//     return myCategories;
// }

export default (state = initState, action) => {
    switch (action.type) {
        case categoryConstants.GET_ALL_CATEGORIES_SUCCESS:
            state = {
                ...state,
                categories: action.payload.categories,
                loading: false
            }
            break;
        case categoryConstants.ADD_NEW_CATEGORY_REQUEST:
            state = {
                ...state,
                loading: true
            }
            break;
        case categoryConstants.ADD_NEW_CATEGORY_SUCCESS:
            state = {
                ...state,
                // categories:buildNewCategories(state.categories,action.payload.category),
                loading: false
            }
            break;
        case categoryConstants.ADD_NEW_CATEGORY_FAILURE:
            state = {
                ...initState
            }
            break;
    }
    console.log(state);
    return state;
}