import ER from './ER'

let k = 5;
let coefficients = {
    a: (5 * k * k + 0.45),
    b: - 29.7 * k,
    c: (0.05 * k * k + 45),
    d: - (k * k + 9) / k,
    e: - (k * k + 9) / k
};

let startPoint = [-1, -1];

let er = new ER(coefficients, startPoint, 0.2);
er.run();

export default er;
