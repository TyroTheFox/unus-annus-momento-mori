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
        this._sfxVolume = this._optionsData.sfxVolume;

        this._emitters = {};
        this.emitterTarget = this;

        const soundsData = this.scene.game.cache.json.get( `sfx_${folderName}` );

        for ( const [ animKey, data ] of Object.entries( soundsData.timing ) ) {
            data.forEach( ( sfxData ) => {
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

        const emitterData = this.scene.game.cache.json.get( `emitter_${folderName}` );

        for ( const data of emitterData ) {
            const particles = this.scene.add.particles( data.name );
            const emitter = particles.createEmitter( data.config );
            emitter.stop();

            if ( !this._emitters.hasOwnProperty( data.action ) ) {
                this._emitters[data.action] = [];
            }

            this._emitters[data.action].push( {
                emitter: emitter,
                ...data
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
                            sfxData.sound.setVolume( this._sfxVolume );
                            sfxData.sound.play();
                        }
                    }
                }

                if ( this._emitters.hasOwnProperty( key ) ) {
                    for ( const emitterData of this._emitters[key] ) {
                        if ( emitterData.frame && emitterData.frame <= frame.index ) {
                            if ( emitterData.target ) {
                                if ( emitterData.target === 'enemy' ) {
                                    emitterData.emitter.startFollow( this.emitterTarget );
                                } else if ( emitterData.target === 'self' ) {
                                    emitterData.emitter.startFollow( this );
                                }
                            }
                            emitterData.emitter.start();
                            this.scene.time.delayedCall( emitterData.duration, () => {
                                emitterData.emitter.stop();
                                emitterData.emitter.stopFollow();
                            }, [], this );
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
                    sfxData.sound.setVolume( this._sfxVolume );
                    this.scene.time.delayedCall( sfxData.time, () => { sfxData.sound.play() }, [], this);
                }
            }
        }

        if ( this._emitters.hasOwnProperty( key ) ) {
            for (const emitterData of this._emitters[key] ) {
                if ( emitterData.time ) {
                    if ( emitterData.target ) {
                        if ( emitterData.target === 'enemy' ) {
                            emitterData.emitter.startFollow( this.emitterTarget );
                        } else if ( emitterData.target === 'self' ) {
                            emitterData.emitter.startFollow( this );
                        }
                    }
                    this.scene.time.delayedCall( emitterData.time, () => {
                        emitterData.emitter.start();
                        this.scene.time.delayedCall( emitterData.duration, () => {
                            emitterData.emitter.stop();
                            emitterData.emitter.stopFollow();
                        }, [], this );
                    }, [], this);
                }
            }
        }
    }

    _updateData(parent, key, data)
    {
        if (key === '__GameOptionsData')
        {
            this._maxHP = data.HP;
            this._sfxVolume = data.sfxVolume;
        }
    }
}
