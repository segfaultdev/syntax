export function Phrase(type, state, left, right) {
  this.type = type;
  this.state = state;
  
  this.left = (left ?? null);
  this.right = (right ?? null);
  
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
}

export function Mark(type, phrase) {
  this.phrase = phrase;
  this.type = type;
  
  this.to_string = function() {
    return this.type + "/h" + this.phrase.type;
  };
}
