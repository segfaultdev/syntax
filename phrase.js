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
  
  this.to_string = function() {
    let string = this.type + "(";
    
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
    return string;
  };
  
  this.to_html = function() {
    let string = "<table><tr>";
    let array = [this.left, this.right];
    
    let valid = 0;
    
    for (let i in array) {
      if (!array[i]) {
        continue;
      }
      
      string += "<td>" + array[i].to_html() + "</td>";
      valid++;
    }
    
    string += "</tr><tr><td colspan=\"" + valid + "\">";
    string += this.type + "</td></tr></table>";
    
    return string;
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
