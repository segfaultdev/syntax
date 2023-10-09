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

export function Lexer() {
  this.trie = new Trie();
  this.words = [];
  
  this.array = [];
  this.index = 0;
  
  this.push = function(word) {
    if (word.index < 0) {
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
      
      if (parts[0] && parts[0][0] !== parts[0][0].toUpperCase()) {
        const upper_word = parts[0][0].toUpperCase() + parts[0].slice(1);
        const upper_parts = [upper_word, ...parts.slice(1)];
        
        this.push(new Word(this.index, upper_parts));
        this.index++;
      }
      
      this.push(new Word(this.index, parts));
      this.index++;
    }
  };
  
  this.split = function(text) {
    this.trie.init();
    this.array = [];
    
    for (let char of text) {
      this.trie.next(this.array, char);
    }
    
    this.trie.next(this.array, "\n");
  };
}

export function LexerState(lexer, index) {
  this.lexer = lexer;
  this.index = (index ?? 0);
  
  this.expect = function(filter) {
    if (this.index >= this.lexer.array.length) {
      return [];
    }
    
    let words = [];
    
    for (let word of this.lexer.words[this.lexer.array[this.index]]) {
      if (filter.text && word.text !== filter.text) {
        continue;
      }
      
      if (filter.root && word.root !== filter.root) {
        continue;
      }
      
      if (filter.flags) {
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
      
      words.push({
        state: new LexerState(this.lexer, this.index + 1),
        word: word,
      });
    }
    
    return words;
  };
}
