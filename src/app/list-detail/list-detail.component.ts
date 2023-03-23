import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { List } from 'src/types/list';
import { ListItem } from 'src/types/listItem';
import { Apollo } from 'apollo-angular';
import { addItem, deleteItem, getFilteredItemsCom, getFilteredItemsUnCom, getItems, getListName, publishItem, updateItemCompleted, updateItemQuantity } from '../graphql/graphql.queries';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements OnInit {
  items: ListItem[] = [];
  item?: ListItem;
  filter: number = 0;
  ListName?: string;
  ListId: string | null = this.route.snapshot.paramMap.get('id');
  private querySubscription?: Subscription;

  constructor(
   
    private route: ActivatedRoute,
    private apollo: Apollo) { }


deleteItem(id?: string): void{
  this.apollo.mutate({
    mutation: deleteItem,
    variables:{
      id:id
    }
  })
  .subscribe(
    {
      next: (data: any) => console.log(data),
      error: (e) => console.error(e),
      complete: () => console.info('complete') 
  }
  )
}

decreaseQuantity(id?: string, value?: number){
  if(value !== undefined){
  this.apollo.mutate({
    mutation: updateItemQuantity,
    variables:{
      id: id,
      quantity: value -1
    }
  })
  .subscribe(
    {
      next: (data: any) => this.apollo.client.mutate({
        mutation: publishItem,
        variables:{
          id: data.data.updateItem.id
        }
      }),
      error: (e) => console.error(e),
      complete: () => console.info('complete') 
  }
  )}
}

  increaseQuantity(id?: string, value?: number){
    if(value !== undefined){
    this.apollo.mutate({
      mutation: updateItemQuantity,
      variables:{
        id: id,
        quantity: value +1
      }
    })
    .subscribe(
      {
        next: (data: any) => this.apollo.client.mutate({
          mutation: publishItem,
          variables:{
            id: data.data.updateItem.id
          }
        }),
        error: (e) => console.error(e),
        complete: () => console.info('complete') 
    }
    )}
  }
  eventCheck(item: ListItem) {
  
    this.apollo.mutate({
      mutation: updateItemCompleted,
      variables: {
        id: item.id,
        completed: !item.completed
      }
    })
    .subscribe(
      {
        next: (data: any) => this.apollo.client.mutate({
          mutation: publishItem,
          variables:{
            id: data.data.updateItem.id
          }
        }),
        error: (e) => console.error(e),
        complete: () => console.info('complete') 
    }
    )
  }

  getItems(filter: number): void {
    this.apollo.query({
      query: filter === 0? getItems: filter> 0? getFilteredItemsCom: getFilteredItemsUnCom,
      variables: {
        id: this.ListId,
      }
    })
    .subscribe(
      {
        next: (data: any) => this.items = data.data.items,
        error: (e) => console.error(e),
        complete: () => console.info('complete') 
    }
    )
    
  }
  
  additemtoList(value: string): void {
    if(value !== ''){

    
    this.apollo
      .mutate({
        mutation: addItem,
        variables: {
          name: value,
          id: this.ListId
        },
      })
      .subscribe({
        next: (res: any) =>  this.apollo
        .mutate({
          mutation: publishItem,
          variables: {
            id: res.data.createItem.id,
          }
        }).subscribe(
          {
            next: (data: any) => console.log(data),
            error: (e) => console.error(e),
            complete: () => console.info('complete')
          }),
        error: (e) => console.error(e),
          complete: () => console.info('complete'),
  }); }else{
    alert("Name of item shouldn't be empty")
  }
  }
  getListName(id:string | null){
    if(id !== null){
    this.apollo.query({
      query: getListName,
      variables:{
        id:id
      }
    }).subscribe(
      {
        next: (data: any) => {this.ListName = data.data.lists[0].title},
        error: (e) => console.error(e),
        complete: () => console.info('complete')
      }
    )}
  }
  ngOnInit(): void {
    this.getListName(this.route.snapshot.paramMap.get('id'));
    this.querySubscription =  this.apollo.watchQuery({
      query: this.filter === 0?getItems: this.filter>0? getFilteredItemsCom: getFilteredItemsUnCom,
      pollInterval: 500,
      variables: {
        id: this.ListId,
      },
    }).valueChanges.subscribe(
      ({ data, error }: any) => {
        this.items = data.items;
        console.log(error);
    }
  );

  }
  ngOnDestroy() {
    this.querySubscription!.unsubscribe();
  }
}
