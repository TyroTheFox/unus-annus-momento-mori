import * as stageManifestData from '../../assets/backgroundManifest.json';

/**
 * typedef {Object} Stage#RepeatConfig
 * @property {number} count - Number of copies to make
 * @property {Object} offset - The offset applied to each copy, in turn
 * @property {number} offset.x - X co-ord
 * @property {number} [offset.y] - Y co-ord
 */

/**
 * @typedef {Object} Stage#Component
 * @property {string} [id] - Optional ID to cache this object under
 * @property {string} name - Name of cached asset this component uses
 * @property {string} position - Positioning mode (absolute or center)
 * @property {number|string} [x] - When in Absolute mode, sets the X co-ord (can set to centre)
 * @property {number|string} [y] - When in Absolute mode, sets the Y co-ord (can set to centre)
 * @property {number|Object} [scale] - The scaling of the component
 * @property {number} scale.x - X scale value
 * @property {number} [scale.y] - Y scale value
 * @property {number} [alpha] - Alpha value
 * @property {Object} [anchor] - Anchor value for the sprite
 * @property {number} anchor.x - X anchor value
 * @property {number} anchor.y - Y anchor value
 * @property {string} [blendMode] - Name of a phaser blend mode
 * @property {boolean} animated - Whether the component has animation frames to play
 * @property {number} randomDelay - The upper bound of a random number range for the delay before the animation plays
 * @property {Stage#RepeatConfig} repeat - Repeats the same asset over and over according to the given
 */

/**
 * @typedef {Object} Stage#BackgroundMusicData
 * @property {string} name - Name the music is stored under
 * @property {Phaser.Types.Sound.SoundConfig} config - Optional sound config object to be applied to this marker or entire sound if no marker name is provided. It gets memorized for future plays of current section of the sound.
 */

/**
 * @typedef {Stage#BackgroundMusicData} Stage#BackgroundMusic
 * @property {Phaser.Sound.BaseSound} music - Music object to actually play
 */

/**
 * @typedef {Array.<Stage#BackgroundMusic>} Stage#BackgroundMusicList
 */

/**
 * @typedef {Object} Stage#PlayerPositionData
 * @property {number} x - X co-ord
 * @property {number} y - Y co-ord
 * @property {boolean} [flip] - Whether or not to flip the player sprite to face the other way
 */

/**
 * @typedef {Object} Stage#StageManifestData
 * @property {string} name - Display name for the Stage
 * @property {string} folderName - Name of the folder containing data and assets
 * @property {Array.<Stage#PlayerPositionData>} playerPosition - Positions of each character within the stage
 * @property {Array.<Stage#Component>} components - An array of Stage Elements to display
 * @property {Stage#BackgroundMusicData|Array.<Stage#BackgroundMusicData>} bgm - Object containing the stage's background music data that gets randomly selected from
 * @property {string} type - Type of stage, either a background or a stage to play
 */

/**
 * The area characters fight in
 * @class Stage
 */
export default class Stage {
    /**
     * @constructor
     * @param {Phaser.Scene} scene
     * @param {string} stageName - Display name of the Stage
     */
    constructor( scene, stageName ) {
        this._name = stageName;
        this._scene = scene;

        this._components = {};

        /** @type {Stage#BackgroundMusicList} */
        this._bgm = [];
        this._bgmCurrentlyPlaying = null;

        /** @type {Stage#StageManifestData} */
        const stageData = stageManifestData.find( data => data.name === this._name );
        const stageComponents = stageData.components;

        /**
         * Positions of the player characters within the stage
         * @type {{x: number, y: number}|null}
         * @private
         */
        this._playerPositions = stageData.playerPositions || null;

        if ( stageData.bgm ) {
            const musicToLoad = [];
            if ( Array.isArray( stageData.bgm ) ) {
                musicToLoad.push( ...stageData.bgm );
            } else {
                musicToLoad.push( stageData.bgm );
            }

            musicToLoad.forEach( ( musicData ) => {
                const music = this._bgm.find( music => music.name === musicData.name );

                if ( !music ) {
                    const configData = musicData.config || {};

                    const data = {
                        ...musicData,
                        music: this._scene.sound.add( musicData.name, configData )
                    }
                    this._bgm.push( data );
                }
            } );
        }

        stageComponents.forEach( ( componentData ) => this._addStageComponent( componentData, stageData ) );

        this._scene.registry.events.on('changedata', this._updateVolume, this);

        this._optionsData = this._scene.registry.get( '__GameOptionsData' );
    }

    get playerPositions () {
        return this._playerPositions;
    }

    /**
     * Play one of the music tracks from the list
     * @param {number} delay - A short pause to wait for before playing the music
     */
    playBGM( delay = 0 ) {
        if ( this._bgm.length > 0 ) {
            this._scene.sound.stopAll();
            const music = Phaser.Math.RND.pick( this._bgm );
            if ( delay ) {
                this._scene.time.delayedCall( delay, () => { music.music.play() }, [], this);
            } else {
                music.music.play();
            }
            this._bgmCurrentlyPlaying = music.music;
            this._bgmCurrentlyPlaying.setVolume( this._optionsData.musicVolume );
        }
    }

