import Character from "../engine/Character";
import Stage from "../engine/Stage";
import HealthBar from "../ui/HealthBar";
import Button from '../ui/Button';
import MenuPanel from '../ui/MenuPanel';
import DieSprite from '../ui/DieSprite';

/**
 * @typedef {Object} FightScene#PlayerComponents
 * @property {string} characterName - Display name for character
 * @property {Character} character - Character object
 * @property {HealthBar} healthBar - Health Bar object
 * @property {CharacterDataLoader#CharacterManifestEntry} data - Character data
 */

/**
 * @typedef {Object} FightScene#PlayerCharacterData
 * @property {string} name - Display name of the character
 * @property {string} folderName - Folder name of the character where the character's assets are
 * @property {?Character#CharacterConfig} config - Configuration data for the character
 */

/**
 * @typedef {Object} FightScene#InitialiseData
 * @property {FightScene#PlayerCharacterData} player1 - PLayer 1 Data
 * @property {FightScene#PlayerCharacterData} player2 - PLayer 2 Data
 * @property {Stage#StageManifestData} stage - Stage data
 */

/**
 * Scene where Fights happen
 * @class FightScene
 * @extends Phaser.Scene
 */
class FightScene extends Phaser.Scene {
    /**
     * @constructor
     */
    constructor() {
        super({
            key: 'FightScene'
        });

        this._stage = null;
        this._stageData = null;

        /** @type {FightScene#PlayerComponents} */
        this._player1 = {
            characterName: null,
            character: null,
            healthBar: null,
            data: null
        };

        /** @type {FightScene#PlayerComponents} */
        this._player2 = {
            characterName: null,
            character: null,
            healthBar: null,
            data: null
        };

        this._damagePower = 1;
        this._critDamage = 5;

        this._textStyle = {
            fontSize: '50px',
            fontFamily: 'Poppins',
            color: '#fff',
            align: 'center'
        }

        this._textWithBackgroundStyle = {
            fontSize: '50px',
            fontFamily: 'Poppins',
            color: '#fff',
            backgroundColor: '#000',
            align: 'center'
        }

        this._playingBackgroundMusic = false;

        this._paused = false;
        this._buttonLock = false;
    }

    /**
     * Initialise the Scene with given data
     * @param {FightScene#InitialiseData} data - Data used to initialise the scene
     */
    init( data ) {
        this._player1.characterName = data.player1.name;
        this._player1.data = data.player1;

        this._player2.characterName = data.player2.name;
        this._player2.data = data.player2;

        /** @type {Stage#StageManifestData} */
        this._stageData = data.stage;

        if ( this._optionsData ) {
            this._damagePower = this._optionsData.damage;
            this._critDamage = this._optionsData.crit;
            if ( this._player1 && this._player1.healthBar ) {
                this._player1.healthBar.setMaximumValue( this._optionsData.HP );
            }

            if ( this._player2 && this._player2.healthBar ) {
                this._player2.healthBar.setMaximumValue( this._optionsData.HP );
            }
        }
    }

