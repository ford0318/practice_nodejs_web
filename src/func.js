let func = a => a*a;

let func2 = () =>{
    let r = 0;
    for(let i=1; i<=10;i++){
        r+=1;
    }
    return r;
};

console.log(func(5));
console.log(func2());