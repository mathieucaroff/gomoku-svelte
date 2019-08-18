<script>
  import { transpose, rot45 } from "./util/matrix";

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

  let getHistoryHandler = k => ev => {
    history = history.slice(0, k);
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
  main {
    max-width: 770px;
    margin: 0 auto;
    border-width: 0 1px 0 1px;
    border-style: solid;
    padding: 1em;
  }
  h1 {
    color: purple;
    margin-top: 0;
  }
  table {
    border-collapse: collapse;
    vertical-align: center;
  }
  input[type="button"] {
    margin: 0;
    padding: 1px;
    height: auto;
  }
  td.x,
  td.o,
  td.empty {
    --size: 1.5em;
    width: var(--size);
    height: var(--size);
    border: 1px solid;
    text-align: center;
    vertical-align: top;
  }
  td.x {
    background: rgb(255, 207, 179);
  }
  td.o {
    background: rgb(205, 255, 129);
  }
  .hcenter {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  .inline {
    display: inline;
  }
  .lowhight {
    height: 2em;
  }
  .vcenter {
    vertical-align: middle;
  }
  .vmargin {
    margin: 1em 0;
  }
  #board {
    margin-right: 2em;
  }
  #board tbody {
    border: 2px solid;
  }
  #history td {
    border: 1px solid;
    text-align: center;
    vertical-align: center;
  }
  #history .ij {
    min-width: 3em;
  }
  #nextPlayer th {
    font-weight: normal;
    padding-right: 1em;
  }
  #winner th {
    padding-right: 1em;
  }
</style>

<main>
  <h1>Gomoku</h1>

  <p id="rules">
    Fill a row, a column or a diagonal of five squares of your color to win.
  </p>

  <table class="inline" id="board">
    <thead>
      <td colspan={size}>
        <div class="vmargin hcenter">
          <span>
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
          </span>
        </div>
      </td>
    </thead>
    <tbody>
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
    </tbody>
  </table>

  <table class="inline" id="history">
    <thead>
      <th>n°</th>
      <th />
      <th>i, j</th>
      <th />
    </thead>
    <tbody>
      <tr>
        <th>0</th>
        <td class="empty" />
        <td class="ij" />
        <td>
          {#if history.length > 0}
            <input
              type="button"
              value="Go back"
              on:click={getHistoryHandler(0)} />
          {/if}
        </td>
      </tr>
      {#each history as [i, j], k}
        <tr>
          <th>{k + 1}</th>
          <td class={xo(k)}>{xo(k)}</td>
          <td class="ij">{i}, {j}</td>
          <td>
            {#if k + 1 !== history.length}
              <input
                type="button"
                value="Go back"
                on:click={getHistoryHandler(k + 1)} />
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>
