import {Lexer} from "./lexer";
import {Parser} from "./parser";

let lexer = new Lexer();
let parser = new Parser();

// await lexer.push_file("./frecuencia_elementos_corpes_1_0.txt");
await lexer.push_file("./corpes_mini_1000000.txt");

// let array = lexer.split("yo espero que tú estés terminando cuando nosotros volvamos de nuestro viaje.");
// let array = lexer.split("dale las gracias a tu prima.");
// let array = lexer.split("qué te voy a decir, si yo acabo de llegar.");
// let array = lexer.split("si me lo hubieras dicho, te habría ayudado.");
// let array = lexer.split("me gusta el chocolate.");

Bun.serve({
  // port: 80,
  
  fetch: function(request) {
    const url = new URL(request.url);
    
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(Bun.file("./public/index.html"));
    } else if (url.pathname === "/style.css") {
      return new Response(Bun.file("./public/style.css"));
    }
    
    const params = url.searchParams;
    lexer.split(params.get("text") || "");
    
    let options = parser.parse(lexer);
    let string = "";
    
    for (let i in options) {
      if (i > 0) {
        string += "<br><br>";
      }
      
      string += options[i].to_html();
    }
    
    return new Response(string);
  },
});
