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
            healthBar: null
        };

        this._player2 = {
            characterName: null,
            character: null,
            healthBar: null
        };
    }

    preload() {
        // this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    }

    create() {
        let sh = this.game.config.height;
        let sw = this.game.config.width;

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
            }
        } );

        this._player1.character.playIdle();
        this._player2.character.playIdle();
    }

    _getCharacterObject( characterData ) {
        return new Character( this, 100, 100, characterData.name, characterData.folderName );
    }

    _getStageObject( stageData ) {
        return new Stage( this, stageData.name, stageData.folderName );
    }

    update(time, delta) {
    }
}

export default FightScene;
