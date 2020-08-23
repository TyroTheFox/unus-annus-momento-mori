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

    create() {
        this._titleBackdrop = new Stage( this, 'Spiral', 'spiral' );

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
                    text: 'START',
                    style: {
                        fontSize: '64px',
                        fontFamily: 'Poppins',
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
    }

    update(time, delta) {
        if (this.registry.get('restartScene')) {
            this.restartScene();
        }

        if ( !this._playingBackgroundMusic ) {
            this._titleBackdrop.playBGM();
            this._playingBackgroundMusic = true;
        }
    }

    startGame() {
        this.scene.start('MenuScene');
    }

    restartScene() {
        this.scene.stop('FightScene');
        this.scene.launch('FightScene');
        this.scene.bringToTop();

        this.registry.set('restartScene', false);
    }
}

export default TitleScene;
