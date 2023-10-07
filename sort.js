export function word_sort(phrases) {
  if (!phrases.length) {
    return [];
  }
  
  let sorted_phrases = [];
  let boxes = [];
  
  for (let index in phrases) {
    sorted_phrases.push(index);
    
    boxes.push(phrases[index].words()
      .map(
        word => word.index
      )
      .sort(
        (a, b) => (b - a)
      )
    );
  }
  
  while (boxes[0].length > 0) {
    let max_holders = [];
    let max_index = -1;
    
    for (let index in boxes) {
      if (boxes[index][0] > max_index) {
        max_holders = [index];
        max_index = boxes[index][0];
      } else if (boxes[index][0] === max_index) {
        max_holders.push(index);
      }
      
      boxes[index] = boxes[index].slice(1);
    }
    
    sorted_phrases = sorted_phrases
      .sort(
        (a, b) => (
          ((max_holders.indexOf(a) >= 0) ? 1 : 0) -
          ((max_holders.indexOf(b) >= 0) ? 1 : 0)
        )
      )
    ;
  }
  
  return sorted_phrases
    .map(
      index => phrases[index]
    )
  ;
}
