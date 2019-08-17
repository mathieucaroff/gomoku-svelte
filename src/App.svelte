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

  let xo = k => (k % 2 === 0 ? "x" : "o");
  $: nextPlayer = xo(history.length);

  let genTable = history => {
    let table = Array(size)
      .fill(0)
      .map(() => Array(size).fill(""));
    history.forEach(([i, j], k) => {
      table[i][j] = xo(k);
    });
    return table;
  };
  $: table = genTable(history);

  let getMoveHandler = (i, j) => ev => {
    if (table[i][j] || winner) {
      return;
    }
    history = [...history, [i, j]];
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
  #history td {
    border: 1px solid;
    text-align: center;
    vertical-align: center;
  }
  td.x,
  td.o,
  td.empty {
    --size: 1.5em;
    width: var(--size);
    height: var(--size);
    border: 1px solid;
    text-align: center;
    vertical-align: center;
  }
  td.x {
    background: rgb(255, 207, 179);
  }
  td.o {
    background: rgb(205, 255, 129);
  }
  table {
    border-collapse: collapse;
    vertical-align: center;
  }
  .verticalMargin1 {
    margin: 1em 0;
  }
  #nextPlayer th {
    font-weight: normal;
    padding-right: 1em;
  }
  #winner th {
    padding-right: 1em;
  }
  .inline {
    display: inline;
  }
</style>

<h1>Gomoku</h1>

<div class="verticalMargin1">
  {#if winner === ''}
    <table class="inline" id="nextPlayer">
      <tr>
        <th>Next player:</th>
        <td class={nextPlayer}>{nextPlayer}</td>
      </tr>
    </table>
  {:else}
    <table class="inline" id="winner">
      <tr>
        <th>Winner:</th>
        <td class={winner}>{winner}</td>
      </tr>
    </table>
  {/if}
</div>

<table class="inline" id="board">
  {#each table as row, i}
    <tr>
      {#each row as item, j}
        <td
          on:click={getMoveHandler(i, j)}
          class={item !== '' ? item : 'empty'}>
          {item}
        </td>
      {/each}
    </tr>
  {/each}
</table>

<table class="inline" id="history">
  <thead>
    <th>n°</th>
    <th />
    <th>i, j</th>
  </thead>
  <tbody>
    {#each history as [i, j], k}
      <tr>
        <th>{k}</th>
        <td class={xo(k)}>{xo(k)}</td>
        <td>{i}, {j}</td>
      </tr>
    {/each}
  </tbody>
</table>
