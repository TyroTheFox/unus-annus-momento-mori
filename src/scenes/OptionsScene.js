import Character from "../engine/Character";
import * as characterData from '../../assets/characterManifest.json';
import MenuPanel from '../ui/MenuPanel';
import Stage from '../engine/Stage';
import Button from '../ui/Button';

class OptionsScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'OptionsScene'
        });
    }

    preload() {

    }

    create() {
        let sh = this.game.config.height;
        let sw = this.game.config.width;

        this._titleBackdrop = new Stage( this, 'Spiral', 'spiral' );

        // BACK BUTTON
        this._backButton = new Button(
            this,
            'button_Idle',
            100, sh * 0.1,
            {
                scale: {
                    x: 5,
                    y: 2
                },
                spriteOver: 'button_Over',
                spriteDown: 'button_Down',
                text: {
                    text: "Back",
                    style: {
                        fontSize: '30px',
                        fontFamily: 'Arial',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: ( button, additionalData ) => {
                    this.scene.stop( 'MenuScene' );
                    this.scene.start( 'MenuScene', { setToCharacterSelect: false } );
                }
            }
        );

        this._backButton.setDepth( 10 );
        this._backButton.text.setDepth( 11 );

        // MAIN MENU
        this._mainMenu = new MenuPanel(
            this,
            'button_Idle',
            sw * 0.5, sh * 0.6,
            {
                scale: {
                    x: 20,
                    y: 10
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
                    text: 'Something',
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
                    text: 'Something Else',
                    style: {
                        fontSize: '64px',
                        fontFamily: 'Arial',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                }
            }
        );
        // MAIN MENU
    }

    update( time, delta ) {
    }
}

export default OptionsScene;
