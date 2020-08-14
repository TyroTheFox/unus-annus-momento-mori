export default class DieSprite extends Phaser.GameObjects.Sprite {
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

        const centerPos = this.getCenter();
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

    async rollDieAnimation( result ) {
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

    async dieFailAnimation() {
        await this.playTweenPromise( this._failTween );
    }

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
}
