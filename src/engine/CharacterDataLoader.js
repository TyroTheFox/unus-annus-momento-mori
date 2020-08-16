import * as characterData from '../../assets/characterManifest.json';

export default class CharacterDataLoader {
    constructor( state ) {
        this._sourceDirectory = 'assets/characters';
        this._game = state;

        this.soundLoaders = [];
    }

    getAllCharacterData() {
        characterData.default.forEach( ( character ) => {
            const folderName = character.folderName;
            this._game.load.atlas(
                `${folderName}`,
                `../../${this._sourceDirectory}/${folderName}/spritesheet.png`,
                `../../${this._sourceDirectory}/${folderName}/atlas.json`);
            this._game.load.json( `animation_${folderName}`, `../../${this._sourceDirectory}/${folderName}/animation.json`);
            this._game.load.json( `sfx_${folderName}`, `../../${this._sourceDirectory}/${folderName}/sounds.json`);
            this._game.load.json( `emitter_${folderName}`, `../../${this._sourceDirectory}/${folderName}/emitters.json`);
        } );
    }

    createAllCharacters() {
        characterData.default.forEach( ( character ) => {
            const folderName = character.folderName;
            const animationData = this._game.cache.json.get( `animation_${folderName}` );

            animationData.forEach( ( animation ) => {
                const animData = animation.animData;
                animData.frames = this._game.anims.generateFrameNames(`${folderName}`, animation.frameConfig );
                this._game.anims.create( animData );
            } );

            const emitterData = this._game.cache.json.get( `emitter_${folderName}` );

            emitterData.forEach( ( emitter ) => {
                if ( emitter.particles.type === 'texture' ) {
                    this._game.load.image(
                        emitter.name,
                        `../../${this._sourceDirectory}/${folderName}/emitter/${emitter.particles.path}`
                    );
                } else if ( emitter.particles.type === 'atlas') {
                    this._game.load.atlas(
                        emitter.name,
                        `../../${this._sourceDirectory}/${folderName}/emitter/${emitter.particles.path}`,
                        `../../${this._sourceDirectory}/${folderName}/emitter/${emitter.particles.json}`
                    );
                }


            } );
        } );
    }
}
