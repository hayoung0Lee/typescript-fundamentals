interface LabeledValue {
    label: string;
}

function printLabel(labeledObj: LabeledValue) {
    console.log(labeledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);


interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});
console.log(mySquare)


interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
// p1.x = 5;

let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
// ro[0] = 12; // 오류!
// ro.push(5); // 오류!
// ro.length = 100; // 오류!
// a = ro; // 오류!
a = ro as number[];

interface StringArray {
    [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];


class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 오류: 숫자형 문자열로 인덱싱을 하면 완전히 다른 타입의 Animal을 얻게 될 것입니다!
// interface NotOkay {
//     [x: number]: Animal;
//     [x: string]: Dog;
// }

interface NotOkay {
    [x: number]: Dog;
    [x: string]: Animal;
}


interface NumberDictionary {
    [index: string]: number | string;
    length: number;    // 성공, length는 숫자입니다
    name: string;      // 오류, `name`의 타입은 인덱서의 하위타입이 아닙니다
}


interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick(): void;
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);


// myAdd는 전체 함수 타입을 가집니다
// let myAdd = function(x: number, y: number): number { return  x + y; };

// 매개변수 x 와 y는 number 타입을 가집니다
let myAdd: (baseValue: number, increment: number) => number =
    function(x, y) { return x + y; };


function buildName(firstName: string = "Will", lastName?: string, ...restOfName: string[]) {
    return firstName + " " + lastName + " " + restOfName.join(" ");
}

let result1 = buildName("Bob");                  // 오류, 너무 적은 매개변수
let result2 = buildName("Bob", "Adams", "Sr.");  // 오류, 너무 많은 매개변수
let result3 = buildName("Bob", "Adams");         // 정확함
console.log(result1)
let result4 = buildName(undefined, "Adams"); 
console.log(result4)

console.log(result2)


interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}


let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function(this: Deck) {
        // NOTE: 아랫줄은 화살표 함수로써, 'this'를 이곳에서 캡처할 수 있도록 합니다
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

console.log("card: " + pickedCard.card + " of " + pickedCard.suit);



function padLeft(value: string, padding: any) {
    if (typeof padding === "number") {
      return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
      return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
  }
  
  padLeft("Hello world", 4); // "Hello world"를 반환합니다.

//   declare function padLeft(value: string, padding: any): string;
// ---생략---
// 컴파일 타임에는 통과하지만, 런타임에는 오류가 발생합니다.
// let indentedString = padLeft("Hello world", true);


interface Bird {
    fly(): void;
    layEggs(): void;
}
  
interface Fish {
swim(): void;
layEggs(): void;
}

declare function getSmallPet(): Fish | Bird;

// let pet = getSmallPet();
// pet.layEggs();
  
  // 두 개의 잠재적인 타입 중 하나에서만 사용할 수 있습니다.
//   pet.swim();


type NetworkLoadingState = {
    state: "loading";
  };
  
  type NetworkFailedState = {
    state: "failed";
    code: number;
  };
  
  type NetworkSuccessState = {
    state: "success";
    response: {
      title: string;
      duration: number;
      summary: string;
    };
  };
  // ---생략---
type NetworkState =
| NetworkLoadingState
| NetworkFailedState
| NetworkSuccessState;


function networkStatus(state: NetworkState): string {
    // 현재 TypeScript는 셋 중 어떤 것이
    // state가 될 수 있는 잠재적인 타입인지 알 수 없습니다.
    
    // 모든 타입에 공유되지 않는 프로퍼티에 접근하려는 시도는
    // 오류를 발생시킵니다.
    // state.code;
    
    // state에 swtich문을 사용하여, TypeScript는 코드 흐름을 분석하면서
    // 유니언 타입을 좁혀나갈 수 있습니다.
    switch (state.state) {
        case "loading":
        return "Downloading...";
        case "failed":
        // 여기서 타입은 NetworkFailedState일 것이며,
        // 따라서 `code` 필드에 접근할 수 있습니다.
        return `Error ${state.code} downloading`;
        case "success":
        return `Downloaded ${state.response.title} - ${state.response.summary}`;
    }
}


// function identity<T>(arg: T): T {
//     return arg;
// }


// let output = identity<string>("myString");

let output = identity("myString" as string);

function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length); // 배열은 .length를 가지고 있습니다. 따라서 오류는 없습니다.
    return arg;
}

function identity<T>(arg: T): T {
    return arg;
}
  
// let myIdentity:     (<T>(arg: T) => T)   = identity;
// let myIdentity: <T>(arg: T) => T = identity;


interface GenericIdentityFn {
    <T>(arg: T): T;
}

let myIdentity: GenericIdentityFn = identity;

  