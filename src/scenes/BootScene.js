import WebFont from 'webfontloader';

import * as soundsData from '../../assets/soundManifest.json';

import CharacterDataLoader from "../engine/CharacterDataLoader";
import BackgroundDataLoader from "../engine/BackgroundDataLoader";

class BootScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'BootScene'
        });

        this._characterLoader = new CharacterDataLoader( this );
        this._backgroundDataLoader = new BackgroundDataLoader( this );
    }

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

    preload() {
        const promises = [];

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
            musicVolume: 0.75,
            sfxVolume: 1
        } );

        this._characterLoader.getAllCharacterData();

        this._backgroundDataLoader.getAllStageData();

        soundsData.default.forEach( ( sound ) => {
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

        this.anims.create( {
            key: 'buttonFrames',
            frames: [
                { key: 'button_Idle' },
                { key: 'button_Over' },
                { key: 'button_Down' }
            ],
            frameRate: 10
        } );
        // this.load.image('background-clouds', 'assets/images/clouds.png'); // 16-bit later

        // Tilemap with a lot of objects and tile-properties tricks
        // this.load.tilemapTiledJSON('map', 'assets/tilemaps/super-mario.json');

        // I load the tiles as a spritesheet so I can use it for both sprites and tiles,
        // Normally you should load it as an image.
        // this.load.spritesheet('tiles', 'assets/images/super-mario.png', {
        //     frameWidth: 16,
        //     frameHeight: 16,
        //     spacing: 2
        // });

        // Support for switching between 8-bit and 16-bit tiles
        // this.load.spritesheet('tiles-16bit', 'assets/images/super-mario-16bit.png', {
        //     frameWidth: 16,
        //     frameHeight: 16,
        //     spacing: 2
        // });

        // Spritesheets with fixed sizes. Should be replaced with atlas:
        // this.load.spritesheet('mario', 'assets/images/mario-sprites.png', {
        //     frameWidth: 16,
        //     frameHeight: 32
        // });

        // Beginning of an atlas to replace the spritesheets above. Always use spriteatlases. I use TexturePacker to prepare them.
        // Check rawAssets folder for the TexturePacker project I use to prepare these files.
        // this.load.atlas('mario-sprites', 'assets/mario-sprites.png', 'assets/mario-sprites.json');

        // Music to play. It's not properly edited for an continous loop, but game play experience isn't really the aim of this repository either.
        // this.load.audio('overworld', [
        //     'assets/music/overworld.ogg',
        //     'assets/music/overworld.mp3'
        // ]);

        // Sound effects in a audioSprite.
        // this.load.audioSprite('sfx', 'assets/audio/sfx.json', [
        //     'assets/audio/sfx.ogg',
        //     'assets/audio/sfx.mp3'
        // ], {
        //     instances: 4
        // });

        // this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

        // This json contain recorded gamep
        // this.load.json('attractMode', 'assets/json/attractMode.json');
    }

    create() {
        this._characterLoader.createAllCharacters();
        this._backgroundDataLoader.createAllStages();
    }
}

export default BootScene;
