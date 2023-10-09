import {Mark} from "./phrase";
import {Word} from "./word";

function get_true(phrase) {
  if (!phrase) {
    return "";
  }
  
  if (phrase instanceof Word) {
    return "<span class=\"phrase-word\">" + phrase.text + "</span>";
  }
  
  if (phrase instanceof Mark) {
    return "<span class=\"phrase-text\">" + phrase.to_string() + "</span>";
  }
  
  let string = "";
  
  for (let child of [phrase.left, phrase.right]) {
    let child_string = get_true(child);
    
    if (string.length && child_string.length) {
      string += "&nbsp";
    }
    
    string += child_string;
  }
  
  string =
    "<div class=\"phrase-outer\">" +
      "<div class=\"phrase-inner\">" +
        string +
      "</div>" +
      "<br>" +
      "<span class=\"phrase-text\">" +
        phrase.type +
      "</span>" +
    "</div>"
  ;
  
  return string;
}

function is_complete(phrase) {
  if (phrase.type === "SD") {
    if (phrase.left) {
      return true;
    }
    
    return is_complete(phrase.right);
  } else if (phrase.type === "D'") {
    if (phrase.left.left instanceof Word) {
      return true;
    }
    
    return is_complete(phrase.right);
  } else if (phrase.type === "SQ") {
    return is_complete(phrase.right);
  } else if (phrase.type === "Q'") {
    return is_complete(phrase.right);
  } else if (phrase.type === "SN") {
    return is_complete(phrase.right);
  } else if (phrase.type === "N'") {
    return is_complete(phrase.left);
  } else if (phrase.type === "N") {
    if (phrase.left instanceof Word) {
      return true;
    }
    
    return false;
  }
  
  return false;
}

function get_traditional(phrase, parent_type) {
  if (!phrase) {
    return "";
  }
  
  if (phrase instanceof Word) {
    return "<span class=\"phrase-word\">" + phrase.text + "</span>";
  }
  
  let string = "";
  
  for (let child of [phrase.left, phrase.right]) {
    let child_string = get_traditional(child, phrase.type);
    
    if (string.length && child_string.length) {
      string += "&nbsp";
    }
    
    string += child_string;
  }
  
  const names = [
    "SA", "G. Adj.",
    "SR", "G. Adv.",
    "SP", "G. Prep.",
    "SV", "G. V.",
    "EA", "Enum. Adj.",
    "ED", "Enum. N.",
    "EN", "Enum. N.",
    "EQ", "Enum. N.",
    "ER", "Enum. Adv.",
    "EP", "Enum. Prep.",
    "EV", "Enum. V.",
  ];
  
  let name = null;
  
  if (phrase.type === "SD") {
    if (is_complete(phrase)) {
      name = "G. N.";
    }
  } else if (phrase.type === "SN") {
    if (parent_type !== "D'" && parent_type !== "Q'") {
      name = "G. N.";
    }
  } else {
    let name_index = names.indexOf(phrase.type);
    
    if (name_index >= 0 && name_index % 2 === 0) {
      name = names[name_index + 1];
    }
  }
  
  if (name) {
    string =
      "<div class=\"phrase-outer\">" +
        "<div class=\"phrase-inner\">" +
          string +
        "</div>" +
        "<br>" +
        "<span class=\"phrase-text\">" +
          name +
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
  
  string += "<div class=\"phrase-root\">" + get_traditional(phrase, null) + "</div>";
  string += "<br><br>"
  
  let words = phrase.words();
  string += "<table>"
  
  for (let word of words) {
    string += "<tr><td><span class=\"word-word\">" + word.text + "</span></td><td><hr class=\"word-line\"></td><td>" + word.get_description() + "</td></tr>";
  }
  
  string += "</table>";
  // string += "<br><br>";
  
  // string += "<div class=\"phrase-root\">" + get_true(phrase) + "</div>";
  // string += "<br><br>"
  
  string += "</div>";
  return string;
}
