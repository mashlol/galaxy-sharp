var G = require("./galaxySharp");

G.start();

G.Trigger.on("chatMessage", {message: "hello", exact: false}, function(player, msg) {
	var x = new G.Player(1);
	G.print(x.getName());
	G.print(player.getName());
	G.print(msg);

	if (someObj.equals(someOtherOb)) {

	}

	G.if(x.getName().equals(player.getName()), function() {

	}).else(function() {

	});
	// G.print("Hi!");
// 	var players = new Players(G.c.ALL_PLAYERS);
// 	players.each(function(player) {
// 		G.print(player.getName());
// 	});

// 	G.for(0, {to: 10, by: 2}, function(x) {
// 		G.print(new G.Player(x).getName());
// 	});
});

// G.Trigger.on("keyUp", {key: G.c.W_KEY}, function(player, key, alt, control, shift) {
// 	G.print(player.getName());
// });

G.end();