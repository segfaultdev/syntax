import {Marker} from "./marker";

/* GAdj GAdv GD GN GP GV */

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
    string += this.name + "</th></tr></table>";
    
    return string;
  }
}

export function Parser() {
  this.determiner_complement = function(lexer, marker) {
    return lexer.maybe([
      function(lexer) {
        return lexer.expect({flags: ["Q", "M"], marker: marker});
      },
      
      function(lexer) {
        return this.adjective_phrase(lexer, marker);
      },
      
      function(lexer) {
        return this.noun_phrase(lexer, marker);
      },
      
      function(lexer) {
        return this.prepositional_phrase(lexer);
      },
    ]);
  };
  
  this.determiner_phrase = function(lexer, marker = new Marker()) {
    return lexer.range(lexer.maybe([
      function(lexer) {
        return lexer.expect({root: "todo", flags: ["Q"]});
      },
    ]), function(lexer, predeterminer_array) {
      let flags = ["X-----d", "T", "D"];
      
      if (predeterminer_array.length === 0) {
        flags = flags.concat(["W", "L"]);
      } else {
        marker = marker.merge(predeterminer_array[0].marker);
      }
      
      return lexer.range(lexer.maybe([
        function(lexer) {
          return lexer.expect({flags: flags, marker: marker});
        },
      ]), function(lexer, determiner_array) {
        /* TODO: Complements. */
        
        let array = predeterminer_array.concat(determiner_array);
        
        if (array.length === 0) {
          return null;
        }
        
        return new Phrase("GD", marker, array);
      });
    });
    
    /*
    let array = [];
    
    let predeterminer = lexer.expect({root: "todo", flags: ["Q"]});
    let flags = ["T", "D", "X-----d"];
    
    if (!predeterminer) {
      flags.push("W");
      flags.push("L");
    } else {
      marker = marker.merge(predeterminer.marker);
      array.push(predeterminer);
    }
    
    let determiner = lexer.expect({flags: flags, marker: marker});
    
    if (determiner) {
      array.push(determiner);
    }
    
    while (determiner.flags[0] !== "L") {
      let complement = this.determiner_complement(lexer, marker);
      
      if (!complement) {
        if (array.length === 0) {
          return null;
        }
        
        break;
      }
      
      marker = marker.merge(complement.marker);
      array.push(complement);
    }
    
    return new Phrase("GD", marker, array);
    */
  };
  
  this.noun_phrase = function(lexer, marker = new Marker()) {
    let noun = lexer.expect({flags: ["N", "L"], marker: marker});
    
    if (!noun) {
      return null;
    }
    
    return new Phrase("GN", noun.marker, [noun]);
  };
  
  this.adjective_phrase = function(lexer, marker = new Marker()) {
    let array = [];
    
    let complement = this.adverbial_phrase(lexer);
    
    if (complement) {
      array.push(complement);
    }
    
    let adjective = lexer.expect({flags: [""], marker: marker});
    
    if (adjective) {
      array.push(adjective);
    } else {
      return null;
    }
    
    complement = this.prepositional_phrase(lexer);
    
    if (complement) {
      array.push(complement);
    }
    
    return new Phrase("GAdj", adjective.marker, array);
  };
  
  this.adverbial_phrase = function(lexer) {
    let array = [];
    
    // let complement = this.adverbial_phrase();
    let complement = null;
    
    if (complement) {
      array.push(complement);
    }
    
    let adverb = lexer.expect({flags: ["R"]});
    
    if (adverb) {
      array.push(adverb);
    } else {
      return null;
    }
    
    complement = this.prepositional_phrase(lexer);
    
    if (complement) {
      array.push(complement);
    }
    
    return new Phrase("GAdv", new Marker(), array);
  };
  
  this.prepositional_phrase = function(lexer) {
    let preposition = lexer.expect({flags: ["P"]});
    
    if (!preposition) {
      return null;
    }
    
    let term = this.prepositional_phrase(lexer);
    
    if (term) {
      return new Phrase("GP", new Marker(), [preposition, term]);
    }
    
    term = this.determiner_phrase(lexer);
    
    if (term) {
      return new Phrase("GP", new Marker(), [preposition, term]);
    }
    
    term = this.adverbial_phrase(lexer);
    
    if (term) {
      return new Phrase("GP", new Marker(), [preposition, term]);
    }
    
    return null;
  };
  
  this.parse = function(lexer) {
    return this.determiner_phrase(lexer);
  };
}
