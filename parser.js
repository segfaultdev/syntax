import {Phrase, Mark} from "./phrase";

let funcs = {};

funcs["D"] = function(state) {
  const determinant_filter = ["D", "M", "T", "Q", "W", "X-----d"];
  
  return state.expect({flags: determinant_filter}).map(
    a => new Phrase("D", a.state, a.word),
  );
};

funcs["D'"] = function(state, mark) {
  return funcs["D"](state).map(
    a => funcs["SN"](a.state, new Mark("N", a)).map(
      b => new Phrase("D'", b.state, a, b)
    )
  ).concat(mark ?
    funcs["SN"](state, new Mark("N", mark)).map(
      a => new Phrase("D'", a.state, mark, a)
    )
  : []).flat();
};

funcs["SD"] = function(state, mark) {
  return funcs["D'"](state, mark).map(
    a => new Phrase("SD", a.state, null, a),
  );
};

funcs["N"] = function(state) {
  return state.expect({flags: ["N"]})
    .map(
      a => new Phrase("N", a.state, a.word)
    )
  ;
};

funcs["N'"] = function(state, mark) {
  return funcs["N"](state)
    .concat(mark ? [null] : [])
    .map(
      a => funcs["SP"](a ? a.state : state)
        .concat([null])
        .map(
          b => new Phrase("N'", b ? b.state : (a ? a.state : state),
              a ?? mark, b)
        )
    )
  .flat();
};

funcs["N'_SA"] = function(state, mark) {
  return funcs["N'"](state, mark)
    .map(
      a => funcs["SA"](a.state).map(
        b => new Phrase("N'", b.state, a, b)
      )
    )
  .flat();
};

funcs["N'_SP"] = function(state, mark) {
  return funcs["N'"](state, mark)
    .concat(funcs["N'_SA"](state, mark))
    .map(
      a => funcs["SP"](a.state).map(
        b => new Phrase("N'", b.state, a, b)
      )
    )
  .flat();
};

funcs["SN"] = function(state, mark) {
  return funcs["SA"](state)
    .concat([null])
    .map(
      a => funcs["N'"](a ? a.state : state, mark)
        .concat(funcs["N'_SA"](a ? a.state : state, mark))
        .concat(funcs["N'_SP"](a ? a.state : state, mark))
        .map(
          b => new Phrase("SN", b.state, a, b)
        )
    )
  .flat();
};

funcs["A"] = function(state) {
  return state.expect({flags: ["A"]})
    .map(
      a => new Phrase("A", a.state, a.word)
    )
  ;
};

funcs["A'"] = function(state) {
  return funcs["A"](state)
    .map(
      a => funcs["SP"](a.state, a)
        .concat([null])
        .map(
          b => new Phrase("A'", b ? b.state : a.state, a, b)
        )
    )
  .flat();
};

funcs["SA"] = function(state) {
  return funcs["SR"](state)
    .concat([null])
    .map(
      a => funcs["A'"](a ? a.state : state)
        .map(
          b => new Phrase("SA", b.state, a, b)
        )
    )
  .flat();
};

funcs["R"] = function(state) {
  return state.expect({flags: ["R"]})
    .map(
      a => new Phrase("R", a.state, a.word)
    )
  ;
};

funcs["R'"] = function(state) {
  return funcs["R"](state)
    .map(
      a => funcs["SP"](a.state, a)
        .concat([null])
        .map(
          b => new Phrase("R'", b ? b.state : a.state, a, b)
        )
    )
  .flat();
};

funcs["SR"] = function(state) {
  return funcs["R'"](state)
    .map(
      a => new Phrase("SR", a.state, a)
    )
  ;
};

funcs["P"] = function(state) {
  return state.expect({flags: ["P"]})
    .map(
      a => new Phrase("P", a.state, a.word)
    )
  ;
};

funcs["P'"] = function(state) {
  return funcs["P"](state)
    .map(
      a => funcs["SD"](a.state, new Mark("D", a))
        .map(
          b => new Phrase("P'", b.state, a, b)
        )
    )
  .flat();
};

funcs["SP"] = function(state) {
  return funcs["SR"](state)
    .concat([null])
    .map(
      a => funcs["P'"](a ? a.state : state)
        .map(
          b => new Phrase("SP", b.state, a, b)
        )
    )
  .flat();
};

export function parse(state) {
  return funcs["SD"](state)
    .concat(funcs["SN"](state))
    .concat(funcs["SA"](state))
    .concat(funcs["SR"](state))
    .concat(funcs["SP"](state))
  ;
}
