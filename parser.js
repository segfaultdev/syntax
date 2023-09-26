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
}

export function Parser(lexer) {
  this.determiner_complement = function(marker) {
    lexer.save();
    let complement = lexer.expect({flags: ["Q", "M"], marker: marker});
    
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
    
    complement = this.prepositional_phrase();
    
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
    } else {
      marker = marker.merge(predeterminer.marker);
      array.push(predeterminer);
    }
    
    let determiner = lexer.expect({flags: flags, marker: marker});
    
    if (determiner) {
      array.push(determiner);
    }
    
    while (true) {
      let complement = this.determiner_complement(marker);
      
      if (!complement) {
        if (!predeterminer && !determiner && complements.length === 0) {
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
    return null;
  };
  
  this.adverbial_phrase = function() {
    return null;
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
