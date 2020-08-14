import * as characterData from '../../assets/characterManifest.json';
import * as backgroundManifest from '../../assets/backgroundManifest.json'

import Character from "../engine/Character";
import MenuPanel from '../ui/MenuPanel';
import Stage from '../engine/Stage';
import Button from '../ui/Button';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MenuScene'
        });

        this._player1 = null;
        this._player2 = null;

        this._player1Select = true;

        this._chosenStage = null;
        this._stagePreview = null;

        this._skipToCharacterSelect = false;
    }

    init( data ) {
        if ( data.setToCharacterSelect ) {
            this._skipToCharacterSelect = true;
        } else {
            this._skipToCharacterSelect = false;
        }
    }

    preload() {

    }

    create() {
        let sh = this.game.config.height;
        let sw = this.game.config.width;

        this._player1SpritePosition = {
            x: sw * 0.2,
            y: sh * 0.5
        }

        this._player2SpritePosition = {
            x: sw * 0.8,
            y: sh * 0.5
        }

        this._currentlySelectingPlayer = this._player1SpritePosition;

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

        this._gameLogo = this.add.sprite( sw * 0.5, sh * 0.1, 'titleLogo' );

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
                    this._mainMenu.setVisible( false );
                    this._characterMenu.setVisible( true );
                    this._backButton.setVisible( true );
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
                },
                callback: () => {
                    this.scene.stop( 'OptionsScene' );
                    this.scene.start( 'OptionsScene' );
                }
            }
        );
        // MAIN MENU

        // CHARACTER SELECT
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

        characterData.default.forEach( ( character ) => {
            this._characterMenu.addButton(
                {
                    scale: {
                        x: 10,
                        y: 3
                    },
                    text: {
                        text: character.name,
                        style: {
                            fontSize: '60px',
                            fontFamily: 'Arial',
                            color: '#fff',
                            align: 'center'
                        },
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
                    text: "Up",
                    style: {
                        fontSize: '30px',
                        fontFamily: 'Arial',
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
                    text: "Down",
                    style: {
                        fontSize: '30px',
                        fontFamily: 'Arial',
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
                    x: 10,
                    y: 3
                },
                text: {
                    text: "Confirm Fighters",
                    style: {
                        fontSize: '60px',
                        fontFamily: 'Arial',
                        color: '#fff',
                        align: 'center'
                    },
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                callback: ( button, additionalData ) => {
                    this.scene.stop('FightScene');
                    this.scene.start('FightScene', {
                        player1: {
                            name: this._player1.characterName,
                            folderName: this._player1.folderName
                        },
                        player2: {
                            name: this._player2.characterName,
                            folderName: this._player2.folderName
                        },
                        stage: this._chosenStage
                    } );
                }
            }
        );

        this._confirmMenu.addButton(
            {
                scale: {
                    x: 10,
                    y: 3
                },
                text: {
                    text: "Main Menu",
                    style: {
                        fontSize: '60px',
                        fontFamily: 'Arial',
                        color: '#fff',
                        align: 'center'
                    },
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

        backgroundManifest.default.forEach( ( stage ) => {
            if ( stage.type === 'stage' ) {
                this._stageMenu.addButton(
                    {
                        scale: {
                            x: 10,
                            y: 3
                        },
                        text: {
                            text: stage.name,
                            style: {
                                fontSize: '60px',
                                fontFamily: 'Arial',
                                color: '#fff',
                                align: 'center'
                            },
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
                    text: "Up",
                    style: {
                        fontSize: '30px',
                        fontFamily: 'Arial',
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
                    text: "Down",
                    style: {
                        fontSize: '30px',
                        fontFamily: 'Arial',
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

        if ( this._skipToCharacterSelect ) {
            this._setToCharacterSelect();
        }

        if ( this._characterMenu.buttonCount <= 5 ) {
            this._characterMenu.turnOffControls = false;
        }

        if ( this._stageMenu.buttonCount <= 5 ) {
            this._stageMenu.turnOffControls = false;
        }
    }

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
    }

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
    }

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

    _resetToPlayer2Select() {
        this._player2.destroy();
        this._player2 = null;
        this._stageMenu.setVisible( false );
        this._characterMenu.setVisible( true );
        this._player1Select = false;
        this._currentlySelectingPlayer = this._player2SpritePosition;
    }

    _resetToPlayer1Select() {
        this._currentlySelectingPlayer = this._player1SpritePosition;
        this._player1Select = true;
        this._player1.destroy();
        this._player1 = null;
    }

    _getCharacterObject( characterData ) {
        return new Character( this, 100, 100, characterData.name, characterData.folderName );
    }

    _getStageObject( stageData ) {
        return new Stage( this, stageData.name, stageData.folderName );
    }
}

export default MenuScene;
