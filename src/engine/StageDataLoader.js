import * as stageManifestData from '../../assets/backgroundManifest.json';

/**
 * Loads all assets relating to stages
 * @class StageDataLoader
 */
export default class StageDataLoader {
    /**
     * @constructor
     * @param {Phaser.Scene} scene - Game Context to load into
     */
    constructor( scene ) {
        this._sourceDirectory = 'assets/backgrounds';
        this._scene = scene;

        /** @type {Array.<Stage#StageManifestData>} */
        this._stageManifestData = stageManifestData.default;
    }

    /**
     * Load all manifest and json data needed to construct stages
     */
    getAllStageData() {
        this._stageManifestData.forEach( ( stage ) => {
            const { folderName, components } = stage;

            if ( !folderName ) {
                throw 'Folder name is missing'
            }

            components.forEach( ( componentData ) => {
                const { importMethod, frames, spritesheetConfig } = componentData;

                if ( !importMethod ){
                    throw 'Import Method not stated'
                }

                switch ( importMethod ) {
                    case 'image':
                        this.loadImageComponent( folderName, componentData );
                        break;
                    case 'atlas':
                        this.loadAtlas( folderName, componentData );
                        break;
                    case 'frames':
                        if ( frames ) {
                            this.loadImageList( folderName, componentData, frames );
                        } else {
                            throw 'Frame data not given'
                        }
                        break;
                    case 'unity':
                        this.loadUnityAtlas( folderName, componentData );
                        break;
                    case 'spritesheet':
                        if ( spritesheetConfig ) {
                            this.loadSpriteSheet( folderName, componentData, spritesheetConfig );
                        } else {
                            throw 'Spritesheet config data not given'
                        }
                        break;
                }

                if ( componentData.animated ) {
                    this.loadAnimationData( folderName, componentData );
                }
            } );
        } );
    }

    /**
     * Turn all loaded data into asset objects
     */
    createAllStages() {
        this._stageManifestData.forEach( ( stage ) => {
            const { folderName, components } = stage;

            components.forEach( ( componentData ) => {
                if ( componentData.animated ) {
                    this.parseAnimationData( folderName, componentData );
                }
            } );
        } );
    }

    /**
     * Loads a sprite atlas using it's data file
     * @param {string} folderName - Name of the data folder for the character
     * @param {Stage#Component} componentData - Data relating to the created component
     */
    loadAtlas( folderName, componentData ) {
        this._scene.load.atlas(
            `${componentData.name}_${folderName}`,
            `../../${this._sourceDirectory}/${folderName}/${componentData.name}/spritesheet.png`,
            `../../${this._sourceDirectory}/${folderName}/${componentData.name}/atlas.json`);
    }

    /**
     * Loads json animation data
     * @param {string} folderName - Name of the data folder for the character
     * @param {Stage#Component} componentData - Data relating to the created component
     */
    loadAnimationData( folderName, componentData ) {
        this._scene.load.json(`animation_${componentData.name}_${folderName}`, `../../${this._sourceDirectory}/${folderName}/${componentData.name}/animation.json`);
    }

    /**
     * Loads a list of frame images
     * @param {string} folderName - Name of the data folder for the character
     * @param {Stage#Component} componentData - Data relating to the created component
     * @param {Object.<string, string>} imageList - A list of keys and paths to frame images
     */
    loadImageList( folderName, componentData, imageList ) {
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
            this._scene.load.image(`${key}-${componentData.name}_${folderName}`, `${this._sourceDirectory}/${folderName}/${componentData.name}/sprite.png`);
            i++;
        }
    }

    /**
     * Loads an image component
     * @param {string} folderName - Name of the data folder for the character
     * @param {Stage#Component} componentData - Data relating to the created component
     */
    loadImageComponent( folderName, componentData ) {
        this._scene.load.image(`${componentData.name}_${folderName}`, `${this._sourceDirectory}/${folderName}/${componentData.name}/sprite.png`);
    }

    /**
     * Loads a Unity Sprite Atlas
     * @param {string} folderName - Name of the data folder for the character
     * @param {Stage#Component} componentData - Data relating to the created component
     */
    loadUnityAtlas( folderName, componentData ) {
        this._scene.load.unityAtlas(
            `${componentData.name}_${folderName}`,
            `../../${this._sourceDirectory}/${folderName}/spritesheet.png`,
            `../../${this._sourceDirectory}/${folderName}/atlas.meta`);
    }

    /**
     * Loads a spritesheet using a given config file
     * @param {string} folderName - Name of the data folder for the character
     * @param {Stage#Component} componentData - Data relating to the created component
     * @param {Phaser.Types.Loader.FileTypes.ImageFrameConfig} spritesheetConfig - Config for the spritesheet
     */
    loadSpriteSheet( folderName, componentData, spritesheetConfig ) {
        this._scene.load.spritesheet(
            `${componentData.name}_${folderName}`,
            `../../${this._sourceDirectory}/${folderName}/spritesheet.png`,
            spritesheetConfig
        );
    }

    /**
     * Parses Animation Data and turns it into sprite animations
     * @param {string} folderName - Name of the data folder for the character
     * @param {Stage#Component} componentData - Data relating to the created component
     */
    parseAnimationData( folderName, componentData ) {
        const animationData = this._scene.cache.json.get( `animation_${componentData.name}_${folderName}` );

        if (animationData) {
            const { animData, frameData } = animationData;

            if ( frameData ) {
                animData.frames = this._scene.anims.generateFrameNames( `${componentData.name}_${folderName}`, animationData.frameData );
            } else if ( animData.frames ) {
                animData.frames.forEach( ( frame ) => {
                    frame.key = `${frame.key}-${componentData.name}_${folderName}`;
                } );
            } else {
                throw 'Frames data missing from ' + `${componentData.name}_${folderName}`;
            }

            animData.key = `${componentData.name}_${folderName}`;
            this._scene.anims.create( animData );
        }
    }
}
