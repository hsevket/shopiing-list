import { gql } from 'apollo-angular';

const getLists = gql`
  query {
    lists {
      id
      title
      items {
        name
        quantity
        completed
      }
    }
  }
`;

const addToList = gql`
  mutation addList($title: String!) {
    createList(data: {title: $title}) {
      id
    }
  }
`;
const addItem = gql`
  mutation addItem($name: String!, $id:ID!) {
    createItem(data: {name: $name, quantity: 1, completed: false, list: {connect: {id: $id}}}) {
      id
    }
  }
`;
const publishItem = gql`
mutation publishItem($id: ID!) {
    publishItem(where: {id: $id}) {
        id
    }
  }
`;
const publishList = gql`
mutation publishList($id: ID!) {
    publishList(where: {id: $id}) {
        id
    }
  }
`;

const getItems = gql`
  query ($id: ID!) {
    items(where: {list: {id: $id}}) {
        name
        id
        quantity
        completed
        list {
          title
        }
      }
  }
`;


const deleteList = gql`
mutation deleteList($id: ID!) {
  deleteList(where: {id: $id}) {
   id
  }
}
`;

const deleteItemByListId = gql`
mutation deletelistitem($id: ID!) {
  deleteManyItems(where: {list: {id: $id}}) {
  	count
  }
}
`;

const deleteItem = gql`
mutation deleteitem($id: ID!) {
  deleteItem(where: {id: $id}){
    id
  }
}
`;

const updateItemCompleted = gql`mutation updateItemCompleted($id:ID!, $completed: Boolean!) {
  updateItem(data: {completed: $completed}, where: {id: $id}){
		id
  }
}`
const updateItemQuantity = gql`mutation updateItemIncrease($id:ID!, $quantity: Int!) {
  updateItem(data: {quantity: $quantity}, where: {id: $id}){
		id
  }
}`

const getFilteredItemsCom = gql`
  query ($id: ID!) {
    items(where: {list: {id: $id}, completed: true}) {
        name
        id
        quantity
        completed
        list {
          title
        }
      }
  }
`;
const getFilteredItemsUnCom = gql`
  query ($id: ID!) {
    items(where: {list: {id: $id}, completed: false}) {
        name
        id
        quantity
        completed
        list {
          title
        }
      }
  }
`;

const getListName = gql`

  query($id: ID!) {
    lists (where: {id: $id} ){
      title
    }
  }
`;


export { getListName, getFilteredItemsCom, getFilteredItemsUnCom, getLists, addToList, publishList, getItems, addItem, publishItem, deleteList, deleteItemByListId, deleteItem,updateItemCompleted, updateItemQuantity };