    /**
     * Restarts the background music.
     */
    resetBGM() {
        if ( this._bgmCurrentlyPlaying ) {
            this._bgmCurrentlyPlaying.stop();
            this._bgmCurrentlyPlaying.play();
        }
    }

    /**
     * Stops the background music
     */
    stopBGM() {
        if ( this._bgmCurrentlyPlaying ) {
            this._bgmCurrentlyPlaying.stop();
        }
    }

    /**
     * Sets the z index of all components of the stage
     * @param {number} zIndex - Depth all the stage objects being rendered at
     */
    setStageZIndex( zIndex ) {
        for ( let [key, component] of Object.entries( this._components ) ) {
            component.setDepth( zIndex );
        }
    }

    /**
     * Sets the visibility of all stage elements
     * @param {boolean} v - Visibility switch
     */
    setVisible( v ) {
        for ( let [key, component] of Object.entries( this._components ) ) {
            component.setVisible( v );
        }
    }

    /**
     * Once the stage is no longer needed, this attempts to clean up all the created assets
     */
    cleanUp() {
        if ( this._bgmCurrentlyPlaying ) {
            this._bgmCurrentlyPlaying.stop();
        }

        for ( let [key, component] of Object.entries( this._components ) ) {
            component.destroy();
        }

        this._bgm.forEach( ( bgmData ) => {
            bgmData.music.destroy();
        } );

        delete this._components;
    }

    /**
     * Adds a new Stage Component to this Stage
     * @param {Stage#Component} componentData - Data used to construct new components
     * @param {Stage#StageManifestData} stageData - Data relating to the stage
     * @param {number} repeat - When a component is being repeated, this is an index to be used for calculations to track how many repeats have been added
     * @private
     */
    _addStageComponent( componentData, stageData, repeat = -1 ) {
        let x = 0;
        let y = 0;

        switch ( componentData.position ) {
            case 'center':
                x = this._scene.game.config.width / 2;
                y = this._scene.game.config.height / 2;
                break;
            case 'absolute':
                if ( componentData.x === 'center' ) {
                    x = this._scene.game.config.width / 2;
                } else {
                    x = componentData.x;
                }

                if ( componentData.y === 'center' ) {
                    y = this._scene.game.config.height / 2;
                } else {
                    y = componentData.y;
                }
                break;
        }

        let componentName = componentData.name;

        if ( componentData.id ) {
            componentName = componentData.id;
        }

        if ( repeat > -1 ) {
            componentName += `-${repeat}`;
        }

        this._components[componentName] = this._scene.add.sprite( x, y, `${componentData.name}_${stageData.folderName}`);

        const currentComponent = this._components[componentName];

        if ( componentData.animated ) {
            if ( componentData.randomDelay ) {
                this._scene.time.delayedCall(
                    Phaser.Math.Between( 0, componentData.randomDelay ), () => {
                        currentComponent.play( `${componentData.name}_${stageData.folderName}` );
                }, [], this );
            } else {
                currentComponent.play( `${componentData.name}_${stageData.folderName}` );
            }

        }

        if ( componentData.scale ) {
            currentComponent.setScale( componentData.scale );
        }

        if ( componentData.alpha ) {
            currentComponent.alpha = componentData.alpha;
        }

        if ( componentData.anchor ) {
            currentComponent.setOrigin( componentData.anchor.x, componentData.anchor.y );
        }

        if ( componentData.blendMode ) {
            currentComponent.setBlendMode( Phaser.BlendModes[componentData.blendMode] );
        }

        if ( componentData.repeat ) {
            const { count, offset } = componentData.repeat;

            for ( let i = 0; i < count; i++ ) {
                let xOffset = 0;
                let yOffset = 0;

                if ( offset ) {
                    xOffset = offset.x || 0;
                    yOffset = offset.y || 0;
                }

                /** @type {Stage#Component} */
                const newComponent = {
                    ...componentData,
                    repeat: false,
                    position: 'absolute',
                    x: x + ( xOffset * i ),
                    y: y + ( yOffset * i )
                }

                this._addStageComponent( newComponent, stageData, i );
            }
        }
    }

    /**
     * Updates stat and volume values once options data changes
     * @listens Phaser.Data.Events#CHANGE_DATA
     * @param {any} parent - A reference to the object that the Data Manager responsible for this event belongs to
     * @param {string} key - The unique key of the data item within the Data Manager
     * @param {any} data - The new value of the item in the Data Manager
     * @private
     */
    _updateVolume(parent, key, data)
    {
        if ( !this._bgmCurrentlyPlaying ) {
            return;
        }

        if (key === '__GameOptionsData')
        {
            this._bgmCurrentlyPlaying.setVolume( data.musicVolume );
        }
    }
}
