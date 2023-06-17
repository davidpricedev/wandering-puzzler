# Vagabond

Inspired by an old puzzle game from the 1980s - probably [this](https://github.com/sshipway/wanderer).
Which is apparently itself a clone of sorts of an older game called Boulder Dash

My first foray into canvas, and my first game.

## Puzzle components

- Loot
  - stationary, static
  - removed from the map (and placed into player inventory) when player moves over it
- Arrow
  - generally moves horizontally
  - will start moving (if possible) on the move/turn after a player moves into an adjascent space (or an adjascent item moves) or the item
  - will end the game if the pointy end intercepts player
  - will be stopped by any static item (landmine, wall, diamond)
  - will be redirected up/down one step when encountering an angled wall
  - Can hold up a Rock
- Lava
  - stationary, static
  - will end the game if the player walks into it
- Rock
  - generally moves vertically down (i.e. obeys gravity)
  - will start moving (if possible) on the move/turn after a player moves into an adjascent space (or an adjascent item moves) or the item the rock was resting is removed
  - will end the game if it lands on the player
  - will be redirected one step to left/right by angled wall
  - will move down diagonally if possible when obeying gravity - but only when sitting on top of another rock
  - can stop an arrow
- Wall
  - stationary, static
- Shrubbery
  - stationary, static
  - player can move over the shrubbery but will trample it - allowing rocks/arrows to move through the previously impassible obstacle
  - can hold up an arrow or rock (until trampled)
- Angled Wall
  - stationary, static
  - will redirect rocks or arrows one step in the direction you'd expect

## Other Rules / Notes

Rules:

- Mostly turn-based
  - after each move the player makes, anything they may have triggered gets a chance to move, and those movements can trigger others, so the player may see quite a few changes in some cases after a single move
- Maps are square grids

Goals:

- Should be 100% deterministic
  - Requires that movement/animation to be run in a consistent order (i.e. when a moving arrow/rock triggers adjascent rock/arrow movements)
  - Rocks that fall down a slope must prefer to roll left before right (or vice-versa)
- Should be able to support several different maps/levels
  - Start with simple text file for maps with particular characters for each item (i.e. `.` for space, `#` for wall,`>` or `<` for arrow, etc.)
  - Allow for arbitrarily large/small maps
- Future expansions
  - Add additional features later (there is a monster that moves towards the player, A teleporter that moves player back or forth from another position on the map, and probably other things)
  - Add ability to use mouse/tap for movement in addition to arrow/wasd keys (mostly for mobile/tablet compatibility)
  - Maybe make the grid-nature of the game less obvious?
  - What about proper animations instead of turn-based updates?
  - Alternative graphics options (icon sets)?
  - sounds?
  - next?: [https://dosgames.com/game/fgodmom/](https://dosgames.com/game/fgodmom/)
