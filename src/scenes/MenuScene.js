import * as characterData from '../../assets/characterManifest.json';
import * as stageManifestData from '../../assets/backgroundManifest.json'

import Character from "../engine/Character";
import MenuPanel from '../ui/MenuPanel';
import Stage from '../engine/Stage';
import Button from '../ui/Button';

/**
 * @typedef {Object} MenuScene#InitialiseData
 * @property {boolean} setToCharacterSelect - Whether or not to jump to the Character Select menu
 */

/**
 * Scene containing the game menus
 * @class MenuScene
 * @extends Phaser.Scene
 */
class MenuScene extends Phaser.Scene {
    /**
     * @constructor
     */
    constructor() {
        super({
            key: 'MenuScene'
        });

        /** @type {Character} */
        this._player1 = null;
        /** @type {Character} */
        this._player2 = null;

        this._player1Select = true;

        /** @type {Stage#StageManifestData} */
        this._chosenStage = null;
        /** @type {Stage} */
        this._stagePreview = null;

        this._skipToCharacterSelect = false;

        /** @type {Phaser.GameObjects.TextStyle} */
        this._textStyle = {
            fontSize: '50px',
            fontFamily: 'Poppins',
            color: '#fff',
            align: 'center'
        }

        /** @type {Array.<string>} */
        this._creditTexts = [
            "BUILT BY TYRO THE FOX",
            "ORIGINAL SOFTWARE: GENERIC PLATFORMER AND PHASER BOOTSTRAP PROJECT - NICKLAS BERG",
            "MUSIC: UNUS ANNUS JAZZ REMIX - LESLIE WAI",
            "MUSIC: SWINGJEDING - ROCCOW",
            "LOGO ON RING FLOOR: U/RAZZLEFOX FROM UNUS ANNUS SUBREDDIT",
            "BUILT IN PHASER 3",
            "VISIT EVERYPONY.COM FOR MORE FROM TYRO THE FOX"
        ]

        this._displayCredit = true;
        this._creditIndex = 0;

        /** @type {Array.<Stage#StageManifestData>} */
        this._stageManifestData = stageManifestData.default;

        /** @type {CharacterDataLoader#CharacterManifestData} */
        this._characterManifestData = characterData.default;
    }

    /**
     * Initialise the Stage
     * @param {MenuScene#InitialiseData} data - Data used to initialise this scene
     */
    init( data ) {
        if ( data.setToCharacterSelect ) {
            this._skipToCharacterSelect = true;
        } else {
            this._skipToCharacterSelect = false;
        }

        if ( this._titleBackdrop ) {
            this._titleBackdrop.playBGM( 500 );
        }
        this._displayCredit = true;
    }

    /**
     * Creates scene required assets
     */
    create() {
        let sh = this.game.config.height;
        let sw = this.game.config.width;

        /** @type {{x: number, y: number}} */
        this._player1SpritePosition = {
            x: sw * 0.2,
            y: sh * 0.5
        }

        /** @type {{x: number, y: number}} */
        this._player2SpritePosition = {
            x: sw * 0.8,
            y: sh * 0.5
        }

        /** @type {{x: number, y: number}} */
        this._currentlySelectingPlayer = this._player1SpritePosition;

        /** @type {Stage} */
        this._titleBackdrop = new Stage( this, 'Spiral', 'spiral' );

        // BACK BUTTON
        /** @type {Button} */
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
                    text: "BACK",
                    style: {
                        fontSize: '30px',
                        fontFamily: 'Poppins',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: ( button, additionalData ) => {
                    if ( this._chosenStage ) {
                        this._resetToStageSelect();
                    } else if ( this._player2 ) {
                        this._resetToPlayer2Select();
                    } else if ( this._player1 ) {
                        this._resetToPlayer1Select();
                    }  else {
                        this._reset();
                    }
                }
            }
        );

        this._backButton.setVisible( false );
        this._backButton.setDepth( 10 );
        this._backButton.text.setDepth( 11 );

