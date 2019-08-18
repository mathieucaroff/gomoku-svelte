export const randint = (t, count) => Math.floor(t * count);

export const randchoice = (t, array) => array[randint(t, array.length)];
