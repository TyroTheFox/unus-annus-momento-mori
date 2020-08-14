import Stage from "../engine/Stage";
import MenuPanel from '../ui/MenuPanel';

class TitleScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'TitleScene'
        });

        this._titleBackdrop = null;

        this._playingBackgroundMusic = false;
    }
    preload() {
        // this.load.atlas('mario-sprites', 'assets/mario-sprites.png', 'assets/mario-sprites.json');
    }
    create() {
        this._titleBackdrop = new Stage( this, 'Spiral', 'spiral' );

        // let config = {
        //     key: 'title',
        //     frames: [{
        //         frame: 'title',
        //         key: 'mario-sprites'
        //     }]
        // };
        // this.anims.create(config);

        // this.title = this.add.sprite(this.sys.game.config.width / 2, 16 * 5);
        // this.title.play('title');
        // this.attractMode = this.scene.launch('GameScene');
        // console.log(this.attractMode.stop);

        this.scene.bringToTop();

        this.registry.set('restartScene', false);
        // this.registry.set('attractMode', true);

        let sh = this.game.config.height;
        let sw = this.game.config.width;

        this._gameLogo = this.add.sprite( sw * 0.5, sh * 0.3, 'titleLogo' );
        this._gameLogo.setScale( 2 );

        this._mainMenu = new MenuPanel(
            this,
            'button_Idle',
            sw * 0.5, sh * 0.9,
            {
                scale: {
                    x: 10,
                    y: 6
                },
                button: {
                    spriteIdle: 'button_Idle',
                    spriteOver: 'button_Over',
                    spriteDown: 'button_Down'
                }
            }
        );

        this._mainMenu.addButton(
            {
                scale: {
                    x: 8,
                    y: 3
                },
                text: {
                    text: 'Fight',
                    style: {
                        fontSize: '64px',
                        fontFamily: 'Arial',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: () => {
                    this.startGame();
                }
            }
        );

        // let ch = 0;
        // let cw = 0;
        // let multiplier = 1;
        // if (sh / sw > 0.6) {
        //     // Portrait, fit width
        //     multiplier = sw / 400;
        // } else {
        //     multiplier = sh / 240;
        // }
        // multiplier = Math.floor(multiplier);
        // let el = document.getElementsByTagName('canvas')[0];
        // el.style.width = 400 * multiplier + 'px';
        // el.style.height = 240 * multiplier + 'px';
        //
        // this.pressX = this.add.bitmapText(16 * 8 + 4, 8 * 16, 'font', 'PRESS X TO START', 8);
        // this.blink = 1000;
    }

    update(time, delta) {
        if (this.registry.get('restartScene')) {
            this.restartScene();
        }

        if ( !this._playingBackgroundMusic ) {
            this._titleBackdrop.playBGM();
            this._playingBackgroundMusic = true;
        }
        // this.blink -= delta;
        // if (this.blink < 0) {
        //     this.pressX.alpha = this.pressX.alpha === 1 ? 0 : 1;
        //     this.blink = 500;
        // }

        // if (!this.registry.get('attractMode')) {}
    }

    startGame() {
        // this.scene.stop('MenuScene');
        // this.registry.set('attractMode', false);
        this.scene.start('MenuScene');
    }

    restartScene() {
        //        this.attractMode.stop();
        this.scene.stop('FightScene');
        this.scene.launch('FightScene');
        this.scene.bringToTop();

        this.registry.set('restartScene', false);
    }
}

export default TitleScene;
