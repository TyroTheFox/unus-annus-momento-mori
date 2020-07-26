import Character from "../engine/Character";
import * as characterData from '../../assets/characterManifest.json';
import MenuPanel from '../ui/MenuPanel';
import Stage from '../engine/Stage';
// import Button from '../ui/Button';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MenuScene'
        });

        this._characterList = [];
    }

    preload() {

    }

    create() {
        let sh = this.game.config.height;
        let sw = this.game.config.width;

        this._titleBackdrop = new Stage( this, 'Spiral', 'spiral' );

        characterData.default.forEach( ( character ) => {
            this._characterList.push( this._getCharacterObject( character ) );
        } );

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

        this._gameLogo = this.add.sprite( sw * 0.5, sh * 0.1, 'titleLogo' );

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
                callback: ( context ) => {
                    context.scene.stop('FightScene');
                    context.scene.start('FightScene');
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
                    text: 'Option',
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
    }

    update( time, delta ) {

    }

    _getCharacterObject( characterData ) {
        return new Character( this, 100, 100, characterData.name, characterData.folderName );
    }
}

export default MenuScene;
