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
  
  if (phrase.mode === "SX" && !is_elemental(phrase.left)) {
    return false;
  }
  
  if (phrase.left) {
    if ((phrase.left.mode !== "SX" || phrase.mode === "EX") && !filter_elemental(phrase.left)) {
      return false;
    }
  }
  
  if (phrase.right) {
    if ((phrase.right.mode !== "SX" || phrase.mode === "EX") && !filter_elemental(phrase.right)) {
      return false;
    }
  }
  
  return true;
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
  
  if (phrase.left) {
    if ((phrase.left.mode !== "SX" || phrase.mode === "EX") && !filter_wordful(phrase.left)) {
      return false;
    }
  }
  
  if (phrase.right) {
    if ((phrase.right.mode !== "SX" || phrase.mode === "EX") && !filter_wordful(phrase.right)) {
      return false;
    }
  }
  
  return true;
}

function filter_repeat(phrase) {
  if (!phrase) {
    return "";
  }
  
  if (phrase instanceof Word) {
    return phrase.flags[0] + ".\"" + phrase.text + "\"";
  }
  
  let string = "";
  
  for (let child of [phrase.left, phrase.right]) {
    let child_string = filter_repeat(child);
    
    if (string.length && child_string.length) {
      string += "&nbsp";
    }
    
    string += child_string;
  }
  
  const names = [
    "SA", "SD", "SR", "SP", "SV",
    "EA", "ED", "ER", "EP", "EV",
  ];
  
  let name_index = names.indexOf(phrase.type);
  
  if (name_index >= 0) {
    string = "(" + phrase.type + " -> " + string + ")";
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
  
  if (phrase.left) {
    if ((phrase.left.mode !== "SX" || phrase.mode === "EX") && !filter_deverb(phrase.left)) {
      return false;
    }
  }
  
  if (phrase.right) {
    if ((phrase.right.mode !== "SX" || phrase.mode === "EX") && !filter_deverb(phrase.right)) {
      return false;
    }
  }
  
  return true;
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
  
  if (phrase.type === "ED" || phrase.type === "SD" || phrase.type === "D'" ||
      phrase.type === "EN" || phrase.type === "SN" || phrase.type === "N'" ||
      phrase.type === "EA" || phrase.type === "SA" || phrase.type === "A'" ||
      phrase.type === "E'") {
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
  
  if (phrase.left) {
    if ((phrase.left.mode !== "SX" || phrase.mode === "EX") && !filter_gender(phrase.left)) {
      return false;
    }
  }
  
  if (phrase.right) {
    if ((phrase.right.mode !== "SX" || phrase.mode === "EX") && !filter_gender(phrase.right)) {
      return false;
    }
  }
  
  return true;
}

function filter_determinant(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase.type === "SD") {
    let s_word = phrase.left ? phrase.left.right.left.left : null;
    
    if (s_word && s_word.root !== "todo") {
      return false;
    }
    
    if (phrase.right.left.left instanceof Word && !phrase.right.right) {
      let n_word = phrase.right.left.left;
      
      if (s_word) {
        if (n_word.flags[0] === "T") {
          return false;
        }
      } else {
        if (n_word.text === "el" || n_word.text === "un") {
          return false;
        }
      }
    }
  }
  
  if (phrase.type === "Q'" && phrase.left.left instanceof Word) {
    let word = phrase.left.left;
    
    if (word.root === "todo") {
      return false;
    }
  }
  
  if (phrase.left) {
    if ((phrase.left.mode !== "SX" || phrase.mode === "EX") && !filter_determinant(phrase.left)) {
      return false;
    }
  }
  
  if (phrase.right) {
    if ((phrase.right.mode !== "SX" || phrase.mode === "EX") && !filter_determinant(phrase.right)) {
      return false;
    }
  }
  
  return true;
}

function filter_pronoun(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase.type === "D'" && phrase.left.left instanceof Word) {
    let n_word = phrase.left.left;
    
    if (n_word.flags[0] === "L" && phrase.right) {
      return false;
    }
  }
  
  if (phrase.left) {
    if ((phrase.left.mode !== "SX" || phrase.mode === "EX") && !filter_pronoun(phrase.left)) {
      return false;
    }
  }
  
  if (phrase.right) {
    if ((phrase.right.mode !== "SX" || phrase.mode === "EX") && !filter_pronoun(phrase.right)) {
      return false;
    }
  }
  
  return true;
}

function get_single(phrase) {
  if (phrase.type === "N'") {
    if (phrase.right && phrase.right.type === "SA") {
      return 2;
    }
    
    return get_single(phrase.left) + (phrase.right ? 1 : 0);
  }
  
  return 0;
}

function filter_single(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase.type === "SD") {
    if (phrase.left) {
      return true;
    }
    
    return filter_single(phrase.right);
  } else if (phrase.type === "D'") {
    if (phrase.left.left instanceof Word) {
      return true;
    }
    
    return filter_single(phrase.right);
  } else if (phrase.type === "SQ") {
    return filter_single(phrase.right);
  } else if (phrase.type === "Q'") {
    return filter_single(phrase.right);
  } else if (phrase.type === "SN") {
    if (filter_single(phrase.right)) {
      return true;
    }
    
    return ((get_single(phrase.right) + (phrase.left ? 1 : 0)) === 1);
  } else if (phrase.type === "N'") {
    return filter_single(phrase.left);
  } else if (phrase.type === "N") {
    if (phrase.left instanceof Word) {
      return true;
    }
    
    if (phrase.left instanceof Mark) {
      if (phrase.left.phrase.left instanceof Word) {
        return true;
      }
    }
    
    return false;
  }
  
  return true;
}

function get_adjective(phrase) {
  if (phrase.type === "N'") {
    if (phrase.right && phrase.right.type === "SA") {
      return true;
    }
    
    return get_adjective(phrase.left);
  }
  
  return false;
}

function filter_adjective(phrase) {
  if (!phrase) {
    return true;
  }
  
  if (phrase.type === "SN") {
    if (filter_adjective(phrase.right)) {
      return true;
    }
    
    return !get_adjective(phrase.right);
  } else if (phrase.type === "N'") {
    return filter_adjective(phrase.left);
  } else if (phrase.type === "N") {
    if (phrase.left instanceof Word) {
      return true;
    }
    
    return false;
  }
  
  return true;
}

export function filter_sx(phrases) {
  let counts = [phrases.length];
  
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
    .filter(filter_determinant)
  ;
  
  counts.push(phrases.length);
  
  phrases = phrases
    .filter(filter_pronoun)
  ;
  
  counts.push(phrases.length);
  
  phrases = phrases
    .filter(filter_gender)
  ;
  
  counts.push(phrases.length);
  
  phrases = phrases
    .filter(filter_single)
  ;
  
  counts.push(phrases.length);
  
  phrases = phrases
    .filter(filter_adjective)
  ;
  
  counts.push(phrases.length);
  
  return phrases;
}

export function filter_final(phrases) {
  let single_phrases = [];
  let seen_strings = {};
  
  for (let phrase of phrases) {
    if (phrase.state.index !== phrase.state.lexer.array.length) {
      if (phrase.state.index !== phrase.state.lexer.array.length - 1 ||
          !phrase.state.expect({text: "."}).length) {
        continue;
      }
    }
    
    let string = filter_repeat(phrase);
    
    if (string in seen_strings) {
      continue;
    }
    
    single_phrases.push(phrase);
    seen_strings[string] = single_phrases.length;
  }
  
  return single_phrases;
}
