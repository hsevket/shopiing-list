import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { List } from 'src/types/list';
import { ListItem } from 'src/types/listItem';
import { Apollo } from 'apollo-angular';
import { getItems } from '../graphql/graphql.queries';

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

  getItems(): void {
    this.apollo.query({
      query: getItems,
      variables: {
        id: this.ListId,
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
  ngOnInit(): void {
    this.apollo.watchQuery({
      query: getItems,
      
        variables: {
          id: this.ListId,
        }
      
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.items = data.items;
      this.ListName = data.items[0].list.title
      console.log(error);
  }
  );

  }
}
