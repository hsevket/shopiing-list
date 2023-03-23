export class ListItem {
    name:string;
    id?: string;
    quantity?:number;
    completed:boolean= false;
    constructor(name:string){
        this.name=name;
        
    }
}