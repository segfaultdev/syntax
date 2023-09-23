export function Word(parts) {
  const type_chars = "ARTCQDWMXPLYHNV";
  
  if (parts.length < 3) {
    return;
  }
  
  if (type_chars.indexOf(parts[2][0]) < 0) {
    return;
  }
  
  /* TODO: Find a way to prevent mis-lexing of "gracias a" and similar.
    if (parts[0].indexOf(" ") >= 0) {
      return;
    }
  */
  
  this.text = parts[0];
  this.root = parts[1];
  this.flags = parts[2];
  
  this.match = function(word) {
    if (this.text !== word.text) {
      return false;
    }
    
    if (this.root !== word.root) {
      return false;
    }
    
    if (this.to_string() !== word.to_string()) {
      return false;
    }
    
    return true;
  };
  
  this.to_string = function() {
    let string = "";
    
    if (this.flags[0] === "A") {
      string = "Adjetivo";
      
      if (this.flags[1] === "f") {
        string += " femenino";
      } else if (this.flags[1] === "m") {
        string += " masculino";
      }
      
      if (this.flags[2] === "p") {
        string += ", plural";
      } else if (this.flags[2] === "s") {
        string += ", singular";
      }
      
      if (this.flags[6] === "c") {
        string += ", grado comparativo";
      } else if (this.flags[6] === "p") {
        string += ", grado positivo";
      } else if (this.flags[6] === "s") {
        string += ", grado superlativo";
      }
    } else if (this.flags[0] === "R") {
      string = "Adverbio";
      
      if (this.flags[3] === "a") {
        string += " afirmativo";
      } else if (this.flags[3] === "d") {
        string += " deíctico";
      } else if (this.flags[3] === "i") {
        string += " intensificador";
      } else if (this.flags[3] === "u") {
        string += " interrogativo";
      } else if (this.flags[3] === "n") {
        string += " negativo";
      } else if (this.flags[3] === "r") {
        string += " relativo";
      }
      
      if (this.flags[6] === "c") {
        string += ", grado comparativo";
      } else if (this.flags[6] === "s") {
        string += ", grado superlativo";
      }
    } else if (this.flags[0] === "T") {
      string += "Artículo";
      
      if (this.flags[1] === "f") {
        string += " femenino";
      } else if (this.flags[1] === "m") {
        string += " masculino";
      } else if (this.flags[1] === "n") {
        string += " neutro";
      }
      
      if (this.flags[2] === "p") {
        string += ", plural";
      } else if (this.flags[2] === "s") {
        string += ", singular";
      }
      
      if (this.flags[6] === "d") {
        string += ", determinado";
      } else if (this.flags[6] === "i") {
        string += ", indeterminado";
      }
    } else if (this.flags[0] === "C") {
      string += "Conjunción";
      
      if (this.flags[3] === "o") {
        string += " coordinante";
      } else if (this.flags[3] === "b") {
        string += " subordinante";
      }
    } else if (this.flags[0] === "Q") {
      string += "Cuantificador";
      
      if (this.flags[1] === "f") {
        string += " femenino";
      } else if (this.flags[1] === "m") {
        string += " masculino";
      } else if (this.flags[1] === "n") {
        string += " neutro";
      }
      
      if (this.flags[2] === "p") {
        string += ", plural";
      } else if (this.flags[2] === "s") {
        string += ", singular";
      }
      
      if (this.flags[6] === "d") {
        string += ", función determinante";
      } else if (this.flags[6] === "r") {
        string += ", función núcleo";
      }
    } else if (this.flags[0] === "D") {
      string += "Demostrativo";
      
      if (this.flags[1] === "f") {
        string += " femenino";
      } else if (this.flags[1] === "m") {
        string += " masculino";
      } else if (this.flags[1] === "n") {
        string += " neutro";
      }
      
      if (this.flags[2] === "p") {
        string += ", plural";
      } else if (this.flags[2] === "s") {
        string += ", singular";
      }
      
      if (this.flags[6] === "d") {
        string += ", función determinante";
      } else if (this.flags[6] === "r") {
        string += ", función núcleo";
      }
    } else if (this.flags[0] === "W") {
      string += "Interrogativo";
      
      if (this.flags[1] === "f") {
        string += " femenino";
      } else if (this.flags[1] === "m") {
        string += " masculino";
      } else if (this.flags[1] === "n") {
        string += " neutro";
      }
      
      if (this.flags[2] === "p") {
        string += ", plural";
      } else if (this.flags[2] === "s") {
        string += ", singular";
      }
      
      if (this.flags[6] === "d") {
        string += ", función determinante";
      } else if (this.flags[6] === "r") {
        string += ", función núcleo";
      }
    } else if (this.flags[0] === "M") {
      string += "Numeral";
      
      if (this.flags[1] === "f") {
        string += " femenino";
      } else if (this.flags[1] === "m") {
        string += " masculino";
      } else if (this.flags[1] === "n") {
        string += " neutro";
      }
      
      if (this.flags[2] === "p") {
        string += ", plural";
      } else if (this.flags[2] === "s") {
        string += ", singular";
      }
      
      if (this.flags[3] === "k") {
        string += ", cardinal";
      } else if (this.flags[3] === "l") {
        string += ", ordinal";
      } else if (this.flags[3] === "s") {
        string += ", partitivo";
      }
      
      if (this.flags[6] === "d") {
        string += ", función determinante";
      } else if (this.flags[6] === "r") {
        string += ", función núcleo";
      }
    } else if (this.flags[0] === "X") {
      string += "Posesivo";
      
      if (this.flags[1] === "f") {
        string += " femenino";
      } else if (this.flags[1] === "m") {
        string += " masculino";
      } else if (this.flags[1] === "n") {
        string += " neutro";
      }
      
      if (this.flags[2] === "p") {
        string += ", plural";
      } else if (this.flags[2] === "s") {
        string += ", singular";
      }
      
      if (this.flags[5] === "l") {
        string += ", poseedor plural";
      } else if (this.flags[5] === "s") {
        string += ", poseedor singular";
      } else if (this.flags[5] === "b") {
        string += ", poseedor plural o singular";
      }
      
      if (this.flags[6] === "d") {
        string += ", función determinante";
      } else if (this.flags[6] === "r") {
        string += ", función núcleo";
      }
    } else if (this.flags[0] === "P") {
      string += "Preposición";
    } else if (this.flags[0] === "L") {
      string += "Pronombre personal";
      
      if (this.flags[1] === "c") {
        string += " común";
      } else if (this.flags[1] === "f") {
        string += " femenino";
      } else if (this.flags[1] === "m") {
        string += " masculino";
      } else if (this.flags[1] === "e") {
        string += " femenino, masculino o neutro";
      } else if (this.flags[1] === "n") {
        string += " neutro";
      }
      
      if (this.flags[2] === "p") {
        string += ", plural";
      } else if (this.flags[2] === "s") {
        string += ", singular";
      } else if (this.flags[2] === "i") {
        string += ", plural o singular";
      }
      
      if (this.flags[4] === "1") {
        string += ", primera persona";
      } else if (this.flags[4] === "2") {
        string += ", segunda persona";
      } else if (this.flags[4] === "3") {
        string += ", tercera persona";
      }
      
      if (this.flags[5] === "a") {
        string += ", caso acusativo";
      } else if (this.flags[5] === "n") {
        string += ", caso acusativo o dativo";
      } else if (this.flags[5] === "o") {
        string += ", caso dativo";
      } else if (this.flags[5] === "e") {
        string += ", caso preposicional";
      } else if (this.flags[5] === "r") {
        string += ", caso recto";
      }
    } else if (this.flags[0] === "Y") {
      string += "Puntuación";
    } else if (this.flags[0] === "H") {
      string += "Relativo";
      
      if (this.flags[1] === "f") {
        string += " femenino";
      } else if (this.flags[1] === "m") {
        string += " masculino";
      } else if (this.flags[1] === "e") {
        string += " femenino, masculino o neutro";
      } else if (this.flags[1] === "n") {
        string += " neutro";
      }
      
      if (this.flags[2] === "p") {
        string += ", plural";
      } else if (this.flags[2] === "s") {
        string += ", singular";
      } else if (this.flags[2] === "i") {
        string += ", plural o singular";
      }
      
      if (this.flags[6] === "d") {
        string += ", función determinante";
      } else if (this.flags[6] === "r") {
        string += ", función núcleo";
      }
    } else if (this.flags[0] === "N") {
      string += "Sustantivo";
      
      if (this.flags[1] === "f") {
        string += " femenino";
      } else if (this.flags[1] === "m") {
        string += " masculino";
      }
      
      if (this.flags[2] === "p") {
        string += ", plural";
      } else if (this.flags[2] === "s") {
        string += ", singular";
      }
      
      if (this.flags[3] === "c") {
        string += ", común";
      } else if (this.flags[3] === "p") {
        string += ", propio";
      }
    } else if (this.flags[0] === "V") {
      string += "Verbo";
      
      if (this.flags[1] === "f") {
        string += " femenino";
      } else if (this.flags[1] === "m") {
        string += " masculino";
      } else if (this.flags[1] === "p") {
        string += " modo imperativo";
      } else if (this.flags[1] === "i") {
        string += " modo indicativo";
      } else if (this.flags[1] === "s") {
        string += " modo subjuntivo";
      }
      
      if (this.flags[2] === "p") {
        string += ", plural";
      } else if (this.flags[2] === "s") {
        string += ", singular";
      }
      
      if (this.flags[3] === "h") {
        string += ", terminante en -ra";
      } else if (this.flags[3] === "s") {
        string += ", terminante en -se";
      }
      
      if (this.flags[4] === "1") {
        string += ", primera persona";
      } else if (this.flags[4] === "2") {
        string += ", segunda persona";
      } else if (this.flags[4] === "3") {
        string += ", tercera persona";
      }
      
      if (this.flags[5] === "w") {
        string += ", tiempo condicional compuesto";
      } else if (this.flags[5] === "c") {
        string += ", tiempo condicional simple";
      } else if (this.flags[5] === "q") {
        string += ", tiempo futuro compuesto";
      } else if (this.flags[5] === "f") {
        string += ", tiempo futuro simple";
      } else if (this.flags[5] === "x") {
        string += ", tiempo gerundio compuesto";
      } else if (this.flags[5] === "g") {
        string += ", tiempo gerundio simple";
      } else if (this.flags[5] === "y") {
        string += ", tiempo infinitivo compuesto";
      } else if (this.flags[5] === "v") {
        string += ", tiempo infinitivo simple";
      } else if (this.flags[5] === "d") {
        string += ", tiempo participio de pasado";
      } else if (this.flags[5] === "p") {
        string += ", tiempo presente";
      } else if (this.flags[5] === "m") {
        string += ", tiempo pretérito anterior";
      } else if (this.flags[5] === "i") {
        string += ", tiempo pretérito imperfecto";
      } else if (this.flags[5] === "j") {
        string += ", tiempo pretérito perfecto compuesto";
      } else if (this.flags[5] === "t") {
        string += ", tiempo pretérito perfecto simple";
      } else if (this.flags[5] === "k") {
        string += ", tiempo pretérito pluscuamperfecto";
      }
    }
    
    string += ".";
    return string;
  };
}
