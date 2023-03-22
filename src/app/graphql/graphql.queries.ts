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
        list {
          title
        }
      }
  }
`;
export { getLists, addToList, publishList, getItems };
