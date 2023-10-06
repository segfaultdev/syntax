function is_elemental(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase.mode === "X'" && phrase.left && phrase.right) {
    if (["D", "P"].indexOf(phrase.left.type) < 0) {
      return false;
    }
  }
  
  return (is_elemental(phrase.left) && is_elemental(phrase.right));
}

function filter_elemental(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase.mode === "SX") {
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
  let counts = [phrases.length];
  
  phrases = phrases
    // Remove phrases that do not cover the original input entirely.
    // .filter(phrase => phrase.state.index === lexer.array.length)
  ;
  
  counts.push(phrases.length);
  
  let single_phrases = [];
  let seen_strings = {};
  
  for (let phrase of phrases) {
    let string = phrase.to_string();
    
    if (string in seen_strings) {
      continue;
    }
    
    single_phrases.push(phrase);
    seen_strings[string] = single_phrases.length;
  }
  
  phrases = single_phrases;
  counts.push(phrases.length);
  
  phrases = phrases
    // Check if specifiers are in their elemental form.
    // .filter(filter_elemental)
  ;
  
  counts.push(phrases.length);
    
    // Check if phrases with marks are lacking specifiers.
    // .filter(filter_marks)
    
    // Check whether gender and number match.
    // .filter(filter_???)
    
    // Check noun and determinant phrase cases.
    // .filter(filter_???)
    
    // Check for determinant requirements.
    // .fitler(filter_determinants)
  
  console.log(counts);
  return phrases;
}
