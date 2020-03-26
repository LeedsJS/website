const got = require("got");

async function setup() {
  console.log("Setting up prize draw");
  await got.post(
    `https://leedsjs-prize-draw.glitch.me/setup/clear/${process.env.prize_draw_setup}`,
    {
      json: {}
    }
  );
}

async function clear() {
  console.log("Clearing prize draw");
  await got.post(
    `https://leedsjs-prize-draw.glitch.me/admin/clear/${process.env.prize_draw_clear}`,
    {
      json: {}
    }
  );
}

module.exports = {
  setup,
  clear
};
