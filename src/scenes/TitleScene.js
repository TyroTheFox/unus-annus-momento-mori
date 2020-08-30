import Stage from "../engine/Stage";
import MenuPanel from '../ui/MenuPanel';

/**
 * The Opening Title Screen
 * @class TitleScene
 * @extends {Phaser.Scene}
 */
class TitleScene extends Phaser.Scene {
    /**
     * @constructor
     */
    constructor() {
        super( {
            key: 'TitleScene'
        } );

        /** @type {Stage} */
        this._titleBackdrop = null;

        /** @type {boolean} */
        this._playingBackgroundMusic = false;
    }

    /**
     * Creates all objects needed for the scene
     */
    create() {
        this._titleBackdrop = new Stage( this, 'Spiral', 'spiral' );

        this.scene.bringToTop();

        this.registry.set('restartScene', false);

        let sh = this.game.config.height;
        let sw = this.game.config.width;

        /** @type {Phaser.GameObjects.Sprite} */
        this._gameLogo = this.add.sprite( sw * 0.5, sh * 0.3, 'titleLogo' );
        this._gameLogo.setScale( 2 );

        /** @type {MenuPanel} */
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

    /**
     * Update the scene every tick
     * @param {number} time
     * @param {number} delta
     */
    update(time, delta) {
        if (this.registry.get('restartScene')) {
            this.restartScene();
        }

        if ( !this._playingBackgroundMusic ) {
            this._titleBackdrop.playBGM();
            this._playingBackgroundMusic = true;
        }
    }

    /**
     * Starts the game and moves to the main menu
     */
    startGame() {
        this.scene.start('MenuScene');
    }

    /**
     * Restarts the scene
     */
    restartScene() {
        this.scene.stop('FightScene');
        this.scene.launch('FightScene');
        this.scene.bringToTop();

        this.registry.set('restartScene', false);
    }
}

export default TitleScene;
