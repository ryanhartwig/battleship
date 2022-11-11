let characters = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', ' T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

characters.slice(1, 4).forEach((c) => {
  characters.forEach((char, i) => {
    if (!i) return;
    characters.push(`${c}${char}`);
  });
});

export { characters };
