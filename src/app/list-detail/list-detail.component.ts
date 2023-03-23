import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { List } from 'src/types/list';
import { ListItem } from 'src/types/listItem';
import { Apollo } from 'apollo-angular';
import { addItem, getItems, publishItem } from '../graphql/graphql.queries';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements OnInit {
  items: ListItem[] = [];
  item?: ListItem;
  ListName?: string;
  ListId: string | null = this.route.snapshot.paramMap.get('id');


  constructor(
   
    private route: ActivatedRoute,
    private apollo: Apollo) { }



  eventCheck(item: ListItem) {
    item.completed = !item.completed;
    console.log(item)
  }
  getItems(id: string): void {
    this.apollo.query({
      query: getItems,
      variables: {
        id: id,
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
            next: (data: any) => this.getItems(this.ListId!),
            error: (e) => console.error(e),
            complete: () => console.info('complete')
          }),
        error: (e) => console.error(e),
          complete: () => console.info('complete'),
        
          
  }); 
  }
  
  ngOnInit(): void {
    this.apollo.watchQuery({
      query: getItems,
      variables: {
        id: this.ListId,
      }
    }).valueChanges.subscribe(
      {
        next: (data: any) => {this.items= data.data.items; this.ListName = data.data.items[0].list.title},
        error: (e) => console.error(e),
        complete: () => console.info('complete')
      }
  );

  }
}
