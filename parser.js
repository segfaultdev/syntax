import {Marker} from "./marker";

export function Parser(lexer) {
  this.grupo_determinante = function() {
    // console.log(lexer.expect({flags: ["W-----d"]}));
    // return;
    
    let word = lexer.expect({root: "todo", flags: ["Q"]});
    let array = [];
    
    let flags = ["T", "D", "X-----d"];
    let marker = new Marker();
    
    if (word === null) {
      flags.push("W");
    } else {
      marker = marker.merge(word.marker);
      array.push(word);
    }
    
    word = lexer.expect({flags: flags, marker: marker});
    
    if (word === null)
  };
  
  this.parse = function() {
    this.grupo_determinante();
  };
}
