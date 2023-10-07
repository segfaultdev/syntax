import {Word} from "./word";

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
      string += "&nbsp";
    }
    
    string += child_string;
  }
  
  const names = ["SA", "SD", "SR", "SP", "SV"];
  const traditional_names = ["G. Adj.", "G. N.", "G. Adv.", "G. Prep.", "G. V."];
  
  let name_index = names.indexOf(phrase.type);
  
  if (name_index >= 0) {
    string =
      "<div class=\"phrase-outer\">" +
        "<div class=\"phrase-inner\">" +
          string +
        "</div>" +
        "<br>" +
        "<span class=\"phrase-text\">" +
          traditional_names[name_index] +
        "</span>" +
      "</div>"
    ;
  }
  
  return string;
}

export function to_html(index, phrase) {
  let string = "<div class=\"result-entry-div\">";
  
  string += "<span class=\"result-entry-title-span\">Propuesta de análisis #" + index + ":</span>";
  string += "<br><br>"
  
  string += "<div class=\"phrase-root\">" + get_traditional(phrase) + "</div>";
  string += "<br><br>"
  
  let words = phrase.words();
  string += "<table>"
  
  for (let word of words) {
    string += "<tr><td><span class=\"word-word\">" + word.text + "</span></td><td><hr class=\"word-line\"></td><td>" + word.get_description() + "</td></tr>";
  }
  
  string += "</table>";
  
  string += "</div>";
  return string;
}
