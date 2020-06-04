export class Account {
    accountId: number;
    username: string;
    password: string;
    active: boolean;
    token?: string;    
    
    constructor() { }

    setData(dados) {
        this.username = dados.username;
        this.active = dados.active;
        this.password = '';
    }


}