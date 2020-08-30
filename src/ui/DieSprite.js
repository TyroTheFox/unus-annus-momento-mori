/**
 * @typedef {Object} DieSprite#TextConfig
 * @property {string} text - Text to display
 * @property {Phaser.GameObjects.TextStyle} style - Text Style object
 */

/**
 * @typedef {Object} DieSprite#Config
 * @property {number|Object} [scale] - Scale values for the character sprites
 * @property {number} [scale.x] - X Scale value
 * @property {number} [scale.y] - Y Scale value
 * @property {number} shakeCount - Number of times the die should shake for durring a roll
 * @property {number} shakeDistance - Amount the die should move in the y direction during a shake
 * @property {number} textMoveDistance - The distance the text displaying the result moves above the die when shown
 * @property {Phaser.Types.Tweens.TweenBuilderConfig} shakeUpTween - Tween config for shaking upwards
 * @property {Phaser.Types.Tweens.TweenBuilderConfig} shakeDownTween - Tween config for shaking downwards
 * @property {Phaser.Types.Tweens.TweenBuilderConfig} textUpTween - Tween config for displaying the text
 * @property {Phaser.Types.Tweens.TweenBuilderConfig} textDownTween - Tween config for hiding the text
 * @property {Phaser.Types.Tweens.TweenBuilderConfig} failedTween - Tween config for when the die result loses a bout
 * @property {DieSprite#TextConfig} text - Configuration for the text attached
 * @property {function} callback - A callback function for the button to fire when clicked
 */

/**
 * Visual element showing player rolls
 * @class DieSprite
 * @extends Phaser.GameObjects.Sprite
 */
export default class DieSprite extends Phaser.GameObjects.Sprite {
    /**
     * @constructor
     * @param {Phaser.Scene} scene - Scene Context
     * @param {string} key - Name to cache the object under
     * @param {number} x - X Co-ord
     * @param {number} y - y Co-ord
     * @param {DieSprite#Config} config - Configuration object for the button
     */
    constructor(scene, key, x, y, config) {
        super( scene, x, y, key );

        this.originalX = x;
        this.originalY = y;

        if ( config.scale ) {
            this.setScale( config.scale.x || config.scale, config.scale.y || config.scale.x );
        }

        this._shakeCount = config.shakeCount;

        this._shakeDistance = config.shakeDistance;
        this._textMoveDistance = config.textMoveDistance;

        /** @type {Phaser.Math.Vector2} */
        const centerPos = this.getCenter();

        /** @type {Phaser.GameObjects.Text} */
        this.rollText = this.scene.add.text( 0, 0, '', config.style );
        this.rollText.x = centerPos.x - ( this.rollText.displayWidth / 2 );
        this.rollText.y = centerPos.y;

        config.shakeUpTween.targets = this;
        config.shakeUpTween.y = this.y + this._shakeDistance;

        config.shakeDownTween.targets = this;
        config.shakeDownTween.y = this.y - this._shakeDistance;

        config.textUpTween.targets = this.rollText;
        config.textUpTween.y = this.y - this._textMoveDistance;

        config.textDownTween.targets = this.rollText;
        config.textDownTween.y = this.y + this._textMoveDistance;

        config.failedTween.targets = this;

        this._shakeUp = config.shakeUpTween;
        this._shakeDown = config.shakeDownTween;

        this._textUp = config.textUpTween;
        this._textDown = config.textDownTween;

        this._failTween = config.failedTween;

        this.rollText.visible = false;

        this.scene.add.existing( this );

        this._textDisplayed = false;
    }

    /**
     * Plays the shake animation then displays the roll result
     * @param {number} result
     * @returns {Promise}
     */
    async rollDieAnimation( result ) {
        /** @type {Phaser.Math.Vector2} */
        const centerPos = this.getCenter();

        if ( this._textDisplayed ) {
            await this.playTweenPromise( this._textDown );
            this._textDisplayed = false;
            this.rollText.visible = false;
        }

        for ( let i = 0; i < this._shakeCount; i++ ) {
           await this.playTweenPromise( this._shakeDown );
           await this.playTweenPromise( this._shakeUp );
        }

        this.rollText.text = result;
        this.rollText.x = centerPos.x - ( this.rollText.displayWidth / 2 );
        this.rollText.visible = true;
        await this.playTweenPromise( this._textUp );
        this._textDisplayed = true;
    }

    /**
     * Plays the tween for losing a roll
     * @returns {Promise}
     */
    async dieFailAnimation() {
        await this.playTweenPromise( this._failTween );
    }

    /**
     * Resets the die to a usable state
     * @returns {Promise}
     */
    async resetAfterDieFail() {
        if ( this.y !== this.originalY ) {
            await this.playTweenPromise( {
                targets: this,
                y: this.originalY,
                duration: 50,
                ease: 'Power2'
            } );
        }
    }

    /**
     * Plays a tween according to a config object
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} tweenConfig
     * @returns {Promise}
     */
    playTweenPromise( tweenConfig ) {
        const that = this;

        return new Promise( ( fulfilled, rejected ) => {
            const config = {
                ...tweenConfig,
                onComplete: () => {
                    fulfilled();
                }
            }
            this.scene.tweens.add( config );
        } );
    }

    /**
     * Resets a die text value
     */
    reset() {
        /** @type {Phaser.Math.Vector2} */
        const centerPos = this.getCenter();

        this.rollText.text = '';
        this.rollText.y = centerPos.y;
    }
}
