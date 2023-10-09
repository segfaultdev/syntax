import {filter_sx, filter_final} from "./filter";
import {Phrase, Mark} from "./phrase";
import {Word} from "./word"

let funcs = {};

funcs["D"] = function(state, marks) {
  const determinant_filter = ["D", "L", "M", "Q", "T", "W", "X-----d"];
  
  return state.expect({flags: determinant_filter})
    .map(
      a => new Phrase("D", a.state, a.word),
    )
    .concat(("D" in marks) ? [new Phrase("D", state, marks["D"])] : [])
  ;
};

funcs["D'"] = function(state, marks) {
  return funcs["D"](state, marks)
    .map(
      a => [null]
        .concat(funcs["SN"](a.state, {N: new Mark("N", a)}))
        .concat(funcs["SQ"](a.state,
          (a.left instanceof Word &&
            ["M", "Q"].indexOf(a.left.flags[0]) >= 0
          ) ?
          {Q: new Mark("Q", a)} : {}
        ))
        .map(
          b => new Phrase("D'", b ? b.state : a.state, a, b)
        )
    )
  .flat();
};

funcs["SD"] = function(state, marks) {
  return [null]
    .concat(funcs["SQ"](state, {}))
    .map(
      a => funcs["D'"](a ? a.state : state,
          a ? {D: new Mark("D", a.right.left)} : marks
        )
        .map(
          b => new Phrase("SD", b.state, a, b)
        )
    )
  .flat();
};

funcs["Q"] = function(state, marks) {
  return state.expect({flags: ["M", "Q"]})
    .map(
      a => new Phrase("Q", a.state, a.word),
    )
    .concat(("Q" in marks) ? [new Phrase("Q", state, marks["Q"])] : [])
  ;
};

funcs["Q'"] = function(state, marks) {
  return funcs["Q"](state, marks)
    .map(
      a => [null]
        .concat(funcs["SN"](a.state, {N: new Mark("N", a)}))
        .map(
          b => new Phrase("Q'", b ? b.state : a.state, a, b)
        )
    )
  .flat();
};

funcs["SQ"] = function(state, marks) {
  return funcs["Q'"](state, marks)
    .map(
      a => new Phrase("SQ", a.state, null, a),
    )
  ;
};

funcs["N"] = function(state, marks) {
  return state.expect({flags: ["N"]})
    .map(
      a => new Phrase("N", a.state, a.word)
    )
    .concat(("N" in marks) ? [new Phrase("N", state, marks["N"])] : [])
  ;
};

funcs["N'"] = function(state, marks) {
  return funcs["N"](state, marks)
    .map(
      a => [null]
        .concat(funcs["SP"](a.state, {}))
        .map(
          b => new Phrase("N'", b ? b.state : a.state, a, b)
        )
    )
  .flat();
};

funcs["N'_SA"] = function(state, marks) {
  return funcs["N'"](state, marks)
    .map(
      a => [null]
        .concat(funcs["SA"](a.state, {}))
        .map(
          b => new Phrase("N'", b ? b.state : a.state, a, b)
        )
    )
  .flat();
};

funcs["N'_SP"] = function(state, marks) {
  return funcs["N'"](state, marks)
    .concat(funcs["N'_SA"](state, marks))
    .map(
      a => [null]
        .concat(funcs["SP"](a.state, {}))
        .map(
          b => new Phrase("N'", b ? b.state : a.state, a, b)
        )
    )
  .flat();
};

funcs["SN"] = function(state, marks) {
  if ("N" in marks && (marks["N"].phrase.left instanceof Word)) {
    if (["M", "Q"].indexOf(marks["N"].phrase.left.flags[0]) >= 0) {
      if (marks["N"].to_string() !== "N/hQ") {
        return [];
      }
    }
  }
  
  return [null]
    .concat(funcs["SA"](state, {}))
    .map(
      a => funcs["N'"](a ? a.state : state, marks)
        .concat(funcs["N'_SA"](a ? a.state : state, marks))
        .concat(funcs["N'_SP"](a ? a.state : state, marks))
        .map(
          b => new Phrase("SN", b.state, a, b)
        )
    )
  .flat();
};

funcs["A"] = function(state, marks) {
  return state.expect({flags: ["A"]})
    .map(
      a => new Phrase("A", a.state, a.word)
    )
    .concat(("A" in marks) ? [new Phrase("A", state, marks["A"])] : [])
  ;
};

funcs["A'"] = function(state, marks) {
  return funcs["A"](state, marks)
    .map(
      a => [null]
        .concat(funcs["SP"](a.state, {}))
        .map(
          b => new Phrase("A'", b ? b.state : a.state, a, b)
        )
    )
  .flat();
};

funcs["SA"] = function(state, marks) {
  return [null]
    .concat(funcs["SR"](state, {}))
    .map(
      a => funcs["A'"](a ? a.state : state, {})
        .map(
          b => new Phrase("SA", b.state, a, b)
        )
    )
  .flat();
};

funcs["R"] = function(state, marks) {
  return state.expect({flags: ["R"]})
    .map(
      a => new Phrase("R", a.state, a.word)
    )
    .concat(("R" in marks) ? [new Phrase("R", state, marks["R"])] : [])
  ;
};

funcs["R'"] = function(state, marks) {
  return funcs["R"](state, {})
    .map(
      a => [null]
        .concat(funcs["SP"](a.state, {}))
        .map(
          b => new Phrase("R'", b ? b.state : a.state, a, b)
        )
    )
  .flat();
};

