class Person {
    constructor(name='noname', age='20'){
        this.name = name;
        this.age = age;
    }
    toJSON(){ //自訂的函數名稱
        const obj = {
            name: this.name,
            age: this.age
        };
        return JSON.stringify(obj)
    }
}

module.exports = Person; //node 匯出類別,只能匯出一個 變數或陣列或物件或函式之一 這個名稱會是 