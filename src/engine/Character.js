export default class Character extends Phaser.GameObjects.Sprite {
    constructor( scene, x, y, characterName, folderName ) {
        super( scene, x, y, characterName );
        this._folderName = folderName;

        this.anims.play( 'idle' );

        this._maxHP = 5;
        this._HP = 5;

        this.scene.add.existing( this );
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
