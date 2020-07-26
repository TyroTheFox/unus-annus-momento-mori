import Button from './Button';

export default class MenuPanel extends Phaser.GameObjects.Sprite {
    constructor( scene, backgroundKey, x, y, config ) {
        super(scene, x, y, backgroundKey);

        if ( config.scale ) {
            this.setScale( config.scale.x || config.scale, config.scale.y || config.scale.x );
        }

        this._idleTexture = config.button.spriteIdle;

        if ( config.button.spriteOver ) {
            this._overSprite = config.button.spriteOver;
        }
        if ( config.button.spriteDown ) {
            this._downSprite = config.button.spriteDown;
        }

        this.scene.add.existing( this );

        this._componentContainer = this.scene.add.container();
        const centerPos = this.getCenter();

        this._componentContainer.x = centerPos.x;
        this._componentContainer.y = centerPos.y;

    }

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

        newButton.setOrigin( 0.5, 0.5 );

        this._componentContainer.add( newButton );
        this._componentContainer.add( newButton.text );

        if ( this._componentContainer.length > 2 ) {
            for ( let i = 0; i < this._componentContainer.length; i++ ) {
                const object = this._componentContainer.getAt( i );
                let heightOffset = -( ( object.displayHeight + 10 ) * 0.5 );

                if ( i > 0 && i % 2 === 0 ) {
                    heightOffset = -heightOffset;
                }

                object.yPos = heightOffset * i;
                // object.yPos = ( ( this.displayHeight / ( this._componentContainer.length / 2 ) ) * i ) + heightOffset;
            }

            const fullButtonListHeight = ( this._componentContainer.getAt( 0 ).displayHeight * ( this._componentContainer.length / 2 ) );
            this._componentContainer.y = ( centerPos.y - ( fullButtonListHeight / 2 ) ) + ( 10 * ( this._componentContainer.length / 2 ) );
        }

        // this._componentContainer.y += ( this._componentContainer.displayHeight - this.displayHeight ) / 2;
    }

    setVisible( v ) {
        this.visible = v;
        this._componentContainer.list.forEach( ( child ) => { child.setVisible(v) } );
    }
}
