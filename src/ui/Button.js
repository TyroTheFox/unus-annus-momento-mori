export default class Button extends Phaser.GameObjects.Sprite {
    constructor( scene, key, x, y, config ) {
        super( scene, x, y, key );

        if ( config.scale ) {
            this.setScale( config.scale.x || config.scale, config.scale.y || config.scale.x );
        }

        this._idleTexture = key;

        if ( config.spriteOver ) {
            this._overSprite = config.spriteOver;
        }
        if ( config.spriteDown ) {
            this._downSprite = config.spriteDown;
        }

        this._buttonState = 'idle';

        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState() )
            .on('pointerout', () => this.enterButtonRestState() )
            .on('pointerdown', () => this.enterButtonActiveState() )
            .on('pointerup', () => {
                this._buttonState = 'up';
                this.enterButtonHoverState();
                if ( config.callback && this.visible ) {
                    config.callback( scene );
                }
            });

        this.scene.add.existing( this );

        if ( config.text ) {
            const centerPos = this.getCenter();
            this._text = this.scene.add.text( centerPos.x, centerPos.y, config.text.text, config.text.style );
            this._text.x -= ( this._text.displayWidth / 2 );
            this._text.y -= ( this._text.displayHeight / 2 );
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

    setVisible( v ) {
        this.visible = v;
        if ( this._text ) {
            this._text.visible = v;
        }
    }

    enterButtonHoverState() {
        this._buttonState = 'over';
        if ( this._textConfig && this._textConfig.colorOver ) {
            this._text.setColor( this._textConfig.colorOver );
        }
        if ( this._overSprite ) {
            this.setTexture( this._overSprite );
        }
    }

    enterButtonRestState() {
        this._buttonState = 'idle';
        if ( this._textConfig ) {
            this._text.setColor( this._textConfig.style.color );
        }
        this.setTexture( this._idleTexture );
    }

    enterButtonActiveState() {
        this._buttonState = 'down';
        if ( this._textConfig && this._textConfig.colorDown ) {
            this._text.setColor( this._textConfig.colorDown );
        }
        this.setTexture( this._downSprite );
    }
}
