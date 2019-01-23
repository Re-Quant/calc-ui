// This is draft, don't look at here

const s = 10000;
const l = 9000;
const d = 1000;
const r = 0.01;

x = (d * r) / (    ((s - l)/s) *  d    )
x = r * s / (s - l)

3800
3725
75

1000
10

( ((3800 - 3725) / 3800) * 1000 * x) =
    (1000 * 0.01) // макс убыток



    ( ((3800 - 3725) / 3800) * 1000 * x) =
        (1000 * 0.01) // макс убыток
        - ((x * 1000) * 0.0075) // комиссия за вход
        - (   ((3800 - 3725) / 3800) * (x * 1000)     * 0.0075) // комиссия за выход по стопу

        ( (1 - (s - l) / s) * d * x) =
            (d * r) // макс убыток
            - ((x * d) * bf) // комиссия за вход
            - (  ((1 - (s - l) / s) * d * x)     * sf) // комиссия за выход по стопу

x * ( (1 - (s - l) / s) * d) + x * (d * bf) + x * (  (1 - (s - l) / s) * d * sf) = (d * r)
x * ( ( (1 - (s - l) / s) * d) + (d * bf) + (  (1 - (s - l) / s) * d * sf) ) = (d * r)
x = (d * r) / ( ( (1 - (s - l) / s) * d) + (d * bf) + (  (1 - (s - l) / s) * d * sf) )

x = (d * r) / ( ( ( (s - l) / s) * d) + (d * bf) + (  ( (s - l) / s) * d * sf) )




( ((s - l) / s) * d * x) =
    (d * r) // макс убыток
    - ((x * d) * bf) // комиссия за вход
    - (   ((s - l) / s) * (x * d)     * sf) // комиссия за выход по стопу



    ( ((s - l) / s) * d * x)
    + ((x * d) * bf)
    + (   ((s - l) / s) * (x * d)     * sf)
        = (d * r)

x * ( ((s - l) / s) * d)
+ x * (d * bf)
+ x * (((s - l) / s) * d * sf)
    = (d * r)




// Calculation example for a 'long' trade
const d = 1000; // deposit
const l = 3725; // stop lose price
const s = 3800; // start price
const r = 0.01; // risk
const bf = 0.0075; // buy fee
const sf = 0.0075; // sell fee

( ((3800 - 3725) / 3800) * 1000 * x) =
    (1000 * 0.01) // max loss
    - ((x * 1000) * 0.0075) // market entry fee
    - (   (1 - (3800 - 3725) / 3800) * (x * 1000)     * 0.0075) // maket exit fee




const x = (d * r) / (
    ( ((s - l) / s) * d)
    + (d * bf)
    + (((s - l) / s) * d * sf)
);

((i) => {
    const d = i * 0.1 * x;
    const c1 = d * 0.0075;
    console.log(d + c1, 10000 * 0.01);
})(10000);

// d - deposit
// l - stop lose price
// s - start price
// r - risk %
// bf - buy fee %
// sf - sell fee %


// initial
((s - l) / s * d * x) * d = (d * r) - ((x * d) * bf) - (x * (abs(l - s) / s) * sf)


// 1
(s - l) / s * d * x * d = d * r - x * d * bf - x * Math.abs(l - s) / s * sf;
// 2
(s - l) / s * d * x * d   + x * d * bf    + x * Math.abs(l - s) / s * sf = d * r;
// 3
x * ((s - l) / s * d * d   + d * bf    + Math.abs(l - s) / s * sf) = d * r;
// 4
x = d * r / ((s - l) / s * d * d   + d * bf    + Math.abs(l - s) / s * sf);
// 5 test

const d = 1000;
const l = 3725;
const s = 3800;
const r = 0.01;
const bf = 0.0075;
const sf = 0.0075;
const x = d * r / ((s - l) / s * d * d   + d * bf    + Math.abs(l - s) / s * sf);

// x = 1000 * 0.01 / ((3800 - 3725) / 3800 * 1000)

pricesRatio - maxToLoose
data.deposit

const s = 9000;
const l = 10000;
const d = 100000;
const r = 0.01;
const bf = 0.075;
const sf = 0.0075;

const p = Math.abs(s - l) / Math.max(s, l);
const entryFee = s > l ? bf : sf;
const exitFee = s > l ? sf : bf;
const x = r / (p + entryFee + (1 - p) * exitFee);

(() => {
    const newDepo = d * x /* 0.0876 */;
    const c1 = newDepo * entryFee;
    const c2 = newDepo * (1 - 0.1) * exitFee;
    const l = newDepo * 0.1;
    console.log(newDepo, d * 0.01, l + c1 + c2, x);
})();
