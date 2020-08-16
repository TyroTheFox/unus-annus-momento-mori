import * as backgroundData from '../../assets/backgroundManifest.json';

export default class Stage {
    constructor( scene, stageName ) {
        this._name = stageName;
        this._scene = scene;

        this._components = {};

        this._bgm = [];
        this._bgmCurrentlyPlaying = null;

        const stageData = backgroundData.find( data => data.name === this._name );
        const stageComponents = stageData.components;

        this._playerPositions = stageData.playerPositions || null;

        if ( stageData.bgm ) {
            const musicToLoad = [];
            if ( Array.isArray( stageData.bgm ) ) {
                musicToLoad.push( ...stageData.bgm );
            } else {
                musicToLoad.push( stageData.bgm );
            }

            musicToLoad.forEach( ( musicData ) => {
                const music = this._bgm.find( music => music.name === musicData.name );

                if ( !music ) {
                    const configData = musicData.config || {};

                    const data = {
                        ...musicData,
                        music: this._scene.sound.add( musicData.name, configData )
                    }
                    this._bgm.push( data );
                }
            } );
        }

        stageComponents.forEach( ( componentData ) => {
            let x = 0;
            let y = 0;

            switch ( componentData.position ) {
                case 'center':
                    x = scene.game.config.width / 2;
                    y = scene.game.config.height / 2;
                    break;
                case 'absolute':
                    if ( componentData.x === 'center' ) {
                        x = scene.game.config.width / 2;
                    } else {
                        x = componentData.x;
                    }

                    if ( componentData.y === 'center' ) {
                        y = scene.game.config.height / 2;
                    } else {
                        y = componentData.y;
                    }
                    break;
            }

            this._components[componentData.name] = this._scene.add.sprite( x, y, `${componentData.name}_${stageData.folderName}`);

            if ( componentData.animated ) {
                this._components[componentData.name].play( `${componentData.name}_${stageData.folderName}` );
            }

            if ( componentData.scale ) {
                this._components[componentData.name].setScale( componentData.scale );
            }

            if ( componentData.alpha ) {
                this._components[componentData.name].alpha = componentData.alpha;
            }

            if ( componentData.anchor ) {
                this._components[componentData.name].setOrigin( componentData.anchor.x, componentData.anchor.y );
            }
        } );

        this._scene.registry.events.on('changedata', this._updateVolume, this);

        this._optionsData = this._scene.registry.get( '__GameOptionsData' );
    }

    get playerPositions () {
        return this._playerPositions;
    }

    playBGM( delay = 0 ) {
        if ( this._bgm.length > 0 ) {
            this._scene.sound.stopAll();
            const music = Phaser.Math.RND.pick( this._bgm );
            if ( delay ) {
                this._scene.time.delayedCall( delay, () => { music.music.play() }, [], this);
            } else {
                music.music.play();
            }
            this._bgmCurrentlyPlaying = music.music;
            this._bgmCurrentlyPlaying.setVolume( this._optionsData.musicVolume );
        }
    }

    resetBGM() {
        if ( this._bgmCurrentlyPlaying ) {
            this._bgmCurrentlyPlaying.stop();
            this._bgmCurrentlyPlaying.play();
        }
    }

    stopBGM() {
        if ( this._bgmCurrentlyPlaying ) {
            this._bgmCurrentlyPlaying.stop();
        }
    }

    setStageZIndex( zIndex ) {
        for ( let [key, component] of Object.entries( this._components ) ) {
            component.setDepth( zIndex );
        }
    }

    setVisible( v ) {
        for ( let [key, component] of Object.entries( this._components ) ) {
            component.setVisible( v );
        }
    }

    cleanUp() {
        if ( this._bgmCurrentlyPlaying ) {
            this._bgmCurrentlyPlaying.stop();
        }

        for ( let [key, component] of Object.entries( this._components ) ) {
            component.destroy();
        }

        this._bgm.forEach( ( bgmData ) => {
            bgmData.music.destroy();
        } );

        delete this._components;
    }

    _updateVolume(parent, key, data)
    {
        if ( !this._bgmCurrentlyPlaying ) {
            return;
        }

        if (key === '__GameOptionsData')
        {
            this._bgmCurrentlyPlaying.setVolume( data.musicVolume );
        }
    }
}
