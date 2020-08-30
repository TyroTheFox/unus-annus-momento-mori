import * as characterData from '../../assets/characterManifest.json';

/**
 * @typedef {Object} CharacterDataLoader#CharacterManifestEntry
 * @property {string} name - Display name for the character
 * @property {string} folderName - Name of character data file
 * @property {string} importMethod - A Key Flag to inform the game how sprite assets for the character are to be loaded
 * @property {Object.<string, string>} [frames] - When loading in character frames one by one, you will need to specify every single one
 * @property {Character#CharacterConfig} [config] - Configuration file for the character
 * @property {Phaser.Types.Loader.FileTypes.ImageFrameConfig} [spritesheetConfig] - Config for the spritesheet
 */

/**
 * @typedef {Object} CharacterDataLoader#CharacterAnimation
 * @property {Phaser.Types.Animations.Animation} animData - Configuration settings for the Animation
 * @property {Phaser.Types.Animations.GenerateFrameNames} [frameData] - The configuration object for the animation frame names
 */

/**
 * @typedef {Array.<CharacterDataLoader#CharacterManifestEntry>} CharacterDataLoader#CharacterManifestData
 */

/**
 * @class CharacterDataLoader
 */
export default class CharacterDataLoader {
    /**
     * @constructor
     * @param {Phaser.Scene} scene - Game Context to load into
     */
    constructor( scene ) {
        this._sourceDirectory = 'assets/characters';
        this._scene = scene;

        /** @type {CharacterDataLoader#CharacterManifestData} */
        this._characterManifestData = characterData.default;
    }

    /**
     * Load all manifest and json data needed to construct characters
     */
    getAllCharacterData() {
        this._characterManifestData.forEach( ( character ) => {
            const { folderName, importMethod, frames, spritesheetConfig } = character;

            if ( !folderName ) {
                throw 'Folder name is missing'
            }

            if ( !importMethod ){
                throw 'Import Method not stated'
            }

            switch ( importMethod ) {
                case 'atlas':
                    this.loadAtlas( folderName );
                    break;
                case 'frames':
                    if ( frames ) {
                        this.loadImageList( folderName, frames );
                    } else {
                        throw 'Frame data not given'
                    }
                    break;
                case 'unity':
                    this.loadUnityAtlas( folderName );
                    break;
                case 'spritesheet':
                    if ( spritesheetConfig ) {
                        this.loadSpriteSheet( folderName, spritesheetConfig );
                    } else {
                        throw 'Spritesheet config data not given'
                    }
                    break;
            }

            this.loadAnimationData( folderName );
            this.loadSoundData( folderName );
            this.loadEmitterData( folderName );
        } );
    }

    /**
     * Turns loaded data and assets into usable objects
     */
    createAllCharacters() {
        this._characterManifestData.forEach( ( character ) => {
            const { folderName } = character;
            this.parseAnimationData( folderName );
        } );
    }

    /**
     * Loads a list of frame images
     * @param {string} folderName - Name of the data folder for the character
     * @param {Object.<string, string>} imageList - A list of keys and paths to frame images
     */
    loadImageList( folderName, imageList ) {
        let i = 0;
        for ( const [key, path] of Object.entries( imageList ) ) {
            if ( !path && !key ) {
                throw 'Data wrong or missing for frame ' + i;
            }

            if ( !path ){
                throw 'Path not given for ' + key
            }

            if ( !key ) {
                throw 'Key not given for ' + path
            }
            this.loadImage( `${key}-${folderName}`, folderName, path );
            i++;
        }
    }

    /**
     * Loads an image frame
     * @param {string} key - Combination of the frame key and the folder name that the frame gets cached under
     * @param {string} folderName - Name of the data folder for the character
     * @param {string} imagePath - Relative path to the frame, starting at the Character's asset folder
     */
    loadImage( key, folderName, imagePath ) {
        this._scene.load.image( key, `../../${this._sourceDirectory}/${folderName}/${imagePath}` );
    }

    /**
     * Loads a sprite atlas using it's data file
     * {string} folderName - Name of the data folder for the character
     */
    loadAtlas( folderName ) {
        this._scene.load.atlas(
            `${folderName}`,
            `../../${this._sourceDirectory}/${folderName}/spritesheet.png`,
            `../../${this._sourceDirectory}/${folderName}/atlas.json`);
    }

    /**
     * Loads a spritesheet using a given config file
     * @param {string} folderName - Name of the data folder for the character
     * @param {Phaser.Types.Loader.FileTypes.ImageFrameConfig} spritesheetConfig - Config for the spritesheet
     */
    loadSpriteSheet( folderName, spritesheetConfig ) {
        this._scene.load.spritesheet(
            `${folderName}`,
            `../../${this._sourceDirectory}/${folderName}/spritesheet.png`,
            spritesheetConfig
        );
    }

    /**
     * Loads a Unity Sprite Atlas
     * @param {string} folderName - Name of the data folder for the character
     */
    loadUnityAtlas( folderName ) {
        this._scene.load.unityAtlas(
            `${folderName}`,
            `../../${this._sourceDirectory}/${folderName}/spritesheet.png`,
            `../../${this._sourceDirectory}/${folderName}/atlas.meta`);
    }

    /**
     * Loads json animation data
     * @param {string} folderName - Name of the data folder for the character
     */
    loadAnimationData( folderName ) {
        this._scene.load.json( `animation_${folderName}`, `../../${this._sourceDirectory}/${folderName}/animation.json`);
    }

    /**
     * Loads json sound data
     * @param {string} folderName - Name of the data folder for the character
     */
    loadSoundData( folderName ) {
        this._scene.load.json( `sfx_${folderName}`, `../../${this._sourceDirectory}/${folderName}/sounds.json`);
    }

    /**
     * Loads json emitter data
     * @param {string} folderName - Name of the data folder for the character
     */
    loadEmitterData( folderName ) {
        this._scene.load.json( `emitter_${folderName}`, `../../${this._sourceDirectory}/${folderName}/emitters.json`);
    }

    /**
     * Parses animation data into sprite animations
     * @param {string} folderName - Name of the data folder for the character
     */
    parseAnimationData( folderName ) {
        /** @type {Array.<CharacterDataLoader#CharacterAnimation>} */
        const animationData = this._scene.cache.json.get( `animation_${folderName}` );

        animationData.forEach( ( animation ) => {
            const { animData, frameData } = animation;

            if ( frameData ) {
                animData.frames = this._scene.anims.generateFrameNames(`${folderName}`, animation.frameData );
            } else if ( animData.frames ) {
                animData.frames.forEach( ( frame ) => {
                    frame.key = `${frame.key}-${folderName}`;
                } );
            } else {
                throw 'Frames data missing from ' + folderName;
            }

            animData.key += `-${folderName}`;
            this._scene.anims.create( animData );
        } );
    }
}
