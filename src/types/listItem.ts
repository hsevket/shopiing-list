export class ListItem {
    name:string;
    id?: string;
    quantity:number =1;
    completed:boolean= false;
    constructor(name:string){
        this.name=name;
        
    }
}