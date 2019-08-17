<script>
  export let name;

  let assert = (a, b) => {
    console.assert(JSON.stringify(a) === JSON.stringify(b), a, b);
  };

  let rot45 = array => {
    let h = array.length;
    if (h === 0) {
      return [];
    }
    let w = array[0].length;
    let m = Math.min(h, w);
    return Array(w + h - 1)
      .fill(0)
      .map((_, k) => {
        let n = k - w + 1;
        let a = Math.max(0, -n);
        let b = Math.min(w, h - n);
        let length = b - a;
        return Array(length)
          .fill(0)
          .map((_, p) => {
            let i = a + p;
            return array[n + i][i];
          });
      });
  };

  // Source:
  // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_chunk
  let transpose = array => {
    if (array.length === 0) {
      return [];
    }
    return array[0].map((col, i) => array.map(row => row[i]));
  };

  assert([[0], [1]], rot45([[0], [1]]));
  assert([[0], [1], [2]], rot45([[0], [1], [2]]));
  assert([[1], [0]], rot45([[0, 1]]));
  assert([[2], [1], [0]], rot45([[0, 1, 2]]));

  let size = 19;
  let five = 5;

  let history = [];
  $: nextPlayer = history.length % 2 === 0 ? "x" : "o"

  let genTable = history => {
    let table = Array(size)
      .fill(0)
      .map(() => Array(size).fill(""));
    history.forEach(([i, j], k) => {
      table[i][j] = k % 2 === 0 ? "x" : "o";
    });
    return table;
  };
  $: table = genTable(history);

  let getOnclick = (i, j) => ev => {
    if (table[i][j] || winner) {
      return;
    }
    history = [...history, [i, j]];
    console.log({ i, j });
  };

  let someRow = (player, five, table) => {
    return table.some(row => {
      let total = 0;
      return row.some(v => {
        if (v === player) {
          total += 1;
        } else {
          total = 0;
        }
        return total === five;
      });
    });
  };

  let victory = table => {
    let winner = "";
    ["x", "o"].forEach(player => {
      let win = someRow(
        player,
        five,
        Array.prototype.concat(
          table,
          transpose(table),
          rot45(table),
          rot45(table.slice().reverse())
        )
      );
      if (win) {
        winner = player;
      }
    });
    return winner;
  };

  $: winner = victory(table);
  $: console.log({ winner });
</script>

<style>
  h1 {
    color: purple;
  }
  td {
    --size: 2em;
    width: var(--size);
    height: var(--size);
    border: 1px solid black;
    text-align: center;
    vertical-align: center;
  }
  table {
    border-collapse: collapse;
  }
</style>

<h1>Gomoku</h1>

<p>Next player: {nextPlayer}</p>

<table>
  {#each table as row, i}
    <tr>
      {#each row as item, j}
        <td on:click={getOnclick(i, j)}>{item}</td>
      {/each}
    </tr>
  {/each}
</table>

{#if winner !== ""}
<p>Winner: {winner}</p>
{/if}