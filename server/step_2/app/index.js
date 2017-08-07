const Stream = require('stream');

class CTX {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.req = {}
        this.res = {}
        this.setHeader = (...headers) => {
            response.setHeader(...headers)
        };
        this.method = request.method;
        this._statusCode = 200;
        this._body = null;
        this.url = request.url;
    }

    redirect(url) {
        this.setHeader("Location", url);
        this.statusCode = 301;
        this.body = '';
    }

    set statusCode(_code) {
        let code = +_code;
        if (isNaN(code)) {
            throw new TypeError('статус код укажите числом!');
        }
        this._statusCode = code;
    }

    get statusCode() {
        return this._statusCode;
    }
    set body(_body) {
        this._body = _body
    }

    get body() {
        return this._body;
    }
}



class UCozApp {
    constructor() {
        this.middlewares = [];
    }

    _response(ctx) {
        let body = ctx._body;
        let statusCode = ctx._statusCode;
        let response = ctx.response

        if (ctx.body == void 0) {
            response.end('not found', 404);
            return;
        }
        if (typeof ctx.body == 'string' || Buffer.isBuffer(body)) {
            response.statusCode = statusCode;
            response.end(body);
            return;
        }

        if (body instanceof Stream) {
            response.statusCode = statusCode;
            body.pipe(response);
            return;
        }
        let json = JSON.stringify(body);
        response.setHeader("Content-Type", "application/json")
        response.end(json);
    }

    use(middleware) {
        if (typeof middleware !== 'function') return;
        this.middlewares.push(middleware);
    }

    async _runMiddlewares(ctx) {
        try {
            let middlewares = this.middlewares;
            for (let q = 0; q < middlewares.length; q++) {
                let middleware = middlewares[q];
                await middleware(ctx);
            }
            return ctx
        } catch (e) {
            throw new Error(e)
        }
    }

    async hendler(request, response) {
        let ctx = new CTX(request, response);
        let middlewares = this.middlewares;
        this._runMiddlewares(ctx).then(ctx => {
            this._response(ctx);
        }).catch(e => {
            console.log(e)
        })


    }
}

module.exports = UCozApp;