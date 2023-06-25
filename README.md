# Wandering Puzzler

Inspired by an old puzzle game from 1988 called Wanderer which was available on Amiga.
I believe [this](https://github.com/sshipway/wanderer) is the source code for that game?
Apparently Wanderer was a clone of sorts of an older game called Boulder Dash

This game is my first attempt to work with html canvas and my first attempt at any sort of game.

## Puzzle components

- Coin
  - stationary, static
  - removed from the map (and placed into player inventory) when player moves over it
- Arrow
  - generally moves horizontally
  - will start moving (if possible) on the move/turn after a player moves into an adjacent space (or an adjacent item moves) or the item
  - will end the game if the pointy end intercepts player
  - will be stopped by any static item (landmine, wall, diamond)
  - will be redirected up/down one step when encountering an angled wall
  - Can hold up a Rock
  - player can push an arrow up/down if it can move into open space
- Lava
  - stationary, static
  - will end the game if the player walks into it
- Rock
  - generally moves vertically down (i.e. obeys gravity)
  - will start moving (if possible) on the move/turn after a player moves into an adjacent space (or an adjacent item moves) or the item the rock was resting is removed
  - will end the game if it lands on the player
  - will be redirected one step to left/right by angled wall
  - will move down diagonally if possible when obeying gravity - but only when not sitting on top of a wall
  - can stop an arrow
  - player can push the rock left/right if it can move into open space
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
  - Requires that movement/animation to be run in a consistent order (i.e. when a moving arrow/rock triggers adjacent rock/arrow movements)
  - Rocks that fall down a slope must prefer to roll left before right (or vice-versa)
- Should be able to support several different maps/levels
  - Start with simple text file for maps with particular characters for each item (i.e. `#` for wall,`>` or `<` for arrow, etc.)
  - Allow for arbitrarily large/small maps

Todos / Future Ideas:

- add UI buttons instead of just keyboard controls for game start/restart, etc. (maybe even for movement?)
- Add ability to use mouse/tap for movement in addition to arrow keys (mostly for mobile/tablet compatibility)
- add level list drop-down to select level (and figure out how to pull in levels from upstream repo)
- sounds?
- Deploy to github.io so it can be played online without installing it locally

## Technical aspects

Dependencies:

- ramda - for all functional programming needs
- dataclass - a simple immutable dataclass implementation for javascript

Running:

- install node
- clone the repo
- cd into the repository folder and run `npm install`
- then run `npm start`
