/**
 * @typedef {Object} HealthBar#Config
 * @property {number|Object} [scale] - Scale values for the character sprites
 * @property {number} x - X Co-ord value
 * @property {number} y - Y Co-ord value
 * @property {boolean} flip - Whether or not to flip the health bar to sit on the other side of the screen
 * @property {boolean} invert - Inverts the assets to a secondary set for an alternative style and appearance
 * @property {number} scale - Sets a scale for the whole of the health bar
 * @property {string} characterName - Display name for the health bar
 * @property {Phaser.GameObjects.TextStyle} textStyle - Text style applied to the character name
 */

/**
 * Visual Element showing player health
 * @class HealthBar
 */
export default class HealthBar {
    /**
     * @constructor
     * @param {Phaser.Scene} scene - Scene context
     * @param {number} maximumValue - Maximum value the bar represents
     * @param {HealthBar#Config} config - Data to configure the health bar
     */
    constructor( scene, maximumValue, config ) {
        /** @type {Phaser.Scene} */
        this._scene = scene;
        /** @type {number} */
        this._maximumValue = maximumValue;
        /** @type {number} */
        this._currentValue = this._maximumValue;

        this._x = config.x || 0;
        this._y = config.y || 0;

        this._flip = config.flip || false;
        this._invert = config.invert || false;
        this._scale = config.scale || 1;

        if ( this._invert ) {
            /** @type {Phaser.GameObjects.Sprite} */
            this._background = this._scene.add.sprite( this._x, this._y, 'healthbar_backgroundInv' );
            /** @type {Phaser.GameObjects.Sprite} */
            this._redBar = this._scene.add.sprite( this._x, this._y, 'healthbar_barRed' );
            /** @type {Phaser.GameObjects.Sprite} */
            this._redBarMask = this._scene.add.sprite( this._x, this._y, 'healthbar_barRed' );
            /** @type {Phaser.GameObjects.Sprite} */
            this._bar = this._scene.add.sprite( this._x, this._y, 'healthbar_barInv' );
            /** @type {Phaser.GameObjects.Sprite} */
            this._mask = this._scene.add.sprite( this._x, this._y, 'healthbar_barInv' );
        } else {
            /** @type {Phaser.GameObjects.Sprite} */
            this._background = this._scene.add.sprite( this._x, this._y, 'healthbar_background' );
            /** @type {Phaser.GameObjects.Sprite} */
            this._redBar = this._scene.add.sprite( this._x, this._y, 'healthbar_barRed' );
            /** @type {Phaser.GameObjects.Sprite} */
            this._redBarMask = this._scene.add.sprite( this._x, this._y, 'healthbar_barRed' );
            /** @type {Phaser.GameObjects.Sprite} */
            this._bar = this._scene.add.sprite( this._x, this._y, 'healthbar_bar' );
            /** @type {Phaser.GameObjects.Sprite} */
            this._mask = this._scene.add.sprite( this._x, this._y, 'healthbar_bar' );
        }

        if ( config.characterName && config.textStyle ) {
            const offset = this._flip ? 200 : -200;
            this._flip ? config.textStyle.align = 'left' : config.textStyle.align = 'right';
            this._characterName = this._scene.add.text( this._x + offset, this._y, config.characterName, config.textStyle );
            this._characterName.x -= ( this._characterName.displayWidth / 2 );
            this._characterName.y += ( this._characterName.displayHeight / 2 );
            this._characterName.originY = 0;
        }

        /** @type {Phaser.Types.Tweens.TweenBuilderConfig} */
        this._redBarTween = {
            targets: this._redBarMask,
            delay: 700,
            duration: 300,
            ease: 'Power2'
        };

        this._background.setFlipX( this._flip );
        this._background.setScale( this._scale );

        this._redBar.setFlipX( this._flip );
        this._redBar.setScale( this._scale );

        this._redBarMask.setFlipX( this._flip );
        this._redBarMask.setScale( this._scale );

        this._bar.setFlipX( this._flip );
        this._bar.setScale( this._scale );

        this._mask.setFlipX( this._flip );
        this._mask.setScale( this._scale );

        this._redBarMask.visible = false;
        this._redBar.mask = this._redBarMask.createBitmapMask();

        this._mask.visible = false;
        this._bar.mask = this._mask.createBitmapMask();

        this._stepWidth = this._mask.displayWidth / this._maximumValue;
    }

    get currentValue() {
        return this._currentValue;
    }

    /**
     * Sets the current value of the bar
     * @param {number} value - Value to set to
     */
    setValue( value ) {
        if ( value > this._maximumValue ) {
            this._currentValue = this._maximumValue;
        } else if ( value < 0 ) {
            this._currentValue = 0;
        } else {
            this._currentValue = value;
        }
        this._updateBar();
    }

    /**
     * Change the current value of the bar by, not to, the given value
     * @param {number} value - The Value modified by
     */
    modifyValue( value ) {
        if ( ( this._currentValue + value ) > this._maximumValue ) {
            this._currentValue = this._maximumValue;
        } else if ( ( this._currentValue + value ) < 0 ) {
            this._currentValue = 0;
        } else {
            this._currentValue += value;
        }
        this._updateBar();
    }

    /**
     * Resets value to the given maximum
     */
    resetValue() {
        this._currentValue = this._maximumValue;
        this._updateBar();
    }

    /**
     * Set the maximum value to something new
     * @param {number} value - Value to set to
     */
    setMaximumValue( value ) {
        this._maximumValue = value;
        this._updateBar();
    }

    /**
     * Updates the size of the bar values to match the current and maximum values
     * @private
     */
    _updateBar() {
        if ( this._flip ) {
            this._mask.x = this._x + ( ( this._maximumValue - this._currentValue ) * this._stepWidth );
        } else {
            this._mask.x = this._x - ( ( this._maximumValue - this._currentValue ) * this._stepWidth );
        }

        this._redBarTween.x = this._mask.x;
        this._scene.tweens.add( this._redBarTween );
    }
}
