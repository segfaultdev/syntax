let verbs = {};

export async function push_verbs(path) {
  verbs = verbs.concat(JSON.parse(await Bun.file(path).text()));
}

export function test_verb(verb, type) {
  if (!(verb in verbs) || !verbs[verb]) {
    return false;
  }
  
  return (verbs[verb].indexOf(type) >= 0);
}