funcs["SR"] = function(state, marks) {
  return funcs["R'"](state, {})
    .map(
      a => new Phrase("SR", a.state, a)
    )
  ;
};

funcs["P"] = function(state, marks) {
  return state.expect({flags: ["P"]})
    .map(
      a => new Phrase("P", a.state, a.word)
    )
    .concat(("P" in marks) ? [new Phrase("P", state, marks["P"])] : [])
  ;
};

funcs["P'"] = function(state, marks) {
  return funcs["P"](state, {})
    .map(
      a => funcs["SD"](a.state, {D: new Mark("D", a)})
        .concat(funcs["SR"](a.state, {}))
        .map(
          b => new Phrase("P'", b.state, a, b)
        )
    )
  .flat();
};

funcs["SP"] = function(state, marks) {
  return [null]
    .concat(funcs["SR"](state, {}))
    .map(
      a => funcs["P'"](a ? a.state : state, {})
        .map(
          b => new Phrase("SP", b.state, a, b)
        )
    )
  .flat();
};

funcs["V"] = function(state, marks) {
  return state.expect({flags: ["V"]})
    .map(
      a => new Phrase("V", a.state, a.word)
    )
    .concat(("V" in marks) ? [new Phrase("V", state, marks["V"])] : [])
  ;
};

/*
funcs["V'"] = function(state, mark) {
  return funcs["V"](state)
    .concat(mark ? [null] : [])
    .map(
      a => funcs["SD"](a.state, new Mark("D", a))
        .concat(funcs["SP"](a.state))
        .concat(funcs["SR"](a.state))
        .map(
          b => new Phrase("P'", b.state, a, b)
        )
    )
  .flat();
};
*/

/* --- Phrase cacher (provides exponential speed boost) --- */

let cache = {};

let cache_total = 0, cache_hit = 0;

function cache_key(name, state, marks) {
  let string = name + " " + state.index;
  
  for (let mark in marks) {
    string += " " + mark + "." + marks[mark].phrase.to_string();
  }
  
  return string;
}

for (let func_name in funcs) {
  let func = funcs[func_name];
  
  funcs[func_name] = function(state, marks) {
    let string = cache_key(func_name, state, marks);
    cache_total++;
    
    if (string in cache) {
      cache_hit++;
      return cache[string];
    }
    
    let phrases = func(state, marks);
    
    cache[string] = phrases;
    return phrases;
  };
}

/* --- Generic enumeration parser (cheat-ish way to implement it) --- */

function E(state, marks) {
  return state.expect({flags: ["C--o---"]})
    .map(
      a => new Phrase("E", a.state, a.word)
    )
  ;
}

function Ep(func, state, marks) {
  return E(state, marks)
    .map(
      a => func(a.state, marks)
        .map(
          b => new Phrase("E'", b.state, a, b)
        )
    )
  .flat();
}

function E_comma(state, marks) {
  return state.expect({text: ","})
    .map(
      a => new Phrase("E", a.state, a.word)
    )
  ;
}

function Ep_comma(func, state, marks) {
  return E_comma(state, marks)
    .map(
      a => func(a.state, marks)
        .map(
          b => new Phrase("E'", b.state, a, b)
        )
    )
  .flat();
}

function Epp_comma(func, state, marks) {
  return Ep_comma(func, state, marks)
    .map(
      a => Epp_comma(func, a.state, marks)
        .concat(Ep(func, a.state, marks))
        .map(
          b => new Phrase("E'", b.state, a, b)
        )
    )
  .flat();
}

function E_semicolon(state, marks) {
  return state.expect({text: ";"})
    .map(
      a => new Phrase("E", a.state, a.word)
    )
  ;
}

function Ep_semicolon(func, state, marks) {
  return E_semicolon(state, marks)
    .map(
      a => func(a.state, marks)
        .map(
          b => new Phrase("E'", b.state, a, b)
        )
    )
  .flat();
}

function Epp_semicolon(func, state, marks) {
  return Ep_semicolon(func, state, marks)
    .map(
      a => Epp_semicolon(func, a.state, marks)
        .concat(Ep(func, a.state, marks))
        .map(
          b => new Phrase("E'", b.state, a, b)
        )
    )
  .flat();
}

function EX(func, name) {
  return function(state, marks) {
    return func(state, marks)
      .map(
        a => [null]
          .concat(Ep(func, a.state, marks))
          .concat(Epp_comma(func, a.state, marks))
          .concat(Epp_semicolon(func, a.state, marks))
          .map(
            b => (b ?
              new Phrase("E" + name, b.state, a, b) :
              a
            )
          )
      )
    .flat();
  };
}

for (let func_name in funcs) {
  let func = funcs[func_name];
  
  if (func_name.length === 2 && func_name[0] === "S") {
    funcs[func_name] = EX(func, func_name[1]);
  }
}

/* --- filter() --- */

for (let func_name in funcs) {
  let func = funcs[func_name];
  
  if (func_name.length === 2 && func_name[0] === "S") {
    funcs[func_name] = function(state, marks) {
      return filter_sx(func(state, marks));
    };
  }
}

/* --- parse() --- */

export function parse(state) {
  cache = {};
  
  let start_time = performance.now();
  
  let phrases = funcs["SD"](state, {})
    .concat(funcs["SN"](state, {}))
    .concat(funcs["SA"](state, {}))
    .concat(funcs["SR"](state, {}))
    .concat(funcs["SP"](state, {}))
  ;
  
  let end_time = performance.now();
  
  console.log("  -> " + (cache_hit / cache_total) + " hit rate, " + (end_time - start_time) + " ms.");
  return filter_final(phrases);
}
