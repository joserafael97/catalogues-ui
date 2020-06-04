export class Product{

    id: number;
    name: string;
    code: string;
    price: Number;
    create_at: Date;

    constructor() {
       
    }

    setDados(dados) {
        this.id = dados.id;
        this.name = dados.name;
        this.code = dados.code;
        this.price = dados.price;
        this.create_at = dados.create_at;
    }
}