import math from 'mathjs';

export default class ER {
    constructor(coefficients, startPoint, s) {
        this.debug = true;

        this.e = math.eye(2);
        this.d = math.zeros(2, 2);
        this.s = s;
        this.x = math.matrix(startPoint);
        this.xl = this.x;
        this.f = math.zeros(2);
        this.J = function (x) {
            return coefficients.a * x._data[0] * x._data[0] + coefficients.b * x._data[0] * x._data[1] + coefficients.c * x._data[1] * x._data[1] + coefficients.d * x._data[0] + coefficients.e * x._data[1];
        };
        this.Jl = this.J(this.x);
        this.iterations = 1;
    }

    log(message) {
        if (this.debug) {
            console.log(message);
        }
    }

    dir(message) {
        if (this.debug) {
            console.dir(message);
        }
    }

    run() {
        let {e, d, s, x, xl, f, J, Jl, iterations} = this;
        this.result = [];

        while(!this.result.length || (this.result[this.result.length-1] - this.result[this.result.length-2]) > 0.00001) {
            this.computeDMatrix();
            this.computeFMatrix();
            this.D = math.norm(d, 1);
            this.log(this.D);
            this.h0 = 0.1 / this.D;
            this.computeHMatrix();
            this.step();
            this.x = this.xl;
        }
    }

    computeDMatrix() {
        let {e, d, s, x, xl, f, J, Jl, iterations} = this;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {

                let e1 = math.squeeze(e.subset(math.index(i, [0, 1])).map(elem => elem * s));
                let e2 = math.squeeze(e.subset(math.index(j, [0, 1])).map(elem => elem * s));
                let x_in = math.add(math.add(x, e1), e2);
                let func = J(x_in);
                d._data[i][j] = func;

                e1 = math.squeeze(e.subset(math.index(i, [0, 1])).map(elem => elem * -s));
                e2 = math.squeeze(e.subset(math.index(j, [0, 1])).map(elem => elem * s));
                x_in = math.add(math.add(x, e1), e2);
                func = J(x_in);
                d._data[i][j] -= func;

                e1 = math.squeeze(e.subset(math.index(i, [0, 1])).map(elem => elem * s));
                e2 = math.squeeze(e.subset(math.index(j, [0, 1])).map(elem => elem * -s));
                x_in = math.add(math.add(x, e1), e2);
                func = J(x_in);
                d._data[i][j] -= func;

                e1 = math.squeeze(e.subset(math.index(i, [0, 1])).map(elem => elem * -s));
                e2 = math.squeeze(e.subset(math.index(j, [0, 1])).map(elem => elem * -s));
                x_in = math.add(math.add(x, e1), e2);
                func = J(x_in);
                d._data[i][j] += func;
            }
        }
        this.log('d');
        this.log(d);
    }

    computeFMatrix() {
        let {e, d, s, x, xl, f, J, Jl, iterations} = this;

        for (let i = 0; i < 2; i++) {
            let e1 = math.squeeze(e.subset(math.index(i, [0, 1])).map(elem => elem * s));
            let x_in = math.add(x, e1);
            let func = J(x_in);
            f._data[i] = func;

            e1 = math.squeeze(e.subset(math.index(i, [0, 1])).map(elem => elem * -s));
            x_in = math.add(x, e1);
            func = J(x_in);
            f._data[i] -= func;

        }

        this.log('f');
        this.log(f);
    }

    computeHMatrix() {
        let {e, d, s, x, xl, f, J, Jl, iterations, D, h0} = this;
        this.H = math.zeros(2, 2);
        for (let i = 0; i < 7; i++) {
            let di = math.pow(d.map(elem => -elem), i);
            let h = di.map(elem => elem * math.pow(h0, (i + 1)) / math.factorial(i + 1));
            this.H = math.add(this.H, h);
        }
        this.log('H');
        this.log(this.H);
    }

    step() {
        let {e, d, s, x, xl, f, J, Jl, iterations, D, h0, H} = this;
        for (let i = 0; i < 20; i++) {
            let xt = math.add(x, math.multiply(H, f).map(elem => -elem * 2 * s));
            let Jt = J(xt);
            if (Jt < Jl) {
                Jl = Jt;
                xl = xt;
                this.result.push({
                    x: xl._data[0],
                    y: xl._data[1],
                    label: Jl
                });
            }
            H = math.multiply(H, math.add(e.map(elem => 2*elem), math.multiply(d, H).map(elem => -elem)));
            this.xl = xl;
            this.Jl = Jl;
        }
    }

    getFinalPoint() {
        return this.result[this.result.length - 1];
    }


}