import {Mark} from "./phrase";
import {test_verb} from "./verb";
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

function get_traditional(phrase, surname = null, parent_type = null) {
  if (!phrase) {
    return "";
  }
  
  if (phrase instanceof Word) {
    let string = "<span class=\"phrase-word\">" + phrase.text + "</span>";
    
    if (surname) {
      string =
        "<div class=\"phrase-outer\">" +
          "<div class=\"phrase-marker\">" +
            string +
          "</div>" +
          "<span class=\"phrase-text\">" +
            surname +
          "</span>" +
        "</div>"
      ;
    }
    
    return string;
  }
  
  let array = [phrase.left, phrase.right];
  let string = "";
  
  for (let index in array) {
    let child_surname = null;
    
    if (phrase.type === "D'") {
      if (parseInt(index) === 0) {
        if (phrase.right) {
          child_surname = "Det.";
        } else {
          child_surname = "N. (Pron.)";
        }
      }
    } else if (phrase.type === "SN" || phrase.type === "SA" || phrase.type === "SR") {
      if (array[index]) {
        if (array[index].type === "SR") {
          child_surname = "Mod.";
        } else if (array[index].mode === "SX") {
          child_surname = ({
            N: "C. N.",
            A: "C. Adj.",
            R: "C. Adv.",
          })[phrase.type[1]];
        }
      }
    } else if (phrase.type === "N'" || phrase.type === "A'" || phrase.type === "R'") {
      if (array[index]) {
        if (array[index].mode === "X") {
          child_surname = "N.";
        } else if (array[index].type === "SR") {
          child_surname = "Mod.";
        } else if (array[index].mode === "SX") {
          child_surname = ({
            N: "C. N.",
            A: "C. Adj.",
            R: "C. Adv.",
          })[phrase.type[0]];
        }
      }
    } else if (phrase.type === "P'") {
      child_surname = (["E.", "T."])[index];
    } else if (phrase.mode === "X") {
      child_surname = surname;
    }
    
    let child_string = get_traditional(array[index], child_surname, phrase.type);
    
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
    if (surname) {
      name += " / " + surname;
    }
    
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
  
  string += "<div class=\"phrase-root\">" + get_traditional(phrase) + "</div>";
  string += "<br>"
  
  let words = phrase.words();
  string += "<table>"
  
  for (let word of words) {
    string += "<tr><td><span class=\"word-word\">" + word.text + "</span></td><td><hr class=\"word-line\"></td><td>" + word.get_description() + "</td></tr>";
  }
  
  string += "</table>";
  string += "<br>";
  
  string += "<div class=\"phrase-root\">" + get_true(phrase) + "</div>";
  
  string += "</div>";
  return string;
}
