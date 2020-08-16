export default class HealthBar {
    constructor( scene, maximumValue, config ) {
        this._scene = scene;
        this._maximumValue = maximumValue;
        this._currentValue = this._maximumValue;

        this._x = config.x || 0;
        this._y = config.y || 0;

        this._flip = config.flip || false;
        this._invert = config.invert || false;
        this._scale = config.scale || 1;

        if ( this._invert ) {
            this._background = this._scene.add.sprite( this._x, this._y, 'healthbar_backgroundInv' );
            this._redBar = this._scene.add.sprite( this._x, this._y, 'healthbar_barRed' );
            this._redBarMask = this._scene.add.sprite( this._x, this._y, 'healthbar_barRed' );
            this._bar = this._scene.add.sprite( this._x, this._y, 'healthbar_barInv' );
            this._mask = this._scene.add.sprite( this._x, this._y, 'healthbar_barInv' );
        } else {
            this._background = this._scene.add.sprite( this._x, this._y, 'healthbar_background' );
            this._redBar = this._scene.add.sprite( this._x, this._y, 'healthbar_barRed' );
            this._redBarMask = this._scene.add.sprite( this._x, this._y, 'healthbar_barRed' );
            this._bar = this._scene.add.sprite( this._x, this._y, 'healthbar_bar' );
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

    resetValue() {
        this._currentValue = this._maximumValue;
        this._updateBar();
    }

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
