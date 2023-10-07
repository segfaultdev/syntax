import {Mark} from "./phrase";
import {Word} from "./word";

function match_feature(a, b) {
  return ((a ?? b) === (b ?? a));
}

function is_elemental(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase instanceof Mark) {
    // return false;
  }
  
  if (phrase.type === "SN" && phrase.left) {
    return false;
  }
  
  if (phrase.mode === "X'" && phrase.right) {
    return false;
  }
  
  return (is_elemental(phrase.left) && is_elemental(phrase.right));
}

function filter_elemental(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase instanceof Mark) {
    // return false;
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

function is_wordful(phrase) {
  if (!phrase) {
    return false;
  }
  
  if (phrase instanceof Word) {
    return true;
  }
  
  return (is_wordful(phrase.left) || is_wordful(phrase.right));
}

function filter_wordful(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase.mode === "SX" && !is_wordful(phrase)) {
    return false;
  }
  
  return (filter_wordful(phrase.left) && filter_wordful(phrase.right));
}

function filter_repeat(phrase) {
  if (!phrase) {
    return "";
  }
  
  if (phrase instanceof Word) {
    return "\"" + phrase.text + "\"";
  }
  
  let string = "";
  
  for (let child of [phrase.left, phrase.right]) {
    let child_string = filter_repeat(child);
    
    if (string.length && child_string.length) {
      string += "&nbsp";
    }
    
    string += child_string;
  }
  
  const names = ["SA", "SD", "SR", "SP", "SV"];
  const traditional_names = ["G. Adj.", "G. N.", "G. Adv.", "G. Prep.", "G. V."];
  
  let name_index = names.indexOf(phrase.type);
  
  if (name_index >= 0) {
    string = "(" + traditional_names[name_index] + " -> " + string + ")";
  }
  
  return string;
}

function filter_deverb(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase.type === "N'" && phrase.left.type === "N" && phrase.right) {
    if (phrase.left instanceof Mark) {
      return false;
    }
    
    if (!phrase.left.left.deverb) {
      return false;
    }
    
    if (["de", "del"].indexOf(phrase.right.right.left.left.text) < 0) {
      return false;
    }
  }
  
  return (filter_deverb(phrase.left) && filter_deverb(phrase.right));
}

function get_gender(phrase) {
  if (!phrase) {
    return null;
  }
  
  if (phrase instanceof Word) {
    return phrase.gender;
  }
  
  if (phrase instanceof Mark) {
    return get_gender(phrase.phrase);
  }
  
  if (phrase.mode === "X") {
    return get_gender(phrase.left);
  }
  
  if (phrase.type === "SD" || phrase.type === "D'" ||
      phrase.type === "SN" || phrase.type === "N'" ||
      phrase.type === "SA" || phrase.type === "A'") {
    return (get_gender(phrase.left) ?? get_gender(phrase.right));
  }
  
  return null;
}

function filter_gender(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase.type === "SD" || phrase.type === "D'" ||
      phrase.type === "SN" || phrase.type === "N'") {
    let left_gender = get_gender(phrase.left);
    let right_gender = get_gender(phrase.right);
    
    if (!match_feature(left_gender, right_gender)) {
      return false;
    }
  }
  
  return (filter_gender(phrase.left) && filter_gender(phrase.right));
}

export function filter(lexer, phrases) {
  let counts = [phrases.length];
  
  phrases = phrases
    .filter(phrase => phrase.state.index === lexer.array.length)
  ;
  
  counts.push(phrases.length);
  
  phrases = phrases
    .filter(filter_wordful)
  ;
  
  counts.push(phrases.length);
  
  phrases = phrases
    .filter(filter_elemental)
  ;
  
  counts.push(phrases.length);
  
  phrases = phrases
    .filter(filter_deverb)
  ;
  
  counts.push(phrases.length);
  
  phrases = phrases
    .filter(filter_gender)
  ;
  
  counts.push(phrases.length);
  
  let single_phrases = [];
  let seen_strings = {};
  
  for (let phrase of phrases) {
    let string = filter_repeat(phrase);
    
    if (string in seen_strings) {
      continue;
    }
    
    single_phrases.push(phrase);
    seen_strings[string] = single_phrases.length;
  }
  
  phrases = single_phrases;
  counts.push(phrases.length);
  
    // Check if phrases with marks are lacking specifiers.
    // .filter(filter_marks)
    
    // Check whether gender and number match.
    // .filter(filter_???)
    
    // Check noun and determinant phrase cases.
    // .filter(filter_???)
    
    // Check for determinant requirements.
    // .fitler(filter_determinants)
  
  // console.log(counts);
  return phrases;
}
