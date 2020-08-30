import WebFont from 'webfontloader';

import * as soundsData from '../../assets/soundManifest.json';
import * as particleData from '../../assets/particleManifest.json';

import CharacterDataLoader from "../engine/CharacterDataLoader";
import StageDataLoader from "../engine/StageDataLoader";

/**
 * @typedef {Object} DefaultOptions
 * @property {number} HP - Initial HP value
 * @property {number} damage - Attack damage value
 * @property {number} crit - Crital Attack Damage value
 */

/**
 * @typedef {DefaultOptions} GameOptions
 * @property {number} musicVolume - Volume of all in-game music
 * @property {number} sfxVolume - Volume of all in-game sound effects
 */

/**
 * @typedef {Object} BootScene#SoundsManifestData
 * @property {string} name - Name the data will be cached under
 * @property {string} path - Relative path to the sound, starting at the 'audio' asset folder
 */

/**
 * @typedef {Object} BootScene#ParticleData
 * @property type - type of asset being used to create a particle
 * @property path - Relative path leading to the particle asset, starting at the 'emitter' asset folder
 */

/**
 * @typedef {Object} BootScene#ParticleManifestData
 * @property {string} name - Name the asset will be cached under
 * @property {BootScene#ParticleData} particles - Data for the individual particle asset
 */

/**
 * Loads all game assets needed for the game
 * @class BootScene
 * @extends Phaser.Scene
 */
class BootScene extends Phaser.Scene {
    /**
     * @constructor
     */
    constructor() {
        super({
            key: 'BootScene'
        });

        /** @type {CharacterDataLoader} */
        this._characterLoader = new CharacterDataLoader( this );
        /** @type {StageDataLoader} */
        this._stageDataLoader = new StageDataLoader( this );

        /** @type {Array.<BootScene#SoundsManifestData>} */
        this._soundsData = soundsData.default;

        /** @type {Array.<BootScene#ParticleManifestData>} */
        this._particleData = particleData.default;
    }

    /**
     * Initialises the scene
     *
     * @override
     */
    init() {
        //  Inject our CSS
        const element = document.createElement('style');

        document.head.appendChild(element);

        const sheet = element.sheet;

        const styles = '@font-face { font-family: "Poppins"; src: url("assets/fonts/Poppins-Bold.ttf") format("truetype"); }\n';

        sheet.insertRule(styles, 0);

        WebFont.load( {
            custom: {
                families: [ 'Poppins' ]
            }
        } )
    }

    /**
     * Loads assets before use in the program
     * @override
     */
    preload() {
        const progress = this.add.graphics();

        // Register a load progress event to show a load bar
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
        });

        // Register a load complete event to launch the title screen when all files are loaded
        this.load.on('complete', () => {
            // prepare all animations, defined in a separate file
            // makeAnimations(this);
            progress.destroy();
            this.scene.start('TitleScene');
        });

        this.registry.set( '__GameOptionsDefaultData', {
            HP: 5,
            damage: 1,
            crit: 5
        } );

        this.registry.set( '__GameOptionsData', {
            HP: 5,
            damage: 1,
            crit: 5,
            musicVolume: 0.25,
            sfxVolume: 1
        } );

        this._characterLoader.getAllCharacterData();

        this._stageDataLoader.getAllStageData();

        this._soundsData.forEach( ( sound ) => {
            this.load.audio( sound.name, `assets/audio/${sound.path}` )
        } );

        this.load.image('healthbar_background', 'assets/healthbar/healthbar_background.png');
        this.load.image('healthbar_bar', 'assets/healthbar/healthbar_bar.png');

        this.load.image('healthbar_backgroundInv', 'assets/healthbar/healthbar_backgroundInv.png');
        this.load.image('healthbar_barInv', 'assets/healthbar/healthbar_barInv.png');

        this.load.image('healthbar_barRed', 'assets/healthbar/healthbar_barRed.png');

        this.load.image('button_Idle', 'assets/button/button_0.png');
        this.load.image('button_Over', 'assets/button/button_2.png');
        this.load.image('button_Down', 'assets/button/button_1.png');

        this.load.image('titleLogo', 'assets/images/UAMMTitle.png');

        this.load.image('dieSprite', 'assets/images/diesprite.png');

        this.load.image('backIcon', 'assets/button/back.png');
        this.load.image('optionsIcon', 'assets/button/options.png');
        this.load.image('personIcon', 'assets/button/person.png');
        this.load.image('swordIcon', 'assets/button/sword.png');

        this._particleData.forEach( ( emitter ) => {
            if ( emitter.particles.type === 'texture' ) {
                this.load.image( emitter.name, `assets/emitter/${emitter.particles.path}` );
            } else if ( emitter.particles.type === 'atlas') {
                this.load.atlas( emitter.name,
                    `assets/emitter/${emitter.particles.path}`, `assets/emitter/${emitter.particles.json}`);
            }
        } );
    }

    /**
     * Creates game objects out of the loaded assets
     * @override
     */
    create() {
        this._characterLoader.createAllCharacters();
        this._stageDataLoader.createAllStages();
    }
}

export default BootScene;
