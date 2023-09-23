## Repository organization.

Word database (`words`):
- Binary file in custom format that gives a fast way of lexing, matching
  words' roots and morphologically analyzing words.
- Generated using RAE's CORPES as a starting point, to be then converted
  to said format.
- Common to all models.

Tree database (`trees`):
- Binary file(s) in custom format to represent syntax trees (with means
  to generate the original sentence out of it).
- Tool to generate both a test suite to evaluate models and a database
  to train learning based models.

Deterministic model (`formal`):
- Based on a formal description of the Spanish language as a standard
  defining a recursively parseable language.

Learning based model (`neural`):
- (...).

Web server and tree-to-HTML transformer (`server`):
- Lets users access both models (ideally, using only one is an option if
  limitations imply so).
- Provides an asynchronous interface for the queries.
