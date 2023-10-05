function is_elemental(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase.type in ["D'", "N'", "A'", "R'", "P'"]) {
    if (phrase.left && phrase.right) {
      return false;
    }
  }
  
  return (is_elemental(phrase.left) && is_elemental(phrase.right));
}

function filter_elemental(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase.type in ["SD", "SN", "SA", "SR", "SP"]) {
    if (!is_elemental(phrase.left)) {
      return false;
    }
  } else {
    if (!filter_elemental(phrase.left)) {
      return false;
    }
  }
  
  return filter_elemental(phrase.right);
}

export function filter(lexer, phrases) {
  let seen_phrases = {};
  
  return phrases
    // Remove phrases that do not cover the whole input.
    .filter(phrase => phrase.state.index === lexer.array.length)
    
    // Check if specifiers are in their elemental form.
    .filter(filter_elemental)
    
    // Check if marks ???
    // .filter(filter_marks)
    
    // Check whether gender and number match.
    // .filter(filter_???)
    
    // Check noun and determinant phrase cases.
    // .filter(filter_???)
    
    // Remove repeated phrases (by converting to strings).
    .filter(function(phrase) {
      let string = phrase.to_string();
      
      if (string in seen_phrases) {
        return false;
      } else {
        seen_phrases[string] = phrase;
        return true;
      }
    })
  ;
}
