import actions from '../actions/get-items';
import { FETCH_SINGLE_ITEM_SUCCESS } from '../actions/get-single-item';
import { EDIT_ITEM_SUCCESS } from '../actions/edit-item';
import { DELETE_SINGLE_ITEM_SUCCESS } from '../actions/delete-item';


const initialState = {};


const AllItems = (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case actions.FETCH_ITEMS_SUCCESS :
      let newItems = {};
      action.items.forEach((item) => newItems[item._id] = item);
      return Object.assign({}, state, newItems);
      break;

    case FETCH_SINGLE_ITEM_SUCCESS :
      const item = action.item;
      return Object.assign({}, state, { [item._id]: item });
      break;

    case EDIT_ITEM_SUCCESS :
      const editedItem = action.item;
      return Object.assign({}, state, { [editedItem._id]: editedItem });
      break;

    case DELETE_SINGLE_ITEM_SUCCESS :
      const deletedItem = action.itemId;
      const newState = Object.assign({}, state);
      delete newState[deletedItem];
      return newState;
      break;

    default :
      return state;
  }
};


export default AllItems;
