import {Marker} from "./marker";

/* GAdj/GA GAdv/GR GD GN GP GV */

/* Every parsing function (and expect), aside from returning all valid
  resulting phrases or words as an array, may receive a lambda function
  to further continue parsing from the end of said phrase or word.
*/

function maybe(parse) {
  return function(lexer, lambda, marker) {
    parse(lexer.clone(), lambda, marker);
    lambda(lexer.clone(), null);
  };
}

function range(parse) {
  
}

export function Phrase(name, marker, array) {
  this.name = name;
  this.marker = marker;
  
  this.array = array;
  
  this.to_string = function() {
    let string = this.name + "(";
    
    for (let i in this.array) {
      if (i > 0) {
        string += " ";
      }
      
      string += this.array[i].to_string();
    }
    
    string += ")";
    return string;
  };
  
  this.to_html = function() {
    let string = "<table><tr>";
    
    for (let i in this.array) {
      string += "<td>" + this.array[i].to_html() + "</td>";
    }
    
    string += "</tr><tr><th colspan=\"" + this.array.length + "\">";
    string += this.name;
    
    let marker_string = this.marker.to_string();
    
    if (marker_string.length > 0) {
      string += " (" + marker_string + ")";
    }
    
    string += "</th></tr></table>";
    return string;
  };
  
  this.match = function(phrase) {
    return (this.to_string() === phrase.to_string());
  };
}

export function Parser() {
  function adjective_phrase(lexer, lambda, marker) {
    
  }
  
  function adverb_phrase(lexer, lambda, marker) {
    
  }
  
  function determiner_complement(lexer, lambda, marker) {
    lexer.expect({flags: ["M", "Q"], marker: marker}, lambda);
    
    adjective_phrase(lexer.clone(), lambda, marker);
    noun_phrase(lexer.clone(), lambda, marker);
    preposition_phrase(lexer.clone(), lambda, marker);
  }
  
  function determiner_phrase(lexer, lambda, marker) {
    lexer.maybe({root: "todo", flags: ["Q"]},
      function(lexer, predeterminer) {
        let flags = ["D", "T", "X-----d"];
        
        if (predeterminer) {
          marker = marker.merge(predeterminer.marker);
        } else {
          flags = flags.concat(["L", "W"]);
        }
        
        lexer.maybe({flags: flags, marker: marker},
          function(lexer, determiner) {
            if (determiner) {
              marker = marker.merge(determiner.marker);
            }
            
            maybe(adjective_phrase)(lexer,
              function(lexer, adjective) {
                /*
                "A [*N [*A] [P]]"
                "*N [*A] [P]"
                "*A [P]"
                "P"
                */
                
                let noun_marker = marker;
                
                range(noun_phrase)(lexer,
                  function(lexer, nouns) {
                    
                  },
                noun_marker);
              },
            marker);
            
            /*
            let array = [];
            
            if (predeterminer) {
              array.push(predeterminer);
            }
            
            if (determiner) {
              marker = marker.merge(determiner.marker);
              array.push(determiner);
            }
            
            if (array.length === 0) {
              return;
            }
            
            lambda(lexer, new Phrase("GD", marker, array));
            */
          }
        );
      }
    );
  }
  
  function noun_phrase(lexer, lambda, marker) {
    lexer.expect({flags: ["L", "N"], marker: marker},
      function(lexer, word) {
        lambda(lexer, new Phrase("GN", word.marker, [word]));
      }
    );
  }
  
  function preposition_phrase(lexer, lambda, marker) {
    lexer.expect({flags: ["P"]},
      function(lexer, preposition) {
        let in_lambda = function(lexer, complement) {
          lambda(lexer, new Phrase("GP", new Marker(),
            [preposition, complement]
          ));
        };
        
        adjective_phrase(lexer.clone(), in_lambda, new Marker());
        adverb_phrase(lexer.clone(), in_lambda, new Marker());
        determiner_phrase(lexer.clone(), in_lambda, new Marker());
        preposition_phrase(lexer.clone(), in_lambda, new Marker());
      }
    );
  }
  
  function verb_phrase(lexer, lambda, marker) {
    
  }
  
  this.parse = function(lexer) {
    let array = [];
    
    let in_lambda = function(lexer, phrase) {
      if (lexer.state_index === lexer.state_array.length) {
        array.push(phrase);
      }
    };
    
    adjective_phrase(lexer.clone(), in_lambda, new Marker());
    adverb_phrase(lexer.clone(), in_lambda, new Marker());
    determiner_phrase(lexer.clone(), in_lambda, new Marker());
    preposition_phrase(lexer.clone(), in_lambda, new Marker());
    verb_phrase(lexer.clone(), in_lambda, new Marker());
    
    for (let i = 0; i < array.length; i++) {
      let string = array[i].to_string();
      
      for (let j = i + 1; j < array.length; j++) {
        if (array[j].to_string() !== string) {
          continue;
        }
        
        array.splice(j, 1);
        j--;
      }
    }
    
    return array;
  };
}
