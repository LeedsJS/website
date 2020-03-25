const got = require("got");

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
  clear
};
