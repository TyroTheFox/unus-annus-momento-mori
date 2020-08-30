# UNUS ANNUS: MOMENTO MORI
#### Web Based Game
##### Built in Phaser
###### Built by Tyro The Fox

This is a very simple game project that you can add new characters to (hopefully) very simply by manipulating the data files to lead to your assets.

## Gameplay

Very simple, based on the Episode of Unus Annus where Mark and Ethan run a game of Celebrity Boxing. Two characters roll dice, the higher die result deals damage to the other.

## Set Up

Have a version of Node Installed:

**Download Link:** https://nodejs.org/en/download/

Once done, double click 'Install.bat' to run first time set up. Once complete, double click 'Run.bat' to start the game. Your browser should start up.
 
# Adding Your Own Stuff
The Game is built to be relatively simple to add in your own content. There's a few methods of doing this but we'll mainly cover the easiest, which is adding in a sprite atlas with accompanying data.

## Recommended Stuff to Have
Because we're working with Phaser, it's recommended to use TexturePacker if you can as it will make the process much smoother. 

It's also useful to have the Phaser Docs to look through as some config data comes from there. 

Lastly, a sprite animating tool like 'PixelMash' (https://nevercenter.com/pixelmash/) or 'Piskel' (https://www.piskelapp.com/) can make the asset making process much easier.

# Make a Character
## Step 1: Make Assets
Create animation frames for the following actions, because the game is looking for these.

- Idle (Standing Around)
- Attack (Throwing a punch or whatever)
- Damage (Taking a hit)
- Defeat (An animation to play upon being taken down)
- Victory (An animation to play upon winning the bout)

Once you have these animations sorted, you'll now need to arrange them so that they make sense to the game.

## Step 2: Sorting Frames, Assets and Handling Data
In the assets folder, make a new folder in the characters folder. You ought to follow the example characters included with the game. You'll want to name the folder to something unique so you can point to it later.

Inside there, you'll want: 

- animation.json
- emitters.json
- sounds.json

These we will configure in a moment. Depending on how you want to import your assets, you'll need to add your assets to the file, renaming the file to suit the import method. 

### Importing an Atlas
- Your image file must be called a 'spritesheet' (png format only)
- The data file must be called 'atlas.json'

(This format is the nicest to work with and is exactly what gets pumped out by TexturePacker in Phaser 3 mode. It is possible to make the 'atlas.json' yourself. Good luck on that though.)

## Importing by Frames
(The 'unusFrames' folder is a good example of this)
- You can put each of your frames for each animation into each folder or just dump them all in. I'd do the former as you'll have to link all of these yourself but you do you, you crazy nutzoidate

## Importing by Spritesheet
- Add in your spritesheet image and rename to 'spritesheet.png'
- This'll be configured elsewhere

## Importing by Unity Atlas (Not Tested)
- Change the image to 'spritesheet.png'
- Change the meta file to 'atlas.meta'

That should be sorted for the frames. Other assets can be put in other places. 

- Custom sounds are put in 'audio'
- Custom particles for emitter effects are in 'emitter'

## Step 3: Configuring The Character
First, you'll need to make sure that the Animation are pointing at the right thing. Use the already example characters for a good idea of how this data should look but you need 5 objects that contain an animData bit and a frameData bit.

- animData: This is Phaser data for the animation. Here you need to set a key which is a lowercase version of the action your setting up ("attack", "damage", "idle" and so on).
- frameData: This is for atlas or spritesheet data which tells the game how to divide up your sprite image into frames
- frames: If you have only individual frames, then here is where you tell the game what frames line up with which animation by listing the frame names associated with each game action

Do this for all five animations in the game to make a new character

You'll also need to tell the game all about your new character. You do this in the 'characterManifest.json' file. Use the characters already in there as a guide

- You'll need to tell the Game what to display your character's name as with 'name'
- You'll need to tell the Game where all your frame assets are by giving the game the name of the folder you put everything in, under 'folderName'
- The 'importMethod' element is important for explaining how to import a character's frames (atlas, frames, unity, spritesheet)
- If you have individual frames, then you'll need to tell the game about each frame by adding to a 'frames' element in a way similar to the 'Unus (Frames)' example: each frame needs a key and the path relative to the asset folder for the character.

After this, you can configure your character a little. You can scale the character assets and you can also add an offset.

Other things to configure is the 'sounds.json' file, where you link sounds to your actions. Look to the existing characters for an idea of how this works.

- You need to specify which action the sound is for ("attack", "damage", "idle" and so on)
- You can have multiple sounds on the same action by adding multiple sound entires to the action
- You must also specify when the sound fires. You can set it by animation frame or by 'time' (which is a delay from the moment the animation starts playing)

Emitters work in a similar way, except they need to know what particle they use and a little details on how the emitter functions

- 'name' needs to link to the name you've given to your custom particle in the emitter folder
- 'action' specifies an action
- 'config' is the options for the emitter
- 'duration' is how long the emitter lasts for
- 'frame' or 'time' for when the emitter fires
- 'target' talks about whether the emitter should happen above your character or the opponent when it fires ('self' or 'enemy')

Once done, that should be it. Boot up the game, test it out and try to deal with any errors you find. Make sure to use F12 menus to look at errors, it's very possible your character hasn't loaded their frames properly and you'll need to double check where it all went wrong.

# Make a Stage
## Step 1: Make all the Assets
Mostly the same as making a character, the difference is that Stages can be made up of lots of different animated and static elements that all layer on top of each other. Use the examples in the backgrounds folder to have a better idea how they fit together

## Step 2: Sorting The Assets Out
Each element of your stage needs its own folder. So, for example, the boxing ring Stage has a ring and floodlights. They're all elements that sit on top of each other so have their own folder with its respective sprite in it

- A single sprite needs only a png called 'sprite.json'
- An animated element, you need an animation.json file which interacts with how you are pulling in your frames, which is done similar to character frames. You can look at the crowdmember element of the boxing ring stage for a good example of what this looks like.

## Step 3: Configuring The Stage
In the backgroundManifest.json, you can sort out how the game reads in and handles a Stage. There's two types you can make here: 'backgrounds' and 'stage' in the 'type' element for most entries. The stages you play on have 'stage' in that.

Here, we'll sort out each entry:

- 'name' is the display name for the Stage
- 'folderName' is the name of the folder where all the sprites are for your stage
- 'playerPositions' is where you set up the x/y values for your characters in the stage. Adding a 'flip' value to make the charater face the opposite direction.
- 'components' is where you add every single component you have
    - 'name' is the name of the folder for the element of the stage
    - 'importMethod' like the character version tells the game how to handle your assets
    - 'position' can be 'center' or 'absolute', where you can specify and x and y value
    - 'scale' changes the size of the assets
    - 'animated' tells the game whether this element can be played or not
- 'bgm' is the background music. 
    - 'name' is the name of the music in the audio folder
    - 'config' are the options for this music
    
That ought to work. Hopefully it does for you!

From there, you ought to be able to make new characters and stages to mess around with. If Phaser 3 can do it, you ought to be able to.

Or, use this as a basis for something more impressive and go nuts. I look forward to it!

Thanks for reading, I hope this is useful and interesting for you to mess with. 
