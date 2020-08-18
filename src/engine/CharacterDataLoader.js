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
        } );
    }
}