        /** @type {Phaser.GameObjects.Sprite} */
        this._gameLogo = this.add.sprite( sw * 0.5, sh * 0.1, 'titleLogo' );

        // MAIN MENU
        /** @type {MenuPanel} */
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
                    x: 15,
                    y: 3
                },
                text: {
                    text: 'FIGHT',
                    style: this._textStyle,
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: () => {
                    this._mainMenu.setVisible( false );
                    this._characterMenu.setVisible( true );
                    this._backButton.setVisible( true );
                    this._creditText.visible = false;
                }
            }
        );

        this._mainMenu.addButton(
            {
                scale: {
                    x: 15,
                    y: 3
                },
                text: {
                    text: 'OPTIONS',
                    style: this._textStyle,
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: () => {
                    this.scene.stop( 'OptionsScene' );
                    this.scene.start( 'OptionsScene' );
                    this._creditText.visible = false;
                }
            }
        );
        // MAIN MENU

        // CHARACTER SELECT
        /** @type {MenuPanel} */
        this._characterMenu = new MenuPanel(
            this,
            'button_Idle',
            sw * 0.5, sh * 0.6,
            {
                scale: {
                    x: 40,
                    y: 30
                },
                button: {
                    spriteIdle: 'button_Idle',
                    spriteOver: 'button_Over',
                    spriteDown: 'button_Down'
                },
                mask: {
                    scale: {
                        x: 1,
                        y: 0.75
                    },
                    offset: {
                        x: 0,
                        y: 50
                    }
                }
            }
        );

        this._characterManifestData.forEach( ( character ) => {
            this._characterMenu.addButton(
                {
                    scale: {
                        x: 25,
                        y: 3
                    },
                    text: {
                        text: character.name,
                        style: this._textStyle,
                        colorOver: '#fff',
                        colorDown: '#000'
                    },
                    additionalData: {
                        characterData: character
                    },
                    callback: ( button, additionalData ) => {
                        if ( additionalData && additionalData.characterData ) {
                            if ( this._player1Select ) {
                                this._player1 = this._getCharacterObject( additionalData.characterData );
                                this._player1.x = this._currentlySelectingPlayer.x;
                                this._player1.y = this._currentlySelectingPlayer.y;
                                this._player1.setFlipX( true );
                                this._currentlySelectingPlayer = this._player2SpritePosition;
                                this._player1Select = false;
                            } else {
                                this._player2 = this._getCharacterObject( additionalData.characterData );
                                this._player2.x = this._currentlySelectingPlayer.x;
                                this._player2.y = this._currentlySelectingPlayer.y;
                            }

                            if ( this._player2 ) {
                                this._characterMenu.setVisible( false );
                                this._stageMenu.setVisible( true );
                            }
                        }
                    }
                }
            );
        } );

        this._upButton = this._characterMenu.addMenuControlButton(
            {
                scale: {
                    x: 5,
                    y: 2
                },
                offset: {
                    x: 400,
                    y: -50
                },
                text: {
                    text: "UP",
                    style: {
                        fontSize: '30px',
                        fontFamily: 'Poppins',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                }
            }
        );

        this._downButton = this._characterMenu.addMenuControlButton(
            {
                scale: {
                    x: 5,
                    y: 2
                },
                offset: {
                    x: 400,
                    y: 50
                },
                text: {
                    text: "DOWN",
                    style: {
                        fontSize: '30px',
                        fontFamily: 'Poppins',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                }
            }
        );

        this._characterMenu.setVisible( false );
        // CHARACTER SELECT

        // CONFIRM MENU
        /** @type {MenuPanel} */
        this._confirmMenu = new MenuPanel(
            this,
            'button_Idle',
            sw * 0.5, sh * 0.6,
            {
                scale: {
                    x: 20,
                    y: 30
                },
                button: {
                    spriteIdle: 'button_Idle',
                    spriteOver: 'button_Over',
                    spriteDown: 'button_Down'
                }
            }
        );

        this._confirmMenu.addButton(
            {
                scale: {
                    x: 17,
                    y: 3
                },
                text: {
                    text: "CONFIRM FIGHTERS",
                    style: this._textStyle,
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: ( button, additionalData ) => {
                    this.scene.stop('FightScene');
                    this.scene.start('FightScene', {
                        player1: {
                            name: this._player1.characterName,
                            folderName: this._player1.folderName,
                            config: this._player1.config || null
                        },
                        player2: {
                            name: this._player2.characterName,
                            folderName: this._player2.folderName,
                            config: this._player2.config || null
                        },
                        stage: this._chosenStage
                    } );
                }
            }
        );

        this._confirmMenu.addButton(
            {
                scale: {
                    x: 17,
                    y: 3
                },
                text: {
                    text: "MAIN MENU",
                    style: this._textStyle,
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: ( button, additionalData ) => {
                    this._reset();
                }
            }
        );

        this._confirmMenu.setVisible( false );
        // CONFIRM MENU

        // STAGE MENU
        /** @type {MenuPanel} */
        this._stageMenu = new MenuPanel(
            this,
            'button_Idle',
            sw * 0.5, sh * 0.6,
            {
                scale: {
                    x: 40,
                    y: 30
                },
                button: {
                    spriteIdle: 'button_Idle',
                    spriteOver: 'button_Over',
                    spriteDown: 'button_Down'
                },
                mask: {
                    scale: {
                        x: 1,
                        y: 0.75
                    },
                    offset: {
                        x: 0,
                        y: 50
                    }
                }
            }
        );

        /** @type {Array.<Stage#StageManifestData>} */
        this._stageManifestData.forEach( ( stage ) => {
            if ( stage.type === 'stage' ) {
                this._stageMenu.addButton(
                    {
                        scale: {
                            x: 25,
                            y: 3
                        },
                        text: {
                            text: stage.name,
                            style: this._textStyle,
                            colorOver: '#fff',
                            colorDown: '#000'
                        },
                        additionalData: {
                            stageData: stage
                        },
                        callback: (button, additionalData) => {
                            if (additionalData && additionalData.stageData) {
                                this._chosenStage = additionalData.stageData;
                                this._stageMenu.setVisible(false);
                                this._confirmMenu.setVisible(true);
                                this._stagePreview = this._getStageObject( this._chosenStage );
                                this._stagePreview.setStageZIndex( -1 );
                                this._titleBackdrop.setVisible( false );
                            }
                        }
                    }
                );
            }
        } );


        this._stageUpButton = this._stageMenu.addMenuControlButton(
            {
                scale: {
                    x: 5,
                    y: 2
                },
                offset: {
                    x: 400,
                    y: -50
                },
                text: {
                    text: "UP",
                    style: {
                        fontSize: '30px',
                        fontFamily: 'Poppins',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                }
            }
        );

        this._stageDownButton = this._stageMenu.addMenuControlButton(
            {
                scale: {
                    x: 5,
                    y: 2
                },
                offset: {
                    x: 400,
                    y: 50
                },
                text: {
                    text: "DOWN",
                    style: {
                        fontSize: '30px',
                        fontFamily: 'Poppins',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                }
            }
        );

        this._stageMenu.setVisible( false );
        // STAGE MENU

        /** @type {Phaser.GameObjects.Text} */
        this._creditText = this.add.text( sw * 0.05, sh * 0.95, this._creditTexts[0], {
            fontSize: '30px',
            fontFamily: 'Poppins',
            color: '#fff',
            align: 'left',
            backgroundColor: '#000'
        } );

        if ( this._skipToCharacterSelect ) {
            this._setToCharacterSelect();
        } else {
            this._reset();
        }

        if ( this._characterMenu.buttonCount <= 5 ) {
            this._characterMenu.turnOffControls = false;
        }

        if ( this._stageMenu.buttonCount <= 5 ) {
            this._stageMenu.turnOffControls = false;
        }
    }

    /**
     * Updates the scene every tick
     * @param {number} time
     * @param {number} delta
     */
    update( time, delta ) {
        if ( this._characterMenu.visible ) {
            if ( this._upButton.state === 'down' ) {
                this._characterMenu.moveButtonContainerUp( 10 );
            }

            if ( this._downButton.state === 'down' ) {
                this._characterMenu.moveButtonContainerDown( 10 );
            }
        }

        if ( this._stageMenu.visible ) {
            if ( this._stageUpButton.state === 'down' ) {
                this._stageMenu.moveButtonContainerUp( 10 );
            }

            if ( this._stageDownButton.state === 'down' ) {
                this._stageMenu.moveButtonContainerDown( 10 );
            }
        }

        if ( this._displayCredit ) {
            this._displayCredit = false;
            this.time.delayedCall( 3000, () => {
                if ( this._creditIndex >= this._creditTexts.length ) {
                    this._creditIndex = 0;
                } else {
                    this._creditIndex++;
                }
                this._creditText.setText( this._creditTexts[this._creditIndex] );
                this._displayCredit = true;
            }, [], this);
        }
    }

    /**
     * Resets the scene back to the main menu
     * @private
     */
    _reset() {
        this._player1Select = true;

        this._mainMenu.setVisible( true );
        this._backButton.setVisible( false );
        this._characterMenu.setVisible( false );
        this._stageMenu.setVisible( false );
        this._confirmMenu.setVisible( false );

        if ( this._player1 ) {
            this._player1.destroy();
        }

        if ( this._player2 ) {
            this._player2.destroy();
        }

        if ( this._stagePreview ) {
            this._stagePreview.cleanUp();
            delete this._stagePreview;
        }

        this._titleBackdrop.setVisible( true );

        this._currentlySelectingPlayer = this._player1SpritePosition;

        this._player1 = null;
        this._player2 = null;
        this._chosenStage = null;
        this._creditText.visible = true;
    }

    /**
     * Sets the menu to the Character Select
     * @private
     */
    _setToCharacterSelect() {
        this._player1 = null;
        this._player2 = null;
        this._player1Select = true;
        this._chosenStage = null;
        this._currentlySelectingPlayer = this._player1SpritePosition;

        this._mainMenu.setVisible( false );
        this._characterMenu.setVisible( true );
        this._stageMenu.setVisible( false );
        this._backButton.setVisible( true );
    }

    /**
     * Sets the menu to the Stage Select
     * @private
     */
    _resetToStageSelect() {
        if ( this._stagePreview ) {
            this._stagePreview.cleanUp();
            delete this._stagePreview;
        }

        this._titleBackdrop.setVisible( true );

        this._chosenStage = null;
        this._confirmMenu.setVisible( false );
        this._stageMenu.setVisible( true );
    }

    /**
     * Set to Player2 select
     * @private
     */
    _resetToPlayer2Select() {
        this._player2.destroy();
        this._player2 = null;
        this._stageMenu.setVisible( false );
        this._characterMenu.setVisible( true );
        this._player1Select = false;
        this._currentlySelectingPlayer = this._player2SpritePosition;
    }

    /**
     * Set to Player 1 select
     * @private
     */
    _resetToPlayer1Select() {
        this._currentlySelectingPlayer = this._player1SpritePosition;
        this._player1Select = true;
        this._player1.destroy();
        this._player1 = null;
    }

    /**
     * Generate a Character Object based on data
     * @param {CharacterDataLoader#CharacterManifestEntry} characterData - Data that modifies the character
     * @returns {Character}
     * @private
     */
    _getCharacterObject( characterData ) {
        return new Character( this, 100, 100, characterData.name, characterData.folderName, characterData.config || null );
    }

    /**
     * Generate a Stage Object based on data
     * @param {Stage#StageManifestData} stageData
     * @returns {Stage}
     * @private
     */
    _getStageObject( stageData ) {
        return new Stage( this, stageData.name, stageData.folderName );
    }
}

export default MenuScene;
