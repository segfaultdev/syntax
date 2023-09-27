import {Word} from "./word";

export function TrieNode(char = "", parent = null) {
  this.char = char;
  this.parent = parent;
  
  this.value = null;
  this.chars = {};
  
  this.push = function(text, value) {
    if (text.length === 0) {
      this.value = value;
      return;
    }
    
    const char = text[0];
    
    if (!(char in this.chars)) {
      this.chars[char] = new TrieNode(char, this);
    }
    
    this.chars[char].push(text.slice(1), value);
  };
  
  this.find = function(text) {
    if (text.length === 0) {
      return this.value;
    }
    
    const char = text[0];
    
    if (!(char in this.chars)) {
      return null;
    }
    
    return this.chars[char].find(text.slice(1));
  };
}

export function Trie() {
  this.root = new TrieNode();
  
  this.state_node = this.root;
  
  this.push = function(text, value) {
    this.root.push(text, value);
  };
  
  this.find = function(text) {
    return this.root.find(text);
  };
  
  this.init = function() {
    this.state_last_value = null;
    this.state_node = this.root;
  };
  
  this.next = function(array, char) {
    if (char in this.state_node.chars) {
      this.state_node = this.state_node.chars[char];
      
      if (this.state_node.value !== null) {
        this.state_last_value = this.state_node.value;
      }
      
      return;
    }
    
    const last_value = this.state_last_value;
    let node = this.state_node;
    
    this.init();
    
    if (last_value === null) {
      return;
    }
    
    array.push(last_value);
    let trace_text = char;
    
    while (node !== null && node.value === null) {
      trace_text = node.char + trace_text;
      node = node.parent;
    }
    
    for (let trace_char of trace_text) {
      this.next(array, trace_char);
    }
  };
}

export function Lexer(lexer = {}) {
  this.trie = lexer.trie || new Trie();
  this.words = lexer.words || [];
  
  this.state_array = lexer.state_array || [];
  this.state_index = lexer.state_index || 0;
  
  this.state_stack = [];
  this.save = function() {this.state_stack.push(this.state_index);};
  this.load = function() {this.state_index = this.state_stack.pop();};
  
  this.push = function(word) {
    if (word.flags === null) {
      return;
    }
    
    let index = this.trie.find(word.text);
    
    if (index === null) {
      index = this.words.length;
      
      this.trie.push(word.text, index);
      this.words.push([]);
    } else {
      for (let existing_word of this.words[index]) {
        if (existing_word.match(word)) {
          return;
        }
      }
    }
    
    this.words[index].push(word);
  };
  
  this.push_file = async function(path) {
    const file = Bun.file(path);
    const lines = (await file.text()).split("\n");
    
    for (let line of lines) {
      const parts = line.split("\t");
      this.push(new Word(parts));
    }
  };
  
  this.split = function(text) {
    this.state_array = [];
    this.state_index = 0;
    
    this.trie.init();
    
    for (let char of text) {
      this.trie.next(this.state_array, char);
    }
    
    this.trie.next(this.state_array, "\n");
  };
  
  this.clone = function(step = 0) {
    let lexer = new Lexer(this);
    lexer.state_index += step;
    
    return lexer;
  };
  
  this.expect = function(filter, lambda) {
    if (this.state_index >= this.state_array.length) {
      return;
    }
    
    let words = this.words[this.state_array[this.state_index]];
    
    for (let word of words) {
      if (filter.text !== undefined) {
        if (word.text !== filter.text) {
          continue;
        }
      }
      
      if (filter.root !== undefined) {
        if (word.root !== filter.root) {
          continue;
        }
      }
      
      if (filter.flags !== undefined) {
        let valid = false;
        
        for (let flags of filter.flags) {
          if (word.match_flags(flags)) {
            valid = true;
            break;
          }
        }
        
        if (!valid) {
          continue;
        }
      }
      
      if (filter.marker !== undefined) {
        if (word.marker.merge(filter.marker) === null) {
          continue;
        }
      }
      
      lambda(this.clone(1), word);
    }
  };
  
  this.maybe = function(filter, lambda) {
    this.expect(filter, lambda);
    lambda(this.clone(), null);
  };
}
