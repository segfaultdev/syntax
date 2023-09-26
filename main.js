import {Lexer} from "./lexer";
import {Parser} from "./parser";

let lexer = new Lexer();
let parser = new Parser(lexer);

// await lexer.push_file("./frecuencia_elementos_corpes_1_0.txt");
await lexer.push_file("./corpes_mini_1000000.txt");

// let array = lexer.split("yo espero que tú estés terminando cuando nosotros volvamos de nuestro viaje.");
// let array = lexer.split("dale las gracias a tu prima.");
// let array = lexer.split("qué te voy a decir, si yo acabo de llegar.");
// let array = lexer.split("si me lo hubieras dicho, te habría ayudado.");
// let array = lexer.split("me gusta el chocolate.");

/*
for await (const line of console) {
  lexer.split(line);
  console.log(parser.parse().to_string());
  
  console.log();
}
*/

// el más estudioso de entre todos los alumnos de la mejor escuela en aquel país

Bun.serve({
  fetch: function(request) {
    const url = new URL(request.url);
    
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(Bun.file("./public/index.html"));
    } else if (url.pathname === "/style.css") {
      return new Response(Bun.file("./public/style.css"));
    }
    
    console.log(request);
  },
});
