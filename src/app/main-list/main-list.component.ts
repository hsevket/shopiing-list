import { Component, Input, OnInit } from '@angular/core';

import { List } from 'src/types/list';
import { Apollo } from 'apollo-angular';
import { getLists, addToList, publishList } from '../graphql/graphql.queries';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.css'],
})
export class MainListComponent implements OnInit {
  lists: List[] = [];
  list?: List;
  id: string = '';

  constructor(private apollo: Apollo) {}

  addMainList(value: string): void {
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
        
          
  }); 
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
    this.apollo.watchQuery({
      query: getLists
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.lists = data.lists;
      console.log(error);
  }
  );
  }
}