    create() {
        let sh = this.game.config.height;
        let sw = this.game.config.width;

        /**
         * @type {GameOptions}
         * @private
         */
        this._optionsData = this.registry.get( '__GameOptionsData' );
        this._damagePower = this._optionsData.damage;
        this._critDamage = this._optionsData.crit;

        /** @type {Stage} */
        this._stage = this._getStageObject( this._stageData );

        /** @type {DieSprite} */
        this._die1 = new DieSprite(
            this, 'dieSprite',
            ( sw * 0.5 ) - 200, sh * 0.9,
            {
                scale: 0.1,
                shakeCount: 5,
                shakeDistance: 10,
                textMoveDistance: 120,
                shakeUpTween: {
                    duration: 50,
                    ease: 'Power2'
                },
                shakeDownTween: {
                    duration: 10,
                    ease: 'Power2'
                },
                textUpTween: {
                    duration: 100,
                    ease: 'Power2'
                },
                textDownTween: {
                    duration: 20,
                    ease: 'Power2'
                },
                failedTween: {
                    y: sh * 1.1,
                    duration: 50,
                    ease: 'Power2'
                },
                style: {
                    ...this._textWithBackgroundStyle,
                    fontSize: '64px',
                    align: 'center'
                }
            }
        );

        /** @type {DieSprite} */
        this._die2 = new DieSprite(
            this,'dieSprite',
            ( sw * 0.5 ) + 200, sh * 0.9,
            {
                scale: 0.1,
                shakeCount: 5,
                shakeDistance: 10,
                textMoveDistance: 120,
                shakeUpTween: {
                    duration: 50,
                    ease: 'Power2'
                },
                shakeDownTween: {
                    duration: 10,
                    ease: 'Power2'
                },
                textUpTween: {
                    duration: 100,
                    ease: 'Power2'
                },
                textDownTween: {
                    duration: 20,
                    ease: 'Power2'
                },
                failedTween: {
                    y: sh * 1.1,
                    duration: 50,
                    ease: 'Power2'
                },
                style: {
                    ...this._textWithBackgroundStyle,
                    fontSize: '64px',
                    align: 'center'
                }
            }
        );

        /** @type {Stage#PlayerPositionData} */
        const playerPostions = this._stage.playerPositions;

        this._player1.character = this._getCharacterObject( this._player1.data );
        this._player2.character = this._getCharacterObject( this._player2.data );

        this._player1.character.emitterTarget = this._player2.character;
        this._player2.character.emitterTarget = this._player1.character;

        if ( playerPostions ) {
            this._player1.character.x = playerPostions[0].x;
            this._player1.character.y = playerPostions[0].y;

            if ( this._player1.character.config && this._player1.character.config.stageOffset ) {
                const offset = this._player1.character.config.stageOffset;

                if ( playerPostions[1].flip ) {
                    this._player1.character.x += offset.x || 0;
                } else {
                    this._player1.character.x -= offset.x || 0;
                }
                this._player1.character.y += offset.y || 0;
            }
            if ( playerPostions[0].flip ) {
                this._player1.character.setFlipX( playerPostions[0].flip );
            }

            this._player2.character.x = playerPostions[1].x;
            this._player2.character.y = playerPostions[1].y;

            if ( this._player2.character.config && this._player2.character.config.stageOffset ) {
                const offset = this._player2.character.config.stageOffset;

                if ( playerPostions[1].flip ) {
                    this._player2.character.x += offset.x || 0;
                } else {
                    this._player2.character.x -= offset.x || 0;
                }
                this._player2.character.y += offset.y || 0;
            }

            if ( playerPostions[1].flip ) {
                this._player2.character.setFlipX( playerPostions[1].flip );
            }
        }

        this._player1.healthBar = new HealthBar( this,
            this._player1.character.maxHP,
            {
                flip: false,
                x: 400,
                y: 100,
                scale: 0.5,
                characterName: this._player1.character.characterName,
                textStyle: {
                    ...this._textWithBackgroundStyle,
                    fontSize: '30px'
                }
            }
        );
        this._player2.healthBar = new HealthBar( this,
            this._player2.character.maxHP,
            {
                flip: true,
                invert: true,
                x: 1200,
                y: 100,
                scale: 0.5,
                characterName: this._player1.character.characterName,
                textStyle: {
                    ...this._textWithBackgroundStyle,
                    fontSize: '30px'
                }
            }
        );

        /** @type {Button} */
        this._attackButton = new Button(this, 'button_Idle', sw / 2, sh * 0.9, {
            scale: {
                x: 8,
                y: 3
            },
            spriteOver: 'button_Over',
            spriteDown: 'button_Down',
            text: {
                text: 'ATTACK',
                style: this._textStyle,
                colorOver: '#fff',
                colorDown: '#000'
            },
            callback: () => {
                this._attackButton.setVisible( false );
                this._playTurn();
            }
        } );

        /** @type {MenuPanel} */
        this._fightMenu = new MenuPanel(
            this,
            'button_Idle',
            sw * 0.5, sh * 0.5,
            {
                scale: {
                    x: 20,
                    y: 20
                },
                button: {
                    spriteIdle: 'button_Idle',
                    spriteOver: 'button_Over',
                    spriteDown: 'button_Down'
                }
            }
        );

        this._fightMenu.addButton(
            {
                scale: {
                    x: 17,
                    y: 3
                },
                text: {
                    text: 'REMATCH',
                    style: this._textStyle,
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                icon: 'swordIcon',
                callback: ( button ) => {
                    this._reset();
                }
            }
        );

        this._fightMenu.addButton(
            {
                scale: {
                    x: 17,
                    y: 3
                },
                text: {
                    text: 'CHARACTER SELECT',
                    style: this._textStyle,
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                icon: 'personIcon',
                callback: ( button ) => {
                    this.scene.stop( 'MenuScene' );
                    this.scene.start( 'MenuScene', { setToCharacterSelect: true } );
                }
            }
        );

        this._fightMenu.addButton(
            {
                scale: {
                    x: 17,
                    y: 3
                },
                text: {
                    text: 'RETURN TO MENU',
                    style: this._textStyle,
                    colorOver: '#fff',
                    colorDown: '#000'
                },
                icon: 'backIcon',
                callback: ( button ) => {
                    this._stage.stopBGM();
                    this.scene.stop('MenuScene');
                    this.scene.start('MenuScene');
                }
            }
        );

        this._fightMenu.setVisible( false );

        this._player1.character.playAnimation( 'idle' );
        this._player2.character.playAnimation( 'idle' );

        /** @type {Phaser.Input.Keyboard.Key} */
        this._pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        /** @type {Phaser.Input.Keyboard.Key} */
        this._attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    /**
     * Update the scene every tick
     * @param {number} time
     * @param {number} delta
     */
    update(time, delta) {
        if ( !this._playingBackgroundMusic ) {
            this._stage.playBGM();
            this._playingBackgroundMusic = true;
        }

        if ( this._player1.character.HP !== this._player1.healthBar.currentValue ) {
            this._player1.healthBar.setValue( this._player1.character.HP );
        }

        if ( this._player2.character.HP !== this._player2.healthBar.currentValue ) {
            this._player2.healthBar.setValue( this._player2.character.HP );
        }

        if ( this._pauseKey.isDown && !this._buttonLock ) {
            this._buttonLock = true;

            if ( this._paused ) {
                this._paused = false;
                this._fightMenu.setVisible( false );
                this._attackButton.setVisible( true );
            } else {
                this._paused = true;
                this._fightMenu.setVisible( true );
                this._attackButton.setVisible( false );
            }
        }

        if ( this._pauseKey.isUp ) {
            this._buttonLock = false;
        }

        if ( this._attackKey.isDown && this._attackButton.visible ) {
            this._attackButton.setVisible( false );
            this._playTurn();
        }
    }

    /**
     *
     * @param characterData
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

    /**
     * Simulates a die roll being made
     * @param {number} sides - Number of sides the die has
     * @returns {number}
     * @private
     */
    _makeDieRoll( sides ) {
        return Math.floor((Math.random() * sides) + 1);
    }

    /**
     * Plays out a round of the fight
     * @returns {Promise<void>}
     * @private
     */
    async _playTurn() {

        await this._die1.resetAfterDieFail();
        await this._die2.resetAfterDieFail();

        // Roll d20 Dice
        const player1Attack = this._makeDieRoll( 20 );
        const player2Attack = this._makeDieRoll( 20 );

        await this._die1.rollDieAnimation( player1Attack );
        await this._die2.rollDieAnimation( player2Attack );

        // Comparing the rolls given
        if ( player1Attack > player2Attack ) {
            await Promise.all( [
                this._die2.dieFailAnimation(),
                this._player1.character.playAnimationPromise( 'attack' ),
                this._player2.character.playAnimationPromise( 'damage' )
            ] );

            let damage = 0;
            if ( player1Attack >= 20 ) {
                damage = this._critDamage;
            } else {
                damage =  this._damagePower;
            }

            this._player2.character.addDamage( damage );
        } else if ( player1Attack < player2Attack ) {
            await Promise.all( [
                this._die1.dieFailAnimation(),
                this._player2.character.playAnimationPromise( 'attack' ),
                this._player1.character.playAnimationPromise( 'damage' )
            ] );

            let damage = 0;
            if ( player2Attack >= 20 ) {
                damage = this._critDamage;
            } else {
                damage =  this._damagePower;
            }

            this._player1.character.addDamage( damage );
        } else {
            await Promise.all( [
                this._die1.dieFailAnimation(),
                this._die2.dieFailAnimation(),
                this._player1.character.playAnimationPromise( 'attack', true ),
                this._player2.character.playAnimationPromise( 'attack', true )
            ] );
        }

        // Checks for player Death
        if ( this._player1.character.HP === 0 ) {
            await this._player1.character.playAnimationPromise( 'defeat' );
            await this._player2.character.playAnimationPromise( 'victory' );
        }

        if ( this._player2.character.HP === 0 ) {
            await this._player2.character.playAnimationPromise( 'defeat' );
            await this._player1.character.playAnimationPromise( 'victory' );
        }

        // If no players are dead, then reset for another round
        if ( this._player1.character.HP > 0 && this._player2.character.HP > 0 ) {
            await Promise.all( [
                this._player2.character.playAnimationPromise( 'idle' ),
                this._player1.character.playAnimationPromise( 'idle' )
            ] );
            this._attackButton.setVisible( true );
        } else {
            this._fightMenu.setVisible( true );
        }
    }

    /**
     * Resets the scene for once a game has concluded
     * @private
     */
    _reset() {
        this._stage.resetBGM();

        this._player1.healthBar.resetValue();
        this._player2.healthBar.resetValue();

        this._player1.character.resetHP();
        this._player2.character.resetHP();

        this._fightMenu.setVisible( false );

        this._player2.character.playAnimation( 'idle' );
        this._player1.character.playAnimation( 'idle' );

        this._die1.reset();
        this._die2.reset();

        this._attackButton.setVisible( true );
    }
}

export default FightScene;
