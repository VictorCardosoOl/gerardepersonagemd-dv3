export const rollDice = (sides: number): number => Math.floor(Math.random() * sides) + 1;

export const rollStat = (): number => {
  // 4d6 drop lowest
  const rolls = [rollDice(6), rollDice(6), rollDice(6), rollDice(6)];
  rolls.sort((a, b) => a - b);
  return rolls.slice(1).reduce((a, b) => a + b, 0);
};

export const getModifier = (score: number): number => Math.floor((score - 10) / 2);