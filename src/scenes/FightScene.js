import Character from "../engine/Character";
import * as characterData from '../../assets/characterManifest.json';
import Stage from "../engine/Stage";
import HealthBar from "../ui/HealthBar";
import Button from '../ui/Button';

class FightScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'FightScene'
        });

        this._characterList = {};

        this._stage = {
            stageName: null,
            stage: null
        };

        this._player1 = {
            characterName: null,
            character: null,
            healthBar: null,
            rollText: null
        };

        this._player2 = {
            characterName: null,
            character: null,
            healthBar: null,
            rollText: null
        };

        this._damagePower = 1;
    }

    preload() {
        // this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    }

    create() {
        let sh = this.game.config.height;
        let sw = this.game.config.width;

        const style = {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#fff',
            align: 'center'
        }

        this._stage = this._getStageObject( {
            name: 'SpiralArena'
        } );

        const playerPostions = this._stage.playerPositions;

        this._player1.characterName = 'annus';
        this._player1.character = this._getCharacterObject( characterData.default[0] );

        this._player2.characterName = 'annus';
        this._player2.character = this._getCharacterObject( characterData.default[0] );

        if ( playerPostions ) {
            this._player1.character.x = playerPostions[0].x;
            this._player1.character.y = playerPostions[0].y;
            if ( playerPostions[0].flip ) {
                this._player1.character.setFlipX( playerPostions[0].flip );
            }

            this._player2.character.x = playerPostions[1].x;
            this._player2.character.y = playerPostions[1].y;
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
                scale: 0.5
            }
        );
        this._player2.healthBar = new HealthBar( this,
            this._player2.character.maxHP,
            {
                flip: true,
                invert: true,
                x: 1200,
                y: 100,
                scale: 0.5
            }
        );

        this._player1.rollText = this.add.text( sw * 0.3, sh * 0.9, '', style );
        this._player2.rollText = this.add.text( sw * 0.65, sh * 0.9, '', style );

        this._attackButton = new Button(this, 'button_Idle', sw / 2, sh * 0.9, {
            scale: {
                x: 8,
                y: 3
            },
            spriteOver: 'button_Over',
            spriteDown: 'button_Down',
            text: {
                text: 'Attack',
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
                context._attackButton.setVisible( false );
                context._playTurn( context );
            }
        } );

        this._player1.character.playIdle();
        this._player2.character.playIdle();
    }

    update(time, delta) {
        if ( this._player1.character.HP !== this._player1.healthBar.currentValue ) {
            this._player1.healthBar.setValue( this._player1.character.HP );
        }

        if ( this._player2.character.HP !== this._player2.healthBar.currentValue ) {
            this._player2.healthBar.setValue( this._player2.character.HP );
        }
    }

    _getCharacterObject( characterData ) {
        return new Character( this, 100, 100, characterData.name, characterData.folderName );
    }

    _getStageObject( stageData ) {
        return new Stage( this, stageData.name, stageData.folderName );
    }

    _makeDieRoll( sides ) {
        return Math.floor((Math.random() * sides) + 1);
    }

    async _playTurn( context ) {
        const player1Atack = context._makeDieRoll( 20 );
        const player2Atack = context._makeDieRoll( 20 );

        context._player1.rollText.text = player1Atack;
        context._player2.rollText.text = player2Atack;

        if ( player1Atack > player2Atack ) {
            await context._player1.character.playAttackPromise();
            context._player2.character.addDamage( context._damagePower );
        } else if ( player1Atack < player2Atack ) {
            await context._player2.character.playAttackPromise();
            context._player1.character.addDamage( context._damagePower );
        } else {
            await Promise.all( [
                context._player1.character.playAttackPromise(),
                context._player2.character.playAttackPromise()
            ] );
        }

        if ( context._player1.character.HP === 0 ) {
            await Promise.all( [
                context._player1.character.playDefeatPromise(),
                context._player2.character.playVictoryPromise()
            ] );
        }

        if ( context._player2.character.HP === 0 ) {
            await Promise.all( [
                context._player2.character.playDefeatPromise(),
                context._player1.character.playVictoryPromise()
            ] );
        }

        if ( context._player1.character.HP > 0 && context._player2.character.HP > 0 ) {
            context._attackButton.setVisible( true );
        }
    }
}

export default FightScene;
