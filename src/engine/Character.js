export default class Character extends Phaser.GameObjects.Sprite {
    constructor( scene, x, y, characterName, folderName ) {
        super( scene, x, y, characterName );
        this._folderName = folderName;

        this.anims.play( 'idle' );

        this._maxHP = 5;
        this._damage = 0;

        this.scene.add.existing( this );
    }

    get maxHP () {
        return this._maxHP;
    }

    get HP () {
        return this._maxHP - this._damage;
    }

    addDamage ( value ) {
        this._damage += value;
    }

    /**
     *
     */
    playIdle() {
        this.anims.play( 'idle' );
    }

    /**
     *
     */
    playAttack() {
        this.anims.play( 'attack' );
    }

    /**
     *
     * @returns {Promise}
     */
    playAttackPromise() {
        this.playAttack();
        return new Promise( ( fulfilled, rejected ) => {
            this.on(
                'animationcomplete',
                ( animation, frame ) => {
                    if ( animation.key === 'attack' ) {
                        fulfilled();
                    }
                },
                this
            );
        } );
    }

    /**
     *
     */
    playDamage() {
        this.anims.play( 'damage' );
    }

    /**
     *
     * @returns {Promise}
     */
    playDamagePromise() {
        this.playDamage();
        return new Promise( ( fulfilled, rejected ) => {
            this.on(
                'animationcomplete',
                ( animation, frame ) => {
                    if ( animation.key === 'damage' ) {
                        fulfilled();
                    }
                },
                this
            );
        } );
    }

    /**
     *
     */
    playDefeat() {
        this.anims.play( 'defeat' );
    }

    /**
     *
     * @returns {Promise}
     */
    playDefeatPromise() {
        this.playDefeat();
        return new Promise( ( fulfilled, rejected ) => {
            this.on(
                'animationcomplete',
                ( animation, frame ) => {
                    if ( animation.key === 'defeat' ) {
                        fulfilled();
                    }
                },
                this
            );
        } );
    }

    /**
     *
     */
    playVictory() {
        this.anims.play( 'victory' );
    }

    /**
     *
     * @returns {Promise}
     */
    playVictoryPromise() {
        this.playVictory();
        return new Promise( ( fulfilled, rejected ) => {
            this.on(
                'animationcomplete',
                ( animation, frame ) => {
                    if ( animation.key === 'victory' ) {
                        fulfilled();
                    }
                },
                this
            );
        } );
    }
}
