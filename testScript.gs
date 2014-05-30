var G = require("./galaxySharp");

G.start();

G.Trigger.on("chatMessage", "-hello", function(player, msg) {
	var x = new G.Player(1);
	G.print(x.getName());
	G.print(player.getName());
});

G.end();