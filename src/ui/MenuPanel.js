import Button from './Button';

/**
 * @typedef {Object} MenuPanel#Config
 * @property {number|Object} [scale] - Scale values for the background panel
 * @property {number} [scale.x] - X Scale value
 * @property {number} [scale.y] - Y Scale value
 * @property {Object} button - Button Data
 * @property {string} button.spriteOver - Name the over sprite is cached over
 * @property {string} button.spriteDown - Name the over sprite is cached over
 * @property {string} button.spriteIdle - Name the over sprite is cached over
 * @property {Object} mask - A mask that can be applied to the panel
 * @property {Object} [mask.scale] - A mask that can be applied to the panel
 * @property {number} [mask.scale.x] - X Scale value
 * @property {number} [mask.scale.y] - Y Scale value
 * @property {Object} [mask.offset] - An offset to alter the position of the panel
 * @property {number} [mask.offset.x] - X Offset value
 * @property {number} [mask.offset.y] - Y Offset value
 */

/**
 * @typedef {Button#Config} MenuPanel#MenuButtonConfig
 * @property {Object} [mask.offset] - An offset to alter the position of the panel
 * @property {number} [mask.offset.x] - X Offset value
 * @property {number} [mask.offset.y] - Y Offset value
 */

/**
 * Creates a panel of buttons to interact with
 * @class MenuPanel
 * @extends Phaser.GameObjects.Sprite
 */
export default class MenuPanel extends Phaser.GameObjects.Sprite {
    /**
     * @constructor
     * @param {Phaser.Scene} scene - Scene Context
     * @param {string} backgroundKey - Name to cache the object under
     * @param {number} x - X Co-ord
     * @param {number} y - y Co-ord
     * @param {MenuPanel#Config} config - Configuration object for the panel
     */
    constructor( scene, backgroundKey, x, y, config ) {
        super(scene, x, y, backgroundKey);

        if ( config.scale ) {
            this.setScale( config.scale.x || config.scale, config.scale.y || config.scale.x );
        }

        /** @type {string} */
        this._idleTexture = config.button.spriteIdle;

        if ( config.button.spriteOver ) {
            /** @type {string} */
            this._overSprite = config.button.spriteOver;
        }
        if ( config.button.spriteDown ) {
            /** @type {string} */
            this._downSprite = config.button.spriteDown;
        }

        this._menuControlsActive = true;

        this.scene.add.existing( this );

        /** @type {Phaser.GameObjects.Container} */
        this._componentContainer = this.scene.add.container();
        /** @type {Phaser.GameObjects.Container} */
        this._controlsContainer = this.scene.add.container();
        /** @type {Phaser.Math.Vector2} */
        const centerPos = this.getCenter();

        this._componentContainer.x = centerPos.x;
        this._componentContainer.y = centerPos.y;

        this._controlsContainer.x = centerPos.x;
        this._controlsContainer.y = centerPos.y;

        /** @type {Array.<Button>} */
        this._buttonList = [];
        /** @type {Array.<Button>} */
        this._controlButtonsList = [];
        /** @type {Array.<Phaser.GameObjects.Text>} */
        this._textList = [];
        /** @type {Array.<Phaser.GameObjects.Text>} */
        this._controlTextList = [];

        if ( config.mask ) {
            const maskShape = this.scene.make.graphics();
            const maskScale = config.mask.scale ? config.mask.scale : { x: 0, y: 0 };
            const maskOffset = config.mask.offset? config.mask.offset : { x: 0, y: 0 };

            const maskX = ( this.getCenter().x - ( this.displayWidth / 2 ) ) + ( maskOffset.x || 0 );
            const maskY = ( this.getCenter().y - ( this.displayHeight / 2 ) ) + ( maskOffset.y || 0 );

            const maskWidth = this.displayWidth * ( maskScale.x || 1 );
            const maskHeight = this.displayHeight * ( maskScale.y || 1 );

            maskShape.fillStyle(0xffffff, 1);
            maskShape.fillRect( maskX, maskY, maskWidth, maskHeight );

            this._componentContainer.mask = new Phaser.Display.Masks.GeometryMask(this, maskShape);
        }
    }

    /**
     * @type {number}
     */
    get buttonCount() {
        return this._buttonList.length;
    }

    set turnOffControls( b ) {
        this._menuControlsActive = b;
        if ( this.visible ) {
            this._controlsContainer.list.forEach( ( child ) => { child.setVisible( b ) } );
        }
    }

