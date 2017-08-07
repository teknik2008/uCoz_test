class RegisterRoute{
    constructor(){
        this.methods={
            get:[],
            post:[],
            any:[]
        }
    };
    /**
     * Регистрация методов
     * @param {string} type - метод запроса
     * @param {string} path -путь запроса
     * @param {function} action - обработчик запроса
     */
    _registerMethods(type,path,action){
        if(typeof action !=='function'){
            console.error('Обработчик должен быть ф-цией');
            return false
        }
        let conroller={path,action}
        if(type=='any'){
            let methods=Object.keys(this.methods);
            methods.map(method=>{
                if(method=='any')return;
                this.methods[method].push(conroller);
            });
            return true;
        }
        this.methods[type].push(conroller);
        return true;
    }

    get(path,action){
        return this._registerMethods('get',path,action);
    }

    post(path,action){
        return this._registerMethods('post',path,action);
    }

    get routes(){
        return this._routes.bind(this)
    }



    async _routes(ctx){
        let methodReq=ctx.method.toLowerCase();
        let conrollers=this.methods[methodReq];
        if(conrollers==void 0)return;
        let url=ctx.url;
        for(let q=0;q<conrollers.length;q++){
            let {path,action}=conrollers[q];
            if(path==url){
                await action(ctx);
            }

        }
    }
}

module.exports=RegisterRoute