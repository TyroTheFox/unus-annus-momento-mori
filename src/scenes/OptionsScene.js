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

        this._optionsKey = '__GameOptionsData';
        this._optionsDefaultKey = '__GameOptionsDefaultData';
    }

    init() {
        this._optionsData = this.registry.get( this._optionsKey );
    }

    preload() {

    }

    create() {
        this._optionsData = this.registry.get( this._optionsKey );
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
            sw * 0.5, sh * 0.5,
            {
                scale: {
                    x: 30,
                    y: 25
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
                    x: 20,
                    y: 3
                },
                text: {
                    text: `Music Volume: ${this._optionsData.musicVolume * 100}%`,
                    style: {
                        fontSize: '64px',
                        fontFamily: 'Arial',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: ( button ) => {
                    if ( this._optionsData.musicVolume < 1 ) {
                        this._optionsData.musicVolume += 0.25;
                    } else {
                        this._optionsData.musicVolume = 0;
                    }

                    this.registry.set( this._optionsKey, this._optionsData );

                    button.text.text = `Music Volume: ${this._optionsData.musicVolume * 100}%`;
                }
            }
        );

        this._mainMenu.addButton(
            {
                scale: {
                    x: 20,
                    y: 3
                },
                text: {
                    text: `SFX Volume: ${this._optionsData.sfxVolume * 100}%`,
                    style: {
                        fontSize: '64px',
                        fontFamily: 'Arial',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: ( button ) => {
                    if ( this._optionsData.sfxVolume < 1 ) {
                        this._optionsData.sfxVolume += 0.25;
                    } else {
                        this._optionsData.sfxVolume = 0;
                    }

                    this.registry.set( this._optionsKey, this._optionsData );

                    button.text.text = `SFX Volume: ${this._optionsData.sfxVolume * 100}%`;
                }
            }
        );

        this._hp = this._mainMenu.addButton(
            {
                scale: {
                    x: 20,
                    y: 3
                },
                text: {
                    text: `Max HP: ${this._optionsData.HP}`,
                    style: {
                        fontSize: '64px',
                        fontFamily: 'Arial',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: ( button ) => {
                    if ( this._optionsData.HP < 20 ) {
                        this._optionsData.HP += 5;
                    } else {
                        this._optionsData.HP = 5;
                    }

                    this.registry.set( this._optionsKey, this._optionsData );

                    button.text.text = `Max HP: ${this._optionsData.HP}`;
                }
            }
        );

        this._damage = this._mainMenu.addButton(
            {
                scale: {
                    x: 20,
                    y: 3
                },
                text: {
                    text: `Attack Damage: ${this._optionsData.damage}`,
                    style: {
                        fontSize: '64px',
                        fontFamily: 'Arial',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: ( button ) => {
                    if ( this._optionsData.damage < 20 ) {
                        if ( this._optionsData.damage === 1 ) {
                            this._optionsData.damage += 4;
                        } else {
                            this._optionsData.damage += 5;
                        }
                    } else {
                        this._optionsData.damage = 1;
                    }

                    this.registry.set( this._optionsKey, this._optionsData );

                    button.text.text = `Attack Damage: ${this._optionsData.damage}`;
                }
            }
        );

        this._crit = this._mainMenu.addButton(
            {
                scale: {
                    x: 20,
                    y: 3
                },
                text: {
                    text: `Crit Damage: ${this._optionsData.crit}`,
                    style: {
                        fontSize: '64px',
                        fontFamily: 'Arial',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: ( button ) => {
                    if ( this._optionsData.crit < 20 ) {
                        if ( this._optionsData.crit === 1 ) {
                            this._optionsData.crit += 4;
                        } else {
                            this._optionsData.crit += 5;
                        }
                    } else {
                        this._optionsData.crit = 1;
                    }

                    this.registry.set( this._optionsKey, this._optionsData );

                    button.text.text = `Crit Damage: ${this._optionsData.crit}`;
                }
            }
        );

        this._mainMenu.addButton(
            {
                scale: {
                    x: 20,
                    y: 3
                },
                text: {
                    text: `Reset Fights To Defaults`,
                    style: {
                        fontSize: '64px',
                        fontFamily: 'Arial',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: ( button ) => {
                    const optionsDefaultData = this.registry.get( this._optionsDefaultKey );
                    this.registry.set( this._optionsKey, {
                        ...this._optionsData,
                        ...optionsDefaultData
                    } );

                    this._optionsData = this.registry.get( this._optionsKey );

                    this._hp.text.text = `Max HP: ${optionsDefaultData.HP}`;
                    this._damage.text.text = `Attack Damage: ${optionsDefaultData.damage}`;
                    this._crit.text.text = `Crit Damage: ${optionsDefaultData.crit}`;
                }
            }
        );
        // MAIN MENU
    }

    update( time, delta ) {
    }
}

export default OptionsScene;
