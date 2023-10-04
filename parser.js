import {Phrase, Mark} from "./phrase";

let funcs = {};

funcs["D"] = function(state) {
  const determinant_filter = ["D", "M", "T", "Q", "W", "X-----d"];
  
  return state.expect({filter: determinant_filter}).map(
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
    a => new Phrase("SD", a.state, a),
  );
};

funcs["N"] = function(state) {
  return state.expect({filter: ["N"]}).map(
    a => new Phrase("N", a.state, a.word),
  );
};

funcs["N'"] = function(state, mark) {
  return funcs["N"](state).map(
    a => funcs["SP"](a.state, a).map(
      b => new Phrase("N'", b.state, a, b)
    ).concat([
      new Phrase("N'", a.state, a)
    ])
  ).concat(mark ?
    funcs["SP"](state, mark).map(
      a => new Phrase("N'", a.state, mark, a)
    ).concat([
      new Phrase("N'", state, mark)
    ])
  : []).flat();
};

funcs["SN"] = function(state, mark) {
  return funcs["SA"](state).map(
    a => funcs["N'"](a.state, mark).map(
      b => new Phrase("SN", b.state, a, b)
    )
  ).concat([
    funcs["N'"](state, mark).map(
      a => new Phrase("SN", a.state, a)
    )
  ]).flat();
};

funcs["A"] = function(state) {
  return state.expect({filter: ["A"]}).map(
    a => new Phrase("A", a.state, a.word),
  );
};

funcs["A'"] = function(state) {
  return funcs["A"](state).map(
    a => funcs["SP"](a.state, a).map(
      b => new Phrase("A'", b.state, a, b)
    ).concat([
      new Phrase("A'", a.state, a)
    ])
  ).flat();
};

funcs["SA"] = function(state) {
  return funcs["SR"](state).map(
    a => funcs["A'"](a.state).map(
      b => new Phrase("SA", b.state, a, b)
    )
  ).concat([
    funcs["A'"](state).map(
      a => new Phrase("SA", a.state, a)
    )
  ]).flat();
};

funcs["R"] = function(state) {
  return state.expect({filter: ["R"]}).map(
    a => new Phrase("R", a.state, a.word)
  );
};

funcs["R'"] = function(state) {
  return funcs["R"](state).map(
    a => funcs["SP"](a.state, a).map(
      b => new Phrase("R'", b.state, a, b)
    ).concat([
      new Phrase("R'", a.state, a)
    ])
  ).flat();
};

funcs["SR"] = function(state) {
  return funcs["R'"](state).map(
    a => new Phrase("SR", a.state, a),
  );
};

funcs["P"] = function(state) {
  return state.expect({filter: ["P"]}).map(
    a => new Phrase("P", a.state, a.word),
  );
};

funcs["P'"] = function(state) {
  return funcs["P"](state).map(
    a => funcs["SD"](a.state, new Mark("D", a)).map(
      b => new Phrase("P'", b.state, a, b)
    )
  ).flat();
};

funcs["SP"] = function(state) {
  return funcs["SR"](state).map(
    a => funcs["P'"](a.state).map(
      b => new Phrase("SP", b.state, a, b)
    )
  ).concat([
    funcs["P'"](state).map(
      a => new Phrase("SP", a.state, a)
    )
  ]).flat();
};

export function parse(state) {
  return funcs["SD"](state);
}
