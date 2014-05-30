# Galaxy Sharp
Galaxy Sharp is a language which compiles into Galaxy.

The project goals are similar to Galaxy++, except it will not be an editor, only a compiler.  The compiler requires nodejs, which means you either need nodejs to run it, or it will eventually run on a server which will be able to compile as well.  The idea of the language is to be minimal, but also extensible.

# Triggers
Triggers are overly complex in Galaxy, so one of the goals of Galaxy Sharp is to reduce this complexity.  A trigger will be defined with the keyword Trigger, followed by the type of event the trigger will handle.  Each trigger type will have a different set of parameters passed to it to make life easier.

This example trigger will greet the player by name if he types "hello" in any sentence in game.

```C
Trigger onChatMessage(c_playerAny, "hello", false) {
    function actions(Player player, string message) {
        print("Hello, " + player.getName());
    }
}
```

# Objects
In Galaxy, one of the major flaws is that everything is function based.  Using notation like `player.getName()` is much nicer than `PlayerGetName(0)`.

```c
Player p = Players.getPlayer(1);
print("Player " + p.getName() + " has " + p.getUnits().length + " units");
print("There are a total of " + Players.length + " players in the game.");
print("There are a total of " + Units.length + " units on the map.");
for (Unit u in p.getUnits()) {
	print(u.getName() + " waves hello to " + p.getName() + "!");
}
```

# Installing
Install nodeJS for your platform.  Should be pretty easy on all platforms, but google is your friend if you run into any issues.  Galaxy Sharp is being tested with nodeJS v0.10.0.

After you download Galaxy Sharp (for now, git clone only), navigate to the directory and run `npm install` using command prompt/terminal depending on your platform.

# Usage
In a command prompt (windows) or a terminal (mac/linux), navigate to the directory where you installed and type:

```./main.js /path/to/galaxy/project -o /path/to/output/script.gs```