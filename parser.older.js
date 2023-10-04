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

export function Parser(lexer) {
  this.determiner_complement = function(marker) {
    lexer.save();
    let complement = lexer.expect({flags: ["Q", "M"], marker: marker});
    
    if (complement) {
      return complement;
    }
    
    complement = this.prepositional_phrase();
    
    if (complement) {
      return complement;
    }
    
    complement = this.noun_phrase(marker);
    
    if (complement) {
      return complement;
    }
    
    complement = this.adjective_phrase(marker);
    
    if (complement) {
      return complement;
    }
    
    lexer.load();
    return null;
  };
  
  this.determiner_phrase = function(marker = new Marker()) {
    lexer.save();
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
      let complement = this.determiner_complement(marker);
      
      if (!complement) {
        if (array.length === 0) {
          lexer.load();
          return null;
        }
        
        break;
      }
      
      marker = marker.merge(complement.marker);
      array.push(complement);
    }
    
    return new Phrase("GD", marker, array);
  };
  
  this.noun_phrase = function(marker = new Marker()) {
    lexer.save();
    let noun = lexer.expect({flags: ["N", "L"], marker: marker});
    
    if (!noun) {
      lexer.load();
      return null;
    }
    
    return new Phrase("GN", noun.marker, [noun]);
  };
  
  this.adjective_phrase = function(marker = new Marker()) {
    let array = [];
    lexer.save();
    
    let complement = this.adverbial_phrase();
    
    if (complement) {
      array.push(complement);
    }
    
    let adjective = lexer.expect({flags: [""], marker: marker});
    
    if (adjective) {
      array.push(adjective);
    } else {
      lexer.load();
      return null;
    }
    
    complement = this.prepositional_phrase();
    
    if (complement) {
      array.push(complement);
    }
    
    return new Phrase("GAdj", adjective.marker, array);
  };
  
  this.adverbial_phrase = function() {
    let array = [];
    lexer.save();
    
    // let complement = this.adverbial_phrase();
    let complement = null;
    
    if (complement) {
      array.push(complement);
    }
    
    let adverb = lexer.expect({flags: ["R"]});
    
    if (adverb) {
      array.push(adverb);
    } else {
      lexer.load();
      return null;
    }
    
    complement = this.prepositional_phrase();
    
    if (complement) {
      array.push(complement);
    }
    
    return new Phrase("GAdv", new Marker(), array);
  };
  
  this.prepositional_phrase = function() {
    lexer.save();
    let preposition = lexer.expect({flags: ["P"]});
    
    if (!preposition) {
      lexer.load();
      return null;
    }
    
    let term = this.prepositional_phrase();
    
    if (term) {
      return new Phrase("GP", new Marker(), [preposition, term]);
    }
    
    term = this.determiner_phrase();
    
    if (term) {
      return new Phrase("GP", new Marker(), [preposition, term]);
    }
    
    term = this.adverbial_phrase();
    
    if (term) {
      return new Phrase("GP", new Marker(), [preposition, term]);
    }
    
    lexer.load();
    return null;
  };
  
  this.parse = function() {
    return this.determiner_phrase();
  };
}
