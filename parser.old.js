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

function range(parse, reset_marker = false) {
  return function(lexer, lambda, marker) {
    let phrases = [];
    
    let range_lambda = function(lexer, phrase) {
      phrases.push(phrase);
      lambda(lexer, phrases);
      
      let next_marker = (reset_marker ? new Marker() : marker);
      parse(lexer.clone(), range_lambda, next_marker);
    };
    
    lambda(lexer.clone(), phrases);
    parse(lexer.clone(), range_lambda, marker);
  };
}

export function Phrase(name, marker, array) {
  this.name = name;
  this.marker = marker;
  
  this.array = array;
  
  this.to_string = function() {
    let string = this.name + "(" + this.marker.to_string() + ")(";
    
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
  
  this.score = function() {
    let score = 0.0;
    
    for (let i in this.array) {
      score += this.array[i].score();
    }
    
    return score;
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
              function(lexer, anterior) {
                /*
                ""
                */
                
                range(noun_phrase, true)(lexer,
                  function(lexer, nouns) {
                    if (nouns.length === 1) {
                      marker = marker.merge(nouns[0].marker);
                    }
                    
                    console.log(nouns);
                    
                    maybe(preposition_phrase)(lexer,
                      function(lexer, posterior) {
                        // predeterminer
                        // determiner
                        // anterior
                        // nouns
                        // posterior
                        
                        // A predeterminer can go without a determiner
                        // if one of these conditions are met:
                        
                        // 1. The phrase has no complements.
                        // 2. The predeterminer is singular, and it has
                        //    at least a noun as a complement.
                        
                        if (predeterminer && !determiner &&
                            !(nouns.length > 0 ||
                            (!anterior && !posterior))) {
                          return;
                        }
                        
                        let array = [];
                        
                        if (predeterminer) {
                          array.push(predeterminer);
                        }
                        
                        if (determiner) {
                          array.push(determiner);
                        }
                        
                        if (anterior) {
                          array.push(anterior);
                        }
                        
                        array = array.concat(nouns);
                        
                        if (posterior) {
                          array.push(posterior);
                        }
                        
                        if (array.length === 0) {
                          return;
                        }
                        
                        lambda(lexer, new Phrase("GD", marker, array));
                      },
                    new Marker());
                  },
                marker);
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
    /* TODO: Expect adjective phrases, and *only* those. */
    
    lexer.expect({flags: ["N"], marker: marker},
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
    
    return array.sort(
      function(phrase_a, phrase_b) {
        return (phrase_b.score() - phrase_a.score());
      }
    );
  };
}
