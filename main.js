import {Lexer} from "./lexer";

let lexer = new Lexer();

await lexer.push_file("./frecuencia_elementos_corpes_1_0.txt");
// await lexer.push_file("./corpes_mini_100000.txt");

// let array = lexer.split("yo espero que tú estés terminando cuando nosotros volvamos de nuestro viaje.");
// let array = lexer.split("dale las gracias a tu prima.");
// let array = lexer.split("qué te voy a decir, si yo acabo de llegar.");
// let array = lexer.split("si me lo hubieras dicho, te habría ayudado.");
let array = lexer.split("me gusta el chocolate.");

console.table(array);
console.log();

for (let index of array) {
  console.log(lexer.words[index][0].text + ":");
  
  for (let word of lexer.words[index]) {
    console.log("  - " + word.to_string());
  }
  
  console.log();
}
