export class ListItem {
    name:string;
    id?: string;
    quantity?:number;
    completed?:boolean;
    constructor(name:string){
        this.name=name;
        
    }
}