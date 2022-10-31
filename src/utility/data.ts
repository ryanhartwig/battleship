

let fields = new Array(10*10).fill('field');
fields = fields.map((f, i) => f + (i + 1));

let characters = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export {
  fields,
  characters,
}