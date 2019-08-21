<script>
  import { around8, transpose, rot45 } from "./util/matrix";
  import { randchoice, randint } from "./util/random";

  let size = 19;
  let five = 5;

  let opponentExpanded = false;
  let selectedStyle;
  let styleList = [
    "human vs human",
    (selectedStyle = "human vs AI"),
    "AI vs human",
    "AI vs AI"
  ];

  let aiStyleExpanded = false;
  let selectedAiStyle;
  let aiStyleList = [(selectedAiStyle = "automatic"), "manual"];

  $: [firstPlayer, _, secondPlayer] = selectedStyle.split(" ");
  $: currentPlayer = history.length % 2 === 0 ? firstPlayer : secondPlayer;
  $: otherPlayer = history.length % 2 !== 0 ? firstPlayer : secondPlayer;

  let history = [];

  let xo = k => (k % 2 === 0 ? "x" : "o");
  $: nextPlayer = xo(history.length);

  let genTable = history => {
    let table = Array(size)
      .fill(0)
      .map(() => Array(size).fill(""));
    history.forEach(([x, y], k) => {
      table[y][x] = xo(k);
    });
    return table;
  };
  $: table = genTable(history);

  let getMoveHandler = (x, y) => ev => {
    if (table[y][x] !== "" || !playing) {
      return;
    }
    history = [...history, [x, y]];
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

  let selectIaMove = table => {
    let i = 0;
    if (history.length === 0) {
      let halfsize = Math.floor(size / 2);
      let smalsize = Math.floor(size / 4);
      let randpos = () => smalsize + randint(Math.random(), halfsize);
      return [randpos(), randpos()];
    }
    let move, x, y;
    do {
      let [oldx, oldy] = randchoice(Math.random(), history);
      let [dx, dy] = randchoice(Math.random(), around8);
      x = oldx + dx;
      y = oldy + dy;
      move = [x, y];
      i += 1;
      if (i > (10 * size ** 2) ** 2) {
        return undefined;
      }
    } while (table[y][x] !== "");
    return move;
  };

  let aiPlay = () => {
    if (currentPlayer === "AI") {
      let table = genTable(history);
      let move = selectIaMove(table);
      if (move) {
        let [x, y] = move;
        if (table[y][x] === "" && winner === "") {
          history = [...history, move];
        }
      } else {
        console.error("could not play", { history, currentPlayer });
      }
    }
  };

  let autoplay = () => {
    if (currentPlayer === "AI" && selectedAiStyle === "automatic") {
      setTimeout(aiPlay, 750);
    }
  };

  $: winner = location.href.includes("winner=x") ? "x" : victory(table);
  $: playing = currentPlayer === "human" && winner === "";
  $: autoplay(history, currentPlayer, selectedAiStyle);
</script>

<main>
  <h1>Gomoku</h1>

  <p id="rules">
    Fill a row, a column or a diagonal of five consecutive squares of your color
    to win.
  </p>

  <p>
    Opponent(s): [{selectedStyle}] [
    <label class="inline">
      <input type="checkbox" bind:checked={opponentExpanded} />
      Expand
    </label>
    ]
    {#if opponentExpanded}
      {#each styleList as style}
        <label>
          <input type="radio" bind:group={selectedStyle} value={style} />
          {style}
        </label>
      {/each}
    {/if}
  </p>
  {#if selectedStyle.includes('AI')}
    <p>
      AI style(s) [
      <label class="inline">
        <input type="checkbox" bind:checked={aiStyleExpanded} />
        Expand
      </label>
      ]
      {#if aiStyleExpanded}
        {#each aiStyleList as style}
          <label>
            <input type="radio" bind:group={selectedAiStyle} value={style} />
            {style}
          </label>
        {/each}
      {/if}
      <input
        type="button"
        value="AI play"
        disabled={playing}
        on:click={aiPlay} />
    </p>
  {/if}

  <table class="inline" class:playing class:winner id="board">
    <thead>
      <td colspan={size}>
        <div class="vmargin vpadding hcenter">
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
      {#each table as row, y}
        <tr>
          {#each row as item, x}
            <td
              on:click={getMoveHandler(x, y)}
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
      <th>x, y</th>
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
      {#each history as [x, y], k}
        <tr>
          <th>{k + 1}</th>
          <td class={xo(k)}>{xo(k)}</td>
          <td class="ij">{x}, {y}</td>
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
  .hidden {
    visibility: hidden;
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
  .vpadding {
    padding: 0.2em 0;
  }
  .hpadding {
    padding-left: 1em;
  }
  #board.winner thead div {
    border-top: 1px solid;
    border-bottom: 1px solid;
  }
  #board.playing td.empty {
    margin-right: 2em;
    cursor: pointer;
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
