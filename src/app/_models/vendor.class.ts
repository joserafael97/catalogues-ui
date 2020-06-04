import { Product } from './product.class';


export class Vendor{
    id: number;
    name: string; 
    cnpj: string; 
    city: string;
    products: Product []; 
    create_at: Date;

    constructor() {}

    setDados(dados) {
        this.id = dados.id;
        this.name = dados.name;
        this.cnpj = dados.cnpj;
        this.city = dados.city;
        this.create_at = dados.create_at;
        this.products = dados.products;
    }
}