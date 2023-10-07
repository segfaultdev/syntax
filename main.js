import {filter} from "./filter";
import {Lexer, LexerState} from "./lexer";
import {parse} from "./parser";
import {to_html} from "./html";
import {word_sort} from "./sort";

let lexer = new Lexer();

// await lexer.push_file("./frecuencia_elementos_corpes_1_0.txt");
await lexer.push_file("./corpes_mini_1000000.txt");

let verbs = JSON.parse(await Bun.file("verbs.json").text());

Bun.serve({
  port: 80,
  
  fetch: async function(request) {
    const url = new URL(request.url);
    
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(Bun.file("./public/index.html"));
    } else if (url.pathname === "/style.css") {
      return new Response(Bun.file("./public/style.css"));
    }
    
    const params = url.searchParams;
    const text_input = params.get("text");
    
    if (text_input && text_input.length) {
      console.log(text_input);
      lexer.split(text_input);
      
      let phrases = word_sort(filter(lexer, parse(new LexerState(lexer))));
      let string = "";
      
      for (let index in phrases) {
        string += to_html(parseInt(index) + 1, phrases[index]);
      }
      
      console.log("  -> " + phrases.length + " results generated.");
      return new Response(string);
    } else {
      return new Response("Invalid request.");
    }
  },
});