    /**
     * Adds a button to the panel
     * @param {Button#Config} config - Configuration for a button
     * @returns {Button}
     */
    addButton( config ) {
        const centerPos = this.getCenter();

        config.spriteOver = this._overSprite;
        config.spriteDown = this._downSprite;

        if ( !config.scale ) {
            config.scale = {
                x: this.scaleX,
                y: this.scaleY
            };
        }

        const newButton = new Button(
            this.scene,
            this._idleTexture,
            0,
            0,
            config
        );

        this._buttonList.push( newButton );
        this._textList.push( newButton.text );

        newButton.setOrigin( 0.5, 0.5 );

        this._componentContainer.add( newButton );
        this._componentContainer.add( newButton.text || null );

        const that = this;

        newButton.off( 'pointerup' );
        newButton.on('pointerup', () => {
            newButton.enterButtonHoverState();
            if ( config.callback && this.visible ) {
                config.callback.call( that, newButton, config.additionalData || null );
            }
        }, this );

        if ( this._componentContainer.length > 2 ) {
            for ( let i = 0; i < this._componentContainer.length; i++ ) {
                const object = this._componentContainer.getAt( i );
                let heightOffset = -( ( object.displayHeight + 10 ) * 0.5 );

                if ( i > 0 && i % 2 === 0 ) {
                    heightOffset = -heightOffset;
                }

                object.yPos = heightOffset * i;
            }

            const fullButtonListHeight = ( this._componentContainer.getAt( 0 ).displayHeight * ( this._componentContainer.length / 2 ) );
            this._componentContainer.y = ( centerPos.y - ( fullButtonListHeight / 2 ) ) + ( 10 * ( this._componentContainer.length / 2 ) );
        }

        return newButton;
    }

    /**
     * Moves the panel upwards
     * @param {number} offsetMod - Value to change position by
     */
    moveButtonContainerUp( offsetMod ) {
        const menuBounds = this.getBounds();
        const containerBounds = this._componentContainer.getBounds();

        const margin = this.displayHeight * 0.7;

        let newY = containerBounds.bottom - offsetMod;

        if ( ( menuBounds.top + margin ) < newY ) {
            this._componentContainer.y -= offsetMod;
        }
    }

    /**
     * Moves container downwards
     * @param {number} offsetMod - Value to change position by
     */
    moveButtonContainerDown( offsetMod ) {
        const menuBounds = this.getBounds();
        const containerBounds = this._componentContainer.getBounds();

        const margin = this.displayHeight * 0.7;

        let newY = containerBounds.top + offsetMod;

        if ( ( menuBounds.bottom - margin ) > newY ) {
            this._componentContainer.y += offsetMod;
        }
    }

    /**
     *
     * @param {MenuPanel#MenuButtonConfig} config - Configuration for this button
     * @returns {Button}
     */
    addMenuControlButton( config ) {
        const centerPos = this.getCenter();

        config.spriteOver = this._overSprite;
        config.spriteDown = this._downSprite;

        if ( !config.scale ) {
            config.scale = {
                x: this.scaleX,
                y: this.scaleY
            };
        }

        let xOffset = 0;
        let yOffset = 0;

        if ( config.offset ){
            xOffset += config.offset.x || 0;
            yOffset += config.offset.y || 0;
        }

        const newButton = new Button(
            this.scene,
            this._idleTexture,
            xOffset,
            yOffset,
            config
        );

        this._controlButtonsList.push( newButton );
        this._controlTextList.push( newButton.text );

        newButton.setOrigin( 0.5, 0.5 );

        this._controlsContainer.add( newButton );
        this._controlsContainer.add( newButton.text || null );

        const eventName = config.eventName || 'pointerup';

        newButton.off( eventName );
        newButton.on( eventName, () => {
            newButton.enterButtonHoverState();
            if ( config.callback && this.visible ) {
                config.callback.call( this, newButton, config.additionalData || null );
            }
        } );

        return newButton;
    }

    /**
     * Sets the visible of the whole button
     * @param {boolean} v - Visible or not
     */
    setVisible( v ) {
        this.visible = v;
        this._componentContainer.list.forEach( ( child ) => { child.setVisible(v) } );
        if ( this._menuControlsActive ) {
            this._controlsContainer.list.forEach( ( child ) => { child.setVisible(v) } );
        }
    }
}
