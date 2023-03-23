import { Component, Input, OnInit } from '@angular/core';

import { List } from 'src/types/list';
import { Apollo } from 'apollo-angular';
import { getLists, addToList, publishList, deleteList, deleteItemByListId } from '../graphql/graphql.queries';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.css'],
})
export class MainListComponent implements OnInit {
  lists: List[] = [];
  list?: List;
  id: string = '';
  private querySubscription?: Subscription;
  constructor(private apollo: Apollo) {}

  deleteList(id?: string): void{
    console.log('this is item id' + id)
    this.apollo.mutate({
      mutation: deleteItemByListId,
      variables: {
        id: id,
      },
    }).subscribe(({ data, error }: any) => {
      this.apollo.mutate({
        mutation: deleteList,
        variables: {
          id: id,
        },}).subscribe(({ data, error }: any) => {console.log(data + "    item deleted" )})
      console.log(error);
  })
  };
  addMainList(value: string): void {
    if(value !== ''){
    this.apollo
      .mutate({
        mutation: addToList,
        variables: {
          title: value,
        },
      })
      .subscribe({
        next: (res: any) =>  this.apollo
        .mutate({
          mutation: publishList,
          variables: {
            id: res.data.createList.id,
          },
          refetchQueries: [{
            query: getLists
          }]
        }).subscribe(
          {
            next: (data: any) => console.log(data),
            error: (e) => console.error(e),
            complete: () => console.info('complete')
          }),
        error: (e) => console.error(e),
          complete: () => console.info('complete'),
        
          
  }); }else{
    alert("Name of the List shouldn't be empty")
  }
  }

  getList(): void {
    this.apollo.query({
      query: getLists
    })
    .subscribe(
      {
        next: (data: any) => {this.lists = data.data.lists;},
        error: (e) => console.error(e),
        complete: () => console.info('complete') 
    }
    )
  }

  ngOnInit(): void {
    this.querySubscription = this.apollo.watchQuery({
      query: getLists,
      pollInterval: 500,
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.lists = data.lists;
      console.log(error);
  }
  );
  }
  ngOnDestroy() {
    this.querySubscription!.unsubscribe();
  }
}
