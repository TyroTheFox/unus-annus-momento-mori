/**
 * @typedef {Object} Button#TextConfig
 * @property {string} text - Text to display
 * @property {Phaser.GameObjects.TextStyle} style - Text Style object
 * @property {color} colorOver - The colour the text turns when the mouse is over the button
 * @property {color} colorDown - The colour the text turns when the button is clicked
 */

/**
 * @typedef {Object} Button#Config
 * @property {number|Object} [scale] - Scale values for the character sprites
 * @property {number} [scale.x] - X Scale value
 * @property {number} [scale.y] - Y Scale value
 * @property {string} spriteOver - Name the over sprite is cached over
 * @property {string} spriteDown - Name the over sprite is cached over
 * @property {Button#TextConfig} text - Configuration for the text attached
 * @property {function} callback - A callback function for the button to fire when clicked
 */

/**
 * A button object
 * @class Button
 * @extends Phaser.GameObjects.Sprite
 */
export default class Button extends Phaser.GameObjects.Sprite {
    /**
     * @constructor
     * @param {Phaser.Scene} scene - Scene Context
     * @param {string} key - Name to cache the object under
     * @param {number} x - X Co-ord
     * @param {number} y - y Co-ord
     * @param {Button#Config} config - Configuration object for the button
     */
    constructor( scene, key, x, y, config ) {
        super( scene, x, y, key );

        this.scene.registry.events.on('changedata', this._updateData, this);

        this._optionsData = this.scene.registry.get( '__GameOptionsData' );
        this._sfxVolume = this._optionsData.sfxVolume;

        if ( config.scale ) {
            this.setScale( config.scale.x || config.scale, config.scale.y || config.scale.x );
        }

        this._idleTexture = key;

        if ( config.spriteOver ) {
            /** @type {string} */
            this._overSprite = config.spriteOver;
        }
        if ( config.spriteDown ) {
            /** @type {string} */
            this._downSprite = config.spriteDown;
        }

        /** @type {string} */
        this._buttonState = 'idle';

        /** @type {Phaser.Sound.BaseSound} */
        this._downSound = this.scene.sound.add( '__buttonDown' );
        this._downSound.setVolume( this._sfxVolume );

        /** @type {Phaser.Sound.BaseSound} */
        this._upSound = this.scene.sound.add( '__buttonUp' );
        this._upSound.setVolume( this._sfxVolume );

        /** @type {Phaser.Sound.BaseSound} */
        this._hoverSound = this.scene.sound.add( '__buttonHover' );
        this._hoverSound.setVolume( this._sfxVolume );
        this._hoverSound.loop = true;

        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this._hoverSound.play();
                this.enterButtonHoverState()
            } )
            .on('pointerout', () => {
                this._hoverSound.stop();
                this.enterButtonRestState()
            } )
            .on('pointerdown', () => {
                this._hoverSound.stop();
                this._downSound.play();
                this.enterButtonActiveState()
            } )
            .on('pointerup', () => {
                this._buttonState = 'up';
                this._upSound.play();
                this._downSound.stop();
                this.enterButtonHoverState();
                if ( config.callback && this.visible ) {
                    this._downSound.stop();
                    config.callback.call( this, this );
                }
            });

        this.scene.add.existing( this );

        if ( config.text ) {
            const centerPos = this.getCenter();

            /** @type {Phaser.GameObjects.Text} */
            this._text = this.scene.add.text( centerPos.x, centerPos.y, config.text.text, config.text.style );
            this._text.x -= ( this._text.displayWidth / 2 );
            this._text.y -= ( this._text.displayHeight / 2 );
            /** @type {Button#TextConfig} */
            this._textConfig = config.text;
        }
    }

    get state() {
        return this._buttonState;
    }

    set xPos( x ) {
        this.x = x;
        if ( this._text ) {
            const centerPos = this.getCenter();
            this._text.x = centerPos.x - ( this._text.displayWidth / 2 );
        }
    }

    set yPos( y ) {
        this.y = y;
        if ( this._text ) {
            const centerPos = this.getCenter();
            this._text.y = centerPos.y - ( this._text.displayHeight / 2 );
        }
    }

    get text() {
        return this._text;
    }

    /**
     * Sets the visible of the whole button
     * @param {boolean} v - Visible or not
     */
    setVisible( v ) {
        this.visible = v;
        if ( this._text ) {
            this._text.visible = v;
        }
    }

    /**
     * Called when the mouse enters the hover state
     */
    enterButtonHoverState() {
        this._buttonState = 'over';
        if ( this._textConfig && this._textConfig.colorOver ) {
            this._text.setColor( this._textConfig.colorOver );
        }
        if ( this._overSprite ) {
            this.setTexture( this._overSprite );
        }
    }

    /**
     * Called when the mouse click completes
     */
    enterButtonRestState() {
        this._buttonState = 'idle';
        if ( this._textConfig ) {
            this._text.setColor( this._textConfig.style.color );
        }
        this.setTexture( this._idleTexture );
    }

    /**
     * Called when the mouse click is down
     */
    enterButtonActiveState() {
        this._buttonState = 'down';
        if ( this._textConfig && this._textConfig.colorDown ) {
            this._text.setColor( this._textConfig.colorDown );
        }
        this.setTexture( this._downSprite );
    }

    /**
     * Updates stat and volume values once options data changes
     * @listens Phaser.Data.Events#CHANGE_DATA
     * @param {any} parent - A reference to the object that the Data Manager responsible for this event belongs to
     * @param {string} key - The unique key of the data item within the Data Manager
     * @param {any} data - The new value of the item in the Data Manager
     * @private
     */
    _updateData(parent, key, data)
    {
        if (key === '__GameOptionsData')
        {
            this._sfxVolume = data.sfxVolume;
        }
    }
}
