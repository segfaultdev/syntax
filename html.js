import {Word} from "./word";

function get_words(phrase) {
  if (!phrase) {
    return [];
  }
  
  if (phrase.left instanceof Word) {
    return [phrase.left];
  }
  
  return get_words(phrase.left)
    .concat(get_words(phrase.right))
  ;
}

function get_traditional(phrase) {
  if (!phrase) {
    return "";
  }
  
  if (phrase instanceof Word) {
    return "<span class=\"phrase-word\">" + phrase.text + "</span>";
  }
  
  let string = "";
  
  for (let child of [phrase.left, phrase.right]) {
    let child_string = get_traditional(child);
    
    if (string.length && child_string.length) {
      string += " ";
    }
    
    string += child_string;
  }
  
  const names = ["SA", "SD", "SR", "SP", "SV"];
  const traditional_names = ["G. Adj.", "G. N.", "G. Adv.", "G. Prep.", "G. V."];
  
  let name_index = names.indexOf(phrase.type);
  
  if (name_index >= 0) {
    string = traditional_names[name_index] + " (" + string + ")";
  }
  
  return string;
}

export function to_html(index, phrase) {
  let string = "<div class=\"result-entry-div\">";
  
  string += "<span class=\"result-entry-title-span\">Propuesta de análisis #" + index + ":</span>";
  string += "<br><br>"
  
  string += get_traditional(phrase);
  string += "<br><br>"
  
  let words = get_words(phrase);
  string += "<table>"
  
  for (let word of words) {
    string += "<tr><td><span class=\"word-word\">" + word.text + "</span></td><td><hr class=\"word-line\"></td><td>" + word.get_description() + "</td></tr>";
  }
  
  string += "</table>";
  
  string += "</div>";
  return string;
}
