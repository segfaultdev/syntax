import {filter} from "./filter";
import {Lexer, LexerState} from "./lexer";
import {parse} from "./parser";
import {sort} from "./sort";
import {to_html} from "./html";

let lexer = new Lexer();

// await lexer.push_file("./frecuencia_elementos_corpes_1_0.txt");
await lexer.push_file("./corpes_mini_1000000.txt");

Bun.serve({
  port: 80,
  
  fetch: function(request) {
    const url = new URL(request.url);
    
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(Bun.file("./public/index.html"));
    } else if (url.pathname === "/style.css") {
      return new Response(Bun.file("./public/style.css"));
    }
    
    const params = url.searchParams;
    lexer.split(params.get("text") || "");
    
    let phrases = sort(filter(lexer, parse(new LexerState(lexer))));
    let string = "";
    
    for (let index in phrases) {
      string += to_html(parseInt(index) + 1, phrases[index]);
    }
    
    return new Response(string);
  },
});
