import * as characterData from '../../assets/characterManifest.json';

export default class Character extends Phaser.GameObjects.Sprite {
    constructor( scene, x, y, characterName, folderName ) {
        super( scene, x, y, characterName );
        this.characterName = characterName;
        this.folderName = folderName;

        this.anims.play( 'idle' );

        this.scene.registry.events.on('changedata', this._updateData, this);

        this._optionsData = this.scene.registry.get( '__GameOptionsData' );

        this._maxHP = this._optionsData.HP;
        this._damage = 0;

        this.scene.add.existing( this );

        this._sfx = {};

        const soundsData = this.scene.game.cache.json.get( `sfx_${folderName}` );

        for ( const [ animKey, data ] of Object.entries( soundsData.timing ) ) {
            data.forEach( ( sfxData ) => {
                // let sfx = this.scene.sound.sounds.find( baseSound => baseSound.key === sfxData.sfx );
                // TODO Check for pre-existing sound object instead

                let sfx = null;

                if ( this._sfx.hasOwnProperty( animKey ) ) {
                    const sound = this._sfx[animKey].find( ( sound ) => {
                        if ( sound.key ) {
                            return sound.key === sfxData.sfx;
                        } else {
                            return false;
                        }
                    } );

                    if ( sound ) {
                        sfx = sound;
                    } else {
                        sfx = this.scene.sound.add( sfxData.sfx );
                    }
                } else {
                    sfx = this.scene.sound.add( sfxData.sfx );
                    this._sfx[animKey] = [];
                }

                const soundData = {
                    ...sfxData,
                    sound: sfx
                }

                this._sfx[animKey].push( soundData );
            } );
        }
    }

    get maxHP () {
        return this._maxHP;
    }

    get HP () {
        return this._maxHP - this._damage;
    }

    resetHP () {
        this._damage = 0;
    }

    addDamage ( value ) {
        this._damage += value;
    }

    playAnimationPromise( key ) {
        this.playAnimation( key );
        const that = this;
        return new Promise( ( fulfilled, rejected ) => {
            const eventName = `animationcomplete`;
            that.once(
                eventName,
                ( animation, frame ) => {
                    if ( animation.key === key ) {
                        fulfilled();
                    }
                },
                that
            );
        } );
    }

    playAnimation( key ) {
        this.anims.play( key );

        this.setTimedSound( key );

        const eventName = `animationupdate`;
        this.once( eventName, ( animation, frame ) => {
            if ( animation.key === key ) {
                if ( this._sfx.hasOwnProperty( key ) ) {
                    for (const sfxData of this._sfx[key] ) {
                        if ( sfxData.frame && sfxData.frame <= frame.index ) {
                            sfxData.sound.play();
                        }
                    }
                }
            }
        }, this );
    }

    setTimedSound( key ) {
        if ( this._sfx.hasOwnProperty( key ) ) {
            for (const sfxData of this._sfx[key] ) {
                if ( sfxData.time ) {
                    this.scene.time.delayedCall( sfxData.time, () => { sfxData.sound.play() }, [], this);
                }
            }
        }
    }

    _updateData(parent, key, data)
    {
        if (key === '__GameOptionsData')
        {
            this._maxHP = data.HP;
        }
    }
}
