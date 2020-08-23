import WebFont from 'webfontloader';

import * as soundsData from '../../assets/soundManifest.json';
import * as particleData from '../../assets/particleManifest.json';

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

        particleData.default.forEach( ( emitter ) => {
            if ( emitter.particles.type === 'texture' ) {
                this.load.image( emitter.name, `assets/emitter/${emitter.particles.path}` );
            } else if ( emitter.particles.type === 'atlas') {
                this.load.atlas( emitter.name,
                    `assets/emitter/${emitter.particles.path}`, `assets/emitter/${emitter.particles.json}`);
            }
        } );
    }

    create() {
        this._characterLoader.createAllCharacters();
        this._backgroundDataLoader.createAllStages();
    }
}

export default BootScene;
