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

    set damage ( value ) {
        this._damage = value;
    }

    playIdle() {
        this.anims.play( 'idle' );
    }

    playAttack() {
        this.anims.play( 'attack' );
    }

    playDamage() {
        this.anims.play( 'damage' );
    }

    playDefeat() {
        this.anims.play( 'defeat' );
    }

    playVictory() {
        this.anims.play( 'victory' );
    }
}
