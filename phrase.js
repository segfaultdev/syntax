import {Word} from "./word";

export function Phrase(type, state, left, right) {
  this.type = type;
  this.state = state;
  
  this.left = (left ?? null);
  this.right = (right ?? null);
  
  if (this.type.length === 2 && this.type[0] === "S") {
    this.mode = "SX";
  } else if (this.type.length === 2 && this.type[1] === "'") {
    this.mode = "X'";
  } else if (this.type.length === 1) {
    this.mode = "X";
  } else {
    this.mode = null;
  }
  
  this.string = null;
  
  this.to_string = function() {
    if (this.string) {
      return this.string;
    }
    
    let string = this.type + " (";
    
    if (this.left) {
      string += this.left.to_string();
    }
    
    if (this.right) {
      if (this.left) {
        string += ", ";
      }
      
      string += this.right.to_string();
    }
    
    string += ")";
    
    this.string = string;
    return string;
  };
  
  this.words = function() {
    let array = [];
    
    if (this.left instanceof Word) {
      array.push(this.left);
    } else if (this.left && ("words" in this.left)) {
      array = array.concat(this.left.words());
    }
    
    if (this.right instanceof Word) {
      array.push(this.right);
    } else if (this.right && ("words" in this.right)) {
      array = array.concat(this.right.words());
    }
    
    return array;
  };
}

export function Mark(type, phrase) {
  this.phrase = phrase;
  this.type = type;
  
  this.to_string = function() {
    return this.type + "/h" + this.phrase.type;
  };
  
  this.to_html = function() {
    return this.type + "/h" + this.phrase.type;
  }
}
